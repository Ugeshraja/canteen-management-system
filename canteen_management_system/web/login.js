/*
=====================================================
 COLLEGE CANTEEN MANAGEMENT SYSTEM
 Login Script (login.js)
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
                throw new Error("Invalid student credentials! (Check username/email & password)");
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
            alert("Login Failed: " + error.message + "\n(Please ensure Spring Boot is running on port 8080 and MySQL is active)");
        });
        return;
    }

    // 2. Admin Login (admin / 1234)
    if (userType === "admin") {
        if (username === "admin" && password === "1234") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userType", "admin");
            localStorage.setItem("username", "Administrator");

            alert("Admin login successful.");
            window.location.href = "admin.html";
            return;
        } else {
            alert("Invalid admin credentials! Use admin / 1234");
            return;
        }
    }

    // 3. Kitchen Login (kitchen / 1234)
    if (userType === "kitchen") {
        if (username === "kitchen" && password === "1234") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userType", "kitchen");
            localStorage.setItem("username", "Kitchen Staff");

            alert("Kitchen staff login successful.");
            window.location.href = "kitchen.html";
            return;
        } else {
            alert("Invalid kitchen credentials! Use kitchen / 1234");
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
    alert("You have been logged out.");
    window.location.href = "login.html";
}

// Function to get current logged in username
function getCurrentUsername() {
    return localStorage.getItem("username") || "Student";
}
