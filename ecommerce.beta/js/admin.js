// ========================================
//  PROTEZIONE ACCESSO ADMIN
// ========================================
if (localStorage.getItem("adminLogged") !== "true") {
    window.location.href = "admin-login.html";
}

// ========================================
//  LOGOUT
// ========================================
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("adminLogged");
    window.location.href = "admin-login.html";
});

// ========================================
//  CARICAMENTO ORDINI
// ========================================
async function loadOrders() {
    const table = document.getElementById("ordersTable");
    table.innerHTML = `
        <tr><td colspan="8" class="text-center text-muted">Caricamento...</td></tr>
    `;

    try {
        const res = await fetch("http://localhost:8080/api/admin/orders");
        const orders = await res.json();

        if (!orders.length) {
            table.innerHTML = `
                <tr><td colspan="8" class="text-center text-muted">Nessun ordine trovato.</td></tr>
            `;
            return;
        }

        table.innerHTML = "";

        orders.forEach(o => {
            let productsHTML = "";

            if (o.items && o.items.length) {
                productsHTML = o.items.map(i => `
                    <div>
                        <b>${i.productId}</b> — qty: ${i.qty}
                        ${i.color ? `<span style="color:gray">(${i.color})</span>` : ""}
                    </div>
                `).join("");
            } else {
                productsHTML = "<em class='text-muted'>Nessun dato</em>";
            }

            table.innerHTML += `
                <tr>
                    <td>${o.orderId}</td>

                    <td>
                        ${o.name}<br>
                        <small class="text-muted">${o.email}</small>
                    </td>

                    <td>
                        ${o.address}<br>
                        ${o.city} (${o.zip})<br>
                        ${o.country}
                    </td>

                    <td>${o.phone}</td>

                    <td>€ ${o.total?.toFixed(2)}</td>

                    <td>${o.date}</td>

                    <td>${productsHTML}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        table.innerHTML = `
            <tr><td colspan="8" class="text-danger text-center">Errore nel caricare gli ordini.</td></tr>
        `;
    }
}

loadOrders();

