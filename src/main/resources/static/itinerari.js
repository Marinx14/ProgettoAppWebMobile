const map = L.map('map').setView([43.52, 13.244], 15);
const userId =1;

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const popup = L.popup()
    .setLatLng([43.521824, 13.244226])
    .setContent('Centro di Jesi')
    .openOn(map);

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(`Hai cliccato la mappa nelle coordinate: ${e.latlng.toString()}`)
        .openOn(map);
}
map.on('click', onMapClick);

// Funzione per spostare la mappa al centro di una posizione selezionata
function centerMapToLocation(latitude, longitude) {
    map.setView([latitude, longitude], 13);
}

// Trova il bottone nella pagina
var centerMapButton = document.getElementById('centerMapButton');

// Aggiungi un gestore di eventi al bottone
centerMapButton.addEventListener('click', function() {
    centerMapToLocation(43.521824, 13.244226);
    const popup = L.popup()
        .setLatLng([43.521824, 13.244226])
        .setContent('Centro di Jesi')
        .openOn(map);
});

fetch('http://localhost:8080/itineraries/getAll')
    .then(response => response.json())
    .then(data => {
        const selectItinerario = document.getElementById('selectItinerario');
        data.forEach(itinerario => {
            const option = document.createElement('option');
            option.value = itinerario.id;
            option.textContent = itinerario.name;
            selectItinerario.appendChild(option);
        });
    })
    .catch(error => console.error('Errore durante il recupero degli itinerari:', error));

selectItinerario.addEventListener('change', function() {
    const selectedItineraryId = this.value;
    console.log(selectedItineraryId);

    // Rimuovi tutti i marker e le polyline dalla mappa
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    const userId = 1;
    fetch(`http://localhost:8080/itineraries/get/itinerary?id=${selectedItineraryId}`)
        .then(response => response.json())
        .then(data => {
            let points = [];
            data.forEach(point => {
                points.push([point.x, point.y]);
                var marker = L.marker([point.x, point.y]).addTo(map);
                marker.bindPopup(`<b>${point.name}</b><br>Tipo: ${point.type}`);
            });
            var polyline = L.polyline(points, {color: 'blue'}).addTo(map);
        })
        .catch(error => console.error('Errore durante il recupero dell\'itinerario:', error));
});

// Funzione per ottenere tutti gli itinerari e visualizzarli sulla mappa
function showAllItineraries() {
    // Esegui la fetch per ottenere tutti gli itinerari
    fetch('http://localhost:8080/itineraries/getAll')
        .then(response => response.json())
        .then(data => {
            // Rimuovi tutti i marker e le polyline dalla mappa
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                    map.removeLayer(layer);
                }
            });

            // Cicla attraverso tutti gli itinerari ottenuti
            data.forEach(itinerario => {
                fetch(`http://localhost:8080/itineraries/get/itinerary?id=${itinerario.id}`)
                    .then(response => response.json())
                    .then(pointsData => {
                        let points = [];
                        pointsData.forEach(point => {
                            points.push([point.x, point.y]);
                            var marker = L.marker([point.x, point.y]).addTo(map);
                            marker.bindPopup(`<b>${point.name}</b><br>Tipo: ${point.type}`);
                        });
                        var polyline = L.polyline(points, {color: 'blue'}).addTo(map);
                    })
                    .catch(error => console.error('Errore durante il recupero dell\'itinerario:', error));
            });
        })
        .catch(error => console.error('Errore durante il recupero degli itinerari:', error));
}

// Event listener per il menu a tendina
document.getElementById('selectItinerario').addEventListener('change', function() {
    const selectedValue = this.value;

    // Rimuovi tutti i marker e le polyline dalla mappa
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    if (selectedValue === 'all') {
        showAllItineraries();
    } else {
        // Fetch per ottenere l'itinerario selezionato
        fetch(`http://localhost:8080/itineraries/get/itinerary?id=${selectedValue}`)
            .then(response => response.json())
            .then(data => {
                let points = [];
                data.forEach(point => {
                    points.push([point.x, point.y]);
                    var marker = L.marker([point.x, point.y]).addTo(map);
                    marker.bindPopup(`<b>${point.name}</b><br>Tipo: ${point.type}`);
                });
                var polyline = L.polyline(points, {color: 'blue'}).addTo(map);
            })
            .catch(error => console.error('Errore durante il recupero dell\'itinerario:', error));
    }
});


let pointsData = []; // Array per memorizzare i punti ottenuti

// Fetch per ottenere tutti i punti disponibili
fetch('http://localhost:8080/points/getAll')
    .then(response => response.json())
    .then(data => {
        // Memorizza i punti ottenuti nell'array pointsData
        pointsData = data;

        // Seleziona gli elementi HTML per i menu a tendina startPoint e endPoint
        const startPointSelect = document.getElementById('startPoint');
        const endPointSelect = document.getElementById('endPoint');

        // Popola i menu a tendina con le opzioni dei punti ottenuti
        data.forEach(point => {
            const option = document.createElement('option');
            option.value = point.id;
            option.textContent = point.name;
            startPointSelect.appendChild(option);

            const option2 = document.createElement('option');
            option2.value = point.id;
            option2.textContent = point.name;
            endPointSelect.appendChild(option2);
        });
    })
    .catch(error => console.error('Errore durante il recupero dei punti:', error));

// Funzione per aggiungere un itinerario
function addItinerary() {
    // Ottieni gli id dei punti selezionati dall'utente
    const startPointId = document.getElementById('startPoint').value;
    const endPointId = document.getElementById('endPoint').value;

    // Trova i punti corrispondenti negli dati ottenuti
    const startPoint = pointsData.find(point => point.id == startPointId);
    const endPoint = pointsData.find(point => point.id == endPointId);

    // Verifica che siano stati selezionati punti validi
    if (startPoint && endPoint) {
        // Costruisci l'oggetto da inviare nel body della richiesta POST
        const itineraryData = {
            start: {
                lat: startPoint.x,
                lng: startPoint.y,
                name: startPoint.name  // Opzionale: aggiungi altre informazioni necessarie
            },
            end: {
                lat: endPoint.x,
                lng: endPoint.y,
                name: endPoint.name  // Opzionale: aggiungi altre informazioni necessarie
            }
        };

        // Esegui la richiesta POST per aggiungere l'itinerario
        fetch(`http://localhost:8080/itineraries/addItinerary?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itineraryData)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Itinerario aggiunto con successo');
                    // Ricarica la pagina per aggiornare gli itinerari
                    location.reload();
                } else {
                    throw new Error('Errore durante l\'aggiunta dell\'itinerario');
                }
            })
            .catch(error => console.error('Errore durante l\'aggiunta dell\'itinerario:', error));
    } else {
        alert('Seleziona due punti validi per aggiungere un itinerario.');
    }
}

// Seleziona il pulsante di conferma e aggiungi un event listener per l'evento click
const confirmItineraryButton = document.getElementById('confirmItineraryButton');
confirmItineraryButton.addEventListener('click', function() {
    addItinerary(); // Chiama la funzione addItinerary al click del pulsante
    document.getElementById('pointSelection').classList.add('hidden'); // Nasconde il menu a tendina
});
