function validateSubscribeForm() {
  const input = document.getElementById('email-abonnement');
  const value = input.value.trim();
  const errorSubscribe = document.getElementById('abonnement-erreur');

input.addEventListener('input', () => {
  input.classList.remove('border-erreur');
  errorSubscribe.textContent = '';
});

  errorSubscribe.textContent = '';
  input.classList.remove('border-erreur');

  if (value === '') {
    return true;
  }

  if (!isValidEmailNew(value)) {
    errorSubscribe.textContent = 'Veuillez entrer une adresse courriel valide.';
    input.classList.add('border-erreur');
    return false;
  }

  return true;
}

const isValidEmailNew = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.toLowerCase());
};
