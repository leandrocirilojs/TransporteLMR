document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses');
    const totalAmount = document.getElementById('total-amount');
    const totalProfit = document.getElementById('total-profit');
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    const filterDriver = document.getElementById('filter-driver');
    const downloadPdfButton = document.getElementById('download-pdf');

    let filteredExpenses = [];  // Armazena as saídas filtradas para o PDF

    // Função para carregar e filtrar saídas
    const loadExpenses = (filterStartDateValue = null, filterEndDateValue = null, filterDriverValue = null) => {
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

            // Verifica se a saída corresponde aos filtros
            if (startDateMatch && endDateMatch && driverMatch) {
                const li = document.createElement('li');
                li.innerHTML = `${expense.driver} - ${expense.store} - R$${expense.amount} - Recebido: R$${expense.received} - Lucro: R$${expense.profit} - ${expense.date} <button onclick="removeExpense(${index})">Remover</button>`;
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

    // Função para gerar o PDF
    /*downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho do PDF
        doc.setFontSize(18);
        doc.text('Relatório de Saídas Filtradas', 14, 20);

        // Adiciona uma linha em branco
        doc.setFontSize(12);
        doc.text('Motorista - Loja - Valor Saída - Recebido - Lucro - Data', 14, 30);

        // Adiciona cada saída filtrada
        let y = 40;
        let totalValue = 0; // Para somar os valores das saídas

        filteredExpenses.forEach((expense, index) => {
            const expenseText = `${expense.driver} - ${expense.store} - R$${expense.amount} - R$${expense.received} - R$${expense.profit} - ${expense.date}`;
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
*/
downloadPdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text('Relatório de Saídas Filtradas', 14, 20);

    // Definir tamanho do texto para o cabeçalho das saídas
    doc.setFontSize(12);
    doc.text('Motorista - Loja - Valor Saída - Recebido - Lucro - Data', 14, 30);

    let y = 40;  // Coordenada Y inicial
    const lineHeight = 10;  // Altura de cada linha
    const pageHeight = doc.internal.pageSize.height;  // Altura da página do PDF
    const marginBottom = 20;  // Margem inferior para não cortar o texto

    filteredExpenses.forEach((expense, index) => {
        const expenseText = `${expense.driver} - ${expense.store} - R$${expense.amount} - R$${expense.received} - R$${expense.profit} - ${expense.date}`;
        
        // Dividir o texto para garantir que ele não ultrapasse os limites da página
        const textLines = doc.splitTextToSize(expenseText, 180);  // Largura máxima do texto
        
        // Checar se o próximo bloco de texto ultrapassa o limite da página
        if (y + (textLines.length * lineHeight) > pageHeight - marginBottom) {
            doc.addPage();  // Adicionar nova página
            y = 20;  // Reiniciar a coordenada Y no topo da nova página
        }

        // Adicionar as linhas de texto
        textLines.forEach(line => {
            doc.text(line, 14, y);
            y += lineHeight;
        });
    });

    // Checar se o total cabe na última página, senão, adicionar nova página
    if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage();  // Adicionar nova página
        y = 20;  // Reiniciar a coordenada Y
    }

    // Adicionar o total ao PDF
    doc.setFontSize(14);
    doc.text(`Total das Saídas: R$${totalValue.toFixed(2)}`, 14, y);

    // Salvar o PDF
    doc.save('Relatorio_de_Saidas.pdf');
});
