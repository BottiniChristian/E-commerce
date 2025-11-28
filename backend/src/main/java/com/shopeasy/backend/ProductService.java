package com.shopeasy.backend;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ProductService {

    private final Map<String, Product> products = new HashMap<>();

    public ProductService() {
        // ID DEVONO COINCIDERE CON QUELLI DEL FRONTEND (products.js)
        products.put("bag-001", new Product("bag-001", "Bag", 24.99));
        products.put("bag-002", new Product("bag-002", "Logo Bag", 34.99));
        products.put("bag-003", new Product("bag-003", "Logo Bag Premium", 44.99));
        products.put("hat-001", new Product("hat-001", "Summer Hat", 19.99));
    }

    public Product getProduct(String id) {
        return products.get(id);
    }

    public Map<String, Product> getAllProducts() {
        return products;
    }
}

