from io import BytesIO
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
import os, json

class STT_controler:

    @staticmethod
    def get_text(iostream: BytesIO):
        load_dotenv()
        iostream.seek(0)

        # 初始化 ElevenLabs 客戶端
        client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
        transcript = client.speech_to_text.convert(
            file=iostream,
            model_id="scribe_v1",
            language_code="zho",
            diarize=True
        )

        # 回傳 API 回應結果
        return transcript

    @staticmethod
    def wash_data(raw_data) -> dict:
        raw_data = json.loads(raw_data.json())
        res_text = ''
        raw_data_list = raw_data["words"]
        prev_id = raw_data_list[0]["speaker_id"]
        buffer = ''
        for item in raw_data_list :
            current_id = item["speaker_id"]
            if current_id != prev_id and buffer :
                res_text += prev_id + ": " + buffer + '\n'
                prev_id = current_id
                buffer = ''
            buffer += item['text']

        if buffer :
            res_text += prev_id + ": " + buffer + '\n'

        return res_text, raw_data["text"] # [with_tag, text_only]

if __name__ == '__main__':
    from utiles.AudioHelper import AudioHelper
    iostream = AudioHelper.load_to_io("example.wav")
    res = STT_controler.get_text(iostream)
    with_tag, text_only = STT_controler.wash_data(res)
    print(with_tag)
    print(text_only)
