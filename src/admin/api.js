import API_BASE_URL from '../config/apiBaseUrl';

function withAuthHeaders(token, headers = {}) {
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

function buildApiError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function adminLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw buildApiError(payload.message || 'Login fallito.', response.status);
  }
  return payload;
}

export async function fetchAdminMe(token) {
  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    headers: withAuthHeaders(token),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw buildApiError(payload.message || 'Sessione non valida.', response.status);
  }
  return payload;
}

export async function adminLogout(token) {
  await fetch(`${API_BASE_URL}/admin/logout`, {
    method: 'POST',
    headers: withAuthHeaders(token, { 'Content-Type': 'application/json' }),
  });
}

export async function fetchAdminDashboard(token, monthKey) {
  const query = monthKey ? `?month=${encodeURIComponent(monthKey)}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/dashboard${query}`, {
    headers: withAuthHeaders(token),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw buildApiError(payload.message || 'Errore nel caricamento dashboard.', response.status);
  }
  return payload;
}

export async function fetchAdminAppointments(token, { page = 1, pageSize = 8, search = '' }) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search.trim()) {
    params.set('search', search.trim());
  }

  const response = await fetch(`${API_BASE_URL}/admin/appointments?${params.toString()}`, {
    headers: withAuthHeaders(token),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw buildApiError(payload.message || 'Errore nel caricamento appuntamenti.', response.status);
  }
  return payload;
}

export async function deleteAdminAppointment(token, appointmentId) {
  const response = await fetch(`${API_BASE_URL}/admin/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: withAuthHeaders(token),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw buildApiError(payload.message || 'Errore durante eliminazione prenotazione.', response.status);
  }
  return payload;
}

export async function confirmAdminAppointment(token, appointmentId) {
  const response = await fetch(`${API_BASE_URL}/admin/appointments/${appointmentId}/confirm`, {
    method: 'POST',
    headers: withAuthHeaders(token, { 'Content-Type': 'application/json' }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw buildApiError(payload.message || 'Errore durante la conferma prenotazione.', response.status);
  }
  return payload;
}
