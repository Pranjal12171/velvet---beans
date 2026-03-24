/* ==========================================
   VELVET BEANS - SUPABASE BACKEND VERSION
   ========================================== */

// 1. Initialize Supabase
const SUBAPASE_URL = 'https://myvdmdmyvaznrywvqhiz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dmRtZG15dmF6bnJ5d3ZxaGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzQzOTMsImV4cCI6MjA4OTkxMDM5M30.hG2fib_b3KaV4wSnUGp9uTe7k-eP30cFF0o1bfKGIf4';
const supabase = supabase.createClient(SUBAPASE_URL, SUPABASE_KEY);

let cart = [];
let allProducts = []; // To store items fetched from DB

// 2. Fetch Menu Data from Supabase
async function displayMenu() {
    const bevGrid = document.getElementById('beverages-grid');
    const snackGrid = document.getElementById('snacks-grid');
    const juiceGrid = document.getElementById('juices-grid');

    // Fetch data from PostgreSQL
    const { data: menuItems, error } = await supabase
        .from('menu_items')
        .select('*');

    if (error) {
        console.error('Error fetching menu:', error);
        return;
    }

    allProducts = menuItems; // Store for cart logic

    // Clear and Fill Grids
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

// 3. Helper: Create Product Card
function createProductCard(item) {
    return `
        <div class="menu-item">
            <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500'">
            <h4>${item.name}</h4>
            <p>$${parseFloat(item.price).toFixed(2)}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `;
}

// 4. Cart Logic (Remains Local for performance, using DB IDs)
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

// 5. Submit Orders/Contact to Supabase (Optional)
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // In a real app, you'd insert the order into an 'orders' table here
    alert("Order Placed Successfully!");
    cart = [];
    updateCartUI();
    toggleCart();
});

document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    alert('Thank you for reaching out!');
    e.target.reset();
});

window.onload = displayMenu;
