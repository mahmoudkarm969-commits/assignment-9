const STORAGE_KEY = 'contactHub.contacts';

const state = {
  contacts: loadContacts(),
  editingId: null,
};

injectStyles();
buildModal();
setupEvents();
render();

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .contact-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      margin-top: 20px;
      width: 100%;
    }

    .contact-card {
      background: rgba(255, 255, 255, 0.76);
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: 18px;
      padding: 16px;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
    }

    .contact-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .contact-main {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .contact-avatar {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .contact-info {
      min-width: 0;
    }

    .contact-name {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .contact-sub {
      display: block;
      font-size: 12px;
      color: #667085;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .contact-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .badge.favorite {
      background: #fff2d9;
      color: #b45309;
    }

    .badge.emergency {
      background: #ffe4e6;
      color: #be123c;
    }

    .badge.group {
      background: #eef2ff;
      color: #4338ca;
    }

    .contact-note {
      margin-top: 12px;
      font-size: 13px;
      color: #475467;
      line-height: 1.5;
    }

    .contact-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid rgba(148, 163, 184, 0.25);
    }

    .mini-btn {
      border: none;
      border-radius: 10px;
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(148, 163, 184, 0.12);
      color: #7a808d;
    }

    .mini-btn svg {
      width: 18px;
      height: 18px;
    }

    .mini-btn:hover {
      transform: translateY(-1px);
    }

    .mini-btn.favorite.active {
      background: #fbbf24;
      color: #fff;
      box-shadow: 0 8px 16px rgba(251, 191, 36, 0.22);
    }

    .mini-btn.emergency.active {
      background: #ef4444;
      color: #fff;
      box-shadow: 0 8px 16px rgba(239, 68, 68, 0.2);
    }

    .mini-btn.edit {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .mini-btn.delete {
      background: rgba(148, 163, 184, 0.12);
      color: #6b7280;
    }

    .mini-btn.call {
      background: rgba(13, 148, 136, 0.1);
      color: #0f766e;
    }

    .mini-btn.mail {
      background: rgba(168, 85, 247, 0.12);
      color: #7c3aed;
    }

    .icon-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .contact-list-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 320px;
      background: linear-gradient(180deg, rgba(221, 239, 232, 0.2), rgba(217, 236, 220, 0.3));
      border-radius: 18px;
      margin-top: 20px;
    }

    .contact-list-empty .content {
      text-align: center;
      color: #2f3542;
    }

    .contact-list-empty .icon-wrap {
      width: 78px;
      height: 78px;
      margin: 0 auto 15px;
      border-radius: 18px;
      background: rgba(221, 230, 235, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8592a1;
    }

    .contact-list-empty .icon-wrap svg {
      width: 34px;
      height: 34px;
    }

    .contact-list-empty h4 {
      margin: 0 0 8px;
      font-size: 30px;
      font-weight: 600;
    }

    .contact-list-empty p {
      margin: 0;
      font-size: 16px;
      color: #5a6473;
    }

    .sidebar-items {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 18px 18px;
      background: rgba(255, 255, 255, 0.2);
    }

    .sidebar-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      padding: 7px 10px;
      font-size: 12px;
      font-weight: 700;
      color: #374151;
      background: rgba(255, 255, 255, 0.48);
    }

    .sidebar-pill .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .sidebar-pill.favorite .dot {
      background: #f59e0b;
    }

    .sidebar-pill.emergency .dot {
      background: #ef4444;
    }

    .modal-form {
      display: grid;
      gap: 18px;
    }

    .add-contact-modal .modal-dialog {
      max-width: 840px;
      width: 100%;
    }

    .add-contact-modal .modal-content {
      border: none;
      border-radius: 18px;
      background: #f4f5f7;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      overflow: hidden;
    }

    .add-contact-modal .modal-header {
      border: none;
      padding: 18px 22px 10px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .add-contact-modal .modal-title {
      font-size: 34px;
      font-weight: 800;
      line-height: 1.2;
      color: #222832;
      margin: 0;
    }

    .add-contact-modal .btn-close {
      width: 16px;
      height: 16px;
      opacity: 0.7;
      margin-left: auto;
      filter: grayscale(1);
    }

    .add-contact-modal .modal-body {
      padding: 10px 28px 24px;
    }

    .add-contact-modal .avatar-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 18px;
    }

    .add-contact-modal .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1d9bf0, #1c85ee);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 18px;
      box-shadow: 0 8px 20px rgba(30, 136, 229, 0.22);
    }

    .add-contact-modal .avatar-circle svg {
      width: 42px;
      height: 42px;
    }

    .add-contact-modal .photo-btn {
      background: rgba(142, 150, 165, 0.12);
      border: none;
      border-radius: 12px;
      padding: 12px 22px;
      color: #2d2f36;
      font-size: 20px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .add-contact-modal .photo-btn svg {
      width: 18px;
      height: 18px;
    }

    .add-contact-modal .field-wrap {
      display: grid;
      gap: 8px;
      margin-bottom: 18px;
    }

    .add-contact-modal .field-label {
      font-size: 15px;
      font-weight: 700;
      color: #272d36;
      margin: 0;
    }

    .add-contact-modal .required {
      color: #e53935;
      margin-left: 4px;
    }

    .add-contact-modal .modal-form input,
    .add-contact-modal .modal-form textarea,
    .add-contact-modal .modal-form select {
      width: 100%;
      border: 1px solid rgba(144, 148, 160, 0.45);
      border-radius: 12px;
      padding: 18px 18px;
      outline: none;
      background: rgba(255, 255, 255, 0.3);
      font-size: 16px;
      color: #2a2f38;
    }

    .add-contact-modal .modal-form textarea {
      min-height: 90px;
      resize: vertical;
    }

    .add-contact-modal .modal-form input::placeholder,
    .add-contact-modal .modal-form textarea::placeholder {
      color: #8a94a6;
    }

    .add-contact-modal .modal-form input:focus,
    .add-contact-modal .modal-form textarea:focus,
    .add-contact-modal .modal-form select:focus {
      border-color: #2f80ed;
      box-shadow: 0 0 0 4px rgba(47, 128, 237, 0.12);
      background: rgba(255, 255, 255, 0.75);
    }

    .add-contact-modal .checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #374151;
      margin-top: 8px;
    }

    .add-contact-modal .checkbox-row input {
      width: 18px;
      height: 18px;
      accent-color: #1d9bf0;
    }

    .add-contact-modal .modal-footer {
      border: none;
      padding: 0 28px 24px;
      justify-content: flex-end;
      gap: 12px;
    }

    .add-contact-modal .modal-footer .btn {
      border-radius: 10px;
      padding: 12px 18px;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
}

function buildModal() {
  const modalMarkup = `
    <div class="modal fade add-contact-modal" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="contactModalLabel">Add New Contact</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <form id="contactForm">
            <div class="modal-body modal-form">
              <div class="avatar-wrapper">
                <div class="avatar-circle">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 12c2.8 0 5-2.2 5-5S14.8 2 12 2 7 4.2 7 7s2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z"/>
                  </svg>
                </div>
                <button type="button" class="photo-btn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M21 7h-3.17l-1.84-2H7.99L6.17 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5z"/>
                  </svg>
                  Change Photo
                </button>
              </div>

              <input type="hidden" id="contactId" />

              <div class="field-wrap">
                <label class="field-label" for="fullName">Full Name <span class="required">*</span></label>
                <input type="text" id="fullName" name="fullName" placeholder="Enter full name" required />
              </div>

              <div class="field-wrap">
                <label class="field-label" for="phoneNumber">Phone Number <span class="required">*</span></label>
                <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="e.g., 01012345678" required />
              </div>

              <div class="field-wrap">
                <label class="field-label" for="emailAddress">Email Address</label>
                <input type="email" id="emailAddress" name="emailAddress" placeholder="name@example.com" />
              </div>

              <div class="field-wrap">
                <label class="field-label" for="address">Address</label>
                <input type="text" id="address" name="address" placeholder="Enter address" />
              </div>

              <div class="field-wrap">
                <label class="field-label" for="group">Group</label>
                <select id="group" name="group">
                  <option value="">Select Group</option>
                  <option value="Family">Family</option>
                  <option value="Friends">Friends</option>
                  <option value="Work">Work</option>
                  <option value="VIP">VIP</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="field-wrap">
                <label class="field-label" for="notes">Notes</label>
                <textarea id="notes" name="notes" placeholder="Add notes"></textarea>
              </div>

              <label class="checkbox-row">
                <input type="checkbox" id="favorite" />
                <span>Add to Favorites</span>
              </label>

              <label class="checkbox-row">
                <input type="checkbox" id="emergency" />
                <span>Add to Emergency</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Contact</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalMarkup);
}

function setupEvents() {
  const addBtn = document.querySelector('.btn-add');
  const searchInput = document.querySelector('#search');
  const form = document.getElementById('contactForm');
  const modalEl = document.getElementById('contactModal');

  addBtn?.addEventListener('click', () => openModal());
  searchInput?.addEventListener('input', render);

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = state.editingId || createId();
    const newContact = {
      id,
      fullName: document.getElementById('fullName').value.trim(),
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      emailAddress: document.getElementById('emailAddress').value.trim(),
      address: document.getElementById('address').value.trim(),
      group: document.getElementById('group').value,
      notes: document.getElementById('notes').value.trim(),
      favorite: document.getElementById('favorite').checked,
      emergency: document.getElementById('emergency').checked,
    };

    if (!newContact.fullName || !newContact.phoneNumber || !newContact.emailAddress) {
      return;
    }

    if (state.editingId) {
      const index = state.contacts.findIndex((contact) => contact.id === state.editingId);
      if (index >= 0) {
        state.contacts[index] = newContact;
      }
    } else {
      state.contacts.unshift(newContact);
    }

    saveContacts();
    render();
    closeModal();
  });

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;

    const { action, id } = actionTarget.dataset;
    const contact = state.contacts.find((item) => item.id === id);
    if (!contact) return;

    if (action === 'delete') {
      state.contacts = state.contacts.filter((item) => item.id !== id);
      saveContacts();
      render();
      return;
    }

    if (action === 'favorite') {
      contact.favorite = !contact.favorite;
      saveContacts();
      render();
      return;
    }

    if (action === 'emergency') {
      contact.emergency = !contact.emergency;
      saveContacts();
      render();
      return;
    }

    if (action === 'edit') {
      state.editingId = id;
      fillForm(contact);
      document.getElementById('contactModalLabel').textContent = 'Edit Contact';
      const editModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      editModal.show();
    }
  });

  modalEl?.addEventListener('hidden.bs.modal', () => {
    const form = document.getElementById('contactForm');
    if (form) form.reset();
    state.editingId = null;
    const modalTitle = document.getElementById('contactModalLabel');
    if (modalTitle) modalTitle.textContent = 'Add Contact';
  });
}

function fillForm(contact) {
  const form = document.getElementById('contactForm');
  if (!form) return;

  document.getElementById('contactId').value = contact.id;
  document.getElementById('fullName').value = contact.fullName || '';
  document.getElementById('phoneNumber').value = contact.phoneNumber || '';
  document.getElementById('emailAddress').value = contact.emailAddress || '';
  document.getElementById('address').value = contact.address || '';
  document.getElementById('group').value = contact.group || '';
  document.getElementById('notes').value = contact.notes || '';
  document.getElementById('favorite').checked = Boolean(contact.favorite);
  document.getElementById('emergency').checked = Boolean(contact.emergency);
}

function openModal() {
  const form = document.getElementById('contactForm');
  form?.reset();
  state.editingId = null;
  document.getElementById('contactModalLabel').textContent = 'Add Contact';
  bootstrap.Modal.getOrCreateInstance(document.getElementById('contactModal')).show();
}

function closeModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
  modal?.hide();
  const form = document.getElementById('contactForm');
  form?.reset();
  state.editingId = null;
  document.getElementById('contactModalLabel').textContent = 'Add Contact';
}

function render() {
  const contacts = getFilteredContacts();
  const totalText = document.querySelector('.head p');
  const totalValues = document.querySelectorAll('.p2');
  const favoritePanel = document.querySelector('.favorites-card .empty-state');
  const emergencyPanel = document.querySelector('.emergency-card .empty-state');
  const listWrap = document.querySelector('.empty-contacts');

  if (totalText) {
    totalText.textContent = `Manage and organize your ${state.contacts.length} contacts`;
  }

  if (totalValues.length >= 3) {
    totalValues[0].textContent = state.contacts.length;
    totalValues[1].textContent = state.contacts.filter((contact) => contact.favorite).length;
    totalValues[2].textContent = state.contacts.filter((contact) => contact.emergency).length;
  }

  const favorites = state.contacts.filter((contact) => contact.favorite);
  const emergencies = state.contacts.filter((contact) => contact.emergency);

  if (favoritePanel) {
    if (!favorites.length) {
      favoritePanel.innerHTML = '<p>No favorites yet</p>';
    } else {
      favoritePanel.innerHTML = `
        <div class="sidebar-items">
          ${favorites
            .map(
              (contact) => `
                <span class="sidebar-pill favorite"><span class="dot"></span>${escapeHtml(contact.fullName)}</span>
              `
            )
            .join('')}
        </div>
      `;
    }
  }

  if (emergencyPanel) {
    if (!emergencies.length) {
      emergencyPanel.innerHTML = '<p>No emergency contacts</p>';
    } else {
      emergencyPanel.innerHTML = `
        <div class="sidebar-items">
          ${emergencies
            .map(
              (contact) => `
                <span class="sidebar-pill emergency"><span class="dot"></span>${escapeHtml(contact.fullName)}</span>
              `
            )
            .join('')}
        </div>
      `;
    }
  }

  if (!contacts.length) {
    if (listWrap) {
      listWrap.innerHTML = `
        <div class="contact-list-empty">
          <div class="content">
            <div class="icon-wrap rounded-3">
              <svg class="svg-inline--fa fa-address-book" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="address-book" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM208 288h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z"></path>
              </svg>
            </div>
            <h4>No contacts found</h4>
            <p>Click "Add Contact" to get started</p>
          </div>
        </div>
      `;
    }
    return;
  }

  if (listWrap) {
    listWrap.innerHTML = `
      <div class="contact-list">
        ${contacts
          .map(
            (contact) => `
              <article class="contact-card">
                <div class="contact-card-head">
                  <div class="contact-main">
                    <div class="contact-avatar">${getInitials(contact.fullName)}</div>
                    <div class="contact-info">
                      <p class="contact-name">${escapeHtml(contact.fullName)}</p>
                      <span class="contact-sub">${escapeHtml(contact.phoneNumber)}</span>
                      <span class="contact-sub">${escapeHtml(contact.emailAddress)}</span>
                    </div>
                  </div>
                </div>

                <div class="contact-badges">
                  ${contact.group ? `<span class="badge group">${escapeHtml(contact.group)}</span>` : ''}
                  ${contact.favorite ? '<span class="badge favorite">★ Favorite</span>' : ''}
                  ${contact.emergency ? '<span class="badge emergency">❤ Emergency</span>' : ''}
                </div>

                ${contact.address ? `<div class="contact-note"><strong>Address:</strong> ${escapeHtml(contact.address)}</div>` : ''}
                ${contact.notes ? `<div class="contact-note"><strong>Notes:</strong> ${escapeHtml(contact.notes)}</div>` : ''}

                <div class="contact-actions">
                  <div class="icon-group">
                    <button class="mini-btn call" type="button" aria-label="Call contact">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"/></svg>
                    </button>
                    <button class="mini-btn mail" type="button" aria-label="Send email">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0 2-8 5-8-5h16zm-16 8V9.2l7.4 4.6a1 1 0 0 0 1.2 0L20 9.2V16H4z"/></svg>
                    </button>
                  </div>

                  <div class="icon-group">
                    <button class="mini-btn favorite ${contact.favorite ? 'active' : ''}" data-action="favorite" data-id="${contact.id}" type="button" aria-label="Toggle favorite">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21l6.18-3.73Z"/></svg>
                    </button>
                    <button class="mini-btn emergency ${contact.emergency ? 'active' : ''}" data-action="emergency" data-id="${contact.id}" type="button" aria-label="Toggle emergency">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.1 6.1 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z"/></svg>
                    </button>
                    <button class="mini-btn edit" data-action="edit" data-id="${contact.id}" type="button" aria-label="Edit contact">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/></svg>
                    </button>
                    <button class="mini-btn delete" data-action="delete" data-id="${contact.id}" type="button" aria-label="Delete contact">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3-3h6l1 2h4v2H4V6h4l1-2Zm-1 6h2v7H8v-7Zm6 0h2v7h-2v-7Z"/></svg>
                    </button>
                  </div>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    `;
  }
}

function getFilteredContacts() {
  const query = document.querySelector('#search')?.value.trim().toLowerCase() || '';

  if (!query) {
    return [...state.contacts];
  }

  return state.contacts.filter((contact) => {
    const haystack = [
      contact.fullName,
      contact.phoneNumber,
      contact.emailAddress,
      contact.address,
      contact.group,
      contact.notes,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}

function getInitials(name) {
  return String(name || 'C')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'C';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createId() {
  return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `contact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadContacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveContacts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.contacts));
}
