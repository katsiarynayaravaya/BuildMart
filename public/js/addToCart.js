async function updateCartCount() {
    const cartCountElement = document.querySelector('.cart__count');
    if (!cartCountElement) return;

    if (!getToken()) {
        cartCountElement.style.visibility = 'hidden';
        return;
    }

    try {
        const cartData = await apiRequest('/cart');
        const totalItems = (cartData.items || []).reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.visibility = 'visible';
        } else {
            cartCountElement.style.visibility = 'hidden';
        }
    } catch (e) {
        cartCountElement.style.visibility = 'hidden';
    }
}

async function addToCart(productId, productTitle = 'Item', quantity = 1) {
    if (!getToken()) {
        openAuthModal();
        return;
    }

    try {
        await apiRequest('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
        await updateCartCount();
        if (typeof createToast === 'function') {
            createToast(`Added ${productTitle} to cart`);
        }
    } catch (error) {
        if (typeof createToast === 'function') {
            createToast(`Error: ${error.message}`);
        } else {
            alert(error.message);
        }
    }
}

function initCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = newButton.dataset.id;
            const card = newButton.closest('.card');
            const productTitle = card.querySelector('a:not(:first-child)').textContent;
            addToCart(productId, productTitle, 1);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
