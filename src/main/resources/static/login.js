document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita il comportamento predefinito del form

    // Ottieni il valore inserito nell'input email
    var email = document.getElementById('email').value.toLowerCase();
    switch (true){
        case email.includes('animatore'):
            window.location.href = '/ProgettoAppWebMobile/src/main/resources/templates/UsersType/animatore/animatore.html';
            break;
        case email.includes('contributorautorizzato'):
            window.location.href = '/ProgettoAppWebMobile/src/main/resources/templates/UsersType/contributorAutorizzato/contributorAutorizzato.html';
            break;
        case email.includes('curatore'):
            window.location.href = '/ProgettoAppWebMobile/src/main/resources/templates/UsersType/curatore/curatore.html';
            break;
        case email.includes('turistaautorizzato'):
            window.location.href = '/ProgettoAppWebMobile/src/main/resources/templates/UsersType/turistaAutorizzato/turistaAutorizzato.html';
            break;
        case email.includes('gestorepiattaforma'):
            window.location.href = '/ProgettoAppWebMobile/src/main/resources/templates/UsersType/gestorePiattaforma/gestorePiattaforma.html';
            break;
        default:
            alert('Effettua il login');
    }
});

