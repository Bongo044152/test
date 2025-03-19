import wave

# 打開音頻文件
obj = wave.open("justin.wav", "rb")

# 取得並顯示音頻文件的各種屬性
num_channels = obj.getnchannels()  # 聲道數 -> 單聲道 or 立體聲
sample_width = obj.getsampwidth()  # 取樣寬度（字節） -> 取樣寬度 (getsampwidth()) 越高越好，8, 16, 24 ..
sample_rate = obj.getframerate()  # 取樣率（赫茲） 
num_frames = obj.getnframes()     # 幀數（總樣本數）

# 顯示基本資訊
print("Number of channels:", num_channels)
print("Sample width:", sample_width)
print("Sample rate (Hz):", sample_rate)
print("Number of frames:", num_frames)

# 計算音頻時長（秒）
t_audio = num_frames / sample_rate
print(f"Audio length: {t_audio} seconds")

# 顯示音頻的一些其他資訊
if num_channels == 1:
    print("This is a mono audio.")
elif num_channels == 2:
    print("This is a stereo audio.")

if sample_width == 2: # 1 表示 1 byte
    print("This is a 16-bit audio (high quality).")
