
export function setToken(token) {
  localStorage.setItem("token", token);
  console.log("set token");
}

export function getToken() {
  console.log("get token");
  return localStorage.getItem("token");
}

export function removeToken() {
  console.log("remove token");
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  console.log("isLoggedIn", !!getToken());
  return !!getToken(); 
}


