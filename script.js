/* ==========================================
   VELVET BEANS - SUPABASE BACKEND VERSION
   ========================================== */

// 1. Initialize Supabase (Use a unique name to avoid naming conflicts)
const SUBAPASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabaseClient = supabase.createClient(SUBAPASE_URL, SUPABASE_KEY);

let cart = [];
let allProducts = []; 

// 2. Fetch Menu Data from Supabase Table
async function displayMenu() {
    const bevGrid = document.getElementById('beverages-grid');
    const snackGrid = document.getElementById('snacks-grid');
    const juiceGrid = document.getElementById('juices-grid');

    // Fetch all columns from your 'menu_items' table
    const { data: menuItems, error } = await supabaseClient
        .from('menu_items')
        .select('*');

    if (error) {
        console.error('Error fetching menu:', error);
        return;
    }

    // Save fetched items for cart logic
    allProducts = menuItems; 

    // Clear existing content before rendering
    if(bevGrid) bevGrid.innerHTML = '';
    if(snackGrid) snackGrid.innerHTML = '';
    if(juiceGrid) juiceGrid.innerHTML = '';

    // Sort items into their respective HTML grids by category
    menuItems.forEach(item => {
        const card = createProductCard(item);
        if (item.category === 'beverages') bevGrid.innerHTML += card;
        else if (item.category === 'juices') juiceGrid.innerHTML += card;
        else if (item.category === 'snacks') snackGrid.innerHTML += card;
    });
}

// 3. Helper: Generate HTML for product cards
function createProductCard(item) {
    return `
        <div class="menu-item">
            <img src="${item.img}" 
                 alt="${item.name}" 
                 onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500'">
            <h4>${item.name}</h4>
            <p>$${parseFloat(item.price).toFixed(2)}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `;
}

// 4. Cart Logic (Remains local, but uses database IDs)
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

// 5. Form & Event Listeners
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
    alert('Thank you for reaching out!');
    e.target.reset();
});

// Run displayMenu on load
window.onload = displayMenu;
