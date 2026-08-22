package com.canteen.config;

import com.canteen.model.FoodItem;
import com.canteen.model.Student;
import com.canteen.repository.FoodItemRepository;
import com.canteen.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final FoodItemRepository foodItemRepository;
    private final StudentRepository studentRepository;

    public DataInitializer(FoodItemRepository foodItemRepository, StudentRepository studentRepository) {
        this.foodItemRepository = foodItemRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        initializeFoodItems();
        initializeStudents();
    }

    private void initializeFoodItems() {
        List<FoodItem> initialFoods = Arrays.asList(
            new FoodItem("Chicken Biriyani", "Rice", "Flavourful chicken biriyani served with traditional spices.", 120.0, "images/chicken-biriyani.jpg", true),
            new FoodItem("Chicken Noodles", "Noodles", "Fried noodles prepared with chicken and fresh vegetables.", 100.0, "images/chicken-noodles.jpg", true),
            new FoodItem("Parota", "Snacks", "Layered flaky flatbread served with hot veg/non-veg gravy.", 30.0, "images/parota.jpg", true),
            new FoodItem("Kothu Parota", "Snacks", "Shredded flatbread tossed with onions, eggs, and spices.", 80.0, "images/kothu-parota.jpg", true),
            new FoodItem("Chicken Rice", "Rice", "Stir-fried rice loaded with juicy chicken chunks and seasonings.", 110.0, "images/chicken-rice.jpg", true),
            new FoodItem("Dosa", "Breakfast", "Crispy golden South Indian crepe served with chutneys and sambar.", 40.0, "images/dosa.jpg", true),
            new FoodItem("Veg Puffs", "Snacks", "Crispy baked puff pastry stuffed with spicy mixed vegetable filling.", 20.0, "images/veg-puffs.jpg", true),
            new FoodItem("Egg Puffs", "Snacks", "Golden flaky pastry filled with seasoned boiled egg.", 25.0, "images/egg-puffs.jpg", true),
            new FoodItem("Chicken Puffs", "Snacks", "Freshly baked puff stuffed with delicious chicken masala.", 35.0, "images/chicken-puffs.jpg", true)
        );

        for (FoodItem item : initialFoods) {
            if (!foodItemRepository.existsByNameIgnoreCase(item.getName())) {
                foodItemRepository.save(item);
                System.out.println("Initialized food item: " + item.getName());
            }
        }
    }

    private void initializeStudents() {
        if (!studentRepository.existsByEmail("arun@gmail.com")) {
            studentRepository.save(new Student("Arun Kumar", "arun@gmail.com", "1234"));
        }
        if (!studentRepository.existsByEmail("priya@gmail.com")) {
            studentRepository.save(new Student("Priya Sharma", "priya@gmail.com", "1234"));
        }
        if (!studentRepository.existsByEmail("karthik@gmail.com")) {
            studentRepository.save(new Student("Karthik Raja", "karthik@gmail.com", "1234"));
        }
    }
}
