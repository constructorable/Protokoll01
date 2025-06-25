setTimeout(function () {
    const heute = new Date();
    document.getElementById('datum').valueAsDate = heute;
}, 100);

document.addEventListener('DOMContentLoaded', function () {

    function copyInputValues() {

        const strasseInput = document.getElementById('strasseeinzug');
        const objektClon = document.getElementById('objektclon');
        if (strasseInput && objektClon) {
            objektClon.value = strasseInput.value;
        }

        const plzInput = document.getElementById('plzeinzug');
        const ortClon = document.getElementById('ortclon');
        if (plzInput && ortClon) {
            ortClon.value = plzInput.value;
        }

        const lageInput = document.getElementById('lageeinzug2');
        const lageClon = document.getElementById('lageclon');
        if (lageInput && lageClon) {
            lageClon.value = lageInput.value;
        }

        const mieterInput = document.getElementById('mieterid');
        const mieterClon = document.getElementById('mietidtclon');
        if (mieterInput && mieterClon) {
            mieterClon.value = mieterInput.value;
        }
    }

    const inputFields = ['strasseeinzug', 'plzeinzug', 'lageeinzug2', 'mieterid'];
    inputFields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', copyInputValues);
            input.addEventListener('change', copyInputValues);
        }
    });

    const mieterInput = document.getElementById('mieterid');
    if (mieterInput) {

        const observer = new MutationObserver(copyInputValues);
        observer.observe(mieterInput, {
            attributes: true,
            attributeFilter: ['value']
        });

        let lastValue = mieterInput.value;
        setInterval(() => {
            if (mieterInput.value !== lastValue) {
                lastValue = mieterInput.value;
                copyInputValues();
            }
        }, 500);
    }

    copyInputValues();
});

document.addEventListener('DOMContentLoaded', function () {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');

    const todayFormatted = `${year}-${month}-${day}`;

    const dateInput = document.getElementById('datum2');
    if (dateInput) {
        dateInput.value = todayFormatted;
    }
});

document.addEventListener('DOMContentLoaded', function () {

    const nameSuggestions = [
        "Christian Adler",
        "Oliver Acker",
        "Manfred Launicke",
        "Claus Zechmeister",
        "Marli Smith",
        "Darius Andörfer",
        "Stefanie Muscat"
    ];

    const inputField = document.getElementById('firma1');
    if (!inputField) {
        console.error('Input-Feld mit ID "firma" nicht gefunden!');
        return;
    }

    const bemerkungContainer = inputField.closest('.bemerkung-container');
    if (!bemerkungContainer) {
        console.error('Eltern-Container ".bemerkung-container" nicht gefunden!');
        return;
    }

    const suggestionContainer = document.getElementById('name-suggestions-container');

    function showSuggestions(suggestions) {
        suggestionContainer.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionContainer.style.display = 'none';
            return;
        }

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                inputField.value = suggestion;
                hideSuggestions();
            });
            suggestionContainer.appendChild(item);
        });

        suggestionContainer.style.display = 'contents';
    }

    function hideSuggestions() {
        suggestionContainer.style.display = 'none';
    }

    function getFilteredSuggestions() {
        const input = inputField.value.toLowerCase();
        return input === ''
            ? nameSuggestions
            : nameSuggestions.filter(name => name.toLowerCase().includes(input));
    }

    inputField.addEventListener('focus', () => showSuggestions(getFilteredSuggestions()));
    inputField.addEventListener('input', () => showSuggestions(getFilteredSuggestions()));

    document.addEventListener('click', (e) => {
        if (!bemerkungContainer.contains(e.target)) {
            hideSuggestions();
        }
    });

    if (!document.getElementById('suggestion-styles')) {
        const style = document.createElement('style');
        style.id = 'suggestion-styles';
        style.textContent = `
            .bemerkung-container {
                position: relative !important;
            }
            #name-suggestions-container {
                position: absolute !important;
                top: calc(100% + 2px) !important;
                left: 0 !important;
                right: 0 !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                background: white !important;
                z-index: 1000 !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
                max-height: 200px !important;
                overflow-y: auto !important;
            }
            .suggestion-item {
                padding: 8px 12px !important;
                cursor: pointer !important;
                border-bottom: 1px solid #eee !important;
            }
            .suggestion-item:hover {
                background-color: #f5f5f5 !important;
            }
            .suggestion-item:last-child {
                border-bottom: none !important;
            }
        `;
        document.head.appendChild(style);
    }
});

document.addEventListener('DOMContentLoaded', function() {

    const landlordCanvas = document.getElementById('landlord-signature-canvas');
    const landlordCtx = landlordCanvas.getContext('2d');

    landlordCtx.lineWidth = 7;
    landlordCtx.lineJoin = 'round';
    landlordCtx.lineCap = 'round';
    landlordCtx.strokeStyle = '#373d41';

    let landlordDrawing = false;

    function startLandlordDrawing(e) {
        landlordDrawing = true;
        const rect = landlordCanvas.getBoundingClientRect();
        const x = e.clientX ? e.clientX : e.touches[0].clientX;
        const y = e.clientY ? e.clientY : e.touches[0].clientY;
        landlordCtx.beginPath();
        landlordCtx.moveTo(x - rect.left, y - rect.top);
        e.preventDefault();
    }

    function drawLandlord(e) {
        if (!landlordDrawing) return;
        const rect = landlordCanvas.getBoundingClientRect();
        const x = e.clientX ? e.clientX : e.touches[0].clientX;
        const y = e.clientY ? e.clientY : e.touches[0].clientY;
        landlordCtx.lineTo(x - rect.left, y - rect.top);
        landlordCtx.stroke();
        e.preventDefault();
    }

    function stopLandlordDrawing() {
        landlordDrawing = false;
    }

    landlordCanvas.addEventListener('mousedown', startLandlordDrawing);
    landlordCanvas.addEventListener('mousemove', drawLandlord);
    landlordCanvas.addEventListener('mouseup', stopLandlordDrawing);
    landlordCanvas.addEventListener('mouseout', stopLandlordDrawing);
    landlordCanvas.addEventListener('touchstart', startLandlordDrawing);
    landlordCanvas.addEventListener('touchmove', drawLandlord);
    landlordCanvas.addEventListener('touchend', stopLandlordDrawing);

    document.getElementById('landlord-clear-signature').addEventListener('click', () => {
        landlordCtx.clearRect(0, 0, landlordCanvas.width, landlordCanvas.height);
    });
});

function initializeMenuModal() {
    const modal = document.getElementById('menuModal');
    const openButton = document.getElementById('openMenuModal');
    const closeButton = document.getElementById('closeMenuModal');

    openButton.addEventListener('click', function() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const menuButtons = document.querySelectorAll('.menu-item-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(`Button clicked: ${this.id}`);

            switch(this.id) {
                case 'savelocal':
                    if (window.promptSaveName) {
                        window.promptSaveName();
                    }
                    break;
                case 'loadlocal':
                    if (window.showSavedStates) {
                        window.showSavedStates();
                    }
                    break;
                case 'delete':
                    if (window.clearAllInputs) {
                        window.clearAllInputs();
                    }
                    break;
                case 'screenshot':
                    handlePDFCreation();
                    closeModal(); 
                    break;
                case 'mail':
                    handleEmailFunction();
                    closeModal();
                    break;
                case 'export':
                    handleExportFunction();
                    closeModal();
                    break;
                case 'import':
                    handleImportFunction();
                    closeModal();
                    break;
                default:
                    console.log(`Unbekannte Aktion: ${this.id}`);
                    closeModal();
                    break;
            }

        });
    });

    function handlePDFCreation() {
        console.log('PDF wird erstellt...');

            }

function handleEmailFunction() {
    console.log('E-Mail wird geöffnet...');

    if (typeof showEmailMenu === 'function') {

        const fileName = `Protokoll_${new Date().toLocaleDateString('de-DE').replace(/\./g, '_')}.pdf`;

        showEmailMenu(fileName);
    } else {
        console.error('showEmailMenu Funktion nicht gefunden. Ist email.js geladen?');
        alert('E-Mail-Funktion nicht verfügbar. Bitte stellen Sie sicher, dass email.js geladen ist.');
    }
}

    function handleExportFunction() {
        console.log('Export wird durchgeführt...');

    }

    function handleImportFunction() {
        console.log('Import wird durchgeführt...');

    }
}

document.addEventListener('DOMContentLoaded', initializeMenuModal);

 
