import React from "react";

function formatCurrency(value, currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date) {
  if (!date) {
    return "No market rate needed";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export default function ResultCard({ result }) {
  const rate = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
  }).format(result.rate);

  return (
    <section className="result-card" aria-live="polite" aria-label="Conversion result">
      <div className="result-heading">
        <span className="result-heading-icon" aria-hidden="true">
          ↗
        </span>
        <span>Converted amount</span>
      </div>
      <p className="result-source">
        {formatCurrency(result.amount, result.from)} =
      </p>
      <p className="result-value">{formatCurrency(result.convertedAmount, result.to)}</p>
      <div className="result-details">
        <div>
          <span className="detail-label">Exchange rate</span>
          <span className="detail-value">
            1 {result.from} = {rate} {result.to}
          </span>
        </div>
        <div>
          <span className="detail-label">Rate date</span>
          <span className="detail-value">{formatDate(result.date)}</span>
        </div>
      </div>
    </section>
  );
}
