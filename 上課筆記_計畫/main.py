from utiles.STT import STT_controler
from utiles.AudioHelper import AudioHelper
from utiles.GPT_controller import GPT_controller
from utiles.my_logging import get_logger
import logging

import multiprocessing
from queue import Empty
from io import BytesIO

import os

t_recode = 60 * 10

class MultithreadingAssistant:
    def __init__(self, Logger: logging):
        self.queue = multiprocessing.Queue()
        self.end = multiprocessing.Value('b', False)
        
        # Don't initialize GPT_controller here
        # Instead, pass only the necessary data to the child process
        
        # Start the processing process
        self.process = multiprocessing.Process(target=self.process_data)
        self.process.start()

        # log
        self.logger = Logger

    def start(self):
        self.logger.debug("進程開始執行")
        with self.end.get_lock():
            self.end.value = False

    def stop(self):
        self.logger.debug("正在暫停進程")
        with self.end.get_lock():
            self.end.value = True
        self.queue.put(None)  # Signal to exit the loop

        # Give the process some time to terminate
        self.process.join(timeout=60 * 7) # 最多等待 7 分鐘，否則強制終止進程

        # If it's still alive, terminate it
        if self.process.is_alive():
            self.logger.warning("預設終止進程方式失敗，強制終止進程")
            self.process.terminate()
            self.process.join()
        
        self.logger.debug("暫停進程成功!")

    def process_data(self):
        # Initialize GPT_controller within the child process
        my_ai = GPT_controller()
        Logger = get_logger(True)

        while True:
            try:
                iostream = self.queue.get(timeout=60 * 1)
                if iostream is None:
                    break  # Exit the loop

                try:
                    res = STT_controler.get_text(iostream)
                    processed_data = STT_controler.wash_data(res)

                    if isinstance(processed_data, tuple) and len(processed_data) == 2:
                        with_tag, text_only = processed_data
                    else:
                        Logger.error("Error: Unexpected data format from STT_controler.wash_data")
                        continue

                    Logger.info(f"STT的結果 ( 錄音的內容 ) :\n{with_tag}")
                    new_note = my_ai.req(with_tag)
                    Logger.info(f"AI 生成的筆記:\n{my_ai.note}")
                    Logger.info(f"AI 的記憶:\n{my_ai.ai_memo}")
                except Exception as e:
                    Logger.error(f"Error processing audio: {str(e)}")
                    def get_proper_path():
                        current_path = "./temp_recoad"
                        i = 0
                        save = f"{current_path}{i}.wav"
                        while os.path.exists(os.path.abspath(save)):
                            i += 1
                            save = f"{current_path}{i}.wav"
                        return save
                    AudioHelper.save_ioStream(iostream, get_proper_path())
            except Empty:
                with self.end.get_lock():
                    if self.end.value:
                        break
            except KeyboardInterrupt:
                Logger.debug("檢測到使用者中斷事件!!，等待外部控制線程終止")
                continue # 這邊要求外部終止線程

    def add_into_queue(self, item: BytesIO) -> bool:
        if self.queue.qsize() > 10:  # Arbitrary limit to prevent memory issues
            self.logger.warning("Queue is getting too large, skipping recording")
            return False
        self.queue.put(item)
        return True


def main():
    Logger = get_logger(True)
    Logger.info("程式開始執行")

    assistant = MultithreadingAssistant(Logger)
    assistant.start()
    audio_controler = AudioHelper(Logger)
    try:
        while True:
            Logger.info("開始錄製")
            iostream, end = audio_controler.record_audio(t_recode)
            Logger.info("錄製結束")
            assistant.add_into_queue(iostream)
            if end:
                Logger.critical("終止線程.... 程式退出...")
                assistant.stop()
                break
    except KeyboardInterrupt:
        Logger.critical("終止線程.... 程式退出...")
        assistant.stop()

if __name__ == '__main__':
    main()