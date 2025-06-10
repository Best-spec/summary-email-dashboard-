# api/routeapi.py
from flask import Blueprint, jsonify
from services.inquiry_api import inquiryAPI
from models.inquiry import InquiryEntry
from services.find_inquiry import parsed



raw_inquiry = inquiryAPI().put_inquiry()
parse = parsed().parsed_entries(raw_inquiry)
# mapdata = InquiryEntry(**raw_inquiry)

print(parse)
