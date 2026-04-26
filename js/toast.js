document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('toast-container');

    let toasts = [];
    let isExpanded = false;
    let draggedToast = null;

    if (!container) {
        console.error('toast-container not found');
        return;
    }

    container.setAttribute('data-expanded', 'false');

    container.addEventListener('mouseenter', () => {
        if (!toasts.length) return;
        isExpanded = true;
        container.setAttribute('data-expanded', 'true');
        pauseAllTimers();
    });

    container.addEventListener('mouseleave', () => {
        if (draggedToast) return;
        isExpanded = false;
        container.setAttribute('data-expanded', 'false');
        resumeAllTimers();
    });

    function updatePositions() {
        toasts.forEach((toast, index) => {
            toast.setAttribute('data-index', index);
        });
    }

    function pauseAllTimers() {
        toasts.forEach(t => t._pauseTimer && t._pauseTimer());
    }

    function resumeAllTimers() {
        toasts.forEach(t => t._resumeTimer && t._resumeTimer());
    }

    function setupSwipe(toast, timeoutId) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const onMove = (e) => {
            if (!isDragging) return;

            currentX = e.clientX;
            let deltaX = currentX - startX;
            if (deltaX < 0) deltaX = 0;

            toast.style.transform = `translateX(${deltaX}px)`;
            toast.style.transition = 'none';
        };

        const onUp = () => {
            if (!isDragging) return;

            isDragging = false;
            draggedToast = null;

            let deltaX = currentX - startX;

            if (deltaX > 120) {
                toast.style.transition = 'transform 0.15s linear';
                toast.style.transform = 'translateX(600px)';

                setTimeout(() => {
                    if (toasts.includes(toast)) {
                        if (timeoutId) clearTimeout(timeoutId);
                        toast.remove();
                        toasts = toasts.filter(t => t !== toast);
                        updatePositions();
                    }
                }, 150);
            } else {
                toast.style.transition = 'transform 0.15s linear';
                toast.style.transform = 'translateX(0)';

                setTimeout(() => {
                    toast.style.transition = '';
                    toast.style.transform = '';
                    toast._resumeTimer && toast._resumeTimer();
                }, 150);
            }

            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        toast.addEventListener('mousedown', (e) => {
            if (!isExpanded) return;

            isDragging = true;
            draggedToast = toast;

            startX = e.clientX;
            currentX = e.clientX;

            toast.style.transition = 'none';

            toast._pauseTimer && toast._pauseTimer();

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        });
    }

    function createToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';

        toast.innerHTML = `
            <div class="toast-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2.5" fill="none"/>
                </svg>
            </div>
            <div class="toast-content">
                <div class="toast-title">${escapeHtml(message)}</div>
            </div>
        `;

        toasts.unshift(toast);

        if (toasts.length > 3) {
            const removed = toasts.pop();
            removed && removed.remove();
        }

        container.prepend(toast);
        updatePositions();

        toast.setAttribute('data-entering', 'true');
        setTimeout(() => toast.removeAttribute('data-entering'), 300);

        let remaining = 4000;
        let start = Date.now();
        let paused = false;
        let timeoutId;

        function startTimer() {
            if (paused) return;

            timeoutId = setTimeout(() => {
                if (toasts.includes(toast)) removeToast(toast);
            }, remaining);
        }

        function pause() {
            if (paused) return;
            paused = true;
            clearTimeout(timeoutId);
            remaining -= Date.now() - start;
        }

        function resume() {
            if (!paused) return;
            paused = false;
            start = Date.now();
            startTimer();
        }

        toast._pauseTimer = pause;
        toast._resumeTimer = resume;

        startTimer();

        if (isExpanded) pause();

        setupSwipe(toast, timeoutId);
    }

    function removeToast(toast) {
        toast.setAttribute('data-exiting', 'true');

        setTimeout(() => {
            toast.remove();
            toasts = toasts.filter(t => t !== toast);
            updatePositions();
        }, 250);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    window.createToast = createToast;

});