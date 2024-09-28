document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses');
    const totalAmount = document.getElementById('total-amount');
    const totalProfit = document.getElementById('total-profit');
    const filterDate = document.getElementById('filter-date');
    const filterDriver = document.getElementById('filter-driver');

    // Função para carregar e filtrar saídas
    const loadExpenses = (filterDateValue = null, filterDriverValue = null) => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenseList.innerHTML = '';
        let total = 0;
        let totalProf = 0;
        expenses.forEach((expense, index) => {
            const dateMatch = !filterDateValue || expense.date === filterDateValue;
            const driverMatch = !filterDriverValue || expense.driver === filterDriverValue;

            if (dateMatch && driverMatch) {
                const li = document.createElement('li');
                li.innerHTML = `${expense.driver} - ${expense.store} - R$${expense.amount} - Recebido: R$${expense.received} - Lucro: R$${expense.profit} - ${expense.date} <button onclick="removeExpense(${index})">Remover</button>`;
                expenseList.appendChild(li);
                total += parseFloat(expense.amount);
                totalProf += parseFloat(expense.profit);
            }
        });
        totalAmount.textContent = total.toFixed(2);
        totalProfit.textContent = totalProf.toFixed(2);
    };

    // Adicionar nova saída
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const driver = document.getElementById('driver-name').value;
        const store = document.getElementById('store-name').value;
        const amount = document.getElementById('expense-amount').value;
        const received = document.getElementById('received-amount').value;
        const date = document.getElementById('expense-date').value;
        const profit = (received - amount).toFixed(2);

        const expense = { driver, store, amount, received, profit, date };
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        loadExpenses();
        expenseForm.reset();
    });

    // Remover saída
    window.removeExpense = (index) => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        loadExpenses();
    };

    // Filtrar saídas por data e motorista
    filterDate.addEventListener('change', (e) => {
        loadExpenses(e.target.value, filterDriver.value);
    });

    filterDriver.addEventListener('change', (e) => {
        loadExpenses(filterDate.value, e.target.value);
    });

    // Carregar todas as saídas no início
    loadExpenses();
});
