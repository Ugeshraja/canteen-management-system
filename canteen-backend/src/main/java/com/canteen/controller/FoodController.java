package com.canteen.controller;

import com.canteen.model.FoodItem;
import com.canteen.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    // 1. Get all food items
    @GetMapping
    public List<FoodItem> getAllFoods() {
        return foodItemRepository.findAll();
    }

    // 2. Get single food item by ID
    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodById(@PathVariable Long id) {
        Optional<FoodItem> foodOptional = foodItemRepository.findById(id);
        if (foodOptional.isPresent()) {
            return ResponseEntity.ok(foodOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 3. Add a new food item (Admin)
    @PostMapping
    public ResponseEntity<FoodItem> addFood(@RequestBody FoodItem foodItem) {
        FoodItem savedFood = foodItemRepository.save(foodItem);
        return ResponseEntity.ok(savedFood);
    }

    // 4. Update an existing food item (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFood(@PathVariable Long id, @RequestBody FoodItem updatedFood) {
        Optional<FoodItem> foodOptional = foodItemRepository.findById(id);
        if (foodOptional.isPresent()) {
            FoodItem food = foodOptional.get();
            food.setName(updatedFood.getName());
            food.setCategory(updatedFood.getCategory());
            food.setDescription(updatedFood.getDescription());
            food.setPrice(updatedFood.getPrice());
            food.setImage(updatedFood.getImage());
            food.setAvailable(updatedFood.isAvailable());

            FoodItem savedFood = foodItemRepository.save(food);
            return ResponseEntity.ok(savedFood);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Delete a food item (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        if (foodItemRepository.existsById(id)) {
            foodItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
