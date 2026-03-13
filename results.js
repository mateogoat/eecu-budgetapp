
import { categories } from './categories.js';

const chart_container = () =>
    /** @type {HTMLCanvasElement} */(document.querySelector('.graph'));

document.addEventListener('DOMContentLoaded', () => {
    // Select all input fields with the class "spending-input"
    const inputs = document.querySelectorAll('input[type="text"]');

    // Populate inputs with values from localStorage
    inputs.forEach(input => {
        const storedValue = localStorage.getItem(input.id); // Retrieve value from localStorage
        if (storedValue !== null) {
            input.value = storedValue; // Set the input value
        }

        // Add an event listener to update localStorage on change
        input.addEventListener('change', () => {
            localStorage.setItem(input.id, input.value); // Update localStorage
        });
    });
});

let current_chart;

function updateChart() {

    categories.forEach(category => {
        category.inputs.forEach(input => {
            const value = input.value; // Get the current value of the input
            localStorage.setItem(input.name, value); // Save to localStorage
        });
    });
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

window.updateChart = updateChart;


