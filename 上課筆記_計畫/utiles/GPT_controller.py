from openai import OpenAI
from dotenv import load_dotenv
import sys, os
sys.path.append(os.path.abspath("."))
from utiles.config import get_system_prompt

load_dotenv()

encode = 'utf-8'
class Infomation_recode_helper():
    
    @staticmethod
    def write_end(data, path):
        """將資料寫在文件的最末端"""
        with open(path, "a", encoding=encode) as f:
            f.write(data)
    
    @staticmethod
    def clean(path):
        """清除目標文件，如果該文件不存在，則 Error"""
        if not os.path.exists(os.path.abspath(path)):
            raise FileNotFoundError("該文件不存在")
        with open(path, "w", encoding=encode) as f:
            f.write("")
    
    @staticmethod
    def read(path) -> str:
        """讀取資料"""
        if not os.path.exists(os.path.abspath(path)):
            with open(path, "w", encoding=encode) as f:
                f.write("")


        with open(path, "r", encoding=encode) as f:
            txt = f.read()
        return txt


class GPT_controller:

    def __init__(self):
        self.note = "" # 上一次的筆記（此處空白，代表第一次請求） -> 更新
        self.ai_memo = "" # 更新
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        # 用戶指示
        self.user_instruct = "" # 用戶當前指示/需求，每次跌代清空
        self.bac = "" # 用戶提示當前情境，例如教授正在閱讀或者探討一些議題，方便 ai 掌握重點，每次跌代清空

    def req(self, audio_text: str):

        # 讀取記憶
        note_path = "./current_note.txt"
        user_instruct_path = "./user_instruct.txt"
        bac_path = "./bac.txt"

        # 讀取必要資訊
        self.note = Infomation_recode_helper.read(note_path)
        self.user_instruct = Infomation_recode_helper.read(user_instruct_path)
        self.bac = Infomation_recode_helper.read(bac_path)
        # 清空
        Infomation_recode_helper.clean(note_path)
        Infomation_recode_helper.clean(user_instruct_path)
        Infomation_recode_helper.clean(bac_path)

        system_prmopt = get_system_prompt(self.ai_memo, self.user_instruct, self.bac)

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
            with open("output.md", "a", encoding=encode) as f:
                f.write(self.note)
            self.note = ''

        # 寫入
        Infomation_recode_helper.write_end(self.note, note_path)

        # 清空狀態
        self.user_instruct = self.bac = ""

        # 輸出更新後的筆記
        return self.note

if __name__ == '__main__':
    from utiles.AudioHelper import AudioHelper
    from utiles.STT import STT_controler
    filepath = "./audio/666.txt"
    iostream = AudioHelper.load_to_io(filepath)
    res = STT_controler.get_text(iostream)
    a, b = STT_controler.wash_data(res)
    gpt = GPT_controller()
    print(a)
    print(b)
    print(gpt.req(a))