downloadPdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text('Relatório de Saídas Filtradas', 14, 20);

    // Subcabeçalho
    doc.setFontSize(12);
    doc.text('Motorista - Loja - Valor Saída - Data', 14, 30);

    let y = 40;
    let totalValue = 0; // Para somar os valores das saídas
    const lineHeight = 10; // Altura de cada linha
    const pageHeight = doc.internal.pageSize.height; // Altura da página

    filteredExpenses.forEach((expense, index) => {
        // Verifica se há espaço suficiente na página atual
        if (y + lineHeight > pageHeight - 20) {
            doc.addPage(); // Adiciona uma nova página se necessário
            y = 20; // Reinicia a posição de y para o topo da nova página
        }

        // Adiciona o texto de cada saída
        const expenseText = `${expense.driver} - ${expense.store} - R$${expense.amount}  - ${expense.date}`;
        doc.text(expenseText, 14, y);
        y += lineHeight; // Move para a próxima linha

        totalValue += parseFloat(expense.amount); // Acumula o valor total
    });

    // Verifica se o total cabe na página atual, caso contrário, adiciona uma nova página
    if (y + lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
    }

    // Adiciona o total ao PDF
    doc.setFontSize(14);
    doc.text(`Total das Saídas: R$${totalValue.toFixed(2)}`, 14, y);

    // Salva o PDF
    doc.save('Relatorio_de_Saidas.pdf');
});
