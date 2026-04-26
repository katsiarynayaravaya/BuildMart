document.addEventListener('DOMContentLoaded', () => {

  const showFiltersBtn = document.querySelector('.btn--outline');
  const filtersBlock = document.querySelector('.filters');
  const toolbarLeftSpan = document.querySelector('.toolbar__left span');
  const sortSelect = document.querySelector('.toolbar__right select');

  const ratingCheckboxes = document.querySelectorAll('.rating-option input');
  const minSlider = document.getElementById('minSlider');
  const maxSlider = document.getElementById('maxSlider');
  const priceMinSpan = document.querySelector('.price-min');
  const priceMaxSpan = document.querySelector('.price-max');
  const clearFiltersBtn = document.querySelector('.clear-filters-btn');
  const sliderContainer = document.querySelector('.slider-container');

  let selectedRating = null;
  let minPrice = 0;
  let maxPrice = 400;

  let actualMaxPrice = 349.99;   
  let defaultMaxPrice = 400;   
  let hasMaxPriceBeenReached = false; 

  let isUpdating = false;

  function updateProductsCount(count) {
    if (toolbarLeftSpan) {
      toolbarLeftSpan.textContent = `Showing ${count} products`;
    }
  }

  function getActualMaxProductPrice() {
    if (window.allProducts?.length) {
      return Math.max(...window.allProducts.map(p => p.price));
    }
    return 349.99;
  }

  function mapSliderToRealValue(value) {
    if (value >= defaultMaxPrice && hasMaxPriceBeenReached) {
      return actualMaxPrice;
    }
    return value;
  }

  
  function updateSliderRange() {
    if (!sliderContainer) return;

    const currentMin = parseFloat(minSlider.value);
    const currentMax = parseFloat(maxSlider.value);

    const min = Math.min(currentMin, currentMax);
    const max = Math.max(currentMin, currentMax);

    const minPercent = (min / defaultMaxPrice) * 100;
    const maxPercent = (max / defaultMaxPrice) * 100;

    sliderContainer.style.setProperty('--min-percent', `${minPercent}%`);
    sliderContainer.style.setProperty('--max-percent', `${maxPercent}%`);
  }

  
  function updatePriceDisplay() {
    const currentMin = parseFloat(minSlider.value);
    const currentMax = parseFloat(maxSlider.value);

    const realMin = mapSliderToRealValue(currentMin);
    const realMax = mapSliderToRealValue(currentMax);

    if (currentMin <= currentMax) {
      priceMinSpan.textContent = `$${realMin}`;
      priceMaxSpan.textContent = `$${realMax}`;
    } else {
      priceMinSpan.textContent = `$${realMax}`;
      priceMaxSpan.textContent = `$${realMin}`;
    }
  }

  
  window.updatePriceRangeLimits = function () {

    actualMaxPrice = getActualMaxProductPrice();
    
    
    hasMaxPriceBeenReached = false;

    defaultMaxPrice = 400;
    minPrice = 0;
    maxPrice = defaultMaxPrice;

    if (minSlider && maxSlider) {
      minSlider.min = 0;
      minSlider.max = defaultMaxPrice;
      maxSlider.min = 0;
      maxSlider.max = defaultMaxPrice;

      minSlider.step = 10;
      maxSlider.step = 10;

      minSlider.value = 0;
      maxSlider.value = defaultMaxPrice;
    }

    
    priceMinSpan.textContent = `$0`;
    priceMaxSpan.textContent = `$400`;

    updateSliderRange();
  };

  
  function filterAndDisplay() {
    if (!window.allProducts?.length) return;

    let filtered = [...window.allProducts];

    if (selectedRating !== null) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    let currentMin = parseFloat(minSlider.value);
    let currentMax = parseFloat(maxSlider.value);

    let filterMin = mapSliderToRealValue(currentMin);
    let filterMax = mapSliderToRealValue(currentMax);

    const min = Math.min(filterMin, filterMax);
    const max = Math.max(filterMin, filterMax);

    filtered = filtered.filter(p => p.price >= min && p.price <= max);

    window.currentProducts = filtered;

    if (window.sortProductsDirectly) {
      window.sortProductsDirectly(filtered, window.currentSortType);
    }
  }

  
  if (showFiltersBtn && filtersBlock) {
    showFiltersBtn.addEventListener('click', () => {
      filtersBlock.classList.toggle('visible');

      const isVisible = filtersBlock.classList.contains('visible');
      showFiltersBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="21" x2="14" y1="4" y2="4"></line>
          <line x1="10" x2="3" y1="4" y2="4"></line>
          <line x1="21" x2="12" y1="12" y2="12"></line>
          <line x1="8" x2="3" y1="12" y2="12"></line>
          <line x1="21" x2="16" y1="20" y2="20"></line>
          <line x1="12" x2="3" y1="20" y2="20"></line>
          <line x1="14" x2="14" y1="2" y2="6"></line>
          <line x1="8" x2="8" y1="10" y2="14"></line>
          <line x1="16" x2="16" y1="18" y2="22"></line>
        </svg>
        ${isVisible ? 'Hide Filters' : 'Show Filters'}
      `;
    });
  }

  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const map = {
        'Name (A-Z)': 'name-asc',
        'Price (Low to High)': 'price-asc',
        'Price (High to Low)': 'price-desc'
      };

      window.currentSortType = map[e.target.value] || 'name-asc';

      if (window.currentProducts) {
        window.sortProductsDirectly(window.currentProducts, window.currentSortType);
      }
    });
  }

  
  if (ratingCheckboxes.length > 0) {
    ratingCheckboxes.forEach(cb => {
      cb.addEventListener('change', function () {

        ratingCheckboxes.forEach(c => {
          if (c !== this) c.checked = false;
        });

        selectedRating = this.checked ? +this.value : null;

        filterAndDisplay();
      });
    });
  }

  
  if (minSlider && maxSlider) {

    function handleSlider() {
      if (isUpdating) return;
      isUpdating = true;

      const currentMax = parseFloat(maxSlider.value);
      
      if (currentMax >= defaultMaxPrice - 1) {
        hasMaxPriceBeenReached = true;
      }
      
      const currentMin = parseFloat(minSlider.value);
      if (currentMin >= defaultMaxPrice - 1) {
        hasMaxPriceBeenReached = true;
      }

      minPrice = parseFloat(minSlider.value);
      maxPrice = parseFloat(maxSlider.value);

      updatePriceDisplay();
      updateSliderRange();
      filterAndDisplay();

      isUpdating = false;
    }

    minSlider.addEventListener('input', handleSlider);
    maxSlider.addEventListener('input', handleSlider);
  }

  window.clearAllFilters = function () {
    selectedRating = null;

    ratingCheckboxes.forEach(cb => cb.checked = false);

    minPrice = 0;
    maxPrice = getActualMaxProductPrice();

    if (minSlider && maxSlider) {
      minSlider.value = 0;
      maxSlider.value = defaultMaxPrice;
    }

    priceMinSpan.textContent = `$0`;
    priceMaxSpan.textContent =`$` + getActualMaxProductPrice();

    updateSliderRange();
    filterAndDisplay();
  };

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', window.clearAllFilters);
  }

  window.filterAndDisplay = filterAndDisplay;
  window.updateProductsCount = updateProductsCount;
});