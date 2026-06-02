const form = document.getElementById("expenseForm");
const table = document.getElementById("expenseTable");

const totalExpenseElement =
    document.getElementById("totalExpense");

const transactionCountElement =
    document.getElementById("transactionCount");

const searchInput =
    document.getElementById("search");

let allExpenses = [];
let chart;

async function loadExpenses() {

    const response =
        await fetch("/api/expenses");

    allExpenses =
        await response.json();

    renderExpenses(allExpenses);

    updateDashboard();

    renderChart();
}

function renderExpenses(expenses) {

    table.innerHTML = "";

    expenses.forEach(expense => {

        table.innerHTML += `
        <tr>
            <td>${expense.id}</td>
            <td>${expense.title}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>${expense.description || "-"}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

function updateDashboard() {

    const total =
        allExpenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );

    totalExpenseElement.textContent =
        `₹${total}`;

    transactionCountElement.textContent =
        allExpenses.length;
}

function renderChart() {

    const canvas =
        document.getElementById("expenseChart");

    if (!canvas) return;

    const categoryTotals = {};

    allExpenses.forEach(expense => {

        const category =
            expense.category;

        categoryTotals[category] =
            (categoryTotals[category] || 0)
            + Number(expense.amount);
    });

    const labels =
        Object.keys(categoryTotals);

    const values =
        Object.values(categoryTotals);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(canvas, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{
                data: values
            }]
        }
    });
}

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase();

    const filtered =
        allExpenses.filter(expense =>

            expense.title.toLowerCase().includes(keyword)

            ||

            expense.category.toLowerCase().includes(keyword)

        );

    renderExpenses(filtered);
});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const expense = {

        title: title.value,
        amount: amount.value,
        category: category.value,
        date: date.value,
        description: description.value
    };

    await fetch("/api/expenses", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(expense)
    });

    form.reset();

    loadExpenses();
});

async function deleteExpense(id) {

    await fetch(`/api/expenses/${id}`, {

        method: "DELETE"
    });

    loadExpenses();
}

loadExpenses();