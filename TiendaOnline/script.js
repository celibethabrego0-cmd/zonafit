// ===================
// CARRITO
// ===================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===================
// SELECCIÓN TALLA / COLOR (POR PRODUCTO)
// ===================
document.querySelectorAll('.product').forEach(product => {

    product.querySelectorAll('.size').forEach(size => {
        size.addEventListener('click', () => {
            product.querySelectorAll('.size')
                .forEach(s => s.classList.remove('selected'));
            size.classList.add('selected');
        });
    });

    product.querySelectorAll('.color').forEach(color => {
        color.addEventListener('click', () => {
            product.querySelectorAll('.color')
                .forEach(c => c.classList.remove('selected'));
            color.classList.add('selected');
        });
    });

});

// ===================
// AÑADIR AL CARRITO (INTELIGENTE)
// ===================
document.querySelectorAll('.add-to-cart').forEach(button => {

    button.addEventListener('click', () => {

        const product = button.closest('.product');

        const sizeElement = product.querySelector('.size.selected');
        const colorElement = product.querySelector('.color.selected');

        const hasSizes = product.querySelectorAll('.size').length > 0;
        const hasColors = product.querySelectorAll('.color').length > 0;

        // VALIDACIONES
        if (hasSizes && !sizeElement) {
            alert("Selecciona una talla");
            return;
        }

        if (hasColors && !colorElement) {
            alert("Selecciona un color");
            return;
        }
        const img = product.querySelector("img");
        flyToCart(img);

        cart.push({
            name: button.dataset.name,
            price: Number(button.dataset.price),
            size: hasSizes ? sizeElement.textContent : null,
            color: hasColors ? colorElement.dataset.color : null,
            qty: 1
        });

        saveCart();
        showAddedMessage();
    });

});

// ===================
// GUARDAR Y ACTUALIZAR
// ===================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        container.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong><br>
                ${item.size ? `Talla: ${item.size}<br>` : ``}
                ${item.color ? `Color: ${item.color}<br>` : ``}
                Cantidad: ${item.qty}

                <div class="cart-controls">
                    <button onclick="changeQty(${index},1)">+</button>
                    <button onclick="changeQty(${index},-1)">−</button>
                    <button onclick="removeItem(${index})">🗑</button>
                </div>
            </div>
        `;
    });

    // ✅ TOTAL EN $
    document.getElementById("total").textContent = total.toFixed(2);

    // ✅ CONTADOR DE ARTÍCULOS
    document.getElementById("cart-count").textContent =
        cart.reduce((sum, item) => sum + item.qty, 0);
}

// ===================
// CONTROLES DE CANTIDAD
// ===================
function changeQty(index, value) {
    cart[index].qty += value;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

// ===================
// CHECKOUT (EMAIL)
// ===================
function openCheckout() {
    document.getElementById("checkout-modal").style.display = "block";
}

function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

// ===================
// SOPORTE
// ===================
function openSupport() {
    document.getElementById("support-modal").style.display = "block";
}

function closeSupport() {
    document.getElementById("support-modal").style.display = "none";
}

// ===================
// TABS / CATEGORÍAS
// ===================
function showTab(id, element) {
    document.querySelectorAll('.tab-content')
        .forEach(c => c.classList.remove('active'));

    document.querySelectorAll('.tab')
        .forEach(t => t.classList.remove('active'));

    document.getElementById(id).classList.add('active');
    element.classList.add('active');
}

// ===================
// BUSCADOR CON CAMBIO AUTOMÁTICO DE PESTAÑA
// ===================
const searchInput = document.querySelector('.search-bar input');

searchInput.addEventListener('keyup', () => {
    const value = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product');

    let foundTab = null;

    products.forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        const tab = product.dataset.tab;

        if (name.includes(value)) {
            product.style.display = "block";
            foundTab = tab;
        } else {
            product.style.display = "none";
        }
    });

    // activar pestaña automáticamente
    if (foundTab) {
        document.querySelectorAll('.tab-content')
            .forEach(c => c.classList.remove('active'));

        document.querySelectorAll('.tab')
            .forEach(t => t.classList.remove('active'));

        document.getElementById(foundTab).classList.add('active');
        document
            .querySelector(`.tab[onclick="showTab('${foundTab}')"]`)
            .classList.add('active');
    }

    // si el buscador está vacío → restaurar todo
    if (value === "") {
        products.forEach(p => p.style.display = "block");
        showTab('damas');
    }
});

// ===================
// CARGAR CARRITO AL INICIAR
// ===================
updateCart();

// ===============================
// CHECKOUT CON SELECTOR
// ===============================

// selector principal
function processCheckout() {


    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !phone || !email) {
        alert("Por favor completa nombre, teléfono y correo");
        return;
    }
    // Guardar datos del cliente para la factura
    const customer = {
        name,
        phone,
    email
};

localStorage.setItem("customer", JSON.stringify(customer));

    closeCheckout();
    document.getElementById("payment-modal").style.display = "block";
}

// ===================
// QR COMPARTIR PÁGINA
// ===================
let qrVisible = false;
let qrGenerated = false;

function toggleQR() {
    const box = document.getElementById("qr-container");

    qrVisible = !qrVisible;
    box.style.display = qrVisible ? "block" : "none";

    if (qrVisible && !qrGenerated) {
        new QRCode(document.getElementById("qrcode"), {
            text: window.location.href,
            width: 150,
            height: 150
        });
        qrGenerated = true;
    }
}

// ===================
// MENSAJE DE CONFIRMACIÓN
// ===================
function showConfirmation() {
    const box = document.getElementById("confirmation");
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 4000);
}
function showAddedMessage() {
    const box = document.getElementById("added-message");
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 2000);
}

function flyToCart(productImg) {
    const cartIcon = document.querySelector(".cart-icon");
    
    if(!cartIcon || !productImg) return;

    const img = productImg.cloneNode(true);

    const imgRect = productImg.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    img.classList.add("fly-img");
    img.style.top = imgRect.top + "px";
    img.style.left = imgRect.left + "px";

    document.body.appendChild(img);

    setTimeout(() => {
        img.style.top = cartRect.top + "px";
        img.style.left = cartRect.left + "px";
        img.style.width = "20px";
        img.style.opacity = "0";
    }, 50);

    setTimeout(() => img.remove(), 900);
}

function closePayment() {
    document.getElementById("payment-modal").style.display = "none";
}

function confirmPayment() {
    document.getElementById("payment-modal").style.display = "none";
    finishOrder();
}

// ===================
// FINALIZAR PEDIDO (FUNCIÓN ÚNICA)
// ===================
function finishOrder() {
    // generar factura antes de vaciar carrito
    generateInvoice();
    openInvoice();

    // vaciar carrito
    cart = [];
    localStorage.removeItem("cart");
    updateCart();

    // cerrar modales
    closeCheckout();
    closePayment();

    // mensaje final
    showConfirmation();
}

// ===================
// GENERAR RESUMEN / FACTURA
// ===================
function generateInvoice() {
    let invoiceHTML = `
        <h3>🧾 Resumen de compra</h3>
        <p><strong>Cliente:</strong> ${document.getElementById("name")?.value || "Cliente"}</p>
        <hr>
    `;

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;

        invoiceHTML += `
            <p>
                <strong>${item.name}</strong><br>
                ${item.size ? `Talla: ${item.size}<br>` : ""}
                ${item.color ? `Color: ${item.color}<br>` : ""}
                Cantidad: ${item.qty}<br>
                Precio: $${item.price.toFixed(2)}
            </p>
            <hr>
        `;
    });

    invoiceHTML += `<h4>Total: $${total.toFixed(2)}</h4>`;

    document.getElementById("invoice-content").innerHTML = invoiceHTML;
}
function openInvoice() {
    document.getElementById("invoice-modal").style.display = "block";
}

function closeInvoice() {
    document.getElementById("invoice-modal").style.display = "none";
}


