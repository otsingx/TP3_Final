console.log('validation.js test');

function setError(inputEl, errorEl, msg) {
  if (inputEl) inputEl.classList.add('border-erreur');
  if (errorEl) errorEl.textContent = msg || '';
}

function clearError(inputEl, errorEl) {
  if (inputEl) inputEl.classList.remove('border-erreur');
  if (errorEl) errorEl.textContent = '';
}

function normalizeSpaces(s) {
  return s.replace(/\s+/g, ' ').trim();
}

const regexNom = /^(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ](?:[A-Za-zÀ-ÖØ-öø-ÿ' -]*[A-Za-zÀ-ÖØ-öø-ÿ])?$/;

function isValidCanadianPhone(value) {
  const digits = (value || '').replace(/\D+/g, '');
  return digits.length === 10;
}

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test((email || '').toLowerCase());
}

function isValidQty(v) {
  if (v === '' || v === null || v === undefined) return false;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1;
}



const regexAdresse = /^\d+\s+[A-Za-zÀ-ÖØ-öø-ÿ].+/;
const regexPostal = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;


function validateField({ inputId, errorId, validator, message }) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return true;

  const value = normalizeSpaces(input.value || '');
  clearError(input, error);

  if (!validator(value)) {
    setError(input, error, message);
    return false;
  }

  return true;
}





function validateReservationForm() {
  let isValid = true;



  const fieldConfigs = [
    {
      inputId: 'reservation-prenom',
      errorId: 'reservation-prenom-error',
      validator: (val) => regexNom.test(val),
      message: 'Le prénom doit contenir au moins 2 lettres (espaces, tirets et apostrophes permis).',
    },
    {
      inputId: 'reservation-nom',
      errorId: 'reservation-nom-error',
      validator: (val) => regexNom.test(val),
      message: 'Le nom doit contenir au moins 2 lettres (espaces, tirets et apostrophes permis).',
    },
    {
      inputId: 'reservation-phone',
      errorId: 'reservation-phone-error',
      validator: isValidCanadianPhone,
      message: 'Numéro invalide (10 chiffres requis : ex. 514-123-4567).',
    },
    {
      inputId: 'reservation-email',
      errorId: 'reservation-email-error',
      validator: isValidEmail,
      message: 'Adresse courriel invalide.',
    },
  ];




  for (const config of fieldConfigs) {
    const result = validateField(config);
    if (!result) isValid = false;
  }




  const quantite = document.querySelector('input[name="quantite"]');
  const quantiteLabel = quantite?.closest('label');




  if (quantite && quantiteLabel) {
    const oldQuantiteError = quantiteLabel.querySelector('[data-quantite-error]');
    if (oldQuantiteError) oldQuantiteError.remove();

    if (!isValidQty(quantite.value)) {
      const error = document.createElement('p');
      error.setAttribute('data-quantite-error', '1');
      error.className = 'erreur-message';
      error.textContent = "Veuillez entrer une quantité d'au moins 1";
      quantite.classList.add('border-erreur');
      quantiteLabel.appendChild(error);
      isValid = false;
    } else {
      quantite.classList.remove('border-erreur');
    }
  }


  const modeReception = document.querySelector('input[name="mode-reception"]:checked');

  if (modeReception?.value === 'livraison') {
    const adresse = document.getElementById('reservation-adresse');
    const adresseError = document.getElementById('reservation-adresse-error');
    const adrVal = normalizeSpaces(adresse?.value || '');
    clearError(adresse, adresseError);

    if (!regexAdresse.test(adrVal)) {
      setError(adresse, adresseError, "L'adresse doit inclure un numéro et une rue");
      isValid = false;
    }

    const codePostal = document.querySelector('[name="code-postal"]');
    const codePostalParent = codePostal?.closest('label');

    if (codePostal && codePostalParent) {
      const oldZipError = codePostalParent.querySelector('p[data-zip-error]');
      if (oldZipError) oldZipError.remove();

      const value = (codePostal.value || '').trim().toUpperCase();

      if (!/^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(value)) {
        const p = document.createElement('p');
        p.setAttribute('data-zip-error', '1');
        p.className = 'erreur-message';
        p.textContent = 'Code postal invalide (ex. H2H 8A1).';
        codePostal.classList.add('border-erreur');
        codePostalParent.appendChild(p);
        isValid = false;
      } else {
        codePostal.classList.remove('border-erreur');
      }
    }
  }

  return isValid;
}

(function () {
  const el = document.getElementById('reservation-start');
  if (!el) return;

  const dateCourante = new Date();
  dateCourante.setMinutes(dateCourante.getMinutes() - dateCourante.getTimezoneOffset());
  const isoLocal = dateCourante.toISOString().slice(0, 16);
  el.min = isoLocal;
  if (!el.value) el.value = isoLocal;
})();

document.addEventListener('DOMContentLoaded', () => {
  const retraitRadio = document.querySelector('input[name="mode-reception"][value="retrait"]');
  const livraisonRadio = document.querySelector('input[name="mode-reception"][value="livraison"]');
  const champsLivraison = document.getElementById('champs-livraison');

  function toggleDeliveryFields() {
    if (!champsLivraison) return;
    if (livraisonRadio?.checked) {
      champsLivraison.classList.remove('hidden');
    } else {
      champsLivraison.classList.add('hidden');
    }
  }

  toggleDeliveryFields();
  retraitRadio?.addEventListener('change', toggleDeliveryFields);
  livraisonRadio?.addEventListener('change', toggleDeliveryFields);
});

const reservationForm = document.querySelector('#reservation-form');
if (reservationForm) {
  reservationForm.addEventListener('submit', (e) => {
    if (!validateReservationForm()) {
      e.preventDefault();
    }
  });
}

function attachLiveClear(id, errorId) {
  const el = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (!el) return;
  el.addEventListener('input', () => clearError(el, err));
}

attachLiveClear('reservation-prenom', 'reservation-prenom-error');
attachLiveClear('reservation-nom', 'reservation-nom-error');
attachLiveClear('reservation-phone', 'reservation-phone-error');
attachLiveClear('reservation-email', 'reservation-email-error');
attachLiveClear('reservation-adresse', 'reservation-adresse-error');
