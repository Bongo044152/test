from openai import OpenAI
from dotenv import load_dotenv
from utiles.config import get_system_prompt
import os

load_dotenv()

class GPT_controller:

    def __init__(self):
        self.note = "" # 上一次的筆記（此處空白，代表第一次請求） -> 更新
        self.ai_memo = "" # 更新
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def req(self, audio_text: str):

        system_prmopt = get_system_prompt(self.ai_memo)

        # OpenAI API 請求內容
        messages = [
            {"role": "system", "content": system_prmopt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "【語音檔】"},
                    {"type": "text", "text": audio_text},  # 使用音頻文字
                    {"type": "text", "text": "【上一次整理到一半的筆記或者會議紀錄】"},
                    {"type": "text", "text": self.note},  # 上次的筆記，這裡可以設置為空
                ],
            },
        ]

        # 發送請求到 GPT-4o
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.1,
            top_p=0.5,  # 使用核採樣提高多樣性
            presence_penalty=0.5,  # 增加新話題的出現頻率
            frequency_penalty=0.3,  # 減少重複
            max_tokens=1000
        )

        # 取得 AI 生成的筆記
        updated_notes = response.choices[0].message.content

        def get_info(text: str):
            str1 = "【筆記或者會議紀錄】"
            str2 = "【你認為有利的訊息】"
            index1 = text.find(str1)
            index2 = text.find(str2)
            index1_end = index1 + len(str1) - 1
            index2_end = index2 + len(str2) - 1
            return text[index1_end+1: index2].strip('\n').strip(' '), text[index2_end+1+1:].strip('\n').strip(' ')

        self.note, self.ai_memo = get_info(updated_notes)

        if len(self.note) > 2500:
            with open("output.md", "a", encoding="uft8") as f:
                f.write(self.note)
            self.note = ''

        # 輸出更新後的筆記
        return self.note

if __name__ == '__main__':
    from utiles.AudioHelper import AudioHelper
    from utiles.STT import STT_controler
    filepath = "./audio/666.txt"
    iostream = AudioHelper.load_to_io(filepath)
    res = STT_controler.get_text(iostream)
    a, b = STT_controler.wash_data(res)
    print(a)
    print(b)
