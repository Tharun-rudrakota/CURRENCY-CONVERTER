import React, { useEffect, useRef, useState } from "react";
import CurrencyInput from "./components/CurrencyInput.jsx";
import CurrencySelector from "./components/CurrencySelector.jsx";
import ResultCard from "./components/ResultCard.jsx";
import "./App.css";

const API_BASE_URL = "https://api.frankfurter.dev/v1";

async function readJson(response) {
  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Frankfurter returned an unreadable response. Please try again.");
    }
    throw error;
  }
  if (!response.ok) {
    throw new Error(
      payload?.message || "Frankfurter could not complete the request. Please try again.",
    );
  }
  return payload;
}

function getErrorMessage(error, fallback) {
  if (error instanceof TypeError) {
    return "Unable to reach Frankfurter. Check your internet connection and try again.";
  }
  return error instanceof Error ? error.message : fallback;
}

export default function App() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [currencies, setCurrencies] = useState({});
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [loadingConversion, setLoadingConversion] = useState(false);
  const [currencyLoadFailed, setCurrencyLoadFailed] = useState(false);
  const [currencyRetry, setCurrencyRetry] = useState(0);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [amountError, setAmountError] = useState("");
  const requestId = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingCurrencies(true);

    async function loadCurrencies() {
      try {
        const response = await fetch(`${API_BASE_URL}/currencies`, {
          signal: controller.signal,
        });
        const data = await readJson(response);
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("The currency list returned an unexpected response.");
        }
        if (!data.USD || !data.INR) {
          throw new Error("Frankfurter does not currently list the default USD and INR currencies.");
        }
        setCurrencies(data);
        setCurrencyLoadFailed(false);
        setMessage("");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setCurrencyLoadFailed(true);
          setMessage(
            `Unable to load currencies: ${getErrorMessage(
              error,
              "Please check your connection and try again.",
            )}`,
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCurrencies(false);
        }
      }
    }

    loadCurrencies();
    return () => controller.abort();
  }, [currencyRetry]);

  async function convert(nextAmount = amount, nextFrom = fromCurrency, nextTo = toCurrency) {
    const currentRequestId = ++requestId.current;
    const normalizedAmount = nextAmount.trim();
    const numericAmount = Number(normalizedAmount);

    if (!normalizedAmount) {
      setLoadingConversion(false);
      setAmountError("Enter an amount to convert.");
      setMessage("");
      setResult(null);
      return;
    }
    if (!Number.isFinite(numericAmount)) {
      setLoadingConversion(false);
      setAmountError("Enter a valid number.");
      setMessage("");
      setResult(null);
      return;
    }
    if (numericAmount < 0) {
      setLoadingConversion(false);
      setAmountError("Amount cannot be negative.");
      setMessage("");
      setResult(null);
      return;
    }

    setAmountError("");
    setMessage("");
    setResult(null);
    setLoadingConversion(true);

    try {
      if (nextFrom === nextTo) {
        if (currentRequestId === requestId.current) {
          setResult({
            amount: numericAmount,
            convertedAmount: numericAmount,
            from: nextFrom,
            to: nextTo,
            rate: 1,
            date: null,
          });
        }
        return;
      }

      const query = new URLSearchParams({
        base: nextFrom,
        symbols: nextTo,
      });
      const response = await fetch(`${API_BASE_URL}/latest?${query}`);
      const data = await readJson(response);
      const rate = data?.rates?.[nextTo];

      if (
        typeof data?.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
        typeof rate !== "number" ||
        !Number.isFinite(rate) ||
        rate <= 0
      ) {
        throw new Error(
          "No exchange rate is available for that currency pair. Choose different currencies.",
        );
      }

      const convertedAmount = numericAmount * rate;
      if (!Number.isFinite(convertedAmount)) {
        throw new Error("The converted amount is outside the supported numeric range.");
      }

      if (currentRequestId === requestId.current) {
        setResult({
          amount: numericAmount,
          convertedAmount,
          from: nextFrom,
          to: nextTo,
          rate,
          date: data.date,
        });
      }
    } catch (error) {
      if (currentRequestId === requestId.current) {
        setMessage(
          getErrorMessage(
            error,
            "Conversion failed. Check your connection and try again.",
          ),
        );
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoadingConversion(false);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    convert();
  }

  function handleSwap() {
    const nextFrom = toCurrency;
    const nextTo = fromCurrency;
    setFromCurrency(nextFrom);
    setToCurrency(nextTo);
    convert(amount, nextFrom, nextTo);
  }

  const isBusy = loadingCurrencies || loadingConversion;

  return (
    <main className="page-shell">
      <div className="background-orb background-orb-one" aria-hidden="true" />
      <div className="background-orb background-orb-two" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Currency Converter home">
          <span className="brand-mark" aria-hidden="true">
            <span>$</span>
            <span>€</span>
          </span>
          <span className="brand-name">rate<span>wise</span></span>
        </a>
        <div className="live-indicator">
          <span className="live-dot" />
          LATEST AVAILABLE RATES
        </div>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">MONEY, MADE SIMPLE</p>
        <h1 id="page-title">Currency Converter</h1>
        <p className="hero-description">
          Know what your money is worth, wherever life takes you.
        </p>
      </section>

      <section className="converter-card" aria-label="Currency conversion form">
        <form onSubmit={handleSubmit} noValidate>
          <CurrencyInput
            value={amount}
            onChange={(nextAmount) => {
              setAmount(nextAmount);
              setAmountError("");
              setMessage("");
              setResult(null);
            }}
            error={amountError}
            disabled={isBusy}
          />

          <div className="currency-row">
            <CurrencySelector
              id="from-currency"
              label="From"
              value={fromCurrency}
              currencies={currencies}
              onChange={(nextCurrency) => {
                setFromCurrency(nextCurrency);
                setMessage("");
                setResult(null);
              }}
              disabled={isBusy || Object.keys(currencies).length === 0}
            />
            <button
              className="swap-button"
              type="button"
              onClick={handleSwap}
              disabled={isBusy || Object.keys(currencies).length === 0}
              aria-label="Swap source and target currencies"
              title="Swap currencies"
            >
              <span aria-hidden="true">⇄</span>
            </button>
            <CurrencySelector
              id="to-currency"
              label="To"
              value={toCurrency}
              currencies={currencies}
              onChange={(nextCurrency) => {
                setToCurrency(nextCurrency);
                setMessage("");
                setResult(null);
              }}
              disabled={isBusy || Object.keys(currencies).length === 0}
            />
          </div>

          <button className="convert-button" type="submit" disabled={isBusy}>
            {loadingConversion ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Getting latest rate
              </>
            ) : loadingCurrencies ? (
              "Loading currencies…"
            ) : (
              <>
                Convert
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </form>

        {message && (
          <div className="status-message" role="alert">
            <span aria-hidden="true">!</span>
            <span className="status-text">{message}</span>
            {currencyLoadFailed && (
              <button
                className="retry-button"
                type="button"
                onClick={() => setCurrencyRetry((attempt) => attempt + 1)}
                disabled={loadingCurrencies}
              >
                Retry
              </button>
            )}
          </div>
        )}

        {result && <ResultCard result={result} />}

        <p className="powered-by">
          Rates provided by{" "}
          <a href="https://www.frankfurter.dev/" target="_blank" rel="noreferrer">
            Frankfurter
          </a>
        </p>
      </section>

      <footer className="page-footer">
        <span>Simple, transparent currency conversion.</span>
        <span className="footer-separator" aria-hidden="true">·</span>
        <span>Rates reflect the latest data available.</span>
      </footer>
    </main>
  );
}
