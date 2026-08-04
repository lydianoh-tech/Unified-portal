const TOKEN_KEY = "accessToken";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json();
}

async function uploadFile(path, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json();
}

async function downloadFile(path, filename) {
  const token = getToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const api = {
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  requestPasswordReset: (email) =>
    request("/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  confirmPasswordReset: (token, password) =>
    request("/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  me: () => request("/auth/me"),

  logout: () => request("/auth/logout", { method: "POST" }),

  securityDashboard: () => request("/security/dashboard"),

  securityLogs: () => request("/security/logs"),

  monitoring: () => request("/security/monitoring"),

  services: () => request("/bookings/services"),

  providerServices: () => request("/bookings/provider/services"),

  createProviderService: (data) =>
    request("/bookings/provider/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProviderService: (serviceId, data) =>
    request(`/bookings/provider/services/${serviceId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  archiveProviderService: (serviceId) =>
    request(`/bookings/provider/services/${serviceId}`, {
      method: "DELETE",
    }),

  bookings: () => request("/bookings/bookings"),

  openBookings: () => request("/bookings/bookings/open"),

  providerBookings: () => request("/bookings/bookings/provider"),

  providerEarnings: () => request("/bookings/bookings/provider/earnings"),

  providerPayoutReport: (params) => {
    const query = new URLSearchParams({
      from: params.from,
      to: params.to,
      commissionRate: String(params.commissionRate),
    });
    return request(
      `/bookings/bookings/provider/payout-report?${query.toString()}`,
    );
  },

  downloadProviderWeeklyStatement: (params) => {
    const query = new URLSearchParams({
      weekStart: params.weekStart,
      commissionRate: String(params.commissionRate),
    });
    return downloadFile(
      `/bookings/bookings/provider/statement/weekly.csv?${query.toString()}`,
      params.filename ?? "weekly-statement.csv",
    );
  },

  downloadProviderCustomStatement: (params) => {
    const query = new URLSearchParams({
      from: params.from,
      to: params.to,
      commissionRate: String(params.commissionRate),
    });
    return downloadFile(
      `/bookings/bookings/provider/statement/custom.csv?${query.toString()}`,
      params.filename ?? "payout-statement.csv",
    );
  },

  acceptBooking: (bookingId) =>
    request(`/bookings/bookings/${bookingId}/accept`, { method: "POST" }),

  rejectBooking: (bookingId, data) =>
    request(`/bookings/bookings/${bookingId}/reject`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  bookingTracking: (bookingId) =>
    request(`/bookings/bookings/${bookingId}/tracking`),

  updateBookingTracking: (bookingId, data) =>
    request(`/bookings/bookings/${bookingId}/tracking`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadMedia: (file) => uploadFile("/media/upload", file),

  listings: (department) =>
    request(
      `/marketplace${department ? `?department=${encodeURIComponent(department)}` : ""}`,
    ),

  createListing: (data) =>
    request("/marketplace", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  purchaseListing: (listingId) =>
    request(`/marketplace/${listingId}/purchase`, { method: "POST" }),

  marketplaceOrders: () => request("/marketplace/orders/mine"),

  listingReviews: (listingId) => request(`/marketplace/${listingId}/reviews`),

  createListingReview: (listingId, data) =>
    request(`/marketplace/${listingId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  tickets: () => request("/tickets"),

  tasks: () => request("/tasks"),

  serviceReviews: (serviceId) =>
    request(`/bookings/services/${serviceId}/reviews`),

  createServiceReview: (serviceId, data) =>
    request(`/bookings/services/${serviceId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
