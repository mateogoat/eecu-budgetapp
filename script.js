const chart_container = () =>
    /** @type {HTMLCanvasElement} */(document.querySelector('.graph'));
import './navigation.js';

const salary = document.getElementById('salary');

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


