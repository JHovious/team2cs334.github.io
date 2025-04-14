window.onload = function() {
    // Check if we're coming from a completed checkout
    if (localStorage.getItem("order_completed") === "true") {
        // Get order data from localStorage
        addOrderToTable();
        // Reset order completion
        localStorage.setItem("order_completed", "false");
    }
    
    // Display any existing orders from localStorage
    displayExistingOrders();
};

function addOrderToTable() {
    // Generate a unique order ID
    const orderId = generateOrderId();
    
    // Get current date for order date
    const orderDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get customer ID (or placeholder if not available)
    const customerId = localStorage.getItem("customer_id") || "Guest";
    
    // Get cart items to extract product details
    const cartArray = JSON.parse(localStorage.getItem("current_cart") || "[]");
    
    // Calculate totals
    const subtotal = parseFloat(localStorage.getItem("subtotal") || "0");
    const tax = calculateTax(subtotal);
    const totalAmount = (subtotal + tax).toFixed(2);
    
    // Get payment information (may be stored during checkout)
    const paymentMethod = localStorage.getItem("payment_method") || "Credit Card";
    
    // Generate a transaction ID
    const transactionId = "TX" + Math.floor(Math.random() * 1000000);
    
    // Get shipping information (may not be available)
    const shippingAddress = localStorage.getItem("shipping_address") || "";
    const shippingMethod = localStorage.getItem("shipping_method") || "Standard";
    
    // Generate tracking number
    const trackingNumber = "TRK" + Math.floor(Math.random() * 1000000);
    
    // Get any discounts or special instructions
    const discounts = localStorage.getItem("discounts") || "";
    const specialInstructions = localStorage.getItem("special_instructions") || "";
    
    // Get loyalty points (if available)
    const loyaltyPoints = Math.floor(subtotal); // Simple example: 1 point per dollar
    
    // Create object for the order
    const order = {
        orderId: orderId,
        orderDate: orderDate,
        customerId: customerId,
        productId: extractProductIds(cartArray),
        quantity: calculateTotalQuantity(cartArray),
        price: subtotal.toFixed(2),
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        shippingMethod: shippingMethod,
        trackingNumber: trackingNumber,
        discounts: discounts,
        specialInstructions: specialInstructions,
        loyaltyPoints: loyaltyPoints
    };
    
    // Store the order in localStorage
    saveOrderToStorage(order);
    
    // Add the order to the table
    addOrderRow(order);
}

function extractProductIds(cartArray) {
    // This is a simplification - we don't have actual product IDs in the cart system
    // Just creating a comma-separated list of product names
    let productNames = [];
    for (let item of cartArray) {
        if (localStorage.getItem(item)) {
            let name = item.substring(5); // Remove "cart_" prefix
            productNames.push(name);
        }
    }
    return productNames.join(", ");
}

function calculateTotalQuantity(cartArray) {
    let totalQty = 0;
    for (let item of cartArray) {
        if (localStorage.getItem(item)) {
            totalQty += parseInt(localStorage.getItem(item));
        }
    }
    return totalQty;
}

function saveOrderToStorage(order) {
    // Get existing orders or initialize empty array
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    // Add new order
    existingOrders.push(order);
    
    // Save back to localStorage
    localStorage.setItem("orders", JSON.stringify(existingOrders));
}

function displayExistingOrders() {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    // Clear any placeholder data
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";
    
    // Add each order to the table
    for (let order of orders) {
        addOrderRow(order);
    }
}

function addOrderRow(order) {
    const tableBody = document.querySelector("tbody");
    
    const row = document.createElement("tr");
    
    // Add cells for each field
    row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.orderDate}</td>
        <td>${order.customerId}</td>
        <td>${order.productId}</td>
        <td>${order.quantity}</td>
        <td>$${order.price}</td>
        <td>${order.paymentMethod}</td>
        <td>${order.transactionId}</td>
        <td>$${order.totalAmount}</td>
        <td>${order.shippingAddress}</td>
        <td>${order.shippingMethod}</td>
        <td>${order.trackingNumber}</td>
        <td>${order.discounts}</td>
        <td>${order.specialInstructions}</td>
        <td>${order.loyaltyPoints}</td>
    `;
    
    tableBody.appendChild(row);
}

function generateOrderId() {
    // Get existing orders to determine next ID
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    // If no orders exist, start with 001
    if (existingOrders.length === 0) {
        return "001";
    }
    
    // Otherwise, increment the highest existing ID
    const highestId = existingOrders.reduce((max, order) => {
        const id = parseInt(order.orderId);
        return id > max ? id : max;
    }, 0);
    
    // Format with leading zeros
    return (highestId + 1).toString().padStart(3, '0');
}

function calculateTax(subtotal) {
    // Using the same tax calculation from cart_Christian.js
    return subtotal * 0.07;
}

// Function to be called from checkout.html when an order is completed
function completeOrder() {
    // Store payment and shipping information from form fields
    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;
    const email = document.getElementById("email").value;
    
    // Save customer information
    localStorage.setItem("customer_name", firstName + " " + lastName);
    localStorage.setItem("customer_email", email);
    
    // Set payment method based on form
    localStorage.setItem("payment_method", "Credit Card");
    
    // Mark order as completed
    localStorage.setItem("order_completed", "true");
    
    // Additional processing can be done here
    
    // Clear cart after order is completed
    clearCart();
    
    // Redirect to orders page
    // window.location.href = "Orders.html";
}

function clearCart() {
    // Get current cart items
    const cartArray = JSON.parse(localStorage.getItem("current_cart") || "[]");
    
    // Remove each item from localStorage
    for (let item of cartArray) {
        localStorage.removeItem(item);
    }
    
    // Clear cart array and length
    localStorage.removeItem("current_cart");
    localStorage.removeItem("cart_length");
    localStorage.removeItem("subtotal");
}