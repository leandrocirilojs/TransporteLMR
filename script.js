document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses');
    const totalAmount = document.getElementById('total-amount');
    const totalProfit = document.getElementById('total-profit');
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    const filterDriver = document.getElementById('filter-driver');
    const filterStore = document.getElementById('filter-store'); // Filtro de loja
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

    // Função para gerar o PDF
    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho do PDF
        doc.setFontSize(18);
        doc.text('Fechamento Tenda', 14, 20);

        // Adiciona o nome da loja e motorista
        const storeName = filterStore.value || 'Não especificada';
        const driverName = filterDriver.value || 'Não especificado';
        doc.setFontSize(14);
        doc.text(`${storeName}`, 14, 30);
        doc.text(`${driverName}`, 14, 40);

        // Adiciona o intervalo de datas do filtro
        const startDate = new Date(filterStartDate.value);
        const endDate = new Date(filterEndDate.value);
        const periodText = `${startDate.getDate()} - ${endDate.getDate()} de ${startDate.toLocaleString('default', { month: 'long' })} a ${endDate.toLocaleString('default', { month: 'long' })}`;
        doc.text(`Período: ${periodText}`, 14, 50);

        // Agrupando as saídas por data
        const expensesByDate = {};
        filteredExpenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const dateKey = `${expenseDate.getDate()}`;
            if (!expensesByDate[dateKey]) {
                expensesByDate[dateKey] = [];
            }
            expensesByDate[dateKey].push(expense);
        });

        let y = 60;
        let totalValue = 0;
        let totalEntries = 0;

        // Adiciona as saídas agrupadas por data
        Object.keys(expensesByDate).forEach(dateKey => {
            const expensesOnDate = expensesByDate[dateKey];
            const numberOfEntries = expensesOnDate.length;
            totalValue += expensesOnDate.reduce((sum, expense) => sum + parseFloat(expense.received), 0);
            totalEntries += numberOfEntries;
            doc.text(`${dateKey} - ${numberOfEntries} Saída${numberOfEntries > 1 ? 's' : ''}`, 14, y);
            y += 10;
        });

        // Adiciona o total de saídas e o valor total
        doc.setFontSize(14);
        y += 10; // Espaço antes do texto final
        doc.text(`Total de Saídas: ${totalEntries} Saída${totalEntries > 1 ? 's' : ''}`, 14, y);
        y += 10;
        doc.text(`Valor Total: R$ ${totalValue.toFixed(2)}`, 14, y);

        // Salva o PDF
        doc.save('Fechamento_Tenda.pdf');
    });

    // Filtros de busca (Iniciar os filtros e carregar saídas com base nos filtros)
    const applyFilters = () => {
        const filterStartDateValue = filterStartDate.value;
        const filterEndDateValue = filterEndDate.value;
        const filterDriverValue = filterDriver.value;
        const filterStoreValue = filterStore.value;
        loadExpenses(filterStartDateValue, filterEndDateValue, filterDriverValue, filterStoreValue);
    };

    // Chama os filtros ao mudar qualquer campo de filtro
    filterStartDate.addEventListener('change', applyFilters);
    filterEndDate.addEventListener('change', applyFilters);
    filterDriver.addEventListener('change', applyFilters);
    filterStore.addEventListener('change', applyFilters);

    // Carregar todas as saídas ao iniciar
    loadExpenses();
});
