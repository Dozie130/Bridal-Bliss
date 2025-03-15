const apiUrl = 'http://localhost:5000/api';
const stripe = Stripe('your-stripe-public-key');
let token = localStorage.getItem('token');

function setAuthLinks() {
    const authLinks = document.getElementById('auth-links');
    if (token) {
        authLinks.innerHTML = '<a href="#" id="logout">Logout</a>';
        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('token');
            token = null;
            setAuthLinks();
            renderCart();
        });
    } else {
        authLinks.innerHTML = '<a href="#" id="login">Login</a><a href="#" id="register">Register</a>';
        setupAuthListeners();
    }
}

function setupAuthListeners() {
    const modal = document.getElementById('authModal');
    const close = document.querySelector('.close');
    const form = document.getElementById('authForm');
    const formTitle = document.getElementById('formTitle');

    document.getElementById('login').addEventListener('click', () => {
        formTitle.textContent = 'Login';
        modal.style.display = 'block';
        form.onsubmit = handleAuth.bind(null, 'login');
    });

    document.getElementById('register').addEventListener('click', () => {
        formTitle.textContent = 'Register';
        modal.style.display = 'block';
        form.onsubmit = handleAuth.bind(null, 'register');
    });

    close.addEventListener('click', () => modal.style.display = 'none');
}

async function handleAuth(type, e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch(`${apiUrl}/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        token = data.token;
        document.getElementById('authModal').style.display = 'none';
        setAuthLinks();
        renderCart();
    }
}

async function fetchDresses() {
    const response = await fetch(`${apiUrl}/dresses`);
    return await response.json();
}

function renderDresses(dresses, filter = 'all') {
    const dressGrid = document.getElementById('dressGrid');
    dressGrid.innerHTML = '';
    
    dresses.filter(dress => 
        filter === 'all' || 
        (filter === 'rent' && dress.rentPrice) || 
        (filter === 'buy' && dress.price)
    ).forEach(dress => {
        const card = document.createElement('div');
        card.className = 'dress-card';
        card.innerHTML = `
            <img src="${dress.images[0]}" alt="${dress.name}">
            <div class="dress-info">
                <h3>${dress.name}</h3>
                <div class="price">${dress.price ? `Buy: $${dress.price}` : ''} ${dress.rentPrice ? `Rent: $${dress.rentPrice}` : ''}</div>
                <button onclick="viewDress('${dress._id}')">Details</button>
                ${token ? `<button onclick="addToCart('${dress._id}', false)">Buy</button><button onclick="addToCart('${dress._id}', true)">Rent</button>` : ''}
            </div>
        `;
        dressGrid.appendChild(card);
    });
}

async function viewDress(id) {
    const response = await fetch(`${apiUrl}/dresses/${id}`);
    const dress = await response.json();
    const content = document.getElementById('dressDetailContent');
    content.innerHTML = `
        <h2>${dress.name}</h2>
        <img src="${dress.images[0]}" alt="${dress.name}">
        <p>${dress.description}</p>
        <p>Price: $${dress.price || 'N/A'} | Rent: $${dress.rentPrice || 'N/A'}</p>
        <p>Designer: ${dress.designer}</p>
        <p>Style: ${dress.style}</p>
        <p>Sizes: ${dress.size.join(', ')}</p>
        <p>Material: ${dress.details.material}</p>
        <p>Length: ${dress.details.length}</p>
        <p>Embellishments: ${dress.details.embellishments}</p>
        ${token ? `<button onclick="addToCart('${dress._id}', false)">Add to Cart (Buy)</button><button onclick="addToCart('${dress._id}', true)">Add to Cart (Rent)</button>` : ''}
    `;
    document.getElementById('dressDetails').scrollIntoView();
}

async function addToCart(dressId, forRent) {
    await fetch(`${apiUrl}/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dressId, quantity: 1, forRent })
    });
    renderCart();
}

async function removeFromCart(dressId) {
    await fetch(`${apiUrl}/cart/remove/${dressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    renderCart();
}

async function renderCart() {
    if (!token) {
        document.getElementById('cartItems').innerHTML = 'Please login to view cart';
        return;
    }
    
    const response = await fetch(`${apiUrl}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const cart = await response.json();
    
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.dressId.name} (${item.forRent ? 'Rent' : 'Buy'}) - $${item.forRent ? item.dressId.rentPrice : item.dressId.price} x ${item.quantity}</span>
            <button onclick="removeFromCart('${item.dressId._id}')">Remove</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => 
        sum + (item.forRent ? item.dressId.rentPrice : item.dressId.price) * item.quantity, 0);
    document.getElementById('cartTotal').innerHTML = `Total: $${total}`;
}

document.getElementById('checkoutBtn').addEventListener('click', async () => {
    const response = await fetch(`${apiUrl}/payment/create-checkout-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const { id } = await response.json();
    stripe.redirectToCheckout({ sessionId: id });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const dresses = await fetchDresses();
        renderDresses(dresses, btn.dataset.filter);
    });
});

(async () => {
    setAuthLinks();
    const dresses = await fetchDresses();
    renderDresses(dresses);
    renderCart();
})();
