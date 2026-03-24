/* ==========================================
   VELVET BEANS - MAIN JAVASCRIPT
   ========================================== */

// STEP 1: Define the Menu Data
// Updated with ultra-reliable, theme-matching image links to bypass external blocking.
const menuData = {
    beverages: [
        { id: 1, name: 'Cappuccino', price: 4.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Cappuccino' },
        { id: 2, name: 'Latte', price: 4.0, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Latte' }, 
        { id: 9, name: 'Macchiato', price: 3.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Macchiato' },
        { id: 10, name: 'Frappuccino', price: 5.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Frappuccino' },
        { id: 11, name: 'Black Tea', price: 2.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Black+Tea' },
        { id: 12, name: 'Lemon Tea', price: 3.0, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Lemon+Tea' },
        { id: 13, name: 'Matcha Tea', price: 4.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Matcha+Tea' },
        { id: 14, name: 'Green Tea', price: 3.0, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Green+Tea' }
    ],
    juices: [
        { id: 15, name: 'Fresh Orange Juice', price: 4.0, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Orange+Juice' },
        { id: 16, name: 'Iced Watermelon', price: 4.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Iced+Watermelon' },
        { id: 17, name: 'Blueberry Mojito', price: 5.0, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Blueberry+Mojito' },
        { id: 18, name: 'Classic Cola', price: 2.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Classic+Cola' }
    ],
    snacks: [
        { id: 5, name: 'Croissant', price: 3.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Croissant' },
        { id: 6, name: 'Club Sandwich', price: 6.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Club+Sandwich' },
        { id: 7, name: 'Fudge Brownie', price: 4.0, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Fudge+Brownie' },
        { id: 8, name: 'Choco-Chip Cookies', price: 2.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Choco-Chip+Cookies' },
        { id: 19, name: 'Blueberry Muffin', price: 3.8, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Blueberry+Muffin' },
        { id: 20, name: 'Avocado Toast', price: 7.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Avocado+Toast' },
        { id: 21, name: 'Cheese Cake', price: 5.5, img: 'https://placehold.co/500x400/d4a373/3d2b1f?text=Cheese+Cake' }
    ]
};

// STEP 2: Initialize the Cart
let cart = [];

// STEP 3: Display Menu Items on the Webpage
function displayMenu() {
    const bevGrid = document.getElementById('beverages-grid');
    const snackGrid = document.getElementById('snacks-grid');
    const juiceGrid = document.getElementById('juices-grid');

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
                 onerror="this.src='https://placehold.co/500x400/3d2b1f/faedcd?text=Image+Unavailable'">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `;
}

// STEP 4: Add to Cart Logic
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
    updateCartUI(); 
}

// STEP 5: Update the Cart User Interface
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
    e.target.reset(); 
});

// STEP 7: Run the Website
window.onload = displayMenu;
