package com.shopeasy.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AdminController {

    @Value("${admin.password}")
    private String adminPassword;

    private final OrderService orderService;

    public AdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String password) {
        boolean ok = password.equals(adminPassword);
        return Map.of("success", ok);
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}

