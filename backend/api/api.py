import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os
import json

load_dotenv()

username = os.getenv("GF_USERNAME")
app_password = os.getenv("GF_APP_PASSWORD")
base_url = os.getenv("GF_URL_BASE")

form_id = "2"
start_date = "2025-05-01"
end_date = "2025-05-31"

# url = f"{base_url}/wp-json/gf/v2/forms/{form_id}/entries?start_date={start_date}&end_date={end_date}"
# url = f"{base_url}/wp-json/gf/v2/forms/10/entries"

API_ENDPOINT = f"{base_url}/wp-json/gf/v2/forms/{form_id}/entries"
# --- กำหนดพารามิเตอร์ทั้งหมด ---
# 1. การแบ่งหน้า (Paging)
params = {
    "paging[page_size]": 100,
    "paging[current_page]": 1, # เริ่มต้นที่หน้าแรก หรือกำหนดหน้าอื่นที่คุณต้องการ
}

# 2. การค้นหาตามวันที่ (Search Filter for date_created)
#    ปรับช่วงวันที่ตรงนี้ได้เลย
search_filters = {
    "field_filters": [
        {"key": "date_created", "operator": ">=", "value": "2025-05-01"}, # วันเริ่มต้น
        {"key": "date_created", "operator": "<=", "value": "2025-05-31"}  # วันสิ้นสุด
    ]
}

# รวม search_filters เข้าไปใน params โดยการแปลงเป็น JSON string
params["search"] = json.dumps(search_filters)

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
# data = response.json()
# entries = data.get("entries", [])

# print(f"จำนวน entries: {len(entries)}")

# Save เป็น JSON
# with open("forms-10e.json", "w", encoding="utf-8") as f:
#     json.dump(response.json(), f, indent=2, ensure_ascii=False)

# print("✅ บันทึกไฟล์ forms.json แล้ว")

