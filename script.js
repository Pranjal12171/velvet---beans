/* ==========================================
   VELVET BEANS - MAIN JAVASCRIPT (LOCAL IMAGES)
   ========================================== */

// STEP 1: Define the Menu Data using Local Images
const menuData = {
    beverages: [
        { id: 1, name: 'Cappuccino', price: 4.5, img: 'images/cappuccino.jpg' },
        { id: 2, name: 'Latte', price: 4.0, img: 'images/latte.jpg' }, 
        { id: 9, name: 'Macchiato', price: 3.5, img: 'images/macchiato.jpg' },
        { id: 10, name: 'Frappuccino', price: 5.5, img: 'images/frappuccino.jpg' },
        { id: 11, name: 'Black Tea', price: 2.5, img: 'images/black-tea.jpg' },
        { id: 12, name: 'Lemon Tea', price: 3.0, img: 'images/lemon-tea.jpg' },
        { id: 13, name: 'Matcha Tea', price: 4.5, img: 'images/matcha-tea.jpg' },
        { id: 14, name: 'Green Tea', price: 3.0, img: 'images/green-tea.jpg' }
    ],
    juices: [
        { id: 15, name: 'Fresh Orange Juice', price: 4.0, img: 'images/fresh-orange-juice.jpg' },
        { id: 16, name: 'Iced Watermelon', price: 4.5, img: 'images/iced-watermelon.jpg' },
        { id: 17, name: 'Blueberry Mojito', price: 5.0, img: 'images/blueberry-mojito.jpg' },
        { id: 18, name: 'Classic Cola', price: 2.5, img: 'images/classic-cola.jpg' }
    ],
    snacks: [
        { id: 5, name: 'Croissant', price: 3.5, img: 'images/croissant.jpg' },
        { id: 6, name: 'Club Sandwich', price: 6.5, img: 'images/club-sandwich.jpg' },
        { id: 7, name: 'Fudge Brownie', price: 4.0, img: 'images/fudge-brownie.jpg' },
        { id: 8, name: 'Choco-Chip Cookies', price: 2.5, img: 'images/choco-chip-cookies.jpg' },
        { id: 19, name: 'Blueberry Muffin', price: 3.8, img: 'images/blueberry-muffin.jpg' },
        { id: 20, name: 'Avocado Toast', price: 7.5, img: 'images/avocado-toast.jpg' },
        { id: 21, name: 'Cheese Cake', price: 5.5, img: 'images/cheese-cake.jpg' }
    ]
};

let cart = [];

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

// Updated onerror to look for a generic local placeholder if a specific image is missing
function createProductCard(item) {
    return `
        <div class="menu-item">
            <img src="${item.img}" 
                 alt="${item.name}" 
                 onerror="this.src='images/placeholder.jpg'">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `;
}

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

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

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

window.onload = displayMenu;
