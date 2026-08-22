package com.canteen.repository;

import com.canteen.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByCategory(String category);
    List<FoodItem> findByAvailable(boolean available);
    boolean existsByNameIgnoreCase(String name);
    Optional<FoodItem> findByNameIgnoreCase(String name);
}
