export function saveUserToLocalStorage(data) {
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("username", data.user.username);
  localStorage.setItem("userId", data.user.id);
  localStorage.setItem("admin", data.user.admin)
}
