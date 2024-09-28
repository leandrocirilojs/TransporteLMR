document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses');
    const totalAmount = document.getElementById('total-amount');
    const totalProfit = document.getElementById('total-profit');
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    const filterDriver = document.getElementById('filter-driver');

    // Função para carregar e filtrar saídas
    const loadExpenses = (filterStartDateValue = null, filterEndDateValue = null, filterDriverValue = null) => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenseList.innerHTML = '';  // Limpa a lista de saídas
        let total = 0;
        let totalProf = 0;

        // Itera sobre cada saída no LocalStorage
        expenses.forEach((expense, index) => {
            const dateExpense = new Date(expense.date);  // Converte a data da saída para o formato Date

            const startDateMatch = !filterStartDateValue || dateExpense >= new Date(filterStartDateValue);
            const endDateMatch = !filterEndDateValue || dateExpense <= new Date(filterEndDateValue);
            const driverMatch = !filterDriverValue || expense.driver === filterDriverValue;

            // Verifica se a saída corresponde aos filtros
            if (startDateMatch && endDateMatch && driverMatch) {
                const li = document.createElement('li');
                li.innerHTML = `${expense.driver} - ${expense.store} - R$${expense.amount} - Recebido: R$${expense.received} - Lucro: R$${expense.profit} - ${expense.date} <button onclick="removeExpense(${index})">Remover</button>`;
                expenseList.appendChild(li);
                total += parseFloat(expense.amount);
                totalProf += parseFloat(expense.profit);
            }
        });

        // Atualiza os totais
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

        loadExpenses();  // Carrega a lista após adicionar uma nova saída
        expenseForm.reset();
    });

    // Remover saída
    window.removeExpense = (index) => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.splice(index, 1);  // Remove a saída da lista
        localStorage.setItem('expenses', JSON.stringify(expenses));  // Atualiza o LocalStorage
        loadExpenses();  // Recarrega a lista após a remoção
    };

    // Função para aplicar os filtros de data e motorista
    const applyFilters = () => {
        const startDate = filterStartDate.value;
        const endDate = filterEndDate.value;
        const driver = filterDriver.value;
        loadExpenses(startDate, endDate, driver);  // Aplica os filtros
    };

    // Eventos dos filtros de data e motorista
    filterStartDate.addEventListener('change', applyFilters);
    filterEndDate.addEventListener('change', applyFilters);
    filterDriver.addEventListener('change', applyFilters);

    // Carregar todas as saídas ao iniciar
    loadExpenses();
});
