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

  const defaultMaxPrice = 400;

  window.updateProductsCount = function(count) {
    if (toolbarLeftSpan) {
      toolbarLeftSpan.textContent = `Showing ${count} products`;
    }
  };

  function updateSliderRange() {
    if (!sliderContainer || !minSlider || !maxSlider) return;
    const min = Math.min(parseFloat(minSlider.value), parseFloat(maxSlider.value));
    const max = Math.max(parseFloat(minSlider.value), parseFloat(maxSlider.value));
    sliderContainer.style.setProperty('--min-percent', `${(min / defaultMaxPrice) * 100}%`);
    sliderContainer.style.setProperty('--max-percent', `${(max / defaultMaxPrice) * 100}%`);
  }

  if (showFiltersBtn && filtersBlock) {
    showFiltersBtn.addEventListener('click', () => {
      filtersBlock.classList.toggle('visible');
      const isVisible = filtersBlock.classList.contains('visible');
      showFiltersBtn.innerHTML = `${isVisible ? 'Hide Filters' : 'Show Filters'}`;
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'Name (A-Z)') {
        window.filterState.sort_by = 'title';
        window.filterState.order = 'asc';
      } else if (val === 'Price (Low to High)') {
        window.filterState.sort_by = 'price';
        window.filterState.order = 'asc';
      } else if (val === 'Price (High to Low)') {
        window.filterState.sort_by = 'price';
        window.filterState.order = 'desc';
      }
      window.filterState.page = 1;
      window.fetchAndRenderProducts?.();
    });
  }

  if (ratingCheckboxes.length > 0) {
    ratingCheckboxes.forEach(cb => {
      cb.addEventListener('change', function () {
        ratingCheckboxes.forEach(c => { if (c !== this) c.checked = false; });
        window.filterState.min_rating = this.checked ? this.value : '';
        window.filterState.page = 1;
        window.fetchAndRenderProducts?.();
      });
    });
  }

  if (minSlider && maxSlider) {
    let sliderTimeout;
    function handleSlider() {
      const min = Math.min(parseFloat(minSlider.value), parseFloat(maxSlider.value));
      const max = Math.max(parseFloat(minSlider.value), parseFloat(maxSlider.value));
      priceMinSpan.textContent = `$${min}`;
      priceMaxSpan.textContent = `$${max}`;
      updateSliderRange();

      clearTimeout(sliderTimeout);
      sliderTimeout = setTimeout(() => {
        window.filterState.min_price = min > 0 ? min : '';
        window.filterState.max_price = max < defaultMaxPrice ? max : '';
        window.filterState.page = 1;
        window.fetchAndRenderProducts?.();
      }, 400);
    }

    minSlider.addEventListener('input', handleSlider);
    maxSlider.addEventListener('input', handleSlider);
    updateSliderRange();
  }

  window.clearAllFilters = function () {
    ratingCheckboxes.forEach(cb => cb.checked = false);
    if (minSlider && maxSlider) {
      minSlider.value = 0;
      maxSlider.value = defaultMaxPrice;
    }
    if (priceMinSpan) priceMinSpan.textContent = '$0';
    if (priceMaxSpan) priceMaxSpan.textContent = `$${defaultMaxPrice}`;
    updateSliderRange();

    window.filterState.search = '';
    window.filterState.min_rating = '';
    window.filterState.min_price = '';
    window.filterState.max_price = '';
    window.filterState.page = 1;
    window.fetchAndRenderProducts?.();
  };

  clearFiltersBtn?.addEventListener('click', window.clearAllFilters);
});
