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
    const commento = document.getElementById('comment-content').value;
    const user1 = 2;
    const multimediaId = getMultimediaIdFromURL();

    if (commento.trim() !== '' && multimediaId !== null) {
        const commentData = {
            multimediaId: multimediaId,
            comment: commento
        };

        fetch(`http://localhost:8080/comment/multimedia/add?userId=${user1}&multimediaId=${multimediaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore durante l\'aggiunta del commento');
                }
                return response.text(); // Cambia a text() per gestire risposte non JSON
            })
            .then(data => {
                console.log('Risposta del server:', data); // Log della risposta del server

                // Aggiungi il commento al DOM
                const board = document.querySelector('.board');

                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');

                const commentContent = document.createElement('p');
                commentContent.classList.add('comment-content');
                commentContent.textContent = commento;

                const commentTimestamp = document.createElement('span');
                commentTimestamp.classList.add('comment-timestamp');
                commentTimestamp.textContent = `Postato il ${new Date().toLocaleString()}`;

                commentDiv.appendChild(commentContent);
                commentDiv.appendChild(commentTimestamp);
                board.appendChild(commentDiv);

                document.getElementById('comment-content').value = '';
            })
            .catch(error => {
                console.error('Errore durante l\'aggiunta del commento:', error);
            });
    } else {
        console.error('Il commento è vuoto o manca l\'ID multimedia.');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit-comment').addEventListener('click', function(event) {
        event.preventDefault();
        aggiungiCommento();
    });

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

                    const commentTimestamp = document.createElement('span');
                    commentTimestamp.classList.add('comment-timestamp');
                    commentTimestamp.textContent = `Postato il ${new Date(comment.timestamp).toLocaleString()}`;

                    commentDiv.appendChild(commentContent);
                    commentDiv.appendChild(commentTimestamp);
                    board.appendChild(commentDiv);
                });
            }
        })
        .catch(error => {
            console.error('Errore durante il recupero dei commenti:', error);
        });
});
