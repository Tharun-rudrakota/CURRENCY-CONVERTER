import requests

BASE_URL = "https://api.frankfurter.app"


def get_currency_codes():
    response = requests.get(f"{BASE_URL}/currencies", timeout=10)
    response.raise_for_status()
    payload = response.json()

    if not isinstance(payload, dict):
        raise ValueError("Invalid currency list received from API.")

    return payload


def get_exchange_rate(from_currency, to_currency, amount):
    amount_value = round(float(amount), 2)

    if from_currency == to_currency:
        return {
            "amount": amount_value,
            "from": from_currency,
            "to": to_currency,
            "exchange_rate": 1.0,
            "converted_amount": amount_value,
        }

    params = {"amount": amount_value, "from": from_currency, "to": to_currency}
    response = requests.get(f"{BASE_URL}/latest", params=params, timeout=10)
    response.raise_for_status()
    payload = response.json()

    if "rates" not in payload or not payload["rates"]:
        raise ValueError("No exchange rate found for the selected currencies.")

    rate = payload["rates"].get(to_currency)
    if rate is None:
        raise ValueError("The selected target currency is not supported.")

    return {
        "amount": amount_value,
        "from": from_currency,
        "to": to_currency,
        "exchange_rate": round(rate, 2),
        "converted_amount": round(amount_value * rate, 2),
    }
