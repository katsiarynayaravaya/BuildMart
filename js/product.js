let currentImageIndex = 0;
let productImages = [];
let currentProduct = null;

function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get('id'));
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

function getSpecifications(productId) {
  const specs = {
    1: [
      { label: "Volume", value: "5 gallons total" },
      { label: "Type", value: "100% Acrylic Latex" },
      { label: "Coverage", value: "400 sq ft per gallon" },
      { label: "Finish", value: "Satin" },
      { label: "Dry Time", value: "2-4 hours" },
      { label: "Colors", value: "Assorted neutral tones" }
    ],
    2: [
      { label: "Dimensions", value: "4' x 8'" },
      { label: "Thickness", value: "3/4 inch" },
      { label: "Grade", value: "CDX" },
      { label: "Plies", value: "7-ply construction" },
      { label: "Exposure", value: "Exterior grade" },
      { label: "Veneer", value: "Softwood" }
    ],
    3: [
      { label: "Weight", value: "50 lbs per bag" },
      { label: "Type", value: "Portland Cement Type I/II" },
      { label: "Compressive Strength", value: "3500 PSI at 28 days" },
      { label: "Setting Time", value: "2-4 hours initial set" },
      { label: "Coverage", value: "Approximately 0.45 cubic feet" },
      { label: "Storage Life", value: "6 months in sealed bag" }
    ],
    4: [
      { label: "Dimensions", value: "2\" x 6\" x 8'" },
      { label: "Wood Type", value: "Douglas Fir" },
      { label: "Grade", value: "Premium Select" },
      { label: "Moisture Content", value: "15% kiln-dried" },
      { label: "Treatment", value: "Pressure-treated option available" },
      { label: "Quantity", value: "Sold individually" }
    ],
    5: [
      { label: "Dimensions", value: "8\" x 4\" x 2.25\"" },
      { label: "Material", value: "Fire-hardened clay" },
      { label: "Compressive Strength", value: "3000+ PSI" },
      { label: "Water Absorption", value: "Less than 8%" },
      { label: "Color", value: "Classic red" },
      { label: "Weight", value: "4.5 lbs per brick" }
    ],
    6: [
      { label: "Length", value: "20 feet" },
      { label: "Profile", value: "W10x49" },
      { label: "Material", value: "ASTM A992 Grade 50 Steel" },
      { label: "Weight", value: "980 lbs" },
      { label: "Yield Strength", value: "50 ksi" },
      { label: "Finish", value: "Mill finish" }
    ]
  };
  return specs[productId] || [
    { label: "Category", value: "Building Materials" },
    { label: "Quality", value: "Premium Grade" },
    { label: "Warranty", value: "30 days" }
  ];
}

function getDescription(productId) {
  const descriptions = {
    1: "Professional-grade exterior paint set designed to withstand harsh weather conditions. This premium paint offers excellent coverage, durability, and color retention. Perfect for residential and commercial exterior surfaces.",
    2: "Versatile construction-grade plywood sheets suitable for a wide range of applications. These sheets are engineered for strength and dimensional stability, perfect for subfloors, roofing, walls, and general construction.",
    3: "High-quality Portland cement bags designed for heavy-duty construction projects. Our premium cement offers exceptional strength, durability, and workability. Ideal for foundations, structural work, and general concrete applications. Each bag contains precisely measured and tested cement that meets international quality standards.",
    4: "Premium kiln-dried lumber planks perfect for all your woodworking and construction needs. These high-grade wooden planks are carefully selected for strength and appearance. Suitable for framing, decking, furniture making, and various carpentry projects.",
    5: "Traditional red clay bricks manufactured to the highest standards. These durable bricks are perfect for walls, patios, pathways, and architectural features. Fire-hardened for exceptional strength and weather resistance.",
    6: "Heavy-duty structural steel I-beams engineered for maximum load-bearing capacity. These professional-grade beams are essential for large construction projects, building frames, and structural support applications."
  };
  return descriptions[productId] || "Professional-grade building material designed for durability and performance.";
}

async function loadProduct() {
  const productId = getProductIdFromUrl();
  
  if (!productId) {
    showError();
    return;
  }
  
  try {
    const response = await fetch('../data/products.json');
    const products = await response.json();
    const product = products.find(p => p.id === productId);
    
    if (!product) throw new Error('Product not found');
    
    currentProduct = product;
    productImages = [product.image, product.image, product.image];
    
    document.getElementById('product-breadcrumb').textContent = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('main-image').src = product.image;
    document.getElementById('product-stars').innerHTML = renderStars(product.rating);
    document.getElementById('product-rating-value').textContent = `(${product.rating.toFixed(1)})`;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = getDescription(product.id);
    
    const specs = getSpecifications(product.id);
    const specGrid = document.getElementById('spec-grid');
    if (specGrid) {
      specGrid.innerHTML = specs.map(spec => `
        <div class="spec-item">
          <span class="spec-label">${spec.label}</span>
          <span class="spec-value">${spec.value}</span>
        </div>
      `).join('');
    }
    
    initGallery();
    initQuantity();
    initCart();
    initSpecAccordion();
    loadRelatedProducts(product.category, product.id);
    
  } catch (error) {
    console.error('Error:', error);
  }
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

function initCart() {
  const addBtn = document.getElementById('addToCartBtn');
  const buyBtn = document.getElementById('buyNowBtn');
  const quantityInput = document.getElementById('quantity');
  
  addBtn?.addEventListener('click', () => {
    const qty = parseInt(quantityInput.value);
    for (let i = 0; i < qty; i++) {
      addToCart(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.image);
    }
  });
  
  buyBtn?.addEventListener('click', () => {
    const qty = parseInt(quantityInput.value);
    for (let i = 0; i < qty; i++) {
      addToCart(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.image);
    }
    window.location.href = 'card.html';
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

async function loadRelatedProducts(category, currentId) {
  try {
    const response = await fetch('../data/products.json');
    const products = await response.json();
    const related = products.filter(p => p.category === category && p.id !== currentId).slice(0, 4);
    
    const grid = document.getElementById('related-grid');
    if (!grid) return;
    
    if (related.length === 0) {
      grid.innerHTML = '';
      return;
    }
    
    grid.innerHTML = related.map(p => `
      <a href="product.html?id=${p.id}" class="related-card">
        <div class="related-card-img">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="related-card-content">
          <div class="related-card-title">${p.name}</div>
          <div class="related-card-rating">
            <div class="stars">${renderSmallStars(p.rating)}</div>
            <span class="related-card-rating-value">(${p.rating.toFixed(1)})</span>
          </div>
          <div class="related-card-price">$${p.price.toFixed(2)}</div>
        </div>
      </a>
    `).join('');
  } catch (error) {
    console.error('Error loading related:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
  if (typeof loadCart === 'function') loadCart();
});