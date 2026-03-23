/* ==========================================
   VELVET BEANS - MAIN JAVASCRIPT
   ========================================== */

// STEP 1: Define the Menu Data
// This stores all our products, prices, and high-quality image links.
const menuData = {
    beverages: [
        { id: 1, name: 'Cappuccino', price: 4.5, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500' },
        { id: 2, name: 'Latte', price: 4.0, img: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=500' }, 
        { id: 9, name: 'Macchiato', price: 3.5, img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500' },
        { id: 10, name: 'Frappuccino', price: 5.5, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500' },
        { id: 11, name: 'Black Tea', price: 2.5, img: 'https://images.unsplash.com/photo-1594631252845-59fc99739785?w=500' },
        { id: 12, name: 'Lemon Tea', price: 3.0, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500' },
        { id: 13, name: 'Matcha Tea', price: 4.5, img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500' },
        { id: 14, name: 'Green Tea', price: 3.0, img: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500' }
    ],
    juices: [
        { id: 15, name: 'Fresh Orange Juice', price: 4.0, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500' },
        { id: 16, name: 'Iced Watermelon', price: 4.5, img: 'https://images.unsplash.com/photo-1504221507732-5246c045949b?w=500' },
        { id: 17, name: 'Blueberry Mojito', price: 5.0, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500' },
        { id: 18, name: 'Classic Cola', price: 2.5, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500' }
    ],
    snacks: [
        { id: 5, name: 'Croissant', price: 3.5, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500' },
        { id: 6, name: 'Club Sandwich', price: 6.5, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500' },
        { id: 7, name: 'Fudge Brownie', price: 4.0, img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500' },
        { id: 8, name: 'Choco-Chip Cookies', price: 2.5, img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500' },
        { id: 19, name: 'Blueberry Muffin', price: 3.8, img: 'https://images.unsplash.com/photo-1607958996333-41aef7caadaa?w=500' },
        { id: 20, name: 'Avocado Toast', price: 7.5, img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500' },
        { id: 21, name: 'Cheese Cake', price: 5.5, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500' }
    ]
};

// STEP 2: Initialize the Cart
// This array will hold the items the user chooses to buy.
let cart = [];

// STEP 3: Display Menu Items on the Webpage
// This function takes the data from Step 1 and injects it into the HTML grids.
function displayMenu() {
    const bevGrid = document.getElementById('beverages-grid');
    const snackGrid = document.getElementById('snacks-grid');
    const juiceGrid = document.getElementById('juices-grid');

    // Ensure grids exist and clear them before loading
    if(bevGrid) bevGrid.innerHTML = '';
    if(snackGrid) snackGrid.innerHTML = '';
    if(juiceGrid) juiceGrid.innerHTML = '';

    menuData.beverages.forEach(item => bevGrid.innerHTML += createProductCard(item));
    menuData.juices.forEach(item => juiceGrid.innerHTML += createProductCard(item));
    menuData.snacks.forEach(item => snackGrid.innerHTML += createProductCard(item));
}

// Helper Function for Step 3: Generates the HTML for a single product card
function createProductCard(item) {
    return `
        <div class="menu-item">
            <img src="${item.img}" 
                 alt="${item.name}" 
                 onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500'">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `;
}

// STEP 4: Add to Cart Logic
// This combines all menu categories and finds the clicked item by ID.
function addToCart(id) {
    const allProducts = [...menuData.beverages, ...menuData.juices, ...menuData.snacks];
    const product = allProducts.find(p => p.id === id);
    
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI(); // Move to Step 5
}

// STEP 5: Update the Cart User Interface
// This refreshes the sidebar view, the item count, and the total price.
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h5>${item.name} (x${item.quantity})</h5>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">Remove</button>
            </div>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = total.toFixed(2);
}

// Helper Function for Step 5: Removes an item from the cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Helper Function for Step 5: Opens/Closes the Cart Sidebar
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// STEP 6: Handle Checkout and Contact Form Submissions
// These listen for button clicks and form submissions.
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Order Placed Successfully! Thank you for choosing Velvet Beans.");
    cart = [];
    updateCartUI();
    toggleCart();
});

document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for reaching out to Velvet Beans! We will get back to you soon.');
    e.target.reset(); // Clears form
});

// STEP 7: Run the Website
// This ensures the menu displays as soon as the window finishes loading.
window.onload = displayMenu;
