const form =
    document.getElementById("expenseForm");

const table =
    document.getElementById("expenseTable");

async function loadExpenses() {

    const response =
        await fetch("/api/expenses");

    const expenses =
        await response.json();

    table.innerHTML = "";

    expenses.forEach(expense => {

        table.innerHTML += `
        <tr>
            <td>${expense.id}</td>
            <td>${expense.title}</td>
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>
                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

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

loadExpenses();