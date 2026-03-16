const chart_container = () =>
    /** @type {HTMLCanvasElement} */(document.querySelector('.graph'));
import './navigation.js';

const taxIncome = document.getElementById('taxIncome');
const salary = document.getElementById('salary');
const TAX_STORAGE_KEY = 'eecu-budget:tax';


// Career Select
async function careerSelector() {
    const selectCareer = document.getElementById('career-input');
    const careerSalaryMap = new Map();
    try {
        const response = await fetch('https://eecu-data-server.vercel.app/data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const users = await response.json();

        users.forEach(user => {
            careerSalaryMap.set(user["Occupation"], user["Salary"]);
            const option = new Option(user["Occupation"], user["Occupation"]);
            selectCareer.add(option);
        });

        selectCareer.addEventListener('change', () => {
            salary.textContent = careerSalaryMap.get(selectCareer.value) || '';
        })
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

careerSelector();

function taxCalculator(income_in) {
    const fixedRate = 0.1165;
    const brackets = [
        {limit: 12400, rate: 0.10},
        {limit: 50400, rate: 0.12 },
        {limit: Infinity, rate: 0.22}
    ];

    let tax = 0;
    let previousLimit = 0;

    for (const bracket of brackets) {
        if (income_in > bracket.limit) {
            tax += (bracket.limit - previousLimit) * bracket.rate;
            previousLimit = bracket.limit;
        } else {
            tax += (income_in - previousLimit) * bracket.rate;
            break;
        }
    }
    tax += income_in * fixedRate;
    return tax;
}

function updateTaxes () {
    const income = parseFloat(salary.textContent) || 0;
    const yearlyTaxValue = taxCalculator(income);
    const monthlyTaxValue = yearlyTaxValue / 12;
    if (taxIncome) {
        taxIncome.textContent = yearlyTaxValue.toFixed(2);
    }
    const netIncomeElement = document.getElementById('netIncome');
    if (netIncomeElement) {
        netIncomeElement.textContent = (income - yearlyTaxValue).toFixed(2);
    }
    localStorage.setItem(TAX_STORAGE_KEY, String(monthlyTaxValue));

    if (typeof window.updateChart === 'function') {
        window.updateChart();
    }
}


const salaryObserver = new MutationObserver (() => {
    updateTaxes();
});

salaryObserver.observe(salary, {childList: true, subtree: true});

updateTaxes();

