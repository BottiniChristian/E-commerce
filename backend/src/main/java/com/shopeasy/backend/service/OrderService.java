package com.shopeasy.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopeasy.backend.entities.Order;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final ObjectMapper mapper = new ObjectMapper();
    private final File file = new File("src/main/resources/orders.json");

    public synchronized void saveOrder(Order order) {
        try {
            List<Order> orders;

            if (file.exists()) {
                orders = mapper.readValue(file, new TypeReference<List<Order>>() {});
            } else {
                orders = new ArrayList<>();
            }

            orders.add(order);
            mapper.writerWithDefaultPrettyPrinter().writeValue(file, orders);

        } catch (Exception e) {
            throw new RuntimeException("Errore salvataggio ordine", e);
        }
    }

    public List<Order> getAllOrders() {
        try {
            if (!file.exists()) return new ArrayList<>();

            return mapper.readValue(file, new TypeReference<List<Order>>() {});

        } catch (Exception e) {
            throw new RuntimeException("Errore lettura ordini", e);
        }
    }
}
