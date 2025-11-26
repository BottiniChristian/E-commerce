package com.shopeasy.backend.entities;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {

    private CustomerData customer;
    private List<CartItem> items;

    @Data
    public static class CustomerData {
        private String name;
        private String email;
        private String phone;
        private String address;
        private String zip;
        private String city;
        private String country;
    }

    @Data
    public static class CartItem {
        private String productId;
        private int qty;
        private String color;
    }
}
