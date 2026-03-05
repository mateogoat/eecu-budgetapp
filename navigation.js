// import { Chart, DoughnutController } from 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/+esm';
import { categories } from './categories.js';

// class doughnut extends DoughnutController {}
// Chart.register(doughnut);

const chart_container = () =>
    /** @type {HTMLCanvasElement} */ (document.querySelector('.graph'));

let current_page = -1;
const pages = /** @type {NodeListOf<HTMLTemplateElement>} */ (
    document.querySelectorAll('template[class^="page-"]')
);
const view = /** @type {HTMLElement} */ (document.querySelector('.inputs'));
const next = /** @type {HTMLButtonElement} */ (document.querySelector('.next'));
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
function navigate(page) {
    if (current_page === page) {
        return;
    }
    view.replaceChildren(
        ...pages.item((current_page = page)).content.cloneNode(true).childNodes
    );
    if (current_page === 0) {
        back.style.opacity = '0';
    } else {
        back.style.opacity = '1';
    }
    console.log(current_page);
        // See if there's a current chart and destroy if there is
        current_chart?.destroy();
        current_chart = new Chart(chart_container(), {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        label: 'Monthly Expenses',
                        data: categories.map(category =>
                            category.inputs
                                .values()
                                .map(value => value.value)
                                .reduce((a, b) => a + b, 0)
                        )
                    }
                ],
                labels: categories.map(category => category.name)
            }
        });
        console.log(current_chart);
}

navigate(0);
