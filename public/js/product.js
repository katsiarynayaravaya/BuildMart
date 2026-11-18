let currentImageIndex = 0;
let productImages = [];
let currentProduct = null;

function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function renderStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDC700" stroke-width="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="#FDC700"/></svg>`;
  }
  
  if (hasHalfStar) {
    stars += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDC700" stroke-width="2"><path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2v16.338z" fill="#FDC700"/></svg>`;
  }
  
  const emptyCount = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyCount; i++) {
    stars += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DC" stroke-width="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="none"/></svg>`;
  }
  
  return stars;
}

function renderSmallStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars += `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FDC700" stroke-width="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="#FDC700"/></svg>`;
  }
  
  if (hasHalfStar) {
    stars += `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FDC700" stroke-width="2"><path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2v16.338z" fill="#FDC700"/></svg>`;
  }
  
  const emptyCount = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyCount; i++) {
    stars += `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DC" stroke-width="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="none"/></svg>`;
  }
  
  return stars;
}

function initGallery() {
  const thumbnailsContainer = document.getElementById('thumbnails');
  if (!thumbnailsContainer) return;
  
  thumbnailsContainer.innerHTML = '';
  
  productImages.forEach((img, index) => {
    const thumb = document.createElement('div');
    thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${img}" alt="Thumb ${index + 1}">`;
    thumb.onclick = () => changeImage(index);
    thumbnailsContainer.appendChild(thumb);
  });
  
  document.getElementById('prevBtn')?.addEventListener('click', () => changeImage(currentImageIndex - 1));
  document.getElementById('nextBtn')?.addEventListener('click', () => changeImage(currentImageIndex + 1));
}

function changeImage(index) {
  const totalImages = productImages.length;
  if (index < 0) index = totalImages - 1;
  if (index >= totalImages) index = 0;
  
  currentImageIndex = index;
  const mainImage = document.getElementById('main-image');
  if (mainImage) mainImage.src = productImages[currentImageIndex];
  
  document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === currentImageIndex);
  });
}

function initQuantity() {
  const quantityInput = document.getElementById('quantity');
  const minusBtn = document.getElementById('qtyMinus');
  const plusBtn = document.getElementById('qtyPlus');
  
  minusBtn?.addEventListener('click', () => {
    let val = parseInt(quantityInput.value);
    if (val > 1) quantityInput.value = val - 1;
  });
  
  plusBtn?.addEventListener('click', () => {
    let val = parseInt(quantityInput.value);
    quantityInput.value = val + 1;
  });
}


function initSpecAccordion() {
  const header = document.getElementById('specHeader');
  const content = document.getElementById('specContent');
  const arrow = document.querySelector('.spec-arrow');
  
  if (header && content) {
    content.classList.remove('open');
    
    header.addEventListener('click', () => {
      content.classList.toggle('open');
      arrow?.classList.toggle('open');
    });
  }
}

async function loadProduct() {
  const productId = getProductIdFromUrl();
  if (!productId) return;
  
  try {
    const data = await apiRequest('/products?limit=100');
    const products = data.items || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) throw new Error('Product not found');
    
    currentProduct = product;
    productImages = (product.images && product.images.length > 0) 
      ? product.images 
      : ['https://placeholder.com'];
    
    document.getElementById('product-breadcrumb').textContent = product.title;
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('main-image').src = productImages[0];
    document.getElementById('product-stars').innerHTML = renderStars(Number(product.rating));
    document.getElementById('product-rating-value').textContent = `(${Number(product.rating).toFixed(1)})`;
    document.getElementById('product-price').textContent = `$${Number(product.price).toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;
    
    initGallery();
    initQuantity();
    initCart();
    initSpecAccordion();
    loadRelatedProducts(products, product.id);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

function initCart() {
  const addBtn = document.getElementById('addToCartBtn');
  const buyBtn = document.getElementById('buyNowBtn');
  const quantityInput = document.getElementById('quantity');
  
  addBtn?.addEventListener('click', async () => {
    const qty = parseInt(quantityInput.value) || 1;
    await addToCart(currentProduct.id, currentProduct.title, qty);
  });
  
  buyBtn?.addEventListener('click', async () => {
    const qty = parseInt(quantityInput.value) || 1;
    await addToCart(currentProduct.id, currentProduct.title, qty);
    window.location.href = '/html/card.html';
  });
}

async function loadRelatedProducts(allProducts, currentId) {
  const related = allProducts.filter(p => p.id !== currentId).slice(0, 4);
  const grid = document.getElementById('related-grid');
  if (!grid) return;
  
  grid.innerHTML = related.map(p => {
    const img = (p.images && p.images.length > 0) ? p.images[0] : 'https://placeholder.com';
    return `
      <a href="/html/product.html?id=${p.id}" class="related-card">
        <div class="related-card-img"><img src="${img}" alt="${p.title}"></div>
        <div class="related-card-content">
          <div class="related-card-title">${p.title}</div>
          <div class="related-card-rating">
            <div class="stars">${renderSmallStars(Number(p.rating))}</div>
            <span class="related-card-rating-value">(${Number(p.rating).toFixed(1)})</span>
          </div>
          <div class="related-card-price">$${Number(p.price).toFixed(2)}</div>
        </div>
      </a>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
});