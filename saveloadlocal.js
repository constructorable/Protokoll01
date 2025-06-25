// savelocal.js - Robuste Version mit inline-styles

document.addEventListener('DOMContentLoaded', function () {
    
    // Flag um doppelte Ausführung zu verhindern
    let isProcessing = false;
    
    // Hilfsfunktion zum Entfernen bestehender Dialoge
    const removeExistingDialogs = (className) => {
        const existingDialogs = document.querySelectorAll(`.${className}`);
        existingDialogs.forEach(dialog => dialog.remove());
    };

    // Event-Delegation für Modal-Buttons


    // Mobile-freundliche Namenseingabe - MIT INLINE STYLES
    function promptSaveName() {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            console.log('promptSaveName wird ausgeführt');
            
            // Bestehende Dialoge entfernen
            removeExistingDialogs('save-name-dialog');
            
            // Wert aus dem strasseeinzug-Feld holen
            const strasseField = document.getElementById('strasseeinzug');
            const strasseValue = strasseField ? strasseField.value.trim() : '';
            const defaultName = strasseValue ? 
                `${strasseValue}_` : 
                `Speicherstand_${new Date().toLocaleDateString('de-DE')}`;

            // Dialog mit INLINE STYLES erstellen
            const dialog = document.createElement('div');
            dialog.className = 'modal-overlay save-name-dialog';
            
            // INLINE STYLES - überschreibt alles andere
            dialog.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.8) !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                z-index: 99999 !important;
                padding: 15px !important;
                box-sizing: border-box !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;

            dialog.innerHTML = `
                <div style="
                    background: white !important;
                    border-radius: 12px !important;
                    width: 100% !important;
                    max-width: 500px !important;
                    padding: 30px !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                    position: relative !important;
                    z-index: 100000 !important;
                ">
                    <h3 style="
                        margin: 0 0 20px 0 !important;
                        font-size: 1.5rem !important;
                        color: #333 !important;
                        text-align: center !important;
                    ">Speicherstand benennen</h3>
                    
                    <input type="text" id="saveNameInput" 
                           placeholder="Name eingeben" 
                           value="${escapeHtml(defaultName)}"
                           maxlength="50" 
                           autocomplete="off"
                           style="
                               width: 100% !important;
                               padding: 15px !important;
                               border: 2px solid #ddd !important;
                               border-radius: 8px !important;
                               font-size: 1.1rem !important;
                               margin: 15px 0 !important;
                               box-sizing: border-box !important;
                               outline: none !important;
                           ">
                    
                    <div style="
                        display: flex !important;
                        gap: 15px !important;
                        justify-content: flex-end !important;
                        margin-top: 25px !important;
                    ">
                        <button id="cancelSave" style="
                            padding: 12px 25px !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 1rem !important;
                            background-color: #6c757d !important;
                            color: white !important;
                            transition: all 0.2s !important;
                        ">Abbrechen</button>
                        
                        <button id="confirmSave" style="
                            padding: 12px 25px !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 1rem !important;
                            background-color: #335d92 !important;
                            color: white !important;
                            transition: all 0.2s !important;
                        ">Speichern</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);
            console.log('Dialog mit inline styles erstellt und hinzugefügt');

            // Focus setzen
            setTimeout(() => {
                const inputField = document.getElementById('saveNameInput');
                if (inputField) {
                    inputField.focus();
                    inputField.selectionStart = inputField.selectionEnd = defaultName.length;
                    console.log('Input Field fokussiert');
                }
            }, 100);

            // Event-Handler
            const confirmButton = document.getElementById('confirmSave');
            const cancelButton = document.getElementById('cancelSave');

            const handleSave = () => {
                const inputField = document.getElementById('saveNameInput');
                const name = inputField.value.trim();
                if (name) {
                    if (saveFormData(name)) {
                        dialog.remove();
                        showMobileAlert('Speicherstand erfolgreich gespeichert!', 'success');
                        closeAnyModal();
                    } else {
                        showMobileAlert('Fehler beim Speichern!', 'error');
                    }
                } else {
                    inputField.focus();
                    inputField.style.borderColor = '#f44336 !important';
                }
                isProcessing = false;
            };

            const handleCancel = () => {
                dialog.remove();
                isProcessing = false;
            };

            if (confirmButton && cancelButton) {
                confirmButton.addEventListener('click', handleSave);
                cancelButton.addEventListener('click', handleCancel);

                // Enter-Taste
                const inputField = document.getElementById('saveNameInput');
                inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSave();
                    }
                });

                // ESC-Taste
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        handleCancel();
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);

                // Click außerhalb
                dialog.addEventListener('click', (e) => {
                    if (e.target === dialog) {
                        handleCancel();
                    }
                });
            }

        } catch (error) {
            console.error('Fehler in promptSaveName:', error);
            isProcessing = false;
        }
    }

    // Auch showSavedStates mit inline styles
    function showSavedStates() {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            console.log('showSavedStates wird ausgeführt');
            
            removeExistingDialogs('saved-states-dialog');
            
            const saves = getAllSaves();

            if (Object.keys(saves).length === 0) {
                showMobileAlert('Keine gespeicherten Zustände gefunden!');
                isProcessing = false;
                return;
            }

            const dialog = document.createElement('div');
            dialog.className = 'modal-overlay saved-states-dialog';
            
            // INLINE STYLES
            dialog.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.8) !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                z-index: 99999 !important;
                padding: 15px !important;
                box-sizing: border-box !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;

            let listHTML = '';
            for (const [name, data] of Object.entries(saves)) {
                const timestamp = new Date(data.timestamp).toLocaleString();
                listHTML += `
                <div style="
                    padding: 15px 0 !important;
                    border-bottom: 1px solid #eee !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    gap: 15px !important;
                ">
                    <div style="flex: 1 !important;">
                        <div style="font-weight: 600 !important; margin-bottom: 5px !important;">${escapeHtml(name)}</div>
                        <div style="font-size: 0.9rem !important; color: #666 !important;">${timestamp}</div>
                    </div>
                    <div style="display: flex !important; gap: 10px !important;">
                        <button class="load-btn" data-name="${escapeHtml(name)}" style="
                            background-color: #335d92 !important;
                            color: white !important;
                            border: none !important;
                            padding: 8px 16px !important;
                            border-radius: 4px !important;
                            cursor: pointer !important;
                        ">Laden</button>
                        <button class="delete-btn2" data-name="${escapeHtml(name)}" style="
    background-color:rgb(137, 34, 45) !important;
    color: white !important;
    border: none !important;
    padding: 8px 12px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
            }

            dialog.innerHTML = `
                <div style="
                    background: white !important;
                    border-radius: 12px !important;
                    width: 100% !important;
                    max-width: 700px !important;
                    max-height: 80vh !important;
                    padding: 30px !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                    position: relative !important;
                    overflow-y: auto !important;
                ">
                    <h3 style="
                        margin: 0 0 20px 0 !important;
                        font-size: 1.5rem !important;
                        color: #333 !important;
                        text-align: center !important;
                    ">Gespeicherte Zustände</h3>
                    
                    <button class="close-dialog" style="
                        position: absolute !important;
                        top: 15px !important;
                        right: 20px !important;
                        background: transparent !important;
                        border: none !important;
                        font-size: 28px !important;
                        cursor: pointer !important;
                        color: #666 !important;
                        line-height: 1 !important;
                    ">×</button>
                    
                    <div style="margin-top: 20px !important;">
                        ${listHTML}
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);
            console.log('Saved States Dialog mit inline styles erstellt');

            // Event-Handler
            dialog.addEventListener('click', (e) => {
                const target = e.target;

                if (target.classList.contains('close-dialog')) {
                    dialog.remove();
                    isProcessing = false;
                } else if (target.classList.contains('load-btn')) {
                    const saveName = target.dataset.name;
                    if (saveName) {
                        loadSpecificState(saveName);
                        dialog.remove();
                        closeAnyModal();
                    }
                    isProcessing = false;
                } else if (target.classList.contains('delete-btn2')) {
                    const saveName = target.dataset.name;
                    if (saveName && confirm(`Speicherstand "${saveName}" wirklich löschen?`)) {
                        deleteState(saveName);
                        dialog.remove();
                        setTimeout(() => showSavedStates(), 100);
                    }
                    isProcessing = false;
                }
            });

        } catch (error) {
            console.error('Fehler in showSavedStates:', error);
            isProcessing = false;
        }
    }

    function showMobileAlert(message, type = 'info') {
        const icon = type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ';
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0,0,0,0.8) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 99999 !important;
            padding: 15px !important;
            box-sizing: border-box !important;
        `;

        const color = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';

        dialog.innerHTML = `
            <div style="
                background: white !important;
                border-radius: 12px !important;
                padding: 30px !important;
                text-align: center !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                border-top: 4px solid ${color} !important;
            ">
                <p style="
                    font-size: 1.3rem !important;
                    margin: 0 0 20px 0 !important;
                    color: ${color} !important;
                ">${icon} ${escapeHtml(message)}</p>
                <button class="alert-ok" style="
                    padding: 12px 25px !important;
                    border: none !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    font-size: 1rem !important;
                    background-color: ${color} !important;
                    color: white !important;
                ">OK</button>
            </div>
        `;

        document.body.appendChild(dialog);

        const okButton = dialog.querySelector('.alert-ok');
        okButton.addEventListener('click', () => {
            dialog.remove();
        });

        if (type === 'success') {
            setTimeout(() => dialog.remove(), 3000);
        }
    }

    // Hilfsfunktionen
    const closeAnyModal = () => {
        const modal = document.getElementById('menuModal');
        if (modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function saveFormData(saveName) {
        try {
            const formData = {};
            document.querySelectorAll('input, select, textarea').forEach(element => {
                if (element.id) {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        formData[element.id] = element.checked;
                    } else {
                        formData[element.id] = element.value;
                    }
                }
            });

            const allSaves = getAllSaves();
            allSaves[saveName] = {
                data: formData,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('formSaves', JSON.stringify(allSaves));
            return true;
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            return false;
        }
    }

    function loadSpecificState(saveName) {
        try {
            const allSaves = getAllSaves();
            const saveData = allSaves[saveName];
            if (!saveData) return false;

            const formData = saveData.data;
            for (const [id, value] of Object.entries(formData)) {
                const element = document.getElementById(id);
                if (element) {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        element.checked = value;
                    } else {
                        element.value = value;
                    }
                }
            }

            showMobileAlert('Speicherstand erfolgreich geladen!', 'success');
            return true;
        } catch (error) {
            console.error('Fehler beim Laden:', error);
            return false;
        }
    }

    function deleteState(saveName) {
        try {
            const allSaves = getAllSaves();
            delete allSaves[saveName];
            localStorage.setItem('formSaves', JSON.stringify(allSaves));
            return true;
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            return false;
        }
    }

    function clearAllInputs() {
        if (!confirm('Wirklich alle Eingaben löschen?')) return;
        
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = false;
            } else {
                element.value = '';
            }
        });
        
        showMobileAlert('Alle Eingaben wurden gelöscht!', 'success');
        closeAnyModal();
    }

    function getAllSaves() {
        try {
            return JSON.parse(localStorage.getItem('formSaves')) || {};
        } catch (e) {
            return {};
        }
    }

    // Funktionen global verfügbar machen
    window.promptSaveName = promptSaveName;
    window.showSavedStates = showSavedStates;
    window.clearAllInputs = clearAllInputs;
});