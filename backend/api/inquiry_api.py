# api/routeapi.py
from flask import Blueprint, jsonify
from services.find_inquiry import parsed

inquiry = Blueprint("inquiry_api", __name__)

@inquiry.route("/inquiry", methods=["GET"])
def summary_route():
    res = parsed()
    json = res.export_json()

    return jsonify(json)
