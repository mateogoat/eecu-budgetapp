// import { Chart, DoughnutController } from 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/+esm';
import { categories } from './categories.js';

// class doughnut extends DoughnutController {}
// Chart.register(doughnut);

const chart_container = () =>
    /** @type {HTMLCanvasElement} */(document.querySelector('.graph'));

let current_page = -1;
const pages = /** @type {NodeListOf<HTMLTemplateElement>} */ (
    document.querySelectorAll('template[class^="page-"]')
);
const view = /** @type {HTMLElement} */ (document.querySelector('.inputs'));
const next = /** @type {HTMLButtonElement} */ (document.querySelector('button.next'));
const results = /** @type {HTMLAnchorElement} */ (document.querySelector('a.next[href="results.html"]'));
const back = /** @type {HTMLButtonElement} */ (document.querySelector('.back'));

next.addEventListener('click', () => {
    navigate(current_page + 1);
});

back.addEventListener('click', () => {
    navigate(current_page - 1);
});
let current_chart;

/**
 * @param {number} page
 */


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
    const taxValue = Number(localStorage.getItem('eecu-budget:tax')) || 0;

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
}

function restoreInputsFromStorage() {
    categories.forEach(category => {
        category.inputs
            .values()
            .forEach(input => input.syncElementFromStorage());
    });
}

function updateNavigationButtons() {
    // Show Continue only before page 4. Show Results at page 4 and after.
    if (current_page < 4) {
        next.classList.remove('hide');
        results.classList.add('hide');
    } else {
        next.classList.add('hide');
        results.classList.remove('hide');
    }
}

// Page navigation
function navigate(page) {
    if (current_page === page) {
        return;
    }

    // if statement prevents from going too far forward or backward in the pages
    if ((page >= 0) && (page < 6)) {
        if (page == 6) {

        }
        view.replaceChildren(
            ...pages.item((current_page = page)).content.cloneNode(true).childNodes
        );

        restoreInputsFromStorage();
        updateNavigationButtons();

        if (current_page === 0) {
            back.style.opacity = '0';
        } else {
            back.style.opacity = '1';
        }

        console.log(current_page);
        // Update the chart with the new data each time there is an update
        updateChart();
        console.log(current_chart);

    }
    console.log(current_page);
}

navigate(0);
updateChart();

window.updateChart = updateChart;

