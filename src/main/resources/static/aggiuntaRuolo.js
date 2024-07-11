const mostraModuloBtn = document.getElementById('mostraModuloBtn');
const registrazioneForm = document.getElementById('registrazioneForm');
const rimuoviModuloBtn = document.getElementById('rimuoviModuloBtn');
const rimozioneForm = document.getElementById('rimozioneForm');

document.addEventListener('DOMContentLoaded', function() {
    const mostraModuloBtn = document.getElementById('mostraModuloBtn');
    const registrazioneForm = document.getElementById('registrazioneForm');
    const rimuoviModuloBtn = document.getElementById('rimuoviModuloBtn');
    const rimozioneForm = document.getElementById('rimozioneForm');

    mostraModuloBtn.addEventListener('click', function() {
        if (registrazioneForm.style.display === 'none') {
            registrazioneForm.style.display = 'block';
        } else {
            registrazioneForm.style.display = 'none';
        }
        document.getElementById("board").style.display = "none";
        document.querySelector(".popup").style.display = "block";
        document.getElementById("popupBackground").style.display = "flex";
    });

    document.querySelector(".close-button").addEventListener("click", function() {
        document.getElementById("board").style.display = "block";
        document.querySelector(".popup").style.display = "none";
        document.getElementById("popupBackground").style.display = "none";
        var formFields = document.querySelectorAll("#registrazioneForm input, #registrazioneForm select");
        formFields.forEach(function(field) {
            field.removeAttribute("required");
        });
    });

    document.getElementById("registrazioneForm").addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("board").style.display = "block";
        document.querySelector(".popup").style.display = "none";
        document.getElementById("popupBackground").style.display = "none";
    });

    rimuoviModuloBtn.addEventListener('click', function() {
        if (rimozioneForm.style.display === 'none') {
            rimozioneForm.style.display = 'block';
        } else {
            rimozioneForm.style.display = 'none';
        }
        document.getElementById("board").style.display = "none";
        document.querySelector(".popup").style.display = "block";
        document.getElementById("popupBackground").style.display = "flex";
    });

    document.querySelector(".close-button2").addEventListener("click", function() {
        document.querySelector(".popup").style.display = "none";
        document.getElementById("popupBackground").style.display = "none";
        var formFields = document.querySelectorAll("#rimozioneForm input, #rimozioneForm select");
        formFields.forEach(function(field) {
            field.removeAttribute("required");
        });
        document.getElementById("rimozioneForm").style.display = "none";
    });

    function createUser() {
        var nome = document.getElementById("nome").value;
        var cognome = document.getElementById("cognome").value;
        var username = document.getElementById("username").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        var ruoloSelect = document.getElementById("ruolo");
        var ruoloSelezionato = ruoloSelect.value;

        const users = { role: ruoloSelezionato, name: nome, surname: cognome, username: username, email: email, password: password };

        fetch('http://localhost:8080/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(users),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                refreshPage();
            })
            .catch(error => console.error('Error: Utente non creato', error));
    }

    function deleteUser() {
        var email = document.getElementById("mail").value;

        fetch('http://localhost:8080/users/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                refreshPage();
            })
            .catch(error => console.error('Errore: Utente cancellato', error));
    }

    function getUsersFromDatabase() {
        fetch('http://localhost:8080/users/getAll')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore nella richiesta Fetch');
                }
                return response.json();
            })
            .then(users => {
                displayUsers(users);
            })
            .catch(error => {
                console.error('Si è verificato un errore:', error);
            });
    }

    function displayUsers(users) {
        const userListElement = document.querySelector('.user-list');
        userListElement.innerHTML = '';

        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = "E-mail: " + user.email + " Ruolo: " + user.userType;
            var UEmail = user.email;

            if (user.userType === "Contributor") {
                const button = document.createElement('button');
                button.classList.add('editButton', 'btn', 'btn-secondary');
                button.innerHTML = '<i class="fas fa-edit"></i>';
                button.setAttribute('title', 'Modifica ruolo');

                button.addEventListener('click', () => {
                    // Rimuove eventuali pop-up esistenti
                    const existingPopup = document.querySelector('.popup-container');
                    if (existingPopup) {
                        existingPopup.remove();
                    }

                    const popupContainer = document.createElement('div');
                    popupContainer.classList.add('popup-container');

                    const popupContent = document.createElement('div');
                    popupContent.classList.add('popup-content');
                    popupContent.style.cssText = `
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                        max-width: 300px;
                        text-align: center;
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    `;

                    const promptText = document.createElement('p');
                    promptText.textContent = `Cosa vuoi fare con il ruolo di ${user.name}?`;
                    promptText.style.marginBottom = '15px';

                    const buttonChange = document.createElement('button');
                    buttonChange.textContent = 'Animatore';
                    buttonChange.style.cssText = `
                        margin: 0 10px;
                        padding: 8px 16px;
                        border: none;
                        border-radius: 4px;
                        background-color: #007bff;
                        color: white;
                        cursor: pointer;
                    `;
                    buttonChange.addEventListener('click', () => {
                        makeAnimator(UEmail, user, li);
                        popupContainer.remove();
                    });

                    const buttonCancel = document.createElement('button');
                    buttonCancel.textContent = 'Curatore';
                    buttonCancel.style.cssText = `
                        margin: 0 10px;
                        padding: 8px 16px;
                        border: none;
                        border-radius: 4px;
                        background-color: #007bff;
                        color: white;
                        cursor: pointer;
                    `;
                    buttonCancel.addEventListener('click', () => {
                        makeCurator(UEmail, user, li);
                        popupContainer.remove();
                    });

                    popupContent.appendChild(promptText);
                    popupContent.appendChild(buttonChange);
                    popupContent.appendChild(buttonCancel);
                    popupContainer.appendChild(popupContent);
                    document.body.appendChild(popupContainer);
                });

                li.appendChild(button);
            }

            userListElement.appendChild(li);
        });
    }

    getUsersFromDatabase();

    var ManagerEmail = "ijeievn@example.com";

    function makeAnimator(emailNew, user, listItem) {
        fetch(`http://localhost:8080/users/addAnimator?email=${emailNew}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: ManagerEmail }),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // Aggiorna l'interfaccia utente
                user.userType = 'Animator';
                listItem.textContent = `E-mail: ${user.email} Ruolo: ${user.userType}`;
                listItem.appendChild(createEditButton(user, listItem));
            })
            .catch(error => console.error('Error: Animatore non creato', error));
    }

    function makeCurator(emailNew, user, listItem) {
        fetch(`http://localhost:8080/users/addCurator?email=${emailNew}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: ManagerEmail }),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // Aggiorna l'interfaccia utente
                user.userType = 'Curator';
                listItem.textContent = `E-mail: ${user.email} Ruolo: ${user.userType}`;
                listItem.appendChild(createEditButton(user, listItem));
            })
            .catch(error => console.error('Error: Curatore non creato', error));
    }

    function createEditButton(user, listItem) {
        const button = document.createElement('button');
        button.classList.add('editButton', 'btn', 'btn-secondary');
        button.innerHTML = '<i class="fas fa-edit"></i>';
        button.setAttribute('title', 'Modifica ruolo');

        button.addEventListener('click', () => {
            const existingPopup = document.querySelector('.popup-container');
            if (existingPopup) {
                existingPopup.remove();
            }

            const popupContainer = document.createElement('div');
            popupContainer.classList.add('popup-container');

            const popupContent = document.createElement('div');
            popupContent.classList.add('popup-content');
            popupContent.style.cssText = `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                max-width: 300px;
                text-align: center;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            `;

            const promptText = document.createElement('p');
            promptText.textContent = `Cosa vuoi fare con il ruolo di ${user.name}?`;
            promptText.style.marginBottom = '15px';

            const buttonChange = document.createElement('button');
            buttonChange.textContent = 'Animatore';
            buttonChange.style.cssText = `
                margin: 0 10px;
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background-color: #007bff;
                color: white;
                cursor: pointer;
            `;
            buttonChange.addEventListener('click', () => {
                makeAnimator(user.email, user, listItem);
                popupContainer.remove();
            });

            const buttonCancel = document.createElement('button');
            buttonCancel.textContent = 'Curatore';
            buttonCancel.style.cssText = `
                margin: 0 10px;
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background-color: #007bff;
                color: white;
                cursor: pointer;
            `;
            buttonCancel.addEventListener('click', () => {
                makeCurator(user.email, user, listItem);
                popupContainer.remove();
            });

            popupContent.appendChild(promptText);
            popupContent.appendChild(buttonChange);
            popupContent.appendChild(buttonCancel);
            popupContainer.appendChild(popupContent);
            document.body.appendChild(popupContainer);
        });

        return button;
    }

    function refreshPage() {
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
});

function refreshPage() {
    setTimeout(function() {
        location.reload();
    }, 2000); // Aspetta 2 secondi prima di eseguire il refresh della pagina
}