export function getAdminDashboardUrl() {
  const configured = import.meta.env.VITE_ADMIN_APP_URL?.trim();
  if (configured) {
    return configured.endsWith("/dashboard")
      ? configured
      : `${configured.replace(/\/$/, "")}/dashboard`;
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5174/dashboard`;
  }

  return "http://localhost:5174/dashboard";
}

export function redirectToAdminDashboard() {
  window.location.assign(getAdminDashboardUrl());
}
