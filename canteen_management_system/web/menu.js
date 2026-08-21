/*
=====================================================
 COLLEGE CANTEEN MANAGEMENT SYSTEM
 Menu Script (menu.js)
 Connected to Spring Boot Backend API
=====================================================
*/

var BACKEND_URL = "http://localhost:8080/api/foods";
var foodItemsList = [];
var currentCategory = "all";

// Function to fetch food items from Spring Boot Backend
function loadMenuFromBackend() {
    fetch(BACKEND_URL)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Failed to fetch food items from server");
            }
            return response.json();
        })
        .then(function(foods) {
            foodItemsList = foods;
            applyFilters();
        })
        .catch(function(error) {
            console.error("Error loading menu:", error);
            var container = document.getElementById("foodGrid");
            if (container) {
                container.innerHTML = 
                    '<div class="no-items-message">' +
                        '<h3>Backend Not Connected</h3>' +
                        '<p>Please start the Spring Boot backend on port 8080 to view the menu items from MySQL database.</p>' +
                    '</div>';
            }
        });
}

// Function to render food items into grid
function displayMenu(items) {
    var container = document.getElementById("foodGrid");
    if (!container) return;

    container.innerHTML = "";

    if (!items || items.length === 0) {
        container.innerHTML = 
            '<div class="no-items-message">' +
                '<h3>No food items found</h3>' +
                '<p>Try searching for another dish or selecting a different category.</p>' +
            '</div>';
        return;
    }

    for (var i = 0; i < items.length; i++) {
        var food = items[i];
        var card = document.createElement("div");
        card.className = "food-card";

        var actionButton = food.available 
            ? '<button class="btn-add-cart" onclick="addToCart(' + food.id + ')">Add to Cart</button>'
            : '<span class="out-of-stock-badge">Out of Stock</span>';

        card.innerHTML = 
            '<div class="food-card-image-box">' +
                '<img src="' + food.image + '" alt="' + food.name + '" class="food-card-img">' +
                '<span class="food-card-badge">' + food.category + '</span>' +
            '</div>' +
            '<div class="food-card-body">' +
                '<span class="food-category">' + food.category + '</span>' +
                '<h3 class="food-title">' + food.name + '</h3>' +
                '<p class="food-desc">' + (food.description || "") + '</p>' +
                '<div class="food-card-footer">' +
                    '<span class="food-price">₹' + food.price + '</span>' +
                    actionButton +
                '</div>' +
            '</div>';

        container.appendChild(card);
    }
}

// Function to filter food by category
function filterCategory(category, buttonElement) {
    currentCategory = category;
    var allButtons = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove("active");
    }
    if (buttonElement) {
        buttonElement.classList.add("active");
    }

    applyFilters();
}

// Function to search food by name
function searchFood() {
    applyFilters();
}

// Combined filter and search logic
function applyFilters() {
    var searchInput = document.getElementById("foodSearch");
    var searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";

    var filteredItems = foodItemsList.filter(function(item) {
        var matchCategory = (currentCategory === "all" || item.category.toLowerCase() === currentCategory.toLowerCase());
        var matchSearch = item.name.toLowerCase().indexOf(searchText) !== -1 || (item.description && item.description.toLowerCase().indexOf(searchText) !== -1);
        return matchCategory && matchSearch;
    });

    displayMenu(filteredItems);
}

// Function to add an item to the cart (localStorage)
function addToCart(foodId) {
    var selectedItem = null;

    for (var i = 0; i < foodItemsList.length; i++) {
        if (foodItemsList[i].id === foodId) {
            selectedItem = foodItemsList[i];
            break;
        }
    }

    if (!selectedItem) {
        alert("Item not found.");
        return;
    }

    var cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
    var existingIndex = -1;

    for (var j = 0; j < cart.length; j++) {
        if (cart[j].id === foodId) {
            existingIndex = j;
            break;
        }
    }

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: selectedItem.id,
            name: selectedItem.name,
            category: selectedItem.category,
            price: selectedItem.price,
            image: selectedItem.image,
            quantity: 1
        });
    }

    localStorage.setItem("canteenCart", JSON.stringify(cart));
    updateCartCount();
    alert(selectedItem.name + " added to cart!");
}

// Function to update cart count badge in navigation
function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem("canteenCart")) || [];
    var totalCount = 0;

    for (var i = 0; i < cart.length; i++) {
        totalCount += cart[i].quantity;
    }

    var cartCountElements = document.querySelectorAll("#cartCount");
    for (var j = 0; j < cartCountElements.length; j++) {
        cartCountElements[j].innerText = totalCount;
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    loadMenuFromBackend();
    updateCartCount();
});
