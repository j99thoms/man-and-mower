// Fade in elements as they scroll into view (adds .visible to .reveal elements)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// API_URL is loaded from js/config.js (gitignored)
// const API_URL = 'PASTE_API_GATEWAY_URL_HERE';
async function submitForm() {
  const firstname = document.getElementById('firstname').value.trim();
  const lastname  = document.getElementById('lastname').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const email     = document.getElementById('email').value.trim();
  const service   = document.getElementById('service').value.trim();
  const message   = document.getElementById('message').value.trim();

  if (!firstname || (!phone && !email)) {
    alert('Please fill in your name and etiher a phone number or an email so we can reach you.');
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
