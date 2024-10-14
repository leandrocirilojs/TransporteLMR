downloadPdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const lineHeight = 10;  // Altura de cada linha de texto
    const pageHeight = doc.internal.pageSize.height;  // Altura da página
    const marginTop = 20;  // Margem no topo da página
    const marginBottom = 20;  // Margem na parte inferior da página
    const marginLeft = 14;  // Margem à esquerda
    const marginRight = 14;  // Margem à direita
    let y = marginTop;  // Posição inicial em Y

    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text('Relatório de Saídas Filtradas', marginLeft, y);
    y += lineHeight * 2;  // Ajusta o espaço abaixo do cabeçalho

    // Subcabeçalho
    doc.setFontSize(12);
    doc.text('Motorista - Loja - Valor Saída - Data', marginLeft, y);
    y += lineHeight;  // Ajuste de espaço após o subcabeçalho

    let totalValue = 0;  // Para acumular o valor total das saídas

    // Adiciona cada saída filtrada
    filteredExpenses.forEach((expense, index) => {
        const expenseText = `${expense.driver} - ${expense.store} - R$${expense.amount}  - ${expense.date}`;
        const textLines = doc.splitTextToSize(expenseText, pageHeight - marginRight); // Divide o texto em várias linhas, se necessário

        // Verifica se o próximo texto cabe na página atual
        if (y + (textLines.length * lineHeight) > pageHeight - marginBottom) {
            doc.addPage();  // Adiciona nova página, se necessário
            y = marginTop;  // Reinicia a posição de Y no topo da nova página
        }

        // Adiciona o texto da saída
        doc.text(textLines, marginLeft, y);
        y += textLines.length * lineHeight;  // Move para a próxima posição Y

        totalValue += parseFloat(expense.amount);  // Acumula o valor total
    });

    // Verifica se o total cabe na página atual
    if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage();  // Adiciona nova página, se necessário
        y = marginTop;  // Reinicia a posição de Y no topo da nova página
    }

    // Adiciona o total ao PDF
    doc.setFontSize(14);
    doc.text(`Total das Saídas: R$${totalValue.toFixed(2)}`, marginLeft, y);

    // Salva o PDF
    doc.save('Relatorio_de_Saidas.pdf');
});
