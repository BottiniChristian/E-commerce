package com.shopeasy.backend.service;

import com.shopeasy.backend.entities.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final List<Product> products = List.of(
            new Product("bag-001", "Bag", 24.99),
            new Product("bag-002", "Logo Bag", 34.99),
            new Product("bag-003", "Logo Bag", 44.99),
            new Product("hat-001", "Summer Hat", 19.99)
    );

    public Product getProduct(String id) {
        return products.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
