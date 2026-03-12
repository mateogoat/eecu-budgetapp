
import { categories } from './categories.js';

const chart_container = () =>
    /** @type {HTMLCanvasElement} */(document.querySelector('.graph'));

let current_chart;

function updateChart() {
    // See if there's a current chart and destroy if there is
    current_chart?.destroy();
    current_chart = new Chart(chart_container(), {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    label: 'Monthly Expenses',
                    data: categories.map(category => {
                        const values = category.inputs
                            .values()
                            .map(value => value.value); 
                        console.log(`Category: ${category.name}, Values:`, values); 

                        return values.reduce((a, b) => a + b, 0);
                    })
                }
            ],
            labels: categories.map(category => category.name)
        }
    });
    console.log(categories.map(category =>
        category.inputs
            .values()
            .map(value => value.value)
            .reduce((a, b) => a + b, 0)
    ));
}

updateChart();