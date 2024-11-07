// Mock data to simulate user storage (You can replace this with a real database)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;
let currentBalance = 1000; // Initial balance
let transactions = [];
const loginSessionTime = 2 * 60 * 1000; // 2 minutes

// Function to check session expiration
function checkSessionExpiration() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const loginTime = sessionStorage.getItem('loginTime');

    // Check if session has expired
    if (isLoggedIn && new Date().getTime() - loginTime >= loginSessionTime) {
        alert('Session expired. Please log in again.');
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

// Ensure the script runs after the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check session expiration every second
    setInterval(checkSessionExpiration, 1000);

    // Handle Signup
    const signupForm = document.querySelector('#signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.querySelector('#signupUsername').value;
            const password = document.querySelector('#signupPassword').value;

            // Check if the username already exists
            if (users.some(user => user.username === username)) {
                alert('Username already exists.');
            } else {
                users.push({ username, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Signup successful. You can now log in.');
                window.location.href = 'index.html'; // Redirect to login page
            }
        });
    }

    // Handle Login
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.querySelector('#loginUsername').value;
            const password = document.querySelector('#loginPassword').value;

            // Check if the user exists and password is correct
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                currentUser = user;
                sessionStorage.setItem('isLoggedIn', true);
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                sessionStorage.setItem('loginTime', new Date().getTime());
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    // Handle Deposit button
    document.querySelector('#depositBtn')?.addEventListener('click', function () {
        const amount = parseFloat(document.querySelector('#amount').value);
        if (amount > 0) {
            currentBalance += amount;
            addTransaction('deposit', amount);
            updateBalance();
        } else {
            alert('Please enter a valid amount');
        }
    });

    // Handle Withdraw button
    document.querySelector('#withdrawBtn')?.addEventListener('click', function () {
        const amount = parseFloat(document.querySelector('#amount').value);
        if (amount > 0 && amount <= currentBalance) {
            currentBalance -= amount;
            addTransaction('withdraw', amount);
            updateBalance();
        } else if (amount > currentBalance) {
            alert('Insufficient balance.');
        } else {
            alert('Please enter a valid amount');
        }
    });

    // Add transaction to history
    function addTransaction(type, amount) {
        const transaction = {
            type: type,
            amount: amount,
            date: new Date().toLocaleString()
        };
        transactions.push(transaction);
        displayTransactionHistory();
    }

    // Display transaction history
    function displayTransactionHistory() {
        const transactionHistory = document.querySelector('#transactionHistory');
        transactionHistory.innerHTML = ''; // Clear history
        transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.classList.add(transaction.type === 'deposit' ? 'transaction-deposit' : 'transaction-withdraw');
            li.innerText = `${transaction.type === 'deposit' ? '+' : '-'}$${transaction.amount.toFixed(2)} on ${transaction.date}`;
            transactionHistory.appendChild(li);
        });
    }

    // Update balance on the dashboard
    function updateBalance() {
        document.querySelector('#balance').innerText = currentBalance.toFixed(2);
    }

    // Handle Logout button
    document.querySelector('#logout')?.addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
});
