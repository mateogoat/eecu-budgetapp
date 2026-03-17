
import { categories } from './categories.js';

const chart_container = () =>
    /** @type {HTMLCanvasElement} */(document.querySelector('.graph'));
const TAX_STORAGE_KEY = 'eecu-budget:tax';
const MONTHLY_NET_STORAGE_KEY = 'eecu-budget:monthly-net';

document.addEventListener('DOMContentLoaded', () => {
    restoreInputsFromStorage();
    attachInputListeners();
    updateChart();
});

let current_chart;

function restoreInputsFromStorage() {
    categories.forEach(category => {
        category.inputs
            .values()
            .forEach(input => input.syncElementFromStorage());
    });
}

function attachInputListeners() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateChart();
        });
    });
}

function updateChart() {

    categories.forEach(category => {
        category.inputs.forEach(input => {
            const value = input.value; // Get the current value of the input
            localStorage.setItem(input.name, value); // Save to localStorage
        });
    });

    const categoryTotals = categories.map(category => {
        const values = category.inputs
            .values()
            .map(value => value.value);
        return values.reduce((a, b) => a + b, 0);
    });
    const taxValue = Number(localStorage.getItem(TAX_STORAGE_KEY)) || 0;

    // See if there's a current chart and destroy if there is
    current_chart?.destroy();
    current_chart = new Chart(chart_container(), {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    label: 'Monthly Expenses',
                    data: [...categoryTotals, taxValue]
                }
            ],
            labels: [...categories.map(category => category.name), 'Taxes']
        }
    });

    updateRemainingIncomeDisplay(categoryTotals);
}

function formatCurrency(value) {
    const absoluteValue = Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${value < 0 ? '-' : ''}$${absoluteValue}`;
}

function updateRemainingIncomeDisplay(categoryTotals) {
    const remainingIncomeElement = document.getElementById('remainingIncome');
    if (!remainingIncomeElement) {
        return;
    }

    const monthlyNetIncome = Number(localStorage.getItem(MONTHLY_NET_STORAGE_KEY)) || 0;
    const totalMonthlySpending = categoryTotals.reduce((sum, categoryTotal) => sum + categoryTotal, 0);
    const remainingIncome = monthlyNetIncome - totalMonthlySpending;

    remainingIncomeElement.textContent = formatCurrency(remainingIncome);
    remainingIncomeElement.classList.remove('negative', 'barelyPositive', 'positive');
    if (remainingIncome < 0) {
        remainingIncomeElement.classList.add('negative');
    } else if (remainingIncome < 100) {
        remainingIncomeElement.classList.add('barelyPositive');
    } else {
        remainingIncomeElement.classList.add('positive');
    }
}

window.updateChart = updateChart;


