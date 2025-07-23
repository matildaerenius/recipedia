package com.matildaerenius.repository;

import com.matildaerenius.entity.ShoppingItem;
import com.matildaerenius.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    List<ShoppingItem> findByUser(User user);
}
