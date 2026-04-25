// Fade in elements as they scroll into view (adds .visible to .reveal elements)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// API_URL is loaded from js/config.js (gitignored)
// const API_URL = 'PASTE_API_GATEWAY_URL_HERE';

function validateForm(firstname, lastname, phone, email, service, message) {
  if (!firstname)
    return 'Please enter your first name.';
  if (firstname.length >= 100)
    return 'First name must be under 100 characters.';
  if (lastname.length >= 100)
    return 'Last name must be under 100 characters.';
  if (!phone && !email)
    return 'Please provide a phone number or email so we can reach you.';
  if (phone && !/^[\d\s.\-]{7,15}$/.test(phone))
    return 'Phone number must be 7–15 characters and contain only digits, spaces, dashes, or periods.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return 'Please enter a valid email address.';
  if (email.length >= 100)
    return 'Email address must be under 100 characters.';
  if (service.length >= 100)
    return 'Service field must be under 100 characters.';
  if (message.length >= 1000)
    return 'Message must be under 1000 characters.';
  return null;
}

async function submitForm() {
  const firstname = document.getElementById('firstname').value.trim();
  const lastname  = document.getElementById('lastname').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const email     = document.getElementById('email').value.trim();
  const service   = document.getElementById('service').value.trim();
  const message   = document.getElementById('message').value.trim();

  const validationError = validateForm(firstname, lastname, phone, email, service, message);
  if (validationError) {
    alert(validationError);
    return;
  }

  // Local fallback: skip the network call until the API URL is configured
  if (API_URL === 'PASTE_API_GATEWAY_URL_HERE') {
    document.getElementById('formWrap').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    return;
  }

  const btn = document.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, phone, email, service, message }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    document.getElementById('formWrap').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  } catch (err) {
    console.error('Form submission failed:', err);
    alert('Something went wrong — please call or email us directly.');
    btn.disabled = false;
    btn.textContent = 'Send My Request 🌿';
  }
}
