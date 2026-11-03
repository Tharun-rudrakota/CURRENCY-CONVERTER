# Currency Converter

A responsive React and Vite currency converter that fetches the latest available rates directly from the [Frankfurter API](https://www.frankfurter.dev/). It includes decimal amount validation, currency selection and swapping, loading and error states, the applied rate, and the date supplied by the API.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (by default, http://localhost:5173/).

Create a production build with `npm run build`; preview it with `npm run preview`.

## Project structure

```text
src/
  components/
    CurrencyInput.jsx
    CurrencySelector.jsx
    ResultCard.jsx
  App.jsx
  App.css
  main.jsx
index.html
package.json
```

The existing `backend/` directory remains available but is not required to run the React application. Frankfurter is queried from the browser for the currency list and the latest rate for the selected pair. No exchange rates are hardcoded.
