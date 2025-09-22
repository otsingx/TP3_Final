


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

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.toLowerCase());
}


function validateSubscribeForm() {
  const input = document.getElementById('email-abonnement');
  const error = document.getElementById('abonnement-erreur');

  const value = normalizeSpaces(input?.value || '');

  clearError(input, error);

  if (value === '') return true;

  if (!isValidEmail(value)) {
    setError(input, error, 'Veuillez entrer une adresse courriel valide');
    return false;
  }

  return true;
}


function attachLiveClear(id, errorId) {
  const el = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (!el) return;
  el.addEventListener('input', () => clearError(el, err));
}

attachLiveClear('email-abonnement', 'abonnement-erreur');