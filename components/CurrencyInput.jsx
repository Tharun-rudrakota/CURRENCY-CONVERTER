import React from "react";

export default function CurrencyInput({ value, onChange, error, disabled }) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor="amount">
        Amount
      </label>
      <div className={`amount-input-wrap${error ? " has-error" : ""}`}>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "amount-error" : "amount-help"}
        />
        <span className="amount-input-note">Enter amount</span>
      </div>
      {error ? (
        <p className="field-error" id="amount-error">
          {error}
        </p>
      ) : (
        <p className="field-help" id="amount-help">
          Enter any amount, including decimals.
        </p>
      )}
    </div>
  );
}
