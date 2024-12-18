document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses');
    const totalAmount = document.getElementById('total-amount');
    const totalProfit = document.getElementById('total-profit');
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    const filterDriver = document.getElementById('filter-driver');
    const filterStore = document.getElementById('filter-store'); // Novo filtro
    const downloadPdfButton = document.getElementById('download-pdf');

    let filteredExpenses = [];  // Armazena as saídas filtradas para o PDF

    // Função para carregar e filtrar saídas
    const loadExpenses = (filterStartDateValue = null, filterEndDateValue = null, filterDriverValue = null, filterStoreValue = null) => {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenseList.innerHTML = '';  // Limpa a lista de saídas
        let total = 0;
        let totalProf = 0;

        filteredExpenses = [];  // Reinicia a lista filtrada

        // Itera sobre cada saída no LocalStorage
        expenses.forEach((expense, index) => {
            const dateExpense = new Date(expense.date);  // Converte a data da saída para o formato Date

            const startDateMatch = !filterStartDateValue || dateExpense >= new Date(filterStartDateValue);
            const endDateMatch = !filterEndDateValue || dateExpense <= new Date(filterEndDateValue);
            const driverMatch = !filterDriverValue || expense.driver === filterDriverValue;
            const storeMatch = !filterStoreValue || expense.store === filterStoreValue; // Verifica loja

            // Verifica se a saída corresponde aos filtros
            if (startDateMatch && endDateMatch && driverMatch && storeMatch) {
                const li = document.createElement('li');
                li.innerHTML = `
    <div style="width: 300px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; position: relative; font-family: Arial, sans-serif;">
        <button onclick="removeExpense(${index})" style="position: absolute; top: 15px; right: 15px; color: red; font-weight: bold; border: none; background: none; font-size: 20px; cursor: pointer;">&times;</button>
        <div>
            <h2 style="margin: 0; text-align: left; font-size: 1.5em; color: #333;">${expense.driver}</h2>
            <p style="margin: 5px 0; color: #666;">${expense.store}</p>
        </div>
        
        <table style="width: 100%; margin-top: 20px;">
            <tr>
                <td style="padding: 8px; vertical-align: top;">
                    <p style="font-size: 0.9em; color: #666;">Valor Pago</p>
                    <p style="font-size: 1.2em; font-weight: bold; color: #333;">R$${expense.amount}</p>
                </td>
                <td style="padding: 8px; vertical-align: top;">
                    <p style="font-size: 0.9em; color: #666;">Recebido</p>
                    <p style="font-size: 1.2em; font-weight: bold; color: #333;">R$${expense.received}</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 8px; vertical-align: top;">
                    <p style="font-size: 0.9em; color: #666;">Lucro</p>
                    <p style="font-size: 1.2em; font-weight: bold; color: green;">R$${expense.profit}</p>
                </td>
                <td style="padding: 8px; vertical-align: top;">
                    <p style="font-size: 0.9em; color: #666;">Data</p>
                    <p style="font-size: 1.2em; font-weight: bold; color: #333;">${expense.date}</p>
                </td>
            </tr>
        </table>
    </div>`;
                expenseList.appendChild(li);
                total += parseFloat(expense.amount);
                totalProf += parseFloat(expense.profit);

                filteredExpenses.push(expense);  // Armazena a saída filtrada
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
        // limpar todos os campos ^ expenseForm.reset();
    });

    // Remover saída
    window.removeExpense = (index) => {
        const password = prompt("2702..Digite a senha para confirmar a remoção:");
        const correctPassword = "270207"; // Defina sua senha aqui

        if (password === correctPassword) {
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            expenses.splice(index, 1);  // Remove a saída da lista
            localStorage.setItem('expenses', JSON.stringify(expenses));  // Atualiza o LocalStorage
            loadExpenses();  // Recarrega a lista após a remoção
        } else {
            alert("Senha incorreta! A saída não foi removida.");
        }
    };

    // Função para aplicar os filtros de data, motorista e loja
    const applyFilters = () => {
        const startDate = filterStartDate.value;
        const endDate = filterEndDate.value;
        const driver = filterDriver.value;
        const store = filterStore.value; // Obtemos o valor do filtro de loja
        loadExpenses(startDate, endDate, driver, store);  // Aplica os filtros
    };

    // Eventos dos filtros de data, motorista e loja
    filterStartDate.addEventListener('change', applyFilters);
    filterEndDate.addEventListener('change', applyFilters);
    filterDriver.addEventListener('change', applyFilters);
    filterStore.addEventListener('change', applyFilters); // Adiciona o evento para o filtro de loja

    // Função para gerar o PDF
    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho do PDF
        doc.setFontSize(18);
        doc.text('Relatório de Saídas Filtradas', 14, 20);

        // Adiciona uma linha em branco
        doc.setFontSize(12);
        doc.text('Motorista - Loja - Valor - Data', 14, 30);

        // Adiciona cada saída filtrada
        let y = 40;
        let totalValue = 0; // Para somar os valores das saídas

        filteredExpenses.forEach((expense) => {
            const expenseText = `${expense.driver} - ${expense.store} - R$${expense.received} - ${expense.date}`;
            // Para adicionar o lucro e recebido no pdf {expense.profit} - - R$${expense.amounf?}
            doc.text(expenseText, 14, y);
            y += 10;  // Move para a próxima linha
            totalValue += parseFloat(expense.amount); // Acumula o valor total
        });

        // Adiciona o total ao PDF
        doc.setFontSize(14);
        doc.text(`Total das Saídas: R$${totalValue.toFixed(2)}`, 14, y);
        
        // Salva o PDF
        doc.save('Relatorio_de_Saidas.pdf');
    });

    // Carregar todas as saídas ao iniciar
    loadExpenses();
});
