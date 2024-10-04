        const endDate = filterEndDate.value;
        const driver = filterDriver.value;
        loadExpenses(startDate, endDate, driver);  // Aplica os filtros
    };

    // Eventos dos filtros de data e motorista
    filterStartDate.addEventListener('change', applyFilters);
    filterEndDate.addEventListener('change', applyFilters);
    filterDriver.addEventListener('change', applyFilters);

    // Função para gerar o PDF
/*  downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho do PDF
        doc.setFontSize(18);
        doc.text('Relatório de Saídas Filtradas', 14, 20);

        // Adiciona uma linha em branco
        doc.setFontSize(12);
        doc.text('Motorista - Loja - Valor Saída - Data', 14, 30);

        // Adiciona cada saída filtrada
        let y = 40;
        let totalValue = 0; // Para somar os valores das saídas

        filteredExpenses.forEach((expense, index) => {
            const expenseText = `${expense.driver} - ${expense.store} - R$${expense.amount}  - ${expense.date}`;
            //Para adicionar o lucro e recebido no pdf {expense.profit} - - R$${expense.received}
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
