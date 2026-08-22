/*
=====================================================
 COLLEGE CANTEEN MANAGEMENT SYSTEM
 Cart Script (cart.js)
 Connected to Spring Boot Backend API
=====================================================
*/

var BACKEND_ORDER_URL = "https://canteen-management-system-s4gw.onrender.com/api/orders";
var CART_KEY = "canteenCart";
var TAX_RATE = 0.05; // 5% tax

// Function to get cart from localStorage
function getCart() {
    var data = localStorage.getItem(CART_KEY);
    if (!data) {
        return [];
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Function to save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Function to display cart items
function displayCart() {
    var cart = getCart();
    var container = document.getElementById("cartItemsContainer");
    var emptyView = document.getElementById("emptyCartView");
    var cartLayout = document.getElementById("cartLayout");

    if (!container) return;

    if (cart.length === 0) {
        if (container) container.innerHTML = "";
        if (emptyView) emptyView.style.display = "block";
        if (cartLayout) cartLayout.style.display = "none";
        updateSummary(0);
        updateCartCount();
        return;
    }

    if (emptyView) emptyView.style.display = "none";
    if (cartLayout) cartLayout.style.display = "grid";

    container.innerHTML = "";

    var subtotal = 0;

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        var row = document.createElement("div");
        row.className = "cart-item-row";

        row.innerHTML = 
            '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
            '<div class="cart-item-details">' +
                '<span class="cart-item-category">' + item.category + '</span>' +
                '<h4 class="cart-item-title">' + item.name + '</h4>' +
                '<span class="cart-item-price">₹' + item.price + ' each</span>' +
            '</div>' +
            '<div class="cart-item-qty">' +
                '<button type="button" class="qty-btn" onclick="changeQuantity(' + item.id + ', -1)">-</button>' +
                '<span class="qty-number">' + item.quantity + '</span>' +
                '<button type="button" class="qty-btn" onclick="changeQuantity(' + item.id + ', 1)">+</button>' +
            '</div>' +
            '<div class="cart-item-total">₹' + itemTotal + '</div>' +
            '<button type="button" class="btn-remove" onclick="removeCartItem(' + item.id + ')">Remove</button>';

        container.appendChild(row);
    }

    updateSummary(subtotal);
    updateCartCount();
}

// Function to increase or decrease quantity
function changeQuantity(id, delta) {
    var cart = getCart();

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity += delta;
            if (cart[i].quantity <= 0) {
                cart.splice(i, 1);
            }
            break;
        }
    }

    saveCart(cart);
    displayCart();
}

// Function to remove an item from the cart
function removeCartItem(id) {
    var cart = getCart();
    var updatedCart = cart.filter(function(item) {
        return item.id !== id;
    });

    saveCart(updatedCart);
    displayCart();
}

// Function to update the subtotal, tax, and total
function updateSummary(subtotal) {
    var tax = Math.round(subtotal * TAX_RATE);
    var total = subtotal + tax;

    var subtotalEl = document.getElementById("cartSubtotal");
    var taxEl = document.getElementById("cartTax");
    var totalEl = document.getElementById("cartTotal");

    if (subtotalEl) subtotalEl.innerText = "₹" + subtotal;
    if (taxEl) taxEl.innerText = "₹" + tax;
    if (totalEl) totalEl.innerText = "₹" + total;
}

// Function to update cart badge in navbar
function updateCartCount() {
    var cart = getCart();
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }
    var badges = document.querySelectorAll("#cartCount");
    for (var j = 0; j < badges.length; j++) {
        badges[j].innerText = count;
    }
}

// Function to place the order to Spring Boot Backend
function placeOrder() {
    var cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty. Please add some food items first.");
        return;
    }

    // Check student login from localStorage
    var studentJson = localStorage.getItem("student");
    var student = studentJson ? JSON.parse(studentJson) : null;

    var studentId = 1; // Default fallback ID if not explicitly logged in
    var studentName = "Student";

    if (student && student.id) {
        studentId = student.id;
        studentName = student.name;
    } else if (localStorage.getItem("username")) {
        studentName = localStorage.getItem("username");
    }

    // Calculate totals
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
        subtotal += (cart[i].price * cart[i].quantity);
    }
    var tax = Math.round(subtotal * TAX_RATE);
    var total = subtotal + tax;

    // Current Date and Time
    var now = new Date();
    var formattedDate = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prepare order payload matching Spring Boot Order entity
    var orderPayload = {
        studentId: studentId,
        studentName: studentName,
        orderDate: formattedDate,
        totalAmount: total,
        status: "PLACED",
        items: cart.map(function(item) {
            return {
                foodItemId: item.id,
                foodName: item.name,
                quantity: item.quantity,
                price: item.price
            };
        })
    };

    // Send POST request to Spring Boot backend
    fetch(BACKEND_ORDER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Server returned status: " + response.status);
        }
        return response.json();
    })
    .then(function(savedOrder) {
        // Clear cart from localStorage
        localStorage.removeItem(CART_KEY);

        alert("Order Placed Successfully!\nOrder ID: #" + savedOrder.id + "\nTotal Amount: ₹" + savedOrder.totalAmount + "\nStatus: PLACED (Kitchen is preparing your food)");

        // Redirect to orders page
        window.location.href = "orders.html";
    })
    .catch(function(error) {
        console.error("Order error:", error);
        alert("Could not place order: Unable to connect to the server. Please try again.");
    });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
});
