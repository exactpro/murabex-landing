/* Why Murabex mobile carousel — swipe + pagination dots.
   No buttons overlapping content. JS injects one dot per card; tapping
   a dot scrolls to that card; the active dot updates as the user
   swipes. Wraps freely (no end-state). */
(function () {
    const slider = document.querySelector('.why-slider');
    if (!slider) return;
    const grid = slider.querySelector('.why-grid');
    const dotsContainer = slider.querySelector('.why-slider-dots');
    if (!grid || !dotsContainer) return;

    const mq = window.matchMedia('(max-width: 560px)');
    let cards = [];
    let dots = [];
    let active = false;

    function setup() {
        teardown();
        if (!mq.matches) return;

        cards = Array.from(grid.querySelectorAll('.w-card'));
        if (cards.length < 2) return;
        active = true;

        renderDots();
        grid.scrollTo({ left: 0, behavior: 'auto' });
        grid.addEventListener('scroll', updateActiveDot, { passive: true });
        updateActiveDot();
    }

    function teardown() {
        active = false;
        grid.removeEventListener('scroll', updateActiveDot);
        dotsContainer.innerHTML = '';
        dots = [];
        cards = [];
    }

    function renderDots() {
        dotsContainer.innerHTML = '';
        dots = cards.map((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', () => {
                grid.scrollTo({ left: cards[i].offsetLeft, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
            return dot;
        });
    }

    function currentIndex() {
        // If scrolled to the end, force-select the last card. The last
        // snap target's offsetLeft can exceed (scrollWidth - clientWidth)
        // when the card's right edge sits close to the container, leaving
        // scrollLeft permanently shy of its offsetLeft and the active dot
        // stuck on the second-to-last card.
        if (Math.abs(grid.scrollLeft) + grid.clientWidth >= grid.scrollWidth - 4) {
            return cards.length - 1;
        }
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < cards.length; i++) {
            const d = Math.abs(cards[i].offsetLeft - grid.scrollLeft);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        }
        return best;
    }

    function updateActiveDot() {
        if (!active) return;
        const idx = currentIndex();
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('is-active', i === idx);
            dots[i].setAttribute('aria-selected', i === idx ? 'true' : 'false');
        }
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', setup);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(setup);
    }

    setup();
})();
