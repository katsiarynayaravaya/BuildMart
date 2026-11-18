window.filterState = {
    search: '',
    min_rating: '',
    min_price: '',
    max_price: '',
    sort_by: 'title',
    order: 'asc',
    page: 1,
    limit: 6
};

async function fetchAndRenderProducts() {
    const container = document.querySelector('.products');
    if (!container) return;

    const params = new URLSearchParams();
    Object.entries(window.filterState).forEach(([key, val]) => {
        if (val !== '' && val !== null && val !== undefined) {
            params.append(key, val);
        }
    });

    try {
        const data = await apiRequest(`/products?${params.toString()}`);
        const products = data.items || [];
        renderProducts(products, data.meta?.total_items ?? products.length);
        renderPagination(data.meta);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        container.innerHTML = '<p style="text-align:center; padding:40px;">Ошибка загрузки товаров с сервера</p>';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchAndRenderProducts();

    const searchInputs = document.querySelectorAll('.search, .mobile-search');
    let searchTimeout;
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                window.filterState.search = e.target.value.trim();
                window.filterState.page = 1;
                fetchAndRenderProducts();
            }, 400);
        });
    });
});

function renderStars(rating) {
    const numRating = Number(rating) || 0;
    let stars = '';
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += `<svg class="star star-full" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="#FDC700" stroke="#FDC700" stroke-width="1"/></svg>`;
    }
    if (hasHalfStar) {
        stars += `<svg class="star star-half" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2v16.338z" fill="#FDC700" stroke="#FDC700" stroke-width="1"/></svg>`;
    }
    const emptyCount = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyCount; i++) {
        stars += `<svg class="star star-empty" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="none" stroke="#D1D5DC" stroke-width="1.33px"/></svg>`;
    }
    return `<div style="display: flex; align-items: center; gap: 4px;">${stars}<span class="rating-value" style="margin-left: 4px; font-size: 14px; color: #4A5565;">${numRating.toFixed(1)}</span></div>`;
}

function renderProducts(products, totalItems) {
    const container = document.querySelector('.products');
    if (!container) return;
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="no-products-message" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>No products match your filters.</p>
                <button class="clear-filters-message-btn" style="margin-top: 10px; padding: 8px 16px; cursor: pointer;">Clear filters</button>
            </div>
        `;
        document.querySelector('.clear-filters-message-btn')?.addEventListener('click', () => window.clearAllFilters?.());
        window.updateProductsCount?.(0);
        return;
    }

    products.forEach(product => {
        const price = Number(product.price);
        const mainImg = (product.images && product.images.length > 0) ? product.images[0] : 'https://placeholder.com';
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <a href="/html/product.html?id=${product.id}"><img src="${mainImg}" alt="${product.title}"></a>
            <a href="/html/product.html?id=${product.id}">${product.title}</a>
            <div class="rating" style="display: flex; align-items: center; margin: 8px 16px 0 16px;">
                ${renderStars(product.rating)}
            </div>
            <p class="price">$${price.toFixed(2)}</p>
            <p class="category">In stock: ${product.stock_quantity}</p>
            <button class="btn add-to-cart" data-id="${product.id}">
                <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                Add to Cart
            </button>
        `;
        container.appendChild(card);
    });

    window.updateProductsCount?.(totalItems);
    if (typeof initCartButtons === 'function') initCartButtons();
}

window.fetchAndRenderProducts = fetchAndRenderProducts;

function renderPagination(meta) {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer || !meta) return;

    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 40px; margin-bottom: 20px;';
        productsContainer.parentNode.insertBefore(paginationContainer, productsContainer.nextSibling);
    }

    if (meta.total_pages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let html = '';

    html += `<button ${meta.current_page === 1 ? 'disabled' : ''} onclick="changePage(${meta.current_page - 1})" 
        style="padding: 8px 14px; border: 1px solid #D1D5DC; border-radius: 6px; background: white; cursor: ${meta.current_page === 1 ? 'not-allowed' : 'pointer'}; opacity: ${meta.current_page === 1 ? '0.5' : '1'};">
        &larr; Prev
    </button>`;

    for (let i = 1; i <= meta.total_pages; i++) {
        const isActive = i === meta.current_page;
        html += `<button onclick="changePage(${i})" 
            style="padding: 8px 14px; border: 1px solid ${isActive ? '#F54900' : '#D1D5DC'}; border-radius: 6px; background: ${isActive ? '#F54900' : 'white'}; color: ${isActive ? 'white' : '#1E293B'}; font-weight: ${isActive ? '600' : '400'}; cursor: pointer;">
            ${i}
        </button>`;
    }

    html += `<button ${meta.current_page === meta.total_pages ? 'disabled' : ''} onclick="changePage(${meta.current_page + 1})" 
        style="padding: 8px 14px; border: 1px solid #D1D5DC; border-radius: 6px; background: white; cursor: ${meta.current_page === meta.total_pages ? 'not-allowed' : 'pointer'}; opacity: ${meta.current_page === meta.total_pages ? '0.5' : '1'};">
        Next &rarr;
    </button>`;

    paginationContainer.innerHTML = html;
}

window.changePage = function(newPage) {
    window.filterState.page = newPage;
    fetchAndRenderProducts();
    document.querySelector('.toolbar')?.scrollIntoView({ behavior: 'smooth' });
};
