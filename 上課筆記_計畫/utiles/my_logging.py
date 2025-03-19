import logging

def get_logger(debug = False):
    # 建立 logger
    Logger = logging.getLogger("SystemLog")
    Logger.setLevel(logging.DEBUG)  # 記錄 DEBUG 以上的所有訊息

    # 建立日誌格式
    # %(asctime)s：代表日誌記錄的時間戳（日期和時間）。當你記錄一條日誌時，%(asctime)s 會被當前的日期和時間所替換。
    # %(levelname)s：代表日誌的級別（例如 DEBUG, INFO, WARNING, ERROR, CRITICAL）。它顯示日誌消息的嚴重程度。
    # %(message)s：代表日誌的具體消息內容。這是你在記錄日誌時提供的訊息。
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s", datefmt="%Y-%m-%d %H:%M:%S")

    # 建立檔案處理器 (寫入檔案)
    file_handler = logging.FileHandler("system.log", encoding="utf-8")
    file_handler.setLevel(logging.INFO)  # 只記錄 INFO 以上級別
    file_handler.setFormatter(formatter)

    # 建立終端機處理器 (輸出到 console)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)  # 終端機顯示所有日誌
    console_handler.setFormatter(formatter)

    # 加入 handler
    Logger.addHandler(file_handler)
    if debug:
        Logger.addHandler(console_handler)

    return Logger


# 下次可以考慮直接繼承 logger，目前先這樣
