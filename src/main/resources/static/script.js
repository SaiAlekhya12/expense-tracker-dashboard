const form = document.getElementById("expenseForm");
const table = document.getElementById("expenseTable");

const totalExpenseElement =
    document.getElementById("totalExpense");

const transactionCountElement =
    document.getElementById("transactionCount");

const searchInput =
    document.getElementById("search");

const budgetInput =
    document.getElementById("budgetInput");

const budgetAmountElement =
    document.getElementById("budgetAmount");

const remainingBudgetElement =
    document.getElementById("remainingBudget");

const progressBar =
    document.getElementById("progressBar");

let allExpenses = [];
let chart;
let monthlyBudget = 0;

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

    if(expenses.length === 0){

        table.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;">
                No expenses found
            </td>
        </tr>
        `;

        return;
    }

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

function saveBudget(){

    monthlyBudget =
        Number(budgetInput.value);

    updateDashboard();
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

    budgetAmountElement.textContent =
        `₹${monthlyBudget}`;

    const remaining =
        monthlyBudget - total;

    remainingBudgetElement.textContent =
        `₹${remaining}`;

    if(monthlyBudget > 0){

        const percentage =
            Math.min(
                (total / monthlyBudget) * 100,
                100
            );

        progressBar.style.width =
            percentage + "%";

        if(percentage > 80){

            progressBar.style.background =
                "#ff4d4d";

        }else{

            progressBar.style.background =
                "linear-gradient(90deg,#00c853,#64dd17)";
        }
    }
}

function renderChart() {

    const canvas =
        document.getElementById("expenseChart");

    if (!canvas) return;

    const categoryTotals = {};

    allExpenses.forEach(expense => {

        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0)
            + Number(expense.amount);
    });

    const labels =
        Object.keys(categoryTotals);

    const values =
        Object.values(categoryTotals);

    if(chart){

        chart.destroy();
    }

    chart = new Chart(canvas, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{
                data: values,

                backgroundColor:[
                    "#667eea",
                    "#764ba2",
                    "#43e97b",
                    "#fa709a",
                    "#4facfe",
                    "#f6d365"
                ]
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false
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

            ||

            (expense.description || "")
                .toLowerCase()
                .includes(keyword)
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

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(expense)
    });

    form.reset();

    loadExpenses();
});

async function deleteExpense(id){

    await fetch(`/api/expenses/${id}`,{

        method:"DELETE"
    });

    loadExpenses();
}

function exportCSV(){

    let csv =
        "Title,Amount,Category,Date,Description\n";

    allExpenses.forEach(expense => {

        csv +=
            `${expense.title},` +
            `${expense.amount},` +
            `${expense.category},` +
            `${expense.date},` +
            `${expense.description || ""}\n`;
    });

    const blob =
        new Blob(
            [csv],
            {type:"text/csv"}
        );

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "expenses.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}

loadExpenses();
function toggleDarkMode(){

    document.body.classList.toggle(
        "dark-mode"
    );
}
