downloadPdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Definir o espaço disponível na página e a altura de cada linha
    const lineHeight = 10; // Altura de cada linha de texto
    const pageHeight = doc.internal.pageSize.height; // Altura da página
    const marginTop = 20; // Margem no topo da página
    const marginBottom = 20; // Margem na parte inferior da página
    let y = marginTop; // Inicializa a posição Y
    
    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text('Relatório de Saídas Filtradas', 14, y);
    y += lineHeight * 2; // Ajuste de espaço abaixo do título

    // Subcabeçalho
    doc.setFontSize(12);
    doc.text('Motorista - Loja - Valor Saída - Data', 14, y);
    y += lineHeight; // Ajuste de espaço após o subcabeçalho

    let totalValue = 0; // Para somar os valores das saídas

    // Adiciona cada saída filtrada
    filteredExpenses.forEach((expense, index) => {
        const expenseText = `${expense.driver} - ${expense.store} - R$${expense.amount}  - ${expense.date}`;
        
        // Verifica se o próximo item cabe na página atual
        if (y + lineHeight > pageHeight - marginBottom) {
            doc.addPage(); // Adiciona uma nova página se necessário
            y = marginTop; // Reinicia a posição de y no topo da nova página
        }

        // Adiciona o texto da saída
        doc.text(expenseText, 14, y);
        y += lineHeight; // Move para a próxima linha
        
        totalValue += parseFloat(expense.amount); // Acumula o valor total
    });

    // Verifica se o total cabe na página atual
    if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
    }

    // Adiciona o total ao PDF
    doc.setFontSize(14);
    doc.text(`Total das Saídas: R$${totalValue.toFixed(2)}`, 14, y);

    // Salva o PDF
    doc.save('Relatorio_de_Saidas.pdf');
});
