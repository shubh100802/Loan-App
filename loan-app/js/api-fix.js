


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
