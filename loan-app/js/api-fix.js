function fixUploads(url) {
    return url.replace("http://localhost:5000", window.location.origin);
}


const BASE_URL = window.location.origin;     

// Final API root
const API = BASE_URL + "/api";               

// Intercept all fetch calls
const originalFetch = window.fetch;

window.fetch = function (url, options = {}) {

    // If a full localhost URL is used, replace it
    url = url.replace("http://localhost:5000/api", API);

  
    if (url.startsWith("/auth") || url.startsWith("/admin") || url.startsWith("/user") || url.startsWith("/applications") || url.startsWith("/loans")) {
        url = API + url;
    }

    return originalFetch(url, options);
};

// =========================
// AUTO LOGOUT AFTER 5 MIN IDLE
// =========================

let idleTimer;
const IDLE_LIMIT = 5 * 60 * 1000; 

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        logout();   
    }, IDLE_LIMIT);
}

// Detect user activity to reset the timer
window.onload = resetIdleTimer;
window.onmousemove = resetIdleTimer;
window.onmousedown = resetIdleTimer;
window.ontouchstart = resetIdleTimer;
window.onclick = resetIdleTimer;
window.onkeypress = resetIdleTimer;
window.onscroll = resetIdleTimer;


// GLOBAL LOGOUT FUNCTION (required by all pages)
function logout() {
    localStorage.removeItem("userToken");  
    localStorage.removeItem("adminToken"); 
    localStorage.removeItem("token");      
    window.location.href = "../index.html";
}


