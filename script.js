/* ==========================================
   VELVET BEANS - FULL SUPABASE BACKEND
   ========================================== */

// 1. Initialize Supabase
const SUBAPASE_URL = 'https://myvdmdmyvaznrywvqhiz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dmRtZG15dmF6bnJ5d3ZxaGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzQzOTMsImV4cCI6MjA4OTkxMDM5M30.hG2fib_b3KaV4wSnUGp9uTe7k-eP30cFF0o1bfKGIf4';
const supabaseClient = supabase.createClient(SUBAPASE_URL, SUPABASE_KEY);

// Set the exchange rate (1 USD to INR)
const EXCHANGE_RATE = 83; 

let cart = [];
let allProducts = []; 

// 2. Fetch Menu Data from Supabase Table
async function displayMenu() {
    const bevGrid = document.getElementById('beverages-grid');
    const snackGrid = document.getElementById('snacks-grid');
    const juiceGrid = document.getElementById('juices-grid');

    const { data: menuItems, error } = await supabaseClient
        .from('menu_items')
        .select('*');

    if (error) {
        console.error('Error fetching menu:', error);
        return;
    }

    allProducts = menuItems; 

    if(bevGrid) bevGrid.innerHTML = '';
    if(snackGrid) snackGrid.innerHTML = '';
    if(juiceGrid) juiceGrid.innerHTML = '';

    menuItems.forEach(item => {
        const card = createProductCard(item);
        if (item.category === 'beverages') bevGrid.innerHTML += card;
        else if (item.category === 'juices') juiceGrid.innerHTML += card;
        else if (item.category === 'snacks') snackGrid.innerHTML += card;
    });
}

// 3. Generate HTML for product cards (Mathematically converted to INR)
function createProductCard(item) {
    const priceInRupees = item.price * EXCHANGE_RATE;
    return `
        <div class="menu-item">
            <img src="${item.img}" 
                 alt="${item.name}" 
                 onerror="this.src='images/placeholder.jpg'">
            <h4>${item.name}</h4>
            <p>₹${priceInRupees.toFixed(2)}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `;
}

// 4. Cart Logic
function addToCart(id) {
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
    let totalInUSD = 0;
    let count = 0;

    cart.forEach(item => {
        totalInUSD += item.price * item.quantity;
        count += item.quantity;
        
        // Convert individual item total for display
        const itemTotalInRupees = item.price * item.quantity * EXCHANGE_RATE;
        
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h5>${item.name} (x${item.quantity})</h5>
                    <p>₹${itemTotalInRupees.toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">Remove</button>
            </div>
        `;
    });

    cartCount.innerText = count;
    
    // Convert the final cart total for display
    const totalInRupees = totalInUSD * EXCHANGE_RATE;
    cartTotal.innerText = totalInRupees.toFixed(2);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// 5. Submit Orders to Supabase
document.querySelector('.checkout-btn').addEventListener('click', async () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.innerText;
    checkoutBtn.innerText = "Processing...";
    checkoutBtn.disabled = true;

    // Calculate total in USD, then convert to INR for the database record
    const orderTotalUSD = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderTotalInRupees = orderTotalUSD * EXCHANGE_RATE;

    const { data, error } = await supabaseClient
        .from('orders')
        .insert([
            { 
                total_amount: orderTotalInRupees, 
                items: cart,
                status: 'pending' 
            }
        ]);

    checkoutBtn.innerText = originalText;
    checkoutBtn.disabled = false;

    if (error) {
        console.error('Error saving order:', error);
        alert("There was an issue processing your order. Please try again.");
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