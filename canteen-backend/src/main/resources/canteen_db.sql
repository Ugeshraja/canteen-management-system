-- =====================================================
-- COLLEGE CANTEEN MANAGEMENT SYSTEM
-- MySQL Database Setup & Sample Data
-- Database Name: canteen_db
-- =====================================================

CREATE DATABASE IF NOT EXISTS canteen_db;
USE canteen_db;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- 2. Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    image VARCHAR(255) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT,
    student_name VARCHAR(100),
    order_date VARCHAR(50),
    total_amount DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLACED'
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    food_item_id BIGINT,
    food_name VARCHAR(100),
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Sample Students (Login with email/name and password: 1234)
INSERT INTO students (id, name, email, password) VALUES
(1, 'Arun Kumar', 'arun@gmail.com', '1234'),
(2, 'Priya Sharma', 'priya@gmail.com', '1234'),
(3, 'Karthik Raja', 'karthik@gmail.com', '1234')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Sample Food Items (Matching canteen menu images)
INSERT INTO food_items (id, name, category, description, price, image, available) VALUES
(1, 'Chicken Biriyani', 'Rice', 'Flavourful chicken biriyani served with traditional spices and gravy.', 120.0, 'images/chicken-biriyani.jpg', true),
(2, 'Chicken Noodles', 'Noodles', 'Fried noodles prepared with tender chicken and fresh vegetables.', 100.0, 'images/chicken-noodles.jpg', true),
(3, 'Parota', 'Snacks', 'Layered flaky flatbread served with hot delicious gravy.', 15.0, 'images/parota.jpg', true),
(4, 'Kothu Parota', 'Snacks', 'Shredded flatbread tossed with onions, eggs, and authentic spices.', 80.0, 'images/kothu-parota.jpg', true),
(5, 'Chicken Rice', 'Rice', 'Stir-fried rice loaded with juicy chicken chunks and seasonings.', 100.0, 'images/chicken-rice.jpg', true),
(6, 'Dosa', 'Breakfast', 'Crispy golden South Indian crepe served with chutneys and sambar.', 40.0, 'images/dosa.jpg', true),
(7, 'Veg Puffs', 'Snacks', 'Crispy baked puff pastry stuffed with spicy mixed vegetable filling.', 20.0, 'images/veg-puffs.jpg', true),
(8, 'Egg Puffs', 'Snacks', 'Golden flaky pastry filled with seasoned boiled egg.', 20.0, 'images/egg-puffs.jpg', true),
(9, 'Chicken Puffs', 'Snacks', 'Freshly baked puff stuffed with delicious spicy chicken masala.', 35.0, 'images/chicken-puffs.jpg', true)
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), image=VALUES(image);
