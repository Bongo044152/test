# 1. 讀取必要的錄音黨
# 2. 轉換成文字
# 3. 把文字丟給 ai
# 4. 儲存筆記

from utiles.AudioHelper import AudioHelper

my_autio_ctl = AudioHelper(None)
iostream, _ = my_autio_ctl.record_audio(10)
AudioHelper.save_ioStream(iostream, "example.wav")