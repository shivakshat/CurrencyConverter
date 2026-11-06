
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }
        else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update country flag
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Initialize flags
updateFlag(fromCurr);
updateFlag(toCurr);

// Fetch exchange rates
const getExchangeRate = async (from, to) => {
    const URL = `${BASE_URL}/${from.toLowerCase()}.json`;
    const FALLBACK = `${FALLBACK_URL}/${from.toLowerCase()}.json`;

    try {
        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Primary API failed");
        }

        return await response.json();

    } catch (error) {
        console.log("Trying fallback API...");

        let response = await fetch(FALLBACK);

        if (!response.ok) {
            throw new Error("Both APIs failed");
        }

        return await response.json();
    }
};

// Button click event
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || Number(amtVal) < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        let data = await getExchangeRate(
            fromCurr.value,
            toCurr.value
        );

        let rate = data[fromCurr.value.toLowerCase()][
            toCurr.value.toLowerCase()
        ];

        if (rate === undefined) {
            throw new Error("Currency not supported");
        }

        let finalAmount = Number(amtVal) * rate;

        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

    } catch (error) {
        console.error("Error:", error.message);
    }
});
