const API_BASE_URL = 'https://buildmart-backend-59jv.onrender.com/api';

function getToken() { return localStorage.getItem('buildmart_token'); }
function setToken(token) { localStorage.setItem('buildmart_token', token); }
function removeToken() {
    localStorage.removeItem('buildmart_token');
    localStorage.removeItem('buildmart_user_email');
}

function getUserRole() {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        return null;
    }
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
        removeToken();
        openAuthModal();
        throw new Error('Требуется авторизация');
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.message || 'Ошибка запроса к серверу');
    }
    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    const headerInner = document.querySelector('.header__inner');
    const cartBlock = document.querySelector('.cart');
    const isAdmin = getUserRole() === 'admin';
    
    if (headerInner && cartBlock) {
        const authContainer = document.createElement('div');
        authContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto; margin-right: 15px;';
        
        const userEmail = localStorage.getItem('buildmart_user_email');
        if (getToken() && userEmail) {
            authContainer.innerHTML = `
                ${isAdmin ? `<button id="openAdminBtn" style="padding: 6px 12px; background: #1E293B; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">Admin Panel</button>` : ''}
                <span style="font-size: 13px; color: #4A5565; max-width: 110px; overflow: hidden; text-overflow: ellipsis;">${userEmail}</span>
                <button id="logoutBtn" style="padding: 6px 12px; border: 1px solid #D1D5DC; border-radius: 6px; background: white; cursor: pointer; font-size: 13px;">Logout</button>
            `;
        } else {
            authContainer.innerHTML = `
                <button id="openLoginBtn" style="padding: 8px 16px; background: #F54900; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px;">Sign In</button>
            `;
        }
        
        headerInner.insertBefore(authContainer, cartBlock);

        document.getElementById('openLoginBtn')?.addEventListener('click', openAuthModal);
        document.getElementById('openAdminBtn')?.addEventListener('click', openAdminModal);
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            removeToken();
            window.location.reload();
        });
    }

    initAuthModal();
    if (isAdmin) initAdminModal();
});

function initAuthModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;';
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 380px; position: relative; font-family: Inter, sans-serif;">
            <button id="closeAuthModal" style="position: absolute; top: 15px; right: 15px; border: none; background: none; font-size: 20px; cursor: pointer;">&times;</button>
            <h2 id="authModalTitle" style="margin-top: 0; margin-bottom: 20px; font-size: 22px;">Sign In</h2>
            <form id="authForm" style="display: flex; flex-direction: column; gap: 14px;">
                <input type="email" id="authEmail" placeholder="Email" required style="padding: 10px; border: 1px solid #D1D5DC; border-radius: 6px;">
                <input type="password" id="authPassword" placeholder="Password" required style="padding: 10px; border: 1px solid #D1D5DC; border-radius: 6px;">
                <div id="authError" style="color: #E7000B; font-size: 13px; display: none;"></div>
                <button type="submit" id="authSubmitBtn" style="padding: 12px; background: #F54900; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Login</button>
            </form>
            <p style="margin-top: 15px; font-size: 13px; text-align: center; color: #4A5565;">
                <span id="authToggleText">Don't have an account?</span>
                <a href="#" id="authToggleLink" style="color: #F54900; font-weight: 500;">Register</a>
            </p>
        </div>
    `;
    document.body.appendChild(modal);

    let isRegisterMode = false;
    document.getElementById('closeAuthModal').onclick = () => modal.style.display = 'none';
    document.getElementById('authToggleLink').onclick = (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        document.getElementById('authModalTitle').textContent = isRegisterMode ? 'Create Account' : 'Sign In';
        document.getElementById('authSubmitBtn').textContent = isRegisterMode ? 'Register' : 'Login';
        document.getElementById('authToggleText').textContent = isRegisterMode ? 'Already have an account?' : "Don't have an account?";
        document.getElementById('authToggleLink').textContent = isRegisterMode ? 'Sign In' : 'Register';
    };

    document.getElementById('authForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const errDiv = document.getElementById('authError');
        errDiv.style.display = 'none';

        try {
            if (isRegisterMode) {
                await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
            }
            const token = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            }).then(async r => {
                if (!r.ok) throw new Error((await r.json()).message || 'Ошибка входа');
                return r.text();
            });

            setToken(token);
            localStorage.setItem('buildmart_user_email', email);
            window.location.reload();
        } catch (err) {
            errDiv.textContent = err.message;
            errDiv.style.display = 'block';
        }
    };
}

function initAdminModal() {
    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center; padding: 20px;';
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; position: relative; font-family: Inter, sans-serif;">
            <button id="closeAdminModal" style="position: absolute; top: 15px; right: 15px; border: none; background: none; font-size: 24px; cursor: pointer;">&times;</button>
            <h2 style="margin-top: 0; margin-bottom: 15px;">Admin Panel — Manage Products</h2>
            
            <form id="createProductForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #F8FAFC; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <input type="text" id="prodTitle" placeholder="Title (e.g. Hammer)" required style="padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">
                <input type="number" step="0.01" id="prodPrice" placeholder="Price ($)" required style="padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">
                <input type="number" step="0.1" max="5" id="prodRating" placeholder="Rating (0-5)" value="4.8" required style="padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">
                <input type="number" id="prodStock" placeholder="Stock Quantity" value="10" required style="padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">
                <textarea id="prodDesc" placeholder="Description" required style="grid-column: 1 / -1; padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px; height: 60px;"></textarea>
                <input type="text" id="prodImages" placeholder="Image URLs separated by comma (min 3)" required style="grid-column: 1 / -1; padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">
                <button type="submit" style="grid-column: 1 / -1; padding: 10px; background: #F54900; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">+ Add Product</button>
            </form>

            <h3 style="margin-bottom: 10px;">Existing Products</h3>
            <div id="adminProductsList" style="display: flex; flex-direction: column; gap: 10px;">Loading...</div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeAdminModal').onclick = () => modal.style.display = 'none';

    document.getElementById('createProductForm').onsubmit = async (e) => {
        e.preventDefault();
        const rawUrls = document.getElementById('prodImages').value.split(',').map(u => u.trim()).filter(Boolean);
        const images = rawUrls.length >= 3 ? rawUrls : [rawUrls[0], rawUrls[0], rawUrls[0]];

        try {
            await apiRequest('/products', {
                method: 'POST',
                body: JSON.stringify({
                title: document.getElementById('prodTitle').value,
                price: Number(document.getElementById('prodPrice').value),
                rating: Number(document.getElementById('prodRating').value),
                stock_quantity: Number(document.getElementById('prodStock').value),
                description: document.getElementById('prodDesc').value,
                images
                })
            });
            document.getElementById('createProductForm').reset();
            await loadAdminProducts();
            window.fetchAndRenderProducts?.();
        } catch (err) {
            alert(err.message);
        }
    };
}

async function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.style.display = 'flex';
        await loadAdminProducts();
    }
}

async function loadAdminProducts() {
    const list = document.getElementById('adminProductsList');
    if (!list) return;
    try {
        const data = await apiRequest('/products?limit=100');
        const items = data.items || [];
        list.innerHTML = items.map(p => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 1px solid #E2E8F0; border-radius: 6px; gap: 10px;">
                <div style="flex: 1;">
                    <strong>${p.title}</strong><br>
                    <span style="font-size: 13px; color: #64748B;">Price: $${Number(p.price).toFixed(2)} | Stock: ${p.stock_quantity}</span>
                </div>
                <button onclick="adminEditPrice('${p.id}', ${p.price}, ${p.stock_quantity})" style="padding: 6px 10px; background: #0284C7; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button>
                <button onclick="adminDeleteProduct('${p.id}')" style="padding: 6px 10px; background: #DC2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

async function adminEditPrice(id, oldPrice, oldStock) {
    const newPrice = prompt('Enter new price ($):', oldPrice);
    if (newPrice === null) return;
    const newStock = prompt('Enter new stock quantity:', oldStock);
    if (newStock === null) return;

    try {
        await apiRequest(`/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                price: Number(newPrice),
                stock_quantity: Number(newStock)
            })
        });
        await loadAdminProducts();
        window.fetchAndRenderProducts?.();
    } catch (err) {
        alert(err.message);
    }
}

async function adminDeleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
        await apiRequest(`/products/${id}`, { method: 'DELETE' });
        await loadAdminProducts();
        window.fetchAndRenderProducts?.();
    } catch (err) {
        alert(err.message);
    }
}

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'flex';
}
