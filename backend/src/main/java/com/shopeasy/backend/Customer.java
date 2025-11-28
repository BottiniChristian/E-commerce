package com.shopeasy.backend;

import lombok.Data;

@Data
public class Customer {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String zip;
    private String city;
    private String country;
}
