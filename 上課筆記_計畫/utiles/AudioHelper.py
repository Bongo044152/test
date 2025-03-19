import wave, pyaudio, os
from io import BytesIO
import logging

class AudioHelper:

    def __init__(self, Logger: logging = None):
        if Logger:
            self.logger = Logger
        else:
            self.logger = None

    def record_audio(self, seconds: int = 10) -> list[BytesIO, bool]:
        """
        錄音並將音頻數據儲存為 WAV 格式。

        @params:
            seconds (int): 要錄音的時間，默認為 10 秒。

        @returns:
            BytesIO 物件，儲存在 ram 中
        """

        exist = False

        FRAMES_PER_BUFFER = 3200  # 可以提高，錄音延遲會比較低 : 時間長度 = FRAMES_PER_BUFFER / RATE
        FORMAT = pyaudio.paInt16 # 錄音格式，16-bit 整數格式（每個樣本用 2 個字節表示）
        CHANNELS = 1 
        RATE = 16000 # 取樣率
        p = pyaudio.PyAudio()

        # 開始錄音
        stream = p.open(
            format=FORMAT,
            channels=CHANNELS,
            rate=RATE,
            input=True,
            frames_per_buffer=FRAMES_PER_BUFFER
        )

        # print("start recording...")

        frames = []
        try:
            for _ in range(0, int(RATE / FRAMES_PER_BUFFER * seconds)):
                data = stream.read(FRAMES_PER_BUFFER)
                frames.append(data)

        except KeyboardInterrupt:
            # 捕獲 KeyboardInterrupt，並打印中斷信息
            if self.logger:
                self.logger.info("使用者中斷錄音...")
            else:
                print("\nRecording interrupted by user!")
            exist = True
        
        finally:
            # print("Recording stopped!")
            stream.stop_stream()
            stream.close()
            p.terminate()

        audio_data = BytesIO()  # 使用 BytesIO 儲存錄音到內存中
        wf = wave.open(audio_data, 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
        wf.close()
        audio_data.seek(0)
        return [audio_data, exist]

    @staticmethod
    def save_ioStream(iostream: BytesIO, output_filename="output.wav") -> None :
        """
        將來自 BytesIO 物件的音頻資料儲存為 WAV 檔案。

        @params:
            iostream (BytesIO): 包含音頻資料的 BytesIO 物件。
            output_filename (str): 儲存音頻資料的檔案名稱，默認為 "output_from_stream.wav"。

        @returns:
            None: 儲存檔案後沒有返回值。
        """

        assert output_filename.lower().endswith(".wav"), "檔案格式錯誤! 請檢查"

        iostream.seek(0)

        SAMPWIDTH = 2 # 2 bytes
        CHANNELS = 1
        RATE = 16000

        # 使用 wave 模組將 BytesIO 資料寫入 WAV 檔案
        with wave.open(output_filename, 'wb') as wf:
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(SAMPWIDTH)
            wf.setframerate(RATE)  # 取樣率
            
            # 從 BytesIO 物件中讀取資料並寫入檔案
            wf.writeframes(iostream.read())

        # print(f"Audio saved to {output_filename}")

    @staticmethod
    def load_to_io(filepath) -> BytesIO:
        """
        將 WAV 檔案轉成 BytesIO 物件。

        @params:
            filepath (str): 來源檔案，只支持 .wav 檔

        @returns:
            BytesIO 物件，seek 已經設為 0
        """

        assert filepath.lower().endswith(".wav"), "檔案格式錯誤! 請檢查"
        assert os.path.exists(filepath), "檔案不存在"

        with wave.open(filepath, 'rb') as wf:
            audio_buffer = BytesIO()

            # 建立一個新的 WAV 文件物件
            with wave.open(audio_buffer, 'wb') as wf_out:
                wf_out.setnchannels(wf.getnchannels())
                wf_out.setsampwidth(wf.getsampwidth())
                wf_out.setframerate(wf.getframerate())
                wf_out.writeframes(wf.readframes(wf.getnframes()))

            audio_buffer.seek(0) 
            return audio_buffer
        

if __name__ == '__main__':
    my_autio_ctl = AudioHelper(None)
    iostream = my_autio_ctl.record_audio(60)
    AudioHelper.save_ioStream(iostream, "example.wav")