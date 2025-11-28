package com.shopeasy.backend;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItem {
    private String productId;
    private int qty;
    private double price;
}
