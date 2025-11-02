/* Shared JS for modal, booking, contact, FAQ, lightbox, and nav active highlight */

/* NAV: highlight active link based on body[data-page] */
(function setActiveNav(){
  const page = document.body.getAttribute('data-page') || '';
  document.querySelectorAll('.nav-link').forEach(a=>{
    if(a.dataset.link === page) a.classList.add('active');
    else a.classList.remove('active');
  });
})();

/* Modal helpers */
function showModal(){
  const modal = document.getElementById('modal');
  if(modal) modal.style.display = 'flex';
}
function closeModal(){
  const modal = document.getElementById('modal');
  if(modal){ modal.style.display = 'none'; document.getElementById('modal-content').innerHTML = ''; }
}

/* Open Booking helpers used by buttons */
function openBooking(title, price){
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <h3>Book: ${title}</h3>
    <p class="small muted">Price: ${price>0? ('$'+price) : 'Contact for quote'}</p>
    <form id="modal-book" onsubmit="submitBooking(event)">
      <label class="small muted">Full name</label>
      <input id="b-name" required>
      <label class="small muted">Email</label>
      <input id="b-email" type="email" required>
      <label class="small muted">Date</label>
      <input id="b-date" type="date" required>
      <label class="small muted">People</label>
      <input id="b-people" type="number" min="1" value="2" required>
      <div style="margin-top:10px;text-align:right"><button class="cta" type="submit">Send Request</button></div>
    </form>
  `;
  showModal();
}

/* Quick-book form on home: prefill modal */
function openBookingModal(e){
  e.preventDefault();
  const tour = document.getElementById('tour').value;
  const date = document.getElementById('date').value;
  const people = document.getElementById('people').value;
  openBooking(tour, 0);
  setTimeout(()=>{
    const dn = document.getElementById('b-date');
    const bp = document.getElementById('b-people');
    if(dn) dn.value = date;
    if(bp) bp.value = people;
  },100);
  return false;
}

/* Submit booking: fallback to mailto (no backend) */
function submitBooking(e){
  e.preventDefault();
  const name = (document.getElementById('b-name') || {}).value || '';
  const email = (document.getElementById('b-email') || {}).value || '';
  const date = (document.getElementById('b-date') || {}).value || '';
  const people = (document.getElementById('b-people') || {}).value || '';
  if(!name || !email || !date){ alert('Please fill all required fields'); return; }

  const subject = encodeURIComponent('Tour Booking Request: ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nDate: ${date}\nPeople: ${people}\nRequest from website`);
  window.location.href = `mailto:info@safiseasidetours.ca?subject=${subject}&body=${body}`;
}

/* Contact form submit (works on multiple forms across pages) */
function submitContact(e){
  e.preventDefault();
  // attempt to find name, email, message from whichever form is present
  const form = e.target;
  const name = form.querySelector('input[type="text"], input:not([type])')?.value?.trim() || '';
  const email = form.querySelector('input[type="email"]')?.value?.trim() || '';
  const message = form.querySelector('textarea')?.value?.trim() || '';
  if(!name || !email || !message){ alert('Please complete the form'); return; }

  const subject = encodeURIComponent('Website Contact: ' + name);
  const body = encodeURIComponent(message + '\n\nContact Email: ' + email);
  window.location.href = `mailto:info@safiseasidetours.ca?subject=${subject}&body=${body}`;
}

/* FAQ toggle */
function toggleFaq(node){
  const ans = node.nextElementSibling;
  const small = node.querySelector('.small') || node.querySelector('.muted');
  const open = ans.style.maxHeight && ans.style.maxHeight !== '0px';
  if(open){
    ans.style.maxHeight = '0';
    if(small) small.innerText = '+';
  } else {
    ans.style.maxHeight = ans.scrollHeight + 'px';
    if(small) small.innerText = '−';
  }
}

/* Lightbox */
function openLightbox(img){
  const content = document.getElementById('modal-content');
  content.innerHTML = `<img src='${img.src}' style='width:100%;height:auto;border-radius:10px' alt='gallery' />`;
  showModal();
}

/* Close modal on backdrop click and ESC key */
document.getElementById('modal')?.addEventListener('click', function(e){ if(e.target===this) closeModal(); });
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

/* Accessibility: focus trap could be added later if needed */
