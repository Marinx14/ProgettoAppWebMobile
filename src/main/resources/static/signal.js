const user = 2;

document.addEventListener("DOMContentLoaded", function() {
    // Ottieni il modal
    var modal = document.getElementById("signal");

    // Ottieni tutti i pulsanti di segnalazione
    var btns = document.querySelectorAll(".btn-report");

    // Associa una funzione all'evento clic di ogni pulsante di segnalazione
    btns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            modal.style.display = "block";
        });
    });

    // Chiudi il modal quando l'utente clicca al di fuori di esso
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

const commentButtons = document.querySelectorAll('.btn-comment');

// Itera su ciascun bottone per aggiungere l'evento click
commentButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Effettua il reindirizzamento alla pagina dei commenti
        window.location.href = 'commentiModifica.html';
    });
});

function getAllReportedMultimedia() {
    fetch('http://localhost:8080/multimedia/getAll')
        .then(response => response.json()) // Trasforma la risposta in formato JSON
        .then(multimediaList => { // Utilizza la risposta JSON
            // Se non ci sono immagini nel database, mostra un messaggio
            if (multimediaList.length === 0) {
                document.getElementById('photo-container').innerHTML = "<p>Nessuna immagine trovata.</p>";
                return;
            }

            // Trova l'elemento HTML dove verranno visualizzate le immagini
            const imageContainer = document.getElementById('photo-container');

            // Itera su ogni oggetto multimediale e crea un elemento immagine per ciascuno
            multimediaList.forEach(multimedia => {
                if (multimedia.signaled) {
                    const imgElement = document.createElement('img');
                    imgElement.src = `/upload/${multimedia.path}.jpg`; // Assicurati che il percorso sia corretto
                    imgElement.alt = multimedia.name;
                    imgElement.style.width = '600px'; // Imposta la dimensione desiderata per l'immagine

                    // Aggiungi la descrizione sotto l'immagine
                    const nameElement = document.createElement('p');
                    nameElement.textContent = multimedia.name;
                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = multimedia.description;

                    // Crea un contenitore per l'immagine e la descrizione
                    const imageWrapper = document.createElement('div');
                    imageWrapper.style.position = 'relative'; // Imposta posizione relativa per posizionare il bottone reportButton
                    imageWrapper.appendChild(imgElement);
                    imageWrapper.appendChild(nameElement);
                    imageWrapper.appendChild(descriptionElement);
                    imageWrapper.style.marginBottom = "20px"; // Aggiunge spazio inferiore tra le immagini

                    // Bottone per rimuovere la segnalazione
                    const removeSignalButton = document.createElement('button');
                    removeSignalButton.textContent = "Rimuovi Segnalazione";
                    removeSignalButton.className = "action-button";
                    removeSignalButton.addEventListener('click', function() {
                        // Chiamata per rimuovere la segnalazione
                        removeSignal(multimedia.id);
                    });

                    // Aggiungi il bottone di rimozione al contenitore dell'immagine
                    imageWrapper.appendChild(removeSignalButton);

                    // Aggiungi il contenitore all'elemento container delle immagini
                    imageContainer.appendChild(imageWrapper);
                }
            });
        })
        .catch(error => {
            console.error('Si è verificato un errore durante il recupero delle immagini:', error);
        });
}

// Funzione per rimuovere la segnalazione di un multimedia/deSignal{userId}{multimediaId}

function removeSignal(multimediaId) {
    const user1=3;
    fetch(`http://localhost:8080/multimedia/deSignal?userId=${user1}&multimediaId=${multimediaId}`, {
    method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => {
    if (response.ok) {
        console.log('Segnalazione rimossa per multimedia con ID ${multimediaId}');
        location.reload();

    } else {
        console.error('Errore durante la rimozione della segnalazione del multimedia:', response.statusText);
    }
})
    .catch(error => {
        console.error('Si è verificato un errore durante la richiesta:', error);
    });
}

// Chiamata alla funzione per recuperare e visualizzare i multimedia segnalati al caricamento della pagina
window.addEventListener('DOMContentLoaded', getAllReportedMultimedia);
