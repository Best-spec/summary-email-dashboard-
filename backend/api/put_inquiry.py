import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os
import json

class api_inquiry:
    def __init__(self):
        load_dotenv()

    def put_inquiry(self):
        

        username = os.getenv("GF_USERNAME")
        app_password = os.getenv("GF_APP_PASSWORD")
        base_url = os.getenv("GF_URL_BASE")

        Inquiry_id = {
        "Inquiry Form - AR": "35",
        "Inquiry Form - DE": "46",
        "Inquiry Form - EN": "1",
        "Inquiry Form - RU": "27",
        "Inquiry Form - TH": "7",
        "Inquiry Form - Zh-hans": "40"
        }

        API_ENDPOINT = f"{base_url}/wp-json/gf/v2/forms/{Inquiry_id['Inquiry Form - AR']}/entries"

        # --- กำหนดพารามิเตอร์ทั้งหมด ---
        # 1. การแบ่งหน้า (Paging)
        params = {
            "paging[page_size]": 5,
            "paging[current_page]": 1, # เริ่มต้นที่หน้าแรก หรือกำหนดหน้าอื่นที่คุณต้องการ
        }

        # --- ส่งคำขอ GET ไปยัง API ---
        try:
            response = requests.get(
                API_ENDPOINT,
                params=params,
                auth=(username, app_password),
                headers={"Content-Type": "application/json"}
            )

            # ตรวจสอบสถานะการตอบกลับ
            response.raise_for_status() # จะยกเว้นข้อผิดพลาดสำหรับสถานะ 4xx/5xx

            # แปลงข้อมูล JSON ที่ได้มาเป็น Python dictionary
            data = response.json()

            # แสดงผลลัพธ์
            print("API Response (JSON):")
            print(json.dumps(data, indent=2, ensure_ascii=False))

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            if hasattr(http_err, 'response') and http_err.response is not None:
                print(f"Response content: {http_err.response.text}")
        except requests.exceptions.RequestException as req_err:
            print(f"An unexpected error occurred: {req_err}")
        return data