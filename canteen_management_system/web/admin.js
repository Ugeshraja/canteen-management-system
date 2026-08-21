/*
=====================================================
 COLLEGE CANTEEN MANAGEMENT SYSTEM
 Admin Dashboard Script (admin.js)
 Connected to Spring Boot Backend API
=====================================================
*/

var BACKEND_FOODS_URL =
    "https://canteen-management-system-s4gw.onrender.com/api/foods";

var BACKEND_ORDERS_URL =
    "https://canteen-management-system-s4gw.onrender.com/api/orders";

var currentAdminFoods = [];
var currentAdminOrders = [];

// 1. Load Dashboard Statistics & Data from Backend
function loadAdminDashboard() {
    // Fetch Foods
    fetch(BACKEND_FOODS_URL)
        .then(function(res) { return res.json(); })
        .then(function(foods) {
            currentAdminFoods = foods;
            renderMenuTable();
            updateStats();
        })
        .catch(function(err) { console.error("Foods API error:", err); });

    // Fetch Orders
    fetch(BACKEND_ORDERS_URL)
        .then(function(res) { return res.json(); })
        .then(function(orders) {
            currentAdminOrders = orders;
            renderOrdersTable();
            updateStats();
        })
        .catch(function(err) { console.error("Orders API error:", err); });
}

function updateStats() {
    var activeMenuItems = 0;
    for (var i = 0; i < currentAdminFoods.length; i++) {
        if (currentAdminFoods[i].available) activeMenuItems++;
    }

    var totalOrders = currentAdminOrders.length;
    var totalRevenue = 0;
    var pendingOrders = 0;

    for (var j = 0; j < currentAdminOrders.length; j++) {
        totalRevenue += (currentAdminOrders[j].totalAmount || 0);
        var st = (currentAdminOrders[j].status || "").toUpperCase();
        if (st === "PLACED" || st === "PENDING" || st === "PREPARING") {
            pendingOrders++;
        }
    }

    var totalRevEl = document.getElementById("statTotalRevenue");
    var totalOrdEl = document.getElementById("statTotalOrders");
    var activeMenuEl = document.getElementById("statActiveMenu");
    var pendingOrdEl = document.getElementById("statPendingOrders");

    if (totalRevEl) totalRevEl.innerText = "₹" + totalRevenue;
    if (totalOrdEl) totalOrdEl.innerText = totalOrders;
    if (activeMenuEl) activeMenuEl.innerText = activeMenuItems;
    if (pendingOrdEl) pendingOrdEl.innerText = pendingOrders;
}

// 2. Render Menu Items Table
function renderMenuTable() {
    var tbody = document.getElementById("menuTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    for (var i = 0; i < currentAdminFoods.length; i++) {
        var item = currentAdminFoods[i];
        var tr = document.createElement("tr");

        var stockBadge = item.available 
            ? '<span class="badge-stock in-stock">In Stock</span>' 
            : '<span class="badge-stock out-stock">Out of Stock</span>';

        var toggleBtnText = item.available ? "Set Out of Stock" : "Set In Stock";

        tr.innerHTML = 
            '<td><img src="' + item.image + '" alt="' + item.name + '" class="table-food-img"></td>' +
            '<td><strong>' + item.name + '</strong></td>' +
            '<td>' + item.category + '</td>' +
            '<td>₹' + item.price + '</td>' +
            '<td>' + stockBadge + '</td>' +
            '<td>' +
                '<div class="action-buttons">' +
                    '<button class="btn-action-edit" onclick="editFoodItem(' + item.id + ')">Edit</button>' +
                    '<button class="btn-action-toggle" onclick="toggleAvailability(' + item.id + ')">' + toggleBtnText + '</button>' +
                    '<button class="btn-action-delete" onclick="deleteFoodItem(' + item.id + ')">Delete</button>' +
                '</div>' +
            '</td>';

        tbody.appendChild(tr);
    }
}

// Show/Hide Add Food Form
function showAddFoodForm() {
    var formCard = document.getElementById("foodFormCard");
    var form = document.getElementById("foodForm");
    var formTitle = document.getElementById("formTitle");
    var editIdInput = document.getElementById("editFoodId");

    if (formCard) {
        formCard.style.display = "block";
        form.reset();
        editIdInput.value = "";
        formTitle.innerText = "Add New Food Item";
        window.scrollTo({ top: formCard.offsetTop - 20, behavior: 'smooth' });
    }
}

function cancelFoodForm() {
    var formCard = document.getElementById("foodFormCard");
    if (formCard) formCard.style.display = "none";
}

// Save or Update food item via Spring Boot API
function handleFoodSubmit(event) {
    event.preventDefault();

    var editId = document.getElementById("editFoodId").value;
    var name = document.getElementById("foodName").value.trim();
    var category = document.getElementById("foodCategory").value;
    var price = parseFloat(document.getElementById("foodPrice").value);
    var image = document.getElementById("foodImage").value.trim() || "images/chicken-biriyani.jpg";
    var description = document.getElementById("foodDescription").value.trim();
    var available = document.getElementById("foodAvailability").value === "true";

    var foodPayload = {
        name: name,
        category: category,
        price: price,
        image: image,
        description: description,
        available: available
    };

    if (editId) {
        // PUT /api/foods/{id}
        fetch(BACKEND_FOODS_URL + "/" + editId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(foodPayload)
        })
        .then(function(res) {
            if (!res.ok) throw new Error("Failed to update food item");
            return res.json();
        })
        .then(function(updated) {
            alert("Food item updated successfully!");
            cancelFoodForm();
            loadAdminDashboard();
        })
        .catch(function(err) { alert("Error: " + err.message); });
    } else {
        // POST /api/foods
        fetch(BACKEND_FOODS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(foodPayload)
        })
        .then(function(res) {
            if (!res.ok) throw new Error("Failed to add food item");
            return res.json();
        })
        .then(function(saved) {
            alert("New food item added successfully!");
            cancelFoodForm();
            loadAdminDashboard();
        })
        .catch(function(err) { alert("Error: " + err.message); });
    }
}

// Edit food item
function editFoodItem(id) {
    var item = null;
    for (var i = 0; i < currentAdminFoods.length; i++) {
        if (currentAdminFoods[i].id === id) {
            item = currentAdminFoods[i];
            break;
        }
    }
    if (!item) return;

    var formCard = document.getElementById("foodFormCard");
    var formTitle = document.getElementById("formTitle");

    document.getElementById("editFoodId").value = item.id;
    document.getElementById("foodName").value = item.name;
    document.getElementById("foodCategory").value = item.category;
    document.getElementById("foodPrice").value = item.price;
    document.getElementById("foodImage").value = item.image;
    document.getElementById("foodDescription").value = item.description || "";
    document.getElementById("foodAvailability").value = item.available ? "true" : "false";

    formTitle.innerText = "Edit Food Item: " + item.name;
    formCard.style.display = "block";
    window.scrollTo({ top: formCard.offsetTop - 20, behavior: 'smooth' });
}

// Toggle availability
function toggleAvailability(id) {
    var item = null;
    for (var i = 0; i < currentAdminFoods.length; i++) {
        if (currentAdminFoods[i].id === id) {
            item = currentAdminFoods[i];
            break;
        }
    }
    if (!item) return;

    var updatedPayload = {
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        description: item.description,
        available: !item.available
    };

    fetch(BACKEND_FOODS_URL + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload)
    })
    .then(function(res) {
        if (!res.ok) throw new Error("Failed to toggle availability");
        return res.json();
    })
    .then(function(data) {
        loadAdminDashboard();
    })
    .catch(function(err) { alert("Error: " + err.message); });
}

// Delete food item
function deleteFoodItem(id) {
    if (!confirm("Are you sure you want to delete this food item?")) return;

    fetch(BACKEND_FOODS_URL + "/" + id, {
        method: "DELETE"
    })
    .then(function(res) {
        if (res.ok) {
            alert("Food item deleted successfully!");
            loadAdminDashboard();
        } else {
            alert("Failed to delete food item.");
        }
    })
    .catch(function(err) { alert("Delete error: " + err.message); });
}

// 3. Render Orders Table
function renderOrdersTable() {
    var filter = document.getElementById("statusFilter") ? document.getElementById("statusFilter").value : "All";
    var tbody = document.getElementById("orderTableBody");

    if (!tbody) return;
    tbody.innerHTML = "";

    var filteredOrders = currentAdminOrders.filter(function(order) {
        if (filter === "All") return true;
        var st = (order.status || "").toUpperCase();
        if (filter === "Pending" && (st === "PLACED" || st === "PENDING")) return true;
        return st === filter.toUpperCase();
    });

    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 25px; color: #888;">No orders found for the selected status.</td></tr>';
        return;
    }

    for (var i = filteredOrders.length - 1; i >= 0; i--) {
        var order = filteredOrders[i];
        var tr = document.createElement("tr");

        var itemsStr = "";
        if (order.items && order.items.length > 0) {
            for (var j = 0; j < order.items.length; j++) {
                itemsStr += (order.items[j].foodName || ("Item #" + order.items[j].foodItemId)) + " (" + order.items[j].quantity + ")";
                if (j < order.items.length - 1) itemsStr += ", ";
            }
        } else {
            itemsStr = "Canteen Food Items";
        }

        var statusOptions = ['PLACED', 'PREPARING', 'READY', 'COMPLETED'];
        var currentSt = (order.status || "PLACED").toUpperCase();
        var selectHtml = '<select class="status-select" onchange="changeAdminOrderStatus(' + order.id + ', this.value)">';
        for (var k = 0; k < statusOptions.length; k++) {
            var st = statusOptions[k];
            var selected = (st === currentSt) ? "selected" : "";
            selectHtml += '<option value="' + st + '" ' + selected + '>' + st + '</option>';
        }
        selectHtml += '</select>';

        tr.innerHTML = 
            '<td><strong>#' + order.id + '</strong></td>' +
            '<td>' + (order.studentName || "Customer") + '</td>' +
            '<td>' + itemsStr + '</td>' +
            '<td>₹' + order.totalAmount + '</td>' +
            '<td>' + (order.orderDate || "Recent") + '</td>' +
            '<td>' + selectHtml + '</td>';

        tbody.appendChild(tr);
    }
}

function changeAdminOrderStatus(orderId, newStatus) {
    fetch(BACKEND_ORDERS_URL + "/" + orderId + "/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    })
    .then(function(res) {
        if (!res.ok) throw new Error("Status update failed");
        return res.json();
    })
    .then(function(updatedOrder) {
        alert("Order #" + orderId + " status updated to: " + newStatus);
        loadAdminDashboard();
    })
    .catch(function(err) { alert("Error: " + err.message); });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    loadAdminDashboard();

    var form = document.getElementById("foodForm");
    if (form) form.addEventListener("submit", handleFoodSubmit);
});
