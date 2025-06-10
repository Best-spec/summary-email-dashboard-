from services.inquiry_api import inquiryAPI
from collections import Counter
import json

class parsed:
    def __init__(self):
        pass
    def parsed_entries(self):
        data_arr = inquiryAPI()
        d = data_arr.sumapi()
        return d
        print(d)
    
    def find_inquiry(self):
        """
        convert dict
        """
        # data = self.parsed_entries()
        data = [
            ['Inquiry Form - AR', 'General Inquiry', 'General Inquiry', 'General Inquiry', 'Other', 'Other', 'Other', 'General Inquiry', 'Estimated Cost', 'Other', 'Other'],
            ['Inquiry Form - DE', 'Allgemeine Anfrage', 'Allgemeine Anfrage', 'Vorraussichtliche Kosten', 'Vorraussichtliche Kosten', 'Vorraussichtliche Kosten', 'Andere', 'Arzt im Bangkok Hospital Pattaya kontaktieren', 'Andere', 'Allgemeine Anfrage', 'Allgemeine Anfrage'],
            ['Inquiry Form - EN', 'Estimated Cost', 'Other', 'General Inquiry', 'Other', 'Other', 'General Inquiry', 'General Inquiry', 'General Inquiry', 'Estimated Cost', 'General Inquiry'],
            ['Inquiry Form - RU', 'Узнать про цену', 'Общий запрос', 'Узнать про цену', 'Другое', 'Другое', 'Общий запрос', 'Узнать про цену', 'Общий запрос', 'Другое', 'Другое'],
            ['Inquiry Form - TH', 'ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา', 'สอบถามทั่วไป', 'อื่นๆ', 'อื่นๆ', 'สอบถามทั่วไป', 'ค่าใช้จ่าย', 'ค่าใช้จ่าย', 'สอบถามทั่วไป', 'อื่นๆ', 'ค่าใช้จ่าย'],
            ['Inquiry Form - Zh-hans', '普通咨询', '普通咨询', '普通咨询', '普通咨询', '联系芭提雅曼谷医院医生', '普通咨询', '其他', '预估价格咨询', '预估价格咨询', '普通咨询']
        ]

        categories = {
        'English': [
            "General Inquiry",
            "Estimated Cost",
            "Contact My Doctor at Bangkok Hospital Pattaya",
            "Other"
        ],
        'Thai': [
            "สอบถามทั่วไป",
            "ค่าใช้จ่าย",
            "ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา",
            "อื่นๆ"
        ],
        'Russia': [
            "Общий запрос",
            "Узнать про цену",
            "Написать врачу",
            "Другое"
        ],
        'Arabic': [
            "General Inquiry",
            "Estimated Cost",
            "Contact My Doctor at Bangkok Hospital Pattaya",
            "Other"
        ],
        'Chinese': [
            "普通咨询",
            "预估价格咨询",
            "联系芭提雅曼谷医院医生",
            "其他"
        ],
        'German': [
            "Allgemeine Anfrage",
            "Vorraussichtliche Kosten",
            "Arzt im Bangkok Hospital Pattaya kontaktieren",
            "Andere"
        ]
        }

        form_lang_map = {
            'Inquiry Form - EN': 'English',
            'Inquiry Form - TH': 'Thai',
            'Inquiry Form - RU': 'Russia',
            'Inquiry Form - AR': 'Arabic',
            'Inquiry Form - Zh-hans': 'Chinese',
            'Inquiry Form - DE': 'German'
        }

        result = {}

        for lang_list in data:
            form_name = lang_list[0]
            lang = form_lang_map.get(form_name)
            counter = Counter(lang_list[1:])

            full_count = {cat: counter.get(cat, 0) for cat in categories[lang]}
            result[lang] = full_count  # เปลี่ยนตรงนี้
        return result

    def export_json(self):
        # export json to string (หรือจะเขียนลงไฟล์ก็ได้)
        result = self.find_inquiry()
        # json_output = json.dumps(result, indent=2, ensure_ascii=False)
        # print(json_output)
        return result