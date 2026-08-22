/*
=====================================================
 COLLEGE CANTEEN MANAGEMENT SYSTEM
 Kitchen Dashboard Script (kitchen.js)
 Connected to Spring Boot Backend API
=====================================================
*/

var BACKEND_ORDERS_URL =
    "https://canteen-management-system-s4gw.onrender.com/api/orders";

function fetchKitchenOrders() {
    fetch(BACKEND_ORDERS_URL)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch kitchen orders");
            }
            return response.json();
        })
        .then(function(orders) {
            renderKitchenBoard(orders);
        })
        .catch(function(error) {
            console.error("Kitchen fetch error:", error);
        });
}

function renderKitchenBoard(orders) {
    var pendingContainer = document.getElementById("pendingOrders");
    var preparingContainer = document.getElementById("preparingOrders");
    var readyContainer = document.getElementById("readyOrders");
    var completedContainer = document.getElementById("completedOrders");

    if (!pendingContainer || !preparingContainer || !readyContainer || !completedContainer) {
        return;
    }

    pendingContainer.innerHTML = "";
    preparingContainer.innerHTML = "";
    readyContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    var pendingCount = 0;
    var preparingCount = 0;
    var readyCount = 0;
    var completedCount = 0;

    for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        var card = createKitchenCard(order);
        var st = (order.status || "").toUpperCase();

        if (st === "PLACED" || st === "PENDING") {
            pendingContainer.appendChild(card);
            pendingCount++;
        } else if (st === "PREPARING") {
            preparingContainer.appendChild(card);
            preparingCount++;
        } else if (st === "READY") {
            readyContainer.appendChild(card);
            readyCount++;
        } else if (st === "COMPLETED") {
            completedContainer.appendChild(card);
            completedCount++;
        }
    }

    document.getElementById("pendingCount").innerText = pendingCount;
    document.getElementById("preparingCount").innerText = preparingCount;
    document.getElementById("readyCount").innerText = readyCount;
    document.getElementById("completedCount").innerText = completedCount;

    if (pendingCount === 0) pendingContainer.innerHTML = '<div class="no-orders-note">No new placed orders</div>';
    if (preparingCount === 0) preparingContainer.innerHTML = '<div class="no-orders-note">No orders currently preparing</div>';
    if (readyCount === 0) readyContainer.innerHTML = '<div class="no-orders-note">No orders ready for pickup</div>';
    if (completedCount === 0) completedContainer.innerHTML = '<div class="no-orders-note">No completed orders yet</div>';
}

function createKitchenCard(order) {
    var card = document.createElement("div");
    var st = (order.status || "PLACED").toUpperCase();
    var cardClass = "card-pending";
    if (st === "PREPARING") cardClass = "card-preparing";
    if (st === "READY") cardClass = "card-ready";
    if (st === "COMPLETED") cardClass = "card-completed";

    card.className = "kitchen-card " + cardClass;

    var itemsListHtml = "";
    if (order.items && order.items.length > 0) {
        for (var j = 0; j < order.items.length; j++) {
            var itm = order.items[j];
            itemsListHtml += '<li><span>' + (itm.foodName || ("Item #" + itm.foodItemId)) + '</span> <span class="item-qty">× ' + itm.quantity + '</span></li>';
        }
    } else {
        itemsListHtml = '<li><span>Canteen Meal</span> <span class="item-qty">× 1</span></li>';
    }

    var actionBtnHtml = "";
    if (st === "PLACED" || st === "PENDING") {
        actionBtnHtml = '<button class="btn-kitchen-action btn-start-prep" onclick="updateOrderStatus(' + order.id + ', \'PREPARING\')">Start Preparing</button>';
    } else if (st === "PREPARING") {
        actionBtnHtml = '<button class="btn-kitchen-action btn-mark-ready" onclick="updateOrderStatus(' + order.id + ', \'READY\')">Mark Ready</button>';
    } else if (st === "READY") {
        actionBtnHtml = '<button class="btn-kitchen-action btn-mark-complete" onclick="updateOrderStatus(' + order.id + ', \'COMPLETED\')">Complete Order</button>';
    } else {
        actionBtnHtml = '<span style="font-size: 12px; color: #7f8c8d; font-weight: bold;">Completed</span>';
    }

    card.innerHTML = 
        '<div class="kitchen-card-header">' +
            '<div>' +
                '<div class="kitchen-order-id">Order #' + order.id + '</div>' +
                '<div class="kitchen-student-name">Student: ' + (order.studentName || "Customer") + '</div>' +
            '</div>' +
            '<div class="kitchen-time">' + (order.orderDate || "") + '</div>' +
        '</div>' +
        '<ul class="kitchen-items-list">' +
            itemsListHtml +
        '</ul>' +
        '<div class="kitchen-card-footer">' +
            '<div class="kitchen-order-total">Total: ₹' + order.totalAmount + '</div>' +
            actionBtnHtml +
        '</div>';

    return card;
}

function updateOrderStatus(orderId, newStatus) {
    fetch(BACKEND_ORDERS_URL + "/" + orderId + "/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Failed to update status");
        }
        return response.json();
    })
    .then(function(data) {
        fetchKitchenOrders();
    })
    .catch(function(error) {
        alert("Status update failed: " + error.message);
    });
}

function checkKitchenAuth() {
    var loggedIn = localStorage.getItem("loggedIn") === "true";
    var userType = localStorage.getItem("userType");
    if (!loggedIn || userType !== "kitchen") {
        alert("Access Denied. Please login as Kitchen Staff.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function() {
    if (!checkKitchenAuth()) return;

    fetchKitchenOrders();
    // Auto-refresh every 8 seconds for live kitchen updates
    setInterval(fetchKitchenOrders, 8000);
});
