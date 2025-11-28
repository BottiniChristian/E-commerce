package com.shopeasy.backend;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private static final String FILE_PATH = "src/main/resources/orders.json";

    private final Gson gson = new Gson();

    public void saveOrder(Order order) {

        List<Order> orders = getAllOrders();

        orders.add(order);

        try (FileWriter writer = new FileWriter(FILE_PATH)) {
            gson.toJson(orders, writer);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Order> getAllOrders() {
        try {
            if (!Files.exists(Paths.get(FILE_PATH))) {
                return new ArrayList<>();
            }
            String json = Files.readString(Paths.get(FILE_PATH));
            Type listType = new TypeToken<List<Order>>(){}.getType();
            return gson.fromJson(json, listType);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
