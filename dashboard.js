const cookieDetails = document.cookie.split("=");
document.querySelector("#userName").innerHTML = cookieDetails[1];

if (!cookieDetails[1]) {
  window.location.href = "/login/index.html";
}

function deleteCookie() {
  document.cookie = "userName" + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;";
  window.location.href = "/login/index.html";
}
