package com.canteen.controller;

import com.canteen.model.Order;
import com.canteen.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // 1. Place a new order (Student Cart Checkout)
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        // Auto-set current date/time if not provided
        if (order.getOrderDate() == null || order.getOrderDate().trim().isEmpty()) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy hh:mm a");
            order.setOrderDate(sdf.format(new Date()));
        }

        // Default order status
        if (order.getStatus() == null || order.getStatus().trim().isEmpty()) {
            order.setStatus("PLACED");
        }

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // 2. Get all orders (for Kitchen and Admin dashboard)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 3. Get previous orders for a specific student
    @GetMapping("/student/{studentId}")
    public List<Order> getOrdersByStudent(@PathVariable Long studentId) {
        return orderRepository.findByStudentId(studentId);
    }

    // 4. Get order details by order ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            return ResponseEntity.ok(orderOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Update order status (PLACED -> PREPARING -> READY -> COMPLETED)
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            String newStatus = statusUpdate.get("status");
            if (newStatus != null && !newStatus.trim().isEmpty()) {
                order.setStatus(newStatus.toUpperCase());
            }
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
