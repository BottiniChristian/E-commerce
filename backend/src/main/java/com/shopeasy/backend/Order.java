package com.shopeasy.backend;

import lombok.Data;
import java.util.List;

@Data
public class Order {

    private String id;           // ID univoco ordine
    private String name;         // Nome cliente
    private String email;        // Email cliente
    private String phone;        // Telefono
    private String address;      // Indirizzo
    private String zip;          // CAP
    private String city;         // Città
    private String country;      // Paese

    private double total;        // Totale ordine
    private String createdAt;    // Data creazione ISO

    private List<OrderItem> items;  // Lista prodotti acquistati
}
