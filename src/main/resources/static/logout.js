document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    const confirmModal = document.getElementById('confirmModal');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const spinner = document.getElementById('spinner');

    function closeModal() {
        document.body.classList.remove('modal-open');
        confirmModal.style.display = 'none';
        document.querySelector('.modal-content').classList.remove('fadeIn');
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            document.body.classList.add('modal-open');
            confirmModal.style.display = 'flex';
            document.querySelector('.modal-content').classList.add('fadeIn');
        });

        confirmYes.addEventListener('click', function() {
            spinner.style.display = 'block';
            setTimeout(function() {
                window.location.href = '/ProgettoAppWebMobile/src/main/resources/templates/home.html';
                spinner.style.display = 'none';
                confirmModal.style.display = 'none';
            }, 2000); // 2 secondi di attesa
        });

        confirmNo.addEventListener('click', closeModal);

        window.addEventListener('click', function(event) {
            if (event.target === confirmModal) {
                closeModal();
            }
        });
    }
    if (homeLink) {
        homeLink.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
    if (mapLink) {
        mapLink.addEventListener('click', function() {
            window.location.href = 'mappa.html';
        });
    }
    if (aggiuntaRuoloLink) {
        mapLink.addEventListener('click', function() {
            window.location.href = 'aggiuntaRuolo.html';
        });
    }
});



