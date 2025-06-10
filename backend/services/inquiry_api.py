import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os
import json

class inquiryAPI:
    def __init__(self):
        load_dotenv()

        self.Inquiry_id = {
        "Inquiry Form - AR": "35",
        "Inquiry Form - DE": "46",
        "Inquiry Form - EN": "1",
        "Inquiry Form - RU": "27",
        "Inquiry Form - TH": "7",
        "Inquiry Form - Zh-hans": "40"
        }
        self.list = []
        self.username = os.getenv("GF_USERNAME")
        self.app_password = os.getenv("GF_APP_PASSWORD")
        self.base_url = os.getenv("GF_URL_BASE")
        self.auth = (self.username, self.app_password)

    def sumapi(self):
        for lang, form_id in self.Inquiry_id.items():
            put = self.put_inquiry(lang, form_id, self.base_url)
            self.list.append(put)
        return self.list

    def put_inquiry(self, lang, form_id, url):
        api_url = f"{url}/wp-json/gf/v2/forms/{form_id}/entries"
        params = {
            "paging[page_size]": 10,
            "paging[current_page]": 1
        }

        response = requests.get(api_url, params=params, auth=self.auth)
        data = response.json()
        entries = data.get("entries", [])
        lang = [lang]
        ids = [entry['1'] for entry in entries]
        api_lang = lang + ids
        return api_lang
