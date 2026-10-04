export const getUserId = () => localStorage.getItem("userId");
export const getUserName = () => localStorage.getItem("userName") || "";

export function saveSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userName", user.name || "");
  window.dispatchEvent(new Event("authChanged"));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function clearSession() {
  localStorage.clear();
  window.dispatchEvent(new Event("authChanged"));
  window.dispatchEvent(new Event("cartUpdated"));
}

export const notifyCartChanged = () =>
  window.dispatchEvent(new Event("cartUpdated"));
