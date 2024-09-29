function sendMessage() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const message = document.getElementById('message').value;
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
}

function autoFillMessage(message) {
    document.getElementById('message').value = message;
}

