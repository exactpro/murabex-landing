/* Features mobile slider — swipe + pagination dots.
   One dot per unique column-stop (handles 1-row and 2-row narrow layouts
   alike). Tapping a dot scrolls to that column; the active dot updates
   as the user swipes. */
(function () {
    const slider = document.querySelector('.features-slider');
    if (!slider) return;
    const grid = slider.querySelector('.features-grid');
    const dotsContainer = slider.querySelector('.features-slider-dots');
    if (!grid || !dotsContainer) return;

    const mq = window.matchMedia('(max-width: 900px)');
    let cards = [];
    let stops = [];
    let dots = [];
    let active = false;

    function setup() {
        teardown();
        if (!mq.matches) return;
        cards = Array.from(grid.querySelectorAll('.f-card'));
        if (cards.length < 2) return;
        active = true;

        // Defer once so the layout settles (column widths reflect the
        // current breakpoint) before measuring offsetLefts.
        requestAnimationFrame(() => {
            stops = uniqueStops();
            renderDots();
            updateActiveDot();
        });
        grid.addEventListener('scroll', updateActiveDot, { passive: true });
        window.addEventListener('resize', onResize);
    }

    function teardown() {
        active = false;
        grid.removeEventListener('scroll', updateActiveDot);
        window.removeEventListener('resize', onResize);
        dotsContainer.innerHTML = '';
        dots = [];
        stops = [];
        cards = [];
    }

    function onResize() {
        if (!active) return;
        stops = uniqueStops();
        renderDots();
        updateActiveDot();
    }

    function uniqueStops() {
        const seen = new Set();
        const out = [];
        for (const c of cards) {
            const v = Math.round(c.offsetLeft);
            if (!seen.has(v)) { seen.add(v); out.push(v); }
        }
        return out;
    }

    function renderDots() {
        dotsContainer.innerHTML = '';
        dots = stops.map((stop, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', () => {
                grid.scrollTo({ left: stop, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
            return dot;
        });
    }

    function currentStopIndex() {
        // Force-select the last stop when scrolled to the end (the last
        // column's offsetLeft can exceed scrollLeft's max so the
        // proximity check would otherwise stick on the second-to-last).
        if (Math.abs(grid.scrollLeft) + grid.clientWidth >= grid.scrollWidth - 4) {
            return stops.length - 1;
        }
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < stops.length; i++) {
            const d = Math.abs(stops[i] - grid.scrollLeft);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        }
        return best;
    }

    function updateActiveDot() {
        if (!active || !dots.length) return;
        const idx = currentStopIndex();
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
