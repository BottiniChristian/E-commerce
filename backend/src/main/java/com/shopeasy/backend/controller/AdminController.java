package com.shopeasy.backend.controller;

import com.shopeasy.backend.entities.Order;
import com.shopeasy.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AdminController {

    private final OrderService orderService;

    @Value("${admin.password}")
    private String adminPassword;

    private String sessionToken = null;

    public AdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestParam String password) {
        Map<String, String> res = new HashMap<>();

        if (!password.equals(adminPassword)) {
            res.put("success", "false");
            return res;
        }

        sessionToken = "ADMIN-" + System.currentTimeMillis();

        res.put("success", "true");
        res.put("token", sessionToken);

        return res;
    }

    @GetMapping("/check-session")
    public Map<String, String> checkSession(@RequestParam String token) {
        Map<String, String> res = new HashMap<>();
        res.put("valid", token != null && token.equals(sessionToken) ? "true" : "false");
        return res;
    }

    @GetMapping("/orders")
    public List<Order> getOrders(@RequestParam String token) {
        if (token == null || !token.equals(sessionToken)) {
            throw new RuntimeException("ACCESSO NEGATO");
        }
        return orderService.getAllOrders();
    }
}

