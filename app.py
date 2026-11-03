from pathlib import Path
import sys

from flask import Flask, jsonify, request, send_from_directory

sys.path.append(str(Path(__file__).resolve().parent))

from services.currency_service import get_currency_codes, get_exchange_rate

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="/static")
app.config["JSON_SORT_KEYS"] = False


@app.get("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/currencies")
def currencies():
    try:
        codes = get_currency_codes()
        return jsonify({"currencies": codes}), 200
    except Exception as exc:  # pragma: no cover - defensive branch
        return jsonify({"error": "Unable to load currencies at the moment."}), 502


@app.post("/convert")
def convert():
    payload = request.get_json(silent=True) or {}
    amount = payload.get("amount")
    from_currency = (payload.get("from") or "").upper().strip()
    to_currency = (payload.get("to") or "").upper().strip()

    if not amount or not from_currency or not to_currency:
        return jsonify({"error": "Please provide amount, from, and to."}), 400

    try:
        amount_value = float(amount)
    except (TypeError, ValueError):
        return jsonify({"error": "Amount must be a valid number."}), 400

    if amount_value < 0:
        return jsonify({"error": "Amount cannot be negative."}), 400

    try:
        result = get_exchange_rate(from_currency, to_currency, amount_value)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:  # pragma: no cover - defensive branch
        return jsonify({"error": "Conversion failed. Please try again later."}), 502

    return jsonify(result), 200


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
