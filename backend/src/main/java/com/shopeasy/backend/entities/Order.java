package com.shopeasy.backend.entities;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Order {

    private String orderId;
    private CheckoutRequest.CustomerData customer;
    private List<CheckoutRequest.CartItem> items;
    private double subtotal;
    private double shipping;
    private double total;
    private LocalDateTime createdAt;
    private String stripeSessionId;
}
