#include "tool.h"

#include <iostream>
#include <cmath>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <thread>
#include <cstdlib>

using namespace std;

void Tool::sleep(float time) {
    int micro_time = time * 1000;
    this_thread::sleep_for(std::chrono::milliseconds(micro_time));
}

void Tool::clear_screen() {
    // System call to clear screen based on the operating system
    #ifdef _WIN32
        system("cls");  // Windows
    #else
        system("clear");  // Linux or macOS
    #endif

    Tool::sleep(0.5);
}

void Tool::wait_unitl_enter() {
    string buffer;
    getline(cin, buffer);
}