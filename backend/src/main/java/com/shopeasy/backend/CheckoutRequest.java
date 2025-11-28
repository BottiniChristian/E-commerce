package com.shopeasy.backend;

import java.util.List;

public class CheckoutRequest {

    private CustomerData customer;
    private List<CartItem> items;

    public CustomerData getCustomer() { return customer; }
    public List<CartItem> getItems() { return items; }

    public void setCustomer(CustomerData customer) { this.customer = customer; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public static class CustomerData {
        private String name;
        private String email;
        private String phone;
        private String address;
        private String zip;
        private String city;
        private String country;
    }

    public static class CartItem {
        private String productId;
        private int qty;
        private String color;

        public String getProductId() { return productId; }
        public int getQty() { return qty; }
        public String getColor() { return color; }

        public void setProductId(String productId) { this.productId = productId; }
        public void setQty(int qty) { this.qty = qty; }
        public void setColor(String color) { this.color = color; }
    }
}

