window.allProducts = [];
window.currentProducts = [];
window.currentSortType = 'name-asc';

document.addEventListener('DOMContentLoaded', function () {
    fetch('../data/products.json')
        .then(response => response.json())
        .then(products => {
            window.allProducts = products;
            window.currentProducts = [...products];

            renderProducts(window.currentProducts);
            initCartButtons();

            if (window.updatePriceRangeLimits) {
                window.updatePriceRangeLimits();
            }

            if (window.filterAndDisplay) {
                window.filterAndDisplay();
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки товаров:', error);
            const container = document.querySelector('.products');
            if (container) {
                container.innerHTML = '<p style="text-align:center; padding:40px;">Ошибка загрузки товаров</p>';
            }
        });
});

function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += `<svg class="star star-full" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="#FDC700" stroke="#FDC700" stroke-width="1"/>
        </svg>`;
    }
    
    if (hasHalfStar) {
        stars += `<svg class="star star-half" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2v16.338z" fill="#FDC700" stroke="#FDC700" stroke-width="1"/>
        </svg>`;
    }
    
    const emptyCount = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyCount; i++) {
        stars += `<svg class="star star-empty" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="none" stroke="#D1D5DC" stroke-width="1.33px"/>
        </svg>`;
    }
    
    return `<div style="display: flex; align-items: center; gap: 4px;">${stars}<span class="rating-value" style="margin-left: 4px; font-size: 14px; color: #4A5565;">${rating.toFixed(1)}</span></div>`;
}

function renderProducts(products) {
    const container = document.querySelector('.products');
    if (!container) return;
    
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12" style="grid-column: 1/-1;">
                <p style="color:#6A7282;font-size:18px;">
                    No products match your filters.
                </p>
                <button class="clear-filters-message-btn" style="margin-top: 16px; color: #F54900; background: none; border: none; cursor: pointer; font-size: 16px;">
                    Clear filters
                </button>
            </div>
        `;

        const btn = document.querySelector('.clear-filters-message-btn');
        if (btn) btn.addEventListener('click', () => window.clearAllFilters?.());

        window.updateProductsCount?.(0);
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <a href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}"></a>
            <a href="product.html?id=${product.id}">${product.name}</a>
            <div class="rating" style="display: flex; align-items: center; margin: 8px 16px 0 16px;">
                ${renderStars(product.rating)}
            </div>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="category">${product.category}</p>
            <button class="btn add-to-cart" data-id="${product.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                Add to Cart
            </button>
        `;

        container.appendChild(card);
    });

    window.updateProductsCount?.(products.length);
    initCartButtons?.();
}

function sortProductsDirectly(productsArray, sortType) {
    if (!productsArray) return;
    
    let sorted = [...productsArray];

    switch (sortType) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
    }

    window.currentProducts = sorted;
    renderProducts(sorted);
}

window.renderProducts = renderProducts;
window.sortProductsDirectly = sortProductsDirectly;