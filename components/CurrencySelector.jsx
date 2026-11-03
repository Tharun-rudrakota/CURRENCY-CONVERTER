import React from "react";

const currencyFlags = {
  AED: "🇦🇪",
  AUD: "🇦🇺",
  BGN: "🇧🇬",
  BRL: "🇧🇷",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  CZK: "🇨🇿",
  DKK: "🇩🇰",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  HKD: "🇭🇰",
  HUF: "🇭🇺",
  IDR: "🇮🇩",
  ILS: "🇮🇱",
  INR: "🇮🇳",
  ISK: "🇮🇸",
  JPY: "🇯🇵",
  KRW: "🇰🇷",
  MXN: "🇲🇽",
  MYR: "🇲🇾",
  NOK: "🇳🇴",
  NZD: "🇳🇿",
  PHP: "🇵🇭",
  PLN: "🇵🇱",
  RON: "🇷🇴",
  SEK: "🇸🇪",
  SGD: "🇸🇬",
  THB: "🇹🇭",
  TRY: "🇹🇷",
  USD: "🇺🇸",
  ZAR: "🇿🇦",
};

export function getCurrencyFlag(code) {
  return currencyFlags[code] ?? "🌐";
}

export default function CurrencySelector({
  id,
  label,
  value,
  currencies,
  onChange,
  disabled,
}) {
  return (
    <div className="field-group currency-field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="currency-select-wrap">
        <span className="currency-flag" aria-hidden="true">
          {getCurrencyFlag(value)}
        </span>
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-label={`${label} currency`}
        >
          {Object.entries(currencies)
            .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
            .map(([code, name]) => (
              <option key={code} value={code}>
                {getCurrencyFlag(code)} {code} · {name}
              </option>
            ))}
        </select>
        <span className="select-chevron" aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
}
