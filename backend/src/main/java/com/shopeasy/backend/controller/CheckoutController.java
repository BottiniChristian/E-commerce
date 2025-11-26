package com.shopeasy.backend.controller;

import com.shopeasy.backend.entities.CheckoutRequest;
import com.shopeasy.backend.entities.Product;
import com.shopeasy.backend.entities.Order;
import com.shopeasy.backend.service.ProductService;
import com.shopeasy.backend.service.OrderService;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CheckoutController {   //  FIX !!!

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${frontend.url}")
    private String frontendUrl;

    private final ProductService productService;
    private final OrderService orderService;

    public CheckoutController(ProductService productService, OrderService orderService) {
        this.productService = productService;
        this.orderService = orderService;
    }

    @PostMapping("/save-order")
    public String saveOrder(@RequestBody Order order) {
        orderService.saveOrder(order);
        return "Ordine salvato";
    }

    @PostMapping("/checkout")
    public String checkout(@RequestBody CheckoutRequest request) throws StripeException {

        Stripe.apiKey = stripeSecretKey;

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (CheckoutRequest.CartItem item : request.getItems()) {

            Product product = productService.getProduct(item.getProductId());
            if (product == null)
                throw new RuntimeException("Product not found: " + item.getProductId());

            lineItems.add(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity((long) item.getQty())
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("eur")
                                            .setUnitAmount((long) (product.getPrice() * 100))
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData
                                                            .builder()
                                                            .setName(product.getName())
                                                            .build()
                                            )
                                            .build()
                            )
                            .build()
            );
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/success.html")
                .setCancelUrl(frontendUrl + "/cancel.html")
                .addAllLineItem(lineItems)
                .build();

        Session session = Session.create(params);

        return session.getUrl();
    }
}

