function getMultimediaIdFromURL() {
    // Ottieni l'URL della pagina corrente
    const url = window.location.href;

    // Dividi l'URL utilizzando il carattere '?' come separatore
    const parts = url.split('?');

    // Se il numero di parti è uguale a 2, significa che l'URL contiene dei parametri
    if (parts.length === 2) {
        // Dividi la seconda parte utilizzando il carattere '=' come separatore
        const params = parts[1].split('=');

        // Se il numero di parametri è uguale a 2 e il nome del parametro è 'id', restituisci il valore
        if (params.length === 2 && params[0] === 'id') {
            return parseInt(params[1]); // Converti il valore in intero
        }
    }

    // Se non riesci a trovare l'ID nell'URL, restituisci null
    return null;
}

function aggiungiCommento() {
    // Ottieni il testo del commento dall'input (supponiamo che ci sia un input con id 'commento')
    const commento = document.getElementById('comment-content').value;
    const user1 = 2;

    // Ottieni l'ID del multimedia dalla funzione getMultimediaIdFromURL
    const multimediaId = getMultimediaIdFromURL();

    // Verifica se il commento non è vuoto e l'ID multimedia è valido
    if (commento.trim() !== '' && multimediaId !== null) {
        // Crea un oggetto con il corpo della richiesta
        const commentData = {
            multimediaId: multimediaId,
            comment: commento
        };
        // Effettua una fetch per aggiungere il commento al server
        fetch(`http://localhost:8080/comment/multimedia/add?userId=${user1}&multimediaId=${multimediaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
            .then(response => {
                location.reload()
                if (!response.ok) {
                    throw new Error('Errore durante l\'aggiunta del commento');
                }
                return response.json();
            })
            .then(data => {
                // Se il commento è stato aggiunto con successo, aggiungi il commento alla bacheca
                const board = document.querySelector('.board');

                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');

                const commentContent = document.createElement('p');
                commentContent.classList.add('comment-content');
                commentContent.textContent = commento;

                commentDiv.appendChild(commentContent);
                board.appendChild(commentDiv);

                // Pulisci l'input del commento dopo l'aggiunta
                document.getElementById('commento').value = '';
            })
    } else {
        console.error('Il commento è vuoto o manca l\'ID multimedia.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Aggiungi il gestore di eventi per il click sul pulsante di aggiunta commento
    document.getElementById('submit-comment').addEventListener('click', function(event) {
        event.preventDefault(); // Previeni il comportamento predefinito del pulsante
        aggiungiCommento();
    });

    // Esegui una fetch per ottenere i commenti dal server all'avvio della pagina
    var multimediaId = getMultimediaIdFromURL();
    fetch(`http://localhost:8080/comment/multimedia?multimediaId=${multimediaId}`)
        .then(response => response.json())
        .then(data => {
            const board = document.querySelector('.board');

            if (data.length === 0) {
                const noCommentsDiv = document.createElement('div');
                noCommentsDiv.classList.add('no-comments');
                noCommentsDiv.textContent = 'Nessun commento ancora presente';
                board.appendChild(noCommentsDiv);
            } else {
                data.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.classList.add('comment');

                    const commentContent = document.createElement('p');
                    commentContent.classList.add('comment-content');
                    commentContent.textContent = comment.comment;

                    commentDiv.appendChild(commentContent);
                    board.appendChild(commentDiv);
                });
            }
        })
        .catch(error => {
            console.error('Errore durante il recupero dei commenti:', error);
        });
});

