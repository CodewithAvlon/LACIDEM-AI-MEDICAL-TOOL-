// ============================================
// GLOBAL STATE & DATA
// ============================================
const ADMIN_PASSWORD = "admin123";
const userDatabase = [
    { phoneNumber: "1234567890", password: "pass123" },
    { phoneNumber: "9876543210", password: "pass456" }
];

let currentUser = null;
let chatHistory = [];

// Cart and Wishlist state
let cart = [];
let wishlist = [];

// Sample medicines database
const sampleMedicines = [
    { id: 1, name: 'Paracetamol 500mg', category: 'painkillers', price: 25, stock: 450, reorderLevel: 200, description: 'For fever and pain relief', supplier: 'PharmaCorp' },
    { id: 2, name: 'Azithromycin 500mg', category: 'antibiotics', price: 180, stock: 120, reorderLevel: 100, description: 'Antibiotic for infections', supplier: 'MediSupply' },
    { id: 3, name: 'Vitamin D3', category: 'vitamins', price: 299, stock: 200, reorderLevel: 150, description: 'Bone health supplement', supplier: 'HealthPlus' },
    { id: 4, name: 'Omeprazole 20mg', category: 'antacids', price: 85, stock: 80, reorderLevel: 150, description: 'For acidity and GERD', supplier: 'PharmaCorp' },
    { id: 5, name: 'Metformin 500mg', category: 'diabetes', price: 45, stock: 90, reorderLevel: 200, description: 'Diabetes management', supplier: 'MediSupply' },
    { id: 6, name: 'Cetirizine 10mg', category: 'antihistamines', price: 35, stock: 300, reorderLevel: 100, description: 'For allergies', supplier: 'HealthPlus' },
    { id: 7, name: 'Amoxicillin 250mg', category: 'antibiotics', price: 120, stock: 150, reorderLevel: 100, description: 'Antibiotic', supplier: 'MediSupply' },
    { id: 8, name: 'Ibuprofen 400mg', category: 'painkillers', price: 60, stock: 50, reorderLevel: 100, description: 'Anti-inflammatory', supplier: 'HealthPlus' },
];

const sampleStores = [
    { id: 1, name: 'HealthPlus Pharmacy', distance: '0.8 km', rating: 4.5, open: true, address: '123 Main Street' },
    { id: 2, name: 'MediCare Store', distance: '1.2 km', rating: 4.7, open: true, address: '456 Park Avenue' },
    { id: 3, name: 'Apollo Pharmacy', distance: '2.5 km', rating: 4.3, open: false, address: '789 Lake Road' },
    { id: 4, name: 'Wellness Drugstore', distance: '3.1 km', rating: 4.6, open: true, address: '321 Hill Street' },
];

const sampleNews = [
    { title: 'New Drug Approved for Cancer Treatment', category: 'Drug Approvals', date: '2 hours ago', summary: 'FDA approves breakthrough medication...', image: '🏥' },
    { title: 'Vitamin D Deficiency on the Rise', category: 'Health Tips', date: '5 hours ago', summary: 'Recent studies show alarming increase...', image: '💊' },
    { title: 'Generic Drug Prices Drop by 30%', category: 'Regulations', date: '1 day ago', summary: 'Government initiative brings price reduction...', image: '📊' },
];

// Admin state
const adminState = {
    activeTab: 'overview',
    medicines: [],
    historicalData: [],
    predictions: [],
    orderList: []
};

// ============================================
// LOGIN FUNCTIONS
// ============================================
function showLogin(type, buttonElement) {
    const adminForm = document.getElementById('adminForm');
    const userForm = document.getElementById('userForm');
    const buttons = document.querySelectorAll('.role-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    
    if (type === 'admin') {
        adminForm.classList.add('active');
        userForm.classList.remove('active');
    } else {
        userForm.classList.add('active');
        adminForm.classList.remove('active');
    }
    
    hideAlert();
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;
    setTimeout(() => hideAlert(), 3000);
}

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.classList.remove('show');
}

function handleAdminLogin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            currentUser = { type: 'admin', name: 'Admin' };
            showPage('adminDashboard');
            initializeAdminDashboard();
        }, 1500);
    } else {
        showAlert('Invalid password. Please try again.', 'error');
    }
}

function handleUserLogin(event) {
    event.preventDefault();
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('userPassword').value;

    if (!/^\d{10}$/.test(phoneNumber)) {
        showAlert('Phone number must be exactly 10 digits', 'error');
        return;
    }

    const user = userDatabase.find(u => u.phoneNumber === phoneNumber);
    
    if (!user) {
        showAlert('This phone number is not registered', 'error');
        return;
    }

    if (user.password !== password) {
        showAlert('Incorrect password. Please try again.', 'error');
        return;
    }

    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(() => {
        currentUser = { type: 'user', name: 'User', phone: phoneNumber };
        cart = [];
        wishlist = [];
        updateCartCount();
        updateWishlistCount();
        showPage('userDashboard');
        showUserSection('home');
    }, 1500);
}

function logout() {
    currentUser = null;
    chatHistory = [];
    showPage('loginPage');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ============================================
// ADMIN DASHBOARD FUNCTIONS
// ============================================
function generateSampleData() {
    const historicalData = sampleMedicines.map(med => ({
        medicineId: med.id,
        medicineName: med.name,
        history: [
            { month: 'May 2024', quantity: Math.floor(Math.random() * 200) + 100 },
            { month: 'Jun 2024', quantity: Math.floor(Math.random() * 200) + 120 },
            { month: 'Jul 2024', quantity: Math.floor(Math.random() * 200) + 110 },
            { month: 'Aug 2024', quantity: Math.floor(Math.random() * 200) + 130 },
            { month: 'Sep 2024', quantity: Math.floor(Math.random() * 200) + 140 },
            { month: 'Oct 2024', quantity: Math.floor(Math.random() * 200) + 150 }
        ]
    }));
    return { medicines: sampleMedicines, historicalData };
}

function predictDemand(history) {
    const recent = history.slice(-3);
    const avg = recent.reduce((s, i) => s + i.quantity, 0) / recent.length;
    return Math.round(avg * 1.15);
}

function initializeAdminDashboard() {
    const { medicines, historicalData } = generateSampleData();
    adminState.medicines = medicines;
    adminState.historicalData = historicalData;

    const predicted = historicalData.map(item => {
        const medicine = medicines.find(m => m.id === item.medicineId);
        const predictedQty = predictDemand(item.history);
        return { 
            ...medicine, 
            predictedDemand: predictedQty, 
            trend: predictedQty > item.history[item.history.length - 1].quantity ? 'up' : 'down' 
        };
    });
    adminState.predictions = predicted;

    const orders = predicted.filter(pred => {
        return pred.stock < (pred.predictedDemand + pred.reorderLevel);
    }).map(pred => ({
        ...pred,
        orderQuantity: Math.max(pred.predictedDemand - pred.stock + pred.reorderLevel, 0),
        urgency: pred.stock < pred.reorderLevel ? 'High' : 'Medium',
        estimatedCost: Math.max(pred.predictedDemand - pred.stock + pred.reorderLevel, 0) * pred.price
    }));
    adminState.orderList = orders;

    renderAdminOverview();
}

function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => section.style.display = 'none');
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.sidebar-item').classList.add('active');

    const sectionMap = {
        'overview': 'adminOverview',
        'predictions': 'adminPredictions',
        'orders': 'adminOrders',
        'inventory': 'adminInventory',
        'customer-orders': 'adminCustomerOrders',
        'delivery': 'adminDelivery'
    };

    const targetId = sectionMap[sectionId];
    document.getElementById(targetId).style.display = 'block';

    if (sectionId === 'overview') renderAdminOverview();
    else if (sectionId === 'predictions') renderAdminPredictions();
    else if (sectionId === 'orders') renderAdminOrders();
    else if (sectionId === 'inventory') renderAdminInventory();
    else if (sectionId === 'customer-orders') renderCustomerOrders();
    else if (sectionId === 'delivery') renderDelivery();
}

function renderAdminOverview() {
    const container = document.getElementById('adminOverview');
    const medicines = adminState.medicines;
    const orderList = adminState.orderList;
    const totalStock = medicines.reduce((s, m) => s + m.stock, 0);
    const lowStockCount = medicines.filter(m => m.stock < m.reorderLevel).length;
    const totalOrderValue = orderList.reduce((s, o) => s + o.estimatedCost, 0);

    container.innerHTML = `
        <h1 class="text-4xl font-bold text-gray-800 mb-8">📊 Store Overview</h1>
        <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="text-4xl font-bold mb-2" style="color: var(--primary);">${medicines.length}</div>
                <div class="text-gray-600">Total Medicines</div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="text-4xl font-bold text-blue-500 mb-2">${totalStock}</div>
                <div class="text-gray-600">Total Stock</div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="text-4xl font-bold text-red-500 mb-2">${lowStockCount}</div>
                <div class="text-gray-600">Low Stock Items</div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="text-4xl font-bold text-green-500 mb-2">₹${totalOrderValue.toLocaleString()}</div>
                <div class="text-gray-600">Order Value</div>
            </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow mb-8">
            <h3 class="text-xl font-bold mb-4">⚠️ Critical Alerts</h3>
            ${lowStockCount > 0 ? 
                medicines.filter(m => m.stock < m.reorderLevel).map(med => `
                    <div class="flex items-center justify-between p-3 bg-red-50 rounded border-l-4 border-red-500 mb-2">
                        <div>
                            <p class="font-semibold">${med.name}</p>
                            <p class="text-sm text-gray-600">Current: ${med.stock} | Required: ${med.reorderLevel}</p>
                        </div>
                        <span class="px-3 py-1 bg-red-500 text-white text-sm rounded-full">Low Stock</span>
                    </div>
                `).join('') :
                '<p class="text-green-600">All medicines are adequately stocked!</p>'
            }
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Top Selling Medicines</h3>
            ${medicines.slice(0, 5).map(med => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <span class="font-medium text-gray-800">${med.name}</span>
                    <span class="font-semibold" style="color: var(--primary);">${Math.floor(Math.random() * 500) + 100} units</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAdminPredictions() {
    const container = document.getElementById('adminPredictions');
    const predictions = adminState.predictions;

    container.innerHTML = `
        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg text-white mb-6">
            <h2 class="text-2xl font-bold mb-2">🤖 AI-Powered Demand Forecasting</h2>
            <p>Predictions based on last 3 months data with 15% safety buffer</p>
        </div>
        <div class="grid gap-4">
            ${predictions.map(pred => `
                <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-800">${pred.name}</h3>
                            <p class="text-sm text-gray-500">${pred.category}</p>
                            <div class="mt-4 grid grid-cols-3 gap-4">
                                <div>
                                    <p class="text-xs text-gray-500">Current Stock</p>
                                    <p class="text-xl font-bold text-blue-600">${pred.stock}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Predicted Demand</p>
                                    <p class="text-xl font-bold text-purple-600">${pred.predictedDemand}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Trend</p>
                                    <p class="text-xl font-bold">${pred.trend === 'up' ? '📈' : '📉'}</p>
                                </div>
                            </div>
                        </div>
                        <span class="px-4 py-2 rounded-full text-sm font-semibold ${pred.stock < pred.predictedDemand ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}">
                            ${pred.stock < pred.predictedDemand ? 'Order Recommended' : 'Sufficient Stock'}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAdminOrders() {
    const container = document.getElementById('adminOrders');
    const orders = adminState.orderList;
    const totalCost = orders.reduce((s, o) => s + o.estimatedCost, 0);

    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow mb-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">📋 Auto-Generated Order List</h2>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Total Items</p>
                    <p class="text-2xl font-bold" style="color: var(--primary);">${orders.length}</p>
                </div>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
                <p class="text-gray-700">Estimated Total Cost: <span class="text-2xl font-bold text-green-600">₹${totalCost.toLocaleString()}</span></p>
            </div>
        </div>
        ${orders.length > 0 ? `
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="w-full">
                    <thead class="text-white" style="background: var(--primary);">
                        <tr>
                            <th class="p-4 text-left">Medicine</th>
                            <th class="p-4 text-left">Current Stock</th>
                            <th class="p-4 text-left">Order Qty</th>
                            <th class="p-4 text-left">Urgency</th>
                            <th class="p-4 text-left">Supplier</th>
                            <th class="p-4 text-left">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map((order, idx) => `
                            <tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                                <td class="p-4">
                                    <p class="font-semibold">${order.name}</p>
                                    <p class="text-sm text-gray-500">${order.category}</p>
                                </td>
                                <td class="p-4">${order.stock}</td>
                                <td class="p-4 font-bold" style="color: var(--primary);">${order.orderQuantity}</td>
                                <td class="p-4">
                                    <span class="px-3 py-1 rounded-full text-sm ${order.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
                                        ${order.urgency}
                                    </span>
                                </td>
                                <td class="p-4">${order.supplier}</td>
                                <td class="p-4 font-bold">₹${order.estimatedCost.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        ` : `
            <div class="bg-white p-12 rounded-lg shadow text-center">
                <div class="text-6xl text-gray-300 mb-4">📦</div>
                <p class="text-xl text-gray-500">No orders needed at this time!</p>
            </div>
        `}
    `;
}

function renderAdminInventory() {
    const container = document.getElementById('adminInventory');
    const medicines = adminState.medicines;

    container.innerHTML = `
        <h1 class="text-4xl font-bold text-gray-800 mb-8">📦 Current Inventory</h1>
        <div class="grid gap-4">
            ${medicines.map(med => `
                <div class="bg-white border rounded-lg p-4 hover:shadow-md transition">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h3 class="font-bold text-lg">${med.name}</h3>
                            <p class="text-sm text-gray-500">${med.category}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-500">Stock Level</p>
                            <p class="text-2xl font-bold ${med.stock < med.reorderLevel ? 'text-red-600' : 'text-green-600'}">${med.stock}</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-gray-600">Reorder Level: ${med.reorderLevel}</span>
                        <span class="text-gray-600">Price: ₹${med.price}</span>
                        <span class="text-gray-600">Supplier: ${med.supplier}</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full ${med.stock < med.reorderLevel ? 'bg-red-500' : 'bg-green-500'}" 
                             style="width: ${Math.min((med.stock / (med.reorderLevel * 2)) * 100, 100)}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCustomerOrders() {
    const orders = [
        { id: 'ORD-156', customer: 'John Doe', phone: '+91 98765 43210', items: ['Paracetamol x2', 'Vitamin D3 x1'], amount: 450, status: 'Processing' },
        { id: 'ORD-155', customer: 'Jane Smith', phone: '+91 98765 43211', items: ['Azithromycin x1'], amount: 180, status: 'Completed' },
    ];
    const container = document.getElementById('adminCustomerOrdersList');
    container.innerHTML = orders.map(order => `
        <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${order.id}</h3>
                    <p class="text-sm text-gray-600">${order.customer} - ${order.phone}</p>
                </div>
                <span class="badge" style="background:${order.status === 'Completed' ? '#22c55e' : '#3b82f6'}">${order.status}</span>
            </div>
            <div class="mb-4">
                <p class="text-sm text-gray-600 mb-2">Items:</p>
                <ul class="list-disc list-inside text-gray-700">${order.items.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-gray-800">₹${order.amount}</span>
                <button class="btn-secondary">View Details</button>
            </div>
        </div>
    `).join('');
}

function renderDelivery() {
    const deliveries = [
        { id: 'DEL-045', orderId: 'ORD-156', customer: 'John Doe', driver: 'Rahul Kumar', status: 'Out for Delivery', eta: '15 mins' },
        { id: 'DEL-044', orderId: 'ORD-155', customer: 'Jane Smith', driver: 'Priya Patel', status: 'Delivered', eta: '-' },
    ];
    const container = document.getElementById('deliveryList');
    container.innerHTML = deliveries.map(del => `
        <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${del.id}</h3>
                    <p class="text-sm text-gray-600">Order: ${del.orderId}</p>
                </div>
                <span class="badge" style="background:${del.status === 'Delivered' ? '#22c55e' : '#3b82f6'}">${del.status}</span>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div><p class="text-sm text-gray-500">Customer</p><p class="font-semibold">${del.customer}</p></div>
                <div><p class="text-sm text-gray-500">Driver</p><p class="font-semibold">${del.driver}</p></div>
                ${del.eta !== '-' ? `<div><p class="text-sm text-gray-500">ETA</p><p class="font-semibold text-blue-600">${del.eta}</p></div>` : ''}
            </div>
            <button class="btn-primary w-full">Track Delivery</button>
        </div>
    `).join('');
}

// ============================================
// USER DASHBOARD FUNCTIONS
// ============================================
function showUserSection(sectionId) {
    document.querySelectorAll('.user-section').forEach(section => section.style.display = 'none');
    document.getElementById('user' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1)).style.display = 'block';
    
    if (sectionId === 'search') displayMedicines(sampleMedicines);
    else if (sectionId === 'nearby') displayStores();
    else if (sectionId === 'news') displayNews();
    else if (sectionId === 'orders') displayUserOrders();
    else if (sectionId === 'chatbot') initializeChatbot();
    else if (sectionId === 'cart') displayCart();
    else if (sectionId === 'wishlist') displayWishlist();
}

function searchMedicine() {
    const searchTerm = document.getElementById('medicineSearchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    let filtered = sampleMedicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm) ||
        med.description.toLowerCase().includes(searchTerm)
    );
    if (category) filtered = filtered.filter(med => med.category === category);
    displayMedicines(filtered);
}

function displayMedicines(medicines) {
    const container = document.getElementById('medicineResults');
    container.innerHTML = medicines.map(med => `
        <div class="medicine-card">
            <div class="text-4xl mb-3">💊</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">${med.name}</h3>
            <p class="text-gray-600 text-sm mb-3">${med.description}</p>
            <div class="flex items-center justify-between mb-3">
                <span class="text-2xl font-bold" style="color: var(--primary);">₹${med.price}</span>
                <span class="stock-badge ${med.stock > 200 ? 'stock-high' : med.stock > 50 ? 'stock-medium' : 'stock-low'}">${med.stock} in stock</span>
            </div>
            <div class="flex gap-2">
                <button onclick="addToCart(${med.id})" class="btn-primary flex-1">Add to Cart</button>
                <button onclick="addToWishlist(${med.id})" class="btn-secondary flex-1">❤️ Wishlist</button>
            </div>
        </div>
    `).join('');
}

function addToCart(medicineId) {
    const medicine = sampleMedicines.find(med => med.id === medicineId);
    if (!medicine) return;
    const existingItem = cart.find(item => item.id === medicineId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...medicine, quantity: 1 });
    }
    updateCartCount();
    showAlert('Medicine added to cart! 🛒', 'success');
}

function addToWishlist(medicineId) {
    const medicine = sampleMedicines.find(med => med.id === medicineId);
    if (!medicine) return;
    if (!wishlist.find(item => item.id === medicineId)) {
        wishlist.push(medicine);
        updateWishlistCount();
        showAlert('Medicine added to wishlist! ❤️', 'success');
    } else {
        showAlert('Medicine already in wishlist!', 'info');
    }
}

function removeFromCart(medicineId) {
    cart = cart.filter(item => item.id !== medicineId);
    updateCartCount();
    displayCart();
}

function removeFromWishlist(medicineId) {
    wishlist = wishlist.filter(item => item.id !== medicineId);
    updateWishlistCount();
    displayWishlist();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (count > 0) {
        cartCountEl.textContent = count;
        cartCountEl.classList.remove('hidden');
    } else {
        cartCountEl.classList.add('hidden');
    }
}

function updateWishlistCount() {
    const count = wishlist.length;
    const wishlistCountEl = document.getElementById('wishlistCount');
    if (count > 0) {
        wishlistCountEl.textContent = count;
        wishlistCountEl.classList.remove('hidden');
    } else {
        wishlistCountEl.classList.add('hidden');
    }
}

function updateCartQuantity(medicineId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(medicineId);
        return;
    }
    const item = cart.find(item => item.id === medicineId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
        displayCart();
    }
}

function displayCart() {
    const container = document.getElementById('cartItems');
    const emptyState = document.getElementById('cartEmpty');
    const summary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        summary.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    summary.style.display = 'block';
    container.innerHTML = cart.map(item => `
        <div class="glass-card p-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                    <div class="text-3xl mr-4">💊</div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${item.name}</h3>
                        <p class="text-gray-600 text-sm">${item.description}</p>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="color:red;font-size:24px;background:none;border:none;cursor:pointer;">×</button>
            </div>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <span class="text-2xl font-bold" style="color: var(--primary);">₹${item.price}</span>
                    <div class="flex items-center gap-2">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" style="background:#e5e7eb;padding:4px 12px;border:none;border-radius:6px;cursor:pointer;font-size:16px;">-</button>
                        <span class="font-semibold">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" style="background:#e5e7eb;padding:4px 12px;border:none;border-radius:6px;cursor:pointer;font-size:16px;">+</button>
                    </div>
                </div>
                <span class="text-xl font-bold text-gray-800">₹${item.price * item.quantity}</span>
            </div>
        </div>
    `).join('');
    updateCartSummary();
}

function displayWishlist() {
    const container = document.getElementById('wishlistItems');
    const emptyState = document.getElementById('wishlistEmpty');
    if (wishlist.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    container.innerHTML = wishlist.map(item => `
        <div class="medicine-card">
            <div class="text-4xl mb-3">💊</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">${item.name}</h3>
            <p class="text-gray-600 text-sm mb-3">${item.description}</p>
            <div class="flex items-center justify-between mb-3">
                <span class="text-2xl font-bold" style="color: var(--primary);">₹${item.price}</span>
                <span class="stock-badge ${item.stock > 200 ? 'stock-high' : item.stock > 50 ? 'stock-medium' : 'stock-low'}">${item.stock} in stock</span>
            </div>
            <div class="flex gap-2">
                <button onclick="addToCart(${item.id})" class="btn-primary flex-1">Add to Cart</button>
                <button onclick="removeFromWishlist(${item.id})" class="btn-secondary flex-1">Remove</button>
            </div>
        </div>
    `).join('');
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;
    document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('cartDelivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
    document.getElementById('cartTotal').textContent = `₹${total}`;
}

function placeOrder() {
    if (cart.length === 0) {
        showAlert('Your cart is empty!', 'error');
        return;
    }
    showAlert('Order placed successfully! 🎉', 'success');
    cart = [];
    updateCartCount();
    showUserSection('orders');
}

function displayStores() {
    const container = document.getElementById('storesList');
    container.innerHTML = sampleStores.map(store => `
        <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-xl font-bold text-gray-800 mb-1">${store.name}</h3>
                    <p class="text-sm text-gray-600">${store.address}</p>
                </div>
                <span class="badge" style="background:${store.open ? '#22c55e' : '#ef4444'}">${store.open ? 'Open' : 'Closed'}</span>
            </div>
            <div class="flex items-center justify-between mb-4">
                <div>⭐ <span class="font-semibold">${store.rating}</span></div>
                <span class="text-gray-600 text-sm">${store.distance}</span>
            </div>
            <div class="flex gap-2">
                <button class="btn-primary flex-1">View Store</button>
                <button class="btn-secondary flex-1">Directions</button>
            </div>
        </div>
    `).join('');
}

function initializeChatbot() {
    if (chatHistory.length === 0) {
        addMessage('ai', "Hello! I'm your AI health assistant. I can help you find medicine alternatives, explain side effects, and provide health advice. How can I help you today?");
    }
}

const SYSTEM_PROMPT = `You are LACIDEM, a knowledgeable and friendly AI health assistant built into a medical management system. You help users with:
- Medicine information, dosage, and usage
- Alternatives to common medications
- Side effects and drug interactions
- General health advice and wellness tips
- Locating medicines and understanding prescriptions

Always be clear, accurate, and professional. Include brief medical disclaimers where appropriate and recommend consulting a healthcare professional for serious conditions. Keep responses concise and easy to understand. You are not a replacement for professional medical advice.`;

function addMessage(type, text) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    chatHistory.push({ role: type === 'user' ? 'user' : 'assistant', content: text });
}

function createStreamingBubble() {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.id = 'streamingMessage';
    messageDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    return messageDiv;
}

// ============================================
// CHATBOT - Real-time Anthropic Streaming
// ============================================
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.querySelector('#userChatbot .btn-primary');
    const message = input.value.trim();
    if (!message) return;

    // Disable input while streaming
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    addMessage('user', message);
    input.value = '';

    // Build message history for context (last 10 turns)
    const recentHistory = chatHistory.slice(-10);
    const messages = recentHistory.map(m => ({ role: m.role, content: m.content }));

    // Create streaming bubble
    const bubble = createStreamingBubble();
    let fullText = '';
    let started = false;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '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',        // ← Paste your Anthropic API key here
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: messages,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]' || !data) continue;

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                        if (!started) {
                            bubble.innerHTML = '';
                            started = true;
                        }
                        fullText += parsed.delta.text;
                        bubble.textContent = fullText;
                        document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
                    }
                } catch (e) { /* skip malformed chunks */ }
            }
        }

        bubble.removeAttribute('id');
        if (fullText) {
            chatHistory.push({ role: 'assistant', content: fullText });
        }

    } catch (error) {
        console.error('Streaming error:', error);
        bubble.innerHTML = '';
        const fallback = generateFallbackResponse(message.toLowerCase());
        bubble.textContent = fallback;
        bubble.removeAttribute('id');
        chatHistory.push({ role: 'assistant', content: fallback });
    } finally {
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
    }
}

function generateFallbackResponse(message) {
    if (message.includes('paracetamol') || message.includes('pain') || message.includes('fever'))
        return "Paracetamol is commonly used for pain relief and fever. Alternatives include Ibuprofen or Aspirin. Always follow dosage instructions and consult a doctor if symptoms persist.";
    if (message.includes('headache') || message.includes('migraine'))
        return "For headaches, Paracetamol or Ibuprofen are usually effective. Stay hydrated and rest. If headaches are frequent or severe, please consult a doctor.";
    if (message.includes('antibiotic') || message.includes('infection'))
        return "Antibiotics should only be taken when prescribed by a doctor. Always complete the full course. Consult your doctor for proper diagnosis.";
    if (message.includes('vitamin') || message.includes('supplement'))
        return "Vitamin D3 is essential for bone health. Always check with your doctor before starting supplements.";
    if (message.includes('diabetes') || message.includes('blood sugar'))
        return "For diabetes management, Metformin is commonly prescribed. Monitor blood sugar regularly and consult your endocrinologist.";
    if (message.includes('allergy') || message.includes('cetirizine'))
        return "Cetirizine (10mg) is effective for allergies. It can cause drowsiness. Loratadine is a non-drowsy alternative.";
    if (message.includes('acidity') || message.includes('gerd') || message.includes('omeprazole'))
        return "Omeprazole helps with acid reflux and GERD. Take it 30 minutes before meals.";
    if (message.includes('side effect'))
        return "Side effects vary by medication. Always read the package insert and consult your doctor. Stop medication and seek help if you experience severe reactions.";
    return "I'm here to help with medicine information, alternatives, side effects, and general health advice. For serious conditions or emergencies, please consult a healthcare professional immediately.";
}

function askQuickQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

function displayNews() {
    const container = document.getElementById('newsList');
    container.innerHTML = sampleNews.map(news => `
        <div class="news-card">
            <div class="p-6">
                <div class="text-4xl mb-4">${news.image}</div>
                <div class="flex items-center justify-between mb-3">
                    <span class="badge">${news.category}</span>
                    <span class="text-sm text-gray-500">${news.date}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${news.title}</h3>
                <p class="text-gray-600 mb-4">${news.summary}</p>
                <button style="color: var(--primary); font-weight: 600; background:none; border:none; cursor:pointer;">Read More →</button>
            </div>
        </div>
    `).join('');
}

function displayUserOrders() {
    const orders = [
        { id: 'ORD-001', date: 'Jan 10, 2026', items: 3, total: 450, status: 'Delivered' },
        { id: 'ORD-002', date: 'Jan 9, 2026', items: 2, total: 320, status: 'Out for Delivery' },
    ];
    const container = document.getElementById('ordersList');
    container.innerHTML = orders.map(order => `
        <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${order.id}</h3>
                    <p class="text-sm text-gray-600">${order.date}</p>
                </div>
                <span class="badge" style="background:${order.status === 'Delivered' ? '#22c55e' : '#3b82f6'}">${order.status}</span>
            </div>
            <div class="flex items-center justify-between mb-4">
                <span class="text-gray-600">${order.items} items</span>
                <span class="text-2xl font-bold text-gray-800">₹${order.total}</span>
            </div>
            <div class="flex gap-2">
                <button class="btn-primary flex-1">Track Order</button>
                <button class="btn-secondary flex-1">View Details</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    showPage('loginPage');
    const adminButton = document.querySelector('.role-btn.active');
    if (adminButton) {
        showLogin('admin', adminButton);
    }
});
