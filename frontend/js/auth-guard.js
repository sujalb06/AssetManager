// =========================================
// ROUTE PROTECTION & HISTORY TRAP
// =========================================

// 1. Standard Check
const isAuthenticated = localStorage.getItem('isLoggedIn');
if (!isAuthenticated) {
    window.location.replace('../index.html');
}

// 2. THE HISTORY HIJACK (Traps the back button)
// Instructor Note: This pushes a dummy state to the history stack. If the user presses the back button, it fires 'popstate' and forces them forward again.
window.history.pushState(null, null, window.location.href);
window.onpopstate = function () {
    if (!localStorage.getItem('isLoggedIn')) {
        window.history.go(1); // Force forward action
        window.location.replace('../index.html'); // Double safety redirect
    }
};

// 3. Handle bfcache (Memory reload)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.reload(); // Force a hard reload from the server, killing the cache
        }
    }
});

// 4. Logout Logic
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault(); 
            localStorage.removeItem('isLoggedIn');
            window.location.replace('../index.html');
        });
    }
});