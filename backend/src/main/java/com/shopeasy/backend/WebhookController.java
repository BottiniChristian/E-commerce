package com.shopeasy.backend;

import com.stripe.model.Event;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class WebhookController {

    @Value("${stripe.webhook-secret}")
    private String endpointSecret;

    @PostMapping("/webhook")
    public String handleStripeWebhook(@RequestBody String payload,
                                      @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;

        try {
            // Verifica della firma del webhook
            event = Webhook.constructEvent(
                    payload,
                    sigHeader,
                    endpointSecret
            );
            System.out.println("✅ Webhook Stripe ricevuto: " + event.getType());
        } catch (Exception e) {
            System.out.println("❌ Errore nel webhook Stripe: " + e.getMessage());
            return "";
        }

        // Per ora non facciamo altro, rispondiamo OK a Stripe
        return "ok";
    }
}


