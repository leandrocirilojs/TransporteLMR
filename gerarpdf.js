// Função para gerar o PDF
downloadPdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text('Relatório de Saídas Filtradas', 14, 20);

    // Adiciona uma linha em branco
    doc.setFontSize(12);
    doc.text('Motorista - Loja - Recebido - Pago - Lucro - Data', 14, 30); // Atualizado para incluir todos os campos

    // Adiciona cada saída filtrada
    let y = 40;
    let totalValue = 0; // Para somar os valores das saídas

    const pdfOption = document.getElementById('pdf-option').value; // Obtém o valor selecionado

    filteredExpenses.forEach((expense, index) => {
        let expenseText = '';

        // Define o texto com base na opção selecionada
        if (pdfOption === 'empresa') {
            // Inclui todas as informações no PDF da empresa
            expenseText = `${expense.driver} - ${expense.store} - R$${expense.received} - R$${expense.amount} - R$${expense.profit} - ${expense.date}`;
        } else if (pdfOption === 'motorista') {
            // Inclui informações resumidas para o motorista
            expenseText = `${expense.driver} - ${expense.store} - R$${expense.amount} - R$${expense.received} - ${expense.date}`;
        }

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
