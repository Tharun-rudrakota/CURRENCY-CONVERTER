const form = document.getElementById("converter-form");
const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const resetButton = document.getElementById("reset-btn");
const messageBox = document.getElementById("message");
const resultBox = document.getElementById("result");

function showMessage(text, type = "info") {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`.trim();
}

function clearMessage() {
    messageBox.textContent = "";
    messageBox.className = "message";
}

function resetForm() {
    amountInput.value = "100";
    fromCurrencySelect.value = "USD";
    toCurrencySelect.value = "INR";
    resultBox.innerHTML = "";
    resultBox.classList.add("hidden");
    clearMessage();
}

function formatNumber(value) {
    return Number(value).toFixed(2);
}

function populateCurrencies(currencies) {
    const entries = Object.entries(currencies);
    const options = entries
        .map(([code, name]) => `<option value="${code}">${code} - ${name}</option>`)
        .join("");

    fromCurrencySelect.innerHTML = options;
    toCurrencySelect.innerHTML = options;

    fromCurrencySelect.value = "USD";
    toCurrencySelect.value = "INR";
}

async function loadCurrencies() {
    try {
        const response = await fetch("/currencies");
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Unable to load currencies.");
        }
        populateCurrencies(data.currencies);
    } catch (error) {
        showMessage(error.message, "error");
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    resultBox.classList.add("hidden");

    const payload = {
        amount: amountInput.value,
        from: fromCurrencySelect.value,
        to: toCurrencySelect.value,
    };

    showMessage("Converting, please wait...");

    try {
        const response = await fetch("/convert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Conversion failed.");
        }

        const exchangeRate = data.exchange_rate ?? data.rate ?? 1;

        resultBox.innerHTML = `
            <h3>Conversion Result</h3>
            <p><strong>${formatNumber(data.amount)} ${data.from}</strong> = <strong>${formatNumber(data.converted_amount)} ${data.to}</strong></p>
            <p>Exchange rate: 1 ${data.from} = ${formatNumber(exchangeRate)} ${data.to}</p>
        `;
        resultBox.classList.remove("hidden");
        showMessage("Conversion successful.", "success");
    } catch (error) {
        showMessage(error.message, "error");
    }
});

resetButton.addEventListener("click", resetForm);

loadCurrencies();
