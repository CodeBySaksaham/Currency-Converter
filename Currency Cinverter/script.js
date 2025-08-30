const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const resultText = document.getElementById("result");

const country_code_map = {
  "AED": "AE", "AFN": "AF", "ALL": "AL", "AMD": "AM", "ANG": "NL", "AOA": "AO", "ARS": "AR", "AUD": "AU", "AWG": "AW",
  "AZN": "AZ", "BAM": "BA", "BBD": "BB", "BDT": "BD", "BGN": "BG", "BHD": "BH", "BIF": "BI", "BMD": "BM", "BND": "BN",
  "BOB": "BO", "BRL": "BR", "BSD": "BS", "BTN": "BT", "BWP": "BW", "BYN": "BY", "BZD": "BZ", "CAD": "CA", "CDF": "CD",
  "CHF": "CH", "CLP": "CL", "CNY": "CN", "COP": "CO", "CRC": "CR", "CUP": "CU", "CVE": "CV", "CZK": "CZ", "DJF": "DJ",
  "DKK": "DK", "DOP": "DO", "DZD": "DZ", "EGP": "EG", "ERN": "ER", "ETB": "ET", "EUR": "EU", "FJD": "FJ", "FKP": "FK",
  "FOK": "FO", "GBP": "GB", "GEL": "GE", "GGP": "GG", "GHS": "GH", "GIP": "GI", "GMD": "GM", "GNF": "GN", "GTQ": "GT",
  "GYD": "GY", "HKD": "HK", "HNL": "HN", "HRK": "HR", "HTG": "HT", "HUF": "HU", "IDR": "ID", "ILS": "IL", "IMP": "IM",
  "INR": "IN", "IQD": "IQ", "IRR": "IR", "ISK": "IS", "JEP": "JE", "JMD": "JM", "JOD": "JO", "JPY": "JP", "KES": "KE",
  "KGS": "KG", "KHR": "KH", "KID": "KI", "KMF": "KM", "KRW": "KR", "KWD": "KW", "KYD": "KY", "KZT": "KZ", "LAK": "LA",
  "LBP": "LB", "LKR": "LK", "LRD": "LR", "LSL": "LS", "LYD": "LY", "MAD": "MA", "MDL": "MD", "MGA": "MG", "MKD": "MK",
  "MMK": "MM", "MNT": "MN", "MOP": "MO", "MRU": "MR", "MUR": "MU", "MVR": "MV", "MWK": "MW", "MXN": "MX", "MYR": "MY",
  "MZN": "MZ", "NAD": "NA", "NGN": "NG", "NIO": "NI", "NOK": "NO", "NPR": "NP", "NZD": "NZ", "OMR": "OM", "PAB": "PA",
  "PEN": "PE", "PGK": "PG", "PHP": "PH", "PKR": "PK", "PLN": "PL", "PYG": "PY", "QAR": "QA", "RON": "RO", "RSD": "RS",
  "RUB": "RU", "RWF": "RW", "SAR": "SA", "SBD": "SB", "SCR": "SC", "SDG": "SD", "SEK": "SE", "SGD": "SG", "SHP": "SH",
  "SLE": "SL", "SLL": "SL", "SOS": "SO", "SRD": "SR", "SSP": "SS", "STN": "ST", "SYP": "SY", "SZL": "SZ", "THB": "TH",
  "TJS": "TJ", "TMT": "TM", "TND": "TN", "TOP": "TO", "TRY": "TR", "TTD": "TT", "TVD": "TV", "TWD": "TW", "TZS": "TZ",
  "UAH": "UA", "UGX": "UG", "USD": "US", "UYU": "UY", "UZS": "UZ", "VES": "VE", "VND": "VN", "VUV": "VU", "WST": "WS",
  "XAF": "CM", "XCD": "AG", "XOF": "SN", "XPF": "PF", "YER": "YE", "ZAR": "ZA", "ZMW": "ZM", "ZWL": "ZW"
};

fetch("https://api.frankfurter.app/currencies")
  .then(res => res.json())
  .then(data => {
    const currencies = Object.keys(data).sort();

    currencies.forEach(code => {
      const option1 = document.createElement("option");
      const option2 = document.createElement("option");

      option1.value = option2.value = code;
      option1.textContent = option2.textContent = code;

      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    updateFlag("from");
    updateFlag("to");
  });

fromCurrency.addEventListener("change", () => updateFlag("from"));
toCurrency.addEventListener("change", () => updateFlag("to"));

function updateFlag(type) {
  const select = type === "from" ? fromCurrency : toCurrency;
  const flagImg = type === "from" ? fromFlag : toFlag;
  const code = select.value;
  const country = country_code_map[code] || "US";

  flagImg.src = `https://flagsapi.com/${country}/flat/32.png`;
}

function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    resultText.innerText = "Please enter a valid amount.";
    return;
  }

  fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`)
    .then(res => res.json())
    .then(data => {
      const rate = data.rates[to];
      resultText.innerText = `${amount} ${from} = ${rate} ${to}`;
    })
    .catch(() => {
      resultText.innerText = "Conversion failed. Try again.";
    });
}

document.getElementById("swapIcon").addEventListener("click", () => {
  const from = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = from;

  updateFlag("from");
  updateFlag("to");
});
