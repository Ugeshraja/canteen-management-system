/*
=====================================================
 COLLEGE CANTEEN MANAGEMENT SYSTEM
 Login & Session Script (login.js)
 Connected to Spring Boot Backend API
=====================================================
*/

var BACKEND_URL = "https://canteen-management-system-s4gw.onrender.com/api";

function loginUser(event) {
    event.preventDefault();

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();
    var userType = document.getElementById("userType").value;

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    // 1. Student Login (Sends POST request to Spring Boot backend)
    if (userType === "student") {
        var loginData = {
            email: username,
            name: username,
            password: password
        };

        fetch(BACKEND_URL + "/students/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Invalid student credentials! Please check your username/email and password.");
            }
            return response.json();
        })
        .then(function(student) {
            // Save student data to localStorage for session management
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userType", "student");
            localStorage.setItem("student", JSON.stringify(student));
            localStorage.setItem("studentId", student.id);
            localStorage.setItem("username", student.name);

            alert("Welcome " + student.name + "! Login successful.");
            window.location.href = "menu.html";
        })
        .catch(function(error) {
            alert("Login Failed: " + error.message);
        });
        return;
    }

    // 2. Admin Login
    if (userType === "admin") {
        if (username === "admin" && password === "1234") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userType", "admin");
            localStorage.setItem("username", "Administrator");

            alert("Admin login successful.");
            window.location.href = "admin.html";
            return;
        } else {
            alert("Invalid admin credentials!");
            return;
        }
    }

    // 3. Kitchen Login
    if (userType === "kitchen") {
        if (username === "kitchen" && password === "1234") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userType", "kitchen");
            localStorage.setItem("username", "Kitchen Staff");

            alert("Kitchen staff login successful.");
            window.location.href = "kitchen.html";
            return;
        } else {
            alert("Invalid kitchen credentials!");
            return;
        }
    }
}

// Function to handle logout
function logoutUser() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    localStorage.removeItem("student");
    localStorage.removeItem("studentId");
    window.location.href = "login.html";
}

// Function to get current logged in username
function getCurrentUsername() {
    return localStorage.getItem("username") || "Student";
}

// Function to check login state when visiting login.html
function checkLoginRedirect() {
    var loggedIn = localStorage.getItem("loggedIn") === "true";
    var userType = localStorage.getItem("userType");

    if (loggedIn) {
        if (userType === "student") {
            window.location.href = "menu.html";
        } else if (userType === "admin") {
            window.location.href = "admin.html";
        } else if (userType === "kitchen") {
            window.location.href = "kitchen.html";
        }
    }
}

// Function to dynamically update navigation bar with session state
function updateNavSession() {
    var loggedIn = localStorage.getItem("loggedIn") === "true";
    var userType = localStorage.getItem("userType");
    var username = localStorage.getItem("username") || "User";

    var nav = document.querySelector("nav.navigation");
    if (!nav) return;

    // Find any existing login / auth element in navigation
    var loginLinks = nav.querySelectorAll("a[href='login.html'], .nav-auth-section");
    for (var i = 0; i < loginLinks.length; i++) {
        loginLinks[i].remove();
    }

    // Also remove any existing kitchen/admin links if user is a student
    if (loggedIn && userType === "student") {
        var kitchenLink = nav.querySelector("a[href='kitchen.html']");
        var adminLink = nav.querySelector("a[href='admin.html']");
        if (kitchenLink) kitchenLink.remove();
        if (adminLink) adminLink.remove();
    }

    var authContainer = document.createElement("div");
    authContainer.className = "nav-auth-section";
    authContainer.style.display = "inline-flex";
    authContainer.style.alignItems = "center";
    authContainer.style.gap = "12px";

    if (loggedIn) {
        var userIcon = (userType === "admin") ? "🛡️" : (userType === "kitchen" ? "👨‍🍳" : "👤");
        
        var userBadge = document.createElement("span");
        userBadge.className = "nav-user-name";
        userBadge.style.fontWeight = "bold";
        userBadge.style.color = "#d84315";
        userBadge.style.fontSize = "14px";
        userBadge.innerText = userIcon + " " + username;

        var logoutBtn = document.createElement("a");
        logoutBtn.href = "login.html";
        logoutBtn.innerText = "Logout";
        logoutBtn.className = "nav-btn btn-logout-nav";
        logoutBtn.style.backgroundColor = "#e74c3c";
        logoutBtn.style.color = "#ffffff";
        logoutBtn.style.padding = "6px 14px";
        logoutBtn.style.borderRadius = "4px";
        logoutBtn.style.textDecoration = "none";
        logoutBtn.style.fontWeight = "bold";
        logoutBtn.style.fontSize = "14px";
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            logoutUser();
        };

        authContainer.appendChild(userBadge);
        authContainer.appendChild(logoutBtn);
    } else {
        var loginBtn = document.createElement("a");
        loginBtn.href = "login.html";
        loginBtn.innerText = "Login";
        loginBtn.className = "nav-btn";
        loginBtn.style.textDecoration = "none";

        authContainer.appendChild(loginBtn);
    }

    nav.appendChild(authContainer);
}

// Auto-run session check on page load
document.addEventListener("DOMContentLoaded", function() {
    // If we are on login.html, check whether to redirect
    if (window.location.pathname.endsWith("login.html") || window.location.href.indexOf("login.html") !== -1) {
        checkLoginRedirect();
    } else {
        updateNavSession();
    }
});
