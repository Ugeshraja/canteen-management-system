/*
=====================================================
 COLLEGE CANTEEN MANAGEMENT SYSTEM
 Orders Script (orders.js)
 Connected to Spring Boot Backend API
=====================================================
*/

var BACKEND_ORDER_URL = "http://localhost:8080/api/orders";

// Function to fetch orders from backend
function fetchOrdersFromBackend() {
    var studentId = localStorage.getItem("studentId");
    var url = BACKEND_ORDER_URL;

    // If student is logged in, fetch this specific student's orders
    if (studentId) {
        url = BACKEND_ORDER_URL + "/student/" + studentId;
    }

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }
            return response.json();
        })
        .then(function(orders) {
            displayOrders(orders);
        })
        .catch(function(error) {
            console.error("Error fetching orders:", error);
            var container = document.getElementById("ordersContainer");
            if (container) {
                container.innerHTML = 
                    '<div class="empty-orders-view">' +
                        '<div class="empty-icon">⚠️</div>' +
                        '<h3>Could Not Load Orders</h3>' +
                        '<p>Please ensure the Spring Boot backend server is running on port 8080.</p>' +
                    '</div>';
            }
        });
}

// Function to display order cards
function displayOrders(orders) {
    var container = document.getElementById("ordersContainer");
    var emptyView = document.getElementById("emptyOrdersView");

    if (!container) return;

    if (!orders || orders.length === 0) {
        if (emptyView) emptyView.style.display = "block";
        container.innerHTML = "";
        return;
    }

    if (emptyView) emptyView.style.display = "none";
    container.innerHTML = "";

    // Show latest orders first
    for (var i = orders.length - 1; i >= 0; i--) {
        var order = orders[i];

        var card = document.createElement("div");
        card.className = "order-card";

        var statusText = (order.status || "PLACED").toUpperCase();
        var statusClass = "status-" + statusText.toLowerCase();
        if (statusText === "PLACED") {
            statusClass = "status-pending"; // Uses existing CSS styling
        }

        var itemsHtml = "";
        if (order.items && order.items.length > 0) {
            for (var j = 0; j < order.items.length; j++) {
                var item = order.items[j];
                var itemSubtotal = item.price * item.quantity;
                itemsHtml += 
                    '<div class="order-item-line">' +
                        '<span>' + (item.foodName || ("Item #" + item.foodItemId)) + ' × ' + item.quantity + '</span>' +
                        '<span>₹' + itemSubtotal + '</span>' +
                    '</div>';
            }
        } else {
            itemsHtml = '<div class="order-item-line"><span>Canteen Food Items</span><span>₹' + order.totalAmount + '</span></div>';
        }

        card.innerHTML = 
            '<div class="order-card-header">' +
                '<div class="order-id-info">' +
                    '<h3>Order #' + order.id + '</h3>' +
                    '<span class="order-date">' + (order.orderDate || "Recent") + ' • Ordered by ' + (order.studentName || "Student") + '</span>' +
                '</div>' +
                '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
            '</div>' +
            '<div class="order-items-list">' +
                itemsHtml +
            '</div>' +
            '<div class="order-card-footer">' +
                '<span>Status: <strong>' + statusText + '</strong></span>' +
                '<span class="order-total-amount">Grand Total: ₹' + order.totalAmount + '</span>' +
            '</div>';

        container.appendChild(card);
    }
}

// Function to update cart badge count
function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }
    var badges = document.querySelectorAll("#cartCount");
    for (var j = 0; j < badges.length; j++) {
        badges[j].innerText = count;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    fetchOrdersFromBackend();
    updateCartCount();
});
