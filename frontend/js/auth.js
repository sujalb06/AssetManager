// Wait for the HTML document to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Grab the form element from the HTML
    const loginForm = document.getElementById('loginForm');

    // Add an event listener for when the form is submitted
    loginForm.addEventListener('submit', (event) => {
        // Prevent the default browser behavior (which is to refresh the page)
        event.preventDefault();

        // Get the values the user typed into the input fields
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // For now, we will just log this to the console to prove it works.
        // Later, we will send this to our Node.js backend!
        console.log("Login Attempted!");
        console.log("Email:", email);
        console.log("Password:", password);

        // Optional: Let's pretend we logged in successfully and redirect to the dashboard
        // We will build dashboard.html in the next step.
        window.location.href = 'pages/dashboard.html';
    });
});