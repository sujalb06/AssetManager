// =========================================
// LOGIN AUTHENTICATION LOGIC
// =========================================

// Prevent going "forward" to the dashboard from the login page after logging out
window.history.pushState(null, null, window.location.href);
window.onpopstate = function () {
    window.history.go(1);
};

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');

    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.replace('pages/dashboard.html');
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email === 'admin@college.edu' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.replace('pages/dashboard.html');
        } else {
            alert('Invalid Email or Password! Please try admin@college.edu / admin123');
        }
    });
});