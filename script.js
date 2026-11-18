// Mahsulotlar ma'lumotlar bazasi
const PRODUCTS = [
    {
        id: 1,
        name: 'iPhone 17 Pro',
        tagline: 'Titan. Kuchli. Yengil. Pro.',
        basePrice: 1199,
        specs: 'A19 Pro chipi • 48MP Pro kamera tizimi • ProMotion displey',
        colors: [
            { name: 'Tabiiy Titan', hex: '#b6b1a8' },
            { name: 'Qora Titan', hex: '#2c2c2e' },
            { name: 'Oq Titan', hex: '#f2f2f7' }
        ],
        storages: [
            { size: '256GB', addPrice: 0 },
            { size: '512GB', addPrice: 200 },
            { size: '1TB', addPrice: 400 }
        ]
    },
    {
        id: 2,
        name: 'MacBook Air',
        tagline: 'M4 chipi bilan yanada tezkor.',
        basePrice: 1099,
        specs: 'Apple M4 chipi • 18 soatgacha batareya • Liquid Retina ekran',
        colors: [
            { name: 'Yarim tun', hex: '#1d1d1f' },
            { name: 'Yulduz nuri', hex: '#e3dcd2' },
            { name: 'Kumush', hex: '#d1d1d6' }
        ],
        storages: [
            { size: '256GB', addPrice: 0 },
            { size: '512GB', addPrice: 200 },
            { size: '1TB', addPrice: 400 }
        ]
    },
    {
        id: 3,
        name: 'Apple Watch Series 11',
        tagline: 'Aqlliroq. Yorqinroq. Kuchliroq.',
        basePrice: 399,
        specs: 'S11 SiP chipi • Uyqu apnoesini aniqlash • 2000 nit ekran',
        colors: [
            { name: 'Jet Black', hex: '#18181b' },
            { name: 'Rose Gold', hex: '#e0bfb8' }
        ],
        storages: [
            { size: 'GPS 42mm', addPrice: 0 },
            { size: 'Cellular 46mm', addPrice: 100 }
        ]
    },
    {
        id: 4,
        name: 'iPad Pro',
        tagline: 'Aql bovar qilmas darajada yupqa.',
        basePrice: 999,
        specs: 'Tandem OLED displey • M4 chipi • Apple Pencil Pro qo‘llab-quvvatlovi',
        colors: [
            { name: 'Space Black', hex: '#27272a' },
            { name: 'Silver', hex: '#e4e4e7' }
        ],
        storages: [
            { size: '256GB', addPrice: 0 },
            { size: '512GB', addPrice: 200 },
            { size: '1TB', addPrice: 600 }
        ]
    },
    {
        id: 5,
        name: 'AirPods Pro 3',
        tagline: 'Shovqinni bekor qilishning yangi darajasi.',
        basePrice: 249,
        specs: 'H3 audio chipi • Moslashuvchan audio • USB-C MagSafe quti',
        colors: [
            { name: 'Oq', hex: '#ffffff' }
        ],
        storages: [
            { size: 'Standart', addPrice: 0 }
        ]
    },
    {
        id: 6,
        name: 'Apple Vision Pro',
        tagline: 'Fazoviy hisoblash davriga xush kelibsiz.',
        basePrice: 3499,
        specs: 'Micro-OLED 4K displeylar • visionOS • Ko‘z va qo‘l bilan boshqarish',
        colors: [
            { name: 'Kumush alyuminiy', hex: '#d4d4d8' }
        ],
        storages: [
            { size: '256GB', addPrice: 0 },
            { size: '512GB', addPrice: 200 },
            { size: '1TB', addPrice: 400 }
        ]
    }
];

// LocalStorage dan savatni yuklash
let cart = JSON.parse(localStorage.getItem('apple_vanilla_cart')) || [];
let currentModalProduct = null;
let selectedColor = null;
let selectedStorage = null;

// DOM Elementlar
const searchToggle = document.getElementById('searchToggle');
const cartToggle = document.getElementById('cartToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

const searchPanel = document.getElementById('searchPanel');
const cartPanel = document.getElementById('cartPanel');
const mobileMenu = document.getElementById('mobileMenu');

const searchInput = document.getElementById('searchInput');
const searchResultsList = document.getElementById('searchResultsList');

const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartFooter = document.getElementById('cartFooter');
const cartTotalPrice = document.getElementById('cartTotalPrice');

const productModal = document.getElementById('productModal');
const toast = document.getElementById('toast');

// Panellarni boshqarish
function closeAllPanels() {
    searchPanel.classList.add('hidden');
    cartPanel.classList.add('hidden');
    mobileMenu.classList.add('hidden');
}

searchToggle.addEventListener('click', () => {
    const isHidden = searchPanel.classList.contains('hidden');
    closeAllPanels();
    if (isHidden) {
        searchPanel.classList.remove('hidden');
        searchInput.focus();
        renderSearchResults('');
    }
});

cartToggle.addEventListener('click', () => {
    const isHidden = cartPanel.classList.contains('hidden');
    closeAllPanels();
    if (isHidden) {
        cartPanel.classList.remove('hidden');
        renderCart();
    }
});

mobileMenuToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    closeAllPanels();
    if (isHidden) mobileMenu.classList.remove('hidden');
});

document.getElementById('closeSearch').addEventListener('click', closeAllPanels);
document.getElementById('closeCart').addEventListener('click', closeAllPanels);
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeAllPanels);
});

// Jonli qidiruv
searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
});

function renderSearchResults(query) {
    const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        searchResultsList.innerHTML = '<p style="color:#86868b; font-size:14px; padding:8px 0;">Hech narsa topilmadi.</p>';
        return;
    }

    searchResultsList.innerHTML = filtered.map(item => `
        <div class="search-result-item" onclick="openProductModal(${item.id}); closeAllPanels();">
            <span>${item.name}</span>
            <span class="search-result-price">$${item.basePrice} dan</span>
        </div>
    `).join('');
}

// Modal oyna (Rang va Xotira tanlash)
function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentModalProduct = product;
    selectedColor = product.colors[0];
    selectedStorage = product.storages[0];

    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalSpecs').textContent = product.specs;

    renderModalOptions();
    productModal.classList.remove('hidden');
}

function renderModalOptions() {
    document.getElementById('selectedColorName').textContent = selectedColor.name;

    // Ranglar
    const colorContainer = document.getElementById('colorOptions');
    colorContainer.innerHTML = currentModalProduct.colors.map((color, idx) => `
        <button
            class="color-swatch ${color.name === selectedColor.name ? 'active' : ''}"
            style="background-color: ${color.hex};"
            title="${color.name}"
            onclick="selectColor(${idx})"
        ></button>
    `).join('');

    // Xotira variantlari
    const storageContainer = document.getElementById('storageOptions');
    storageContainer.innerHTML = currentModalProduct.storages.map((st, idx) => `
        <button
            class="storage-btn ${st.size === selectedStorage.size ? 'active' : ''}"
            onclick="selectStorage(${idx})"
        >
            <span class="storage-size">${st.size}</span>
            <span class="storage-add">${st.addPrice === 0 ? 'Asosiy' : '+$' + st.addPrice}</span>
        </button>
    `).join('');

    const finalPrice = currentModalProduct.basePrice + selectedStorage.addPrice;
    document.getElementById('modalFinalPrice').textContent = '$' + finalPrice;
}

function selectColor(index) {
    selectedColor = currentModalProduct.colors[index];
    renderModalOptions();
}

function selectStorage(index) {
    selectedStorage = currentModalProduct.storages[index];
    renderModalOptions();
}

document.getElementById('closeModal').addEventListener('click', () => {
    productModal.classList.add('hidden');
});

productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.classList.add('hidden');
});

document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
    const finalPrice = currentModalProduct.basePrice + selectedStorage.addPrice;
    addToCart(currentModalProduct, selectedColor.name, selectedStorage.size, finalPrice);
    productModal.classList.add('hidden');
});

// Tezkor sotib olish
function quickBuy(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    addToCart(product, product.colors[0].name, product.storages[0].size, product.basePrice);
}

// Savat funksiyalari
function addToCart(product, colorName, storageSize, finalPrice) {
    const cartItemId = `${product.id}-${colorName}-${storageSize}`;
    const existing = cart.find(item => item.cartItemId === cartItemId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            cartItemId,
            name: product.name,
            color: colorName,
            storage: storageSize,
            price: finalPrice,
            qty: 1
        });
    }

    saveCart();
    updateBadge();
    renderCart();
    showToast(`${product.name} savatga qo'shildi`);
}

function updateQty(cartItemId, delta) {
    cart = cart.map(item => {
        if (item.cartItemId === cartItemId) {
            return { ...item, qty: item.qty + delta };
        }
        return item;
    }).filter(item => item.qty > 0);

    saveCart();
    updateBadge();
    renderCart();
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart();
    updateBadge();
    renderCart();
}

function saveCart() {
    localStorage.setItem('apple_vanilla_cart', JSON.stringify(cart));
}

function updateBadge() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalCount > 0) {
        cartBadge.textContent = totalCount;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Savatingiz hozircha bo'sh.</p>';
        cartFooter.classList.add('hidden');
        return;
    }

    cartFooter.classList.remove('hidden');
    let total = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-meta">Rang: ${item.color} • Variant: ${item.storage}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-controls">
                    <div class="qty-box">
                        <button class="qty-btn" onclick="updateQty('${item.cartItemId}', -1)">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty('${item.cartItemId}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.cartItemId}')">O'chirish</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotalPrice.textContent = '$' + total;
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    alert(`Buyurtmangiz muvaffaqiyatli qabul qilindi! Jami to'lov: $${total}`);
    cart = [];
    saveCart();
    updateBadge();
    renderCart();
    closeAllPanels();
});

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

// Sahifa yuklanganda savat sonini yangilash
updateBadge();
