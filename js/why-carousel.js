/* Why Murabex mobile carousel — manual only (swipe + next button).
   No autoplay, no clones: 6 cards, last one stays put. The next button
   smoothly scrolls back to the first card from the end. */
(function () {
    const slider = document.querySelector('.why-slider');
    if (!slider) return;
    const grid = slider.querySelector('.why-grid');
    if (!grid) return;
    const nextBtn = slider.querySelector('.why-slider-next');

    const mq = window.matchMedia('(max-width: 560px)');
    let cards = [];
    let active = false;

    function setup() {
        teardown();
        if (!mq.matches) return;

        cards = Array.from(grid.querySelectorAll('.w-card'));
        if (cards.length < 2) return;
        active = true;

        grid.scrollTo({ left: 0, behavior: 'auto' });
        if (nextBtn) nextBtn.addEventListener('click', onNextClick);
    }

    function teardown() {
        active = false;
        if (nextBtn) nextBtn.removeEventListener('click', onNextClick);
        cards = [];
    }

    function currentIndex() {
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

    function onNextClick() {
        if (!active) return;
        const next = currentIndex() + 1;
        const target = next >= cards.length ? 0 : cards[next].offsetLeft;
        grid.scrollTo({ left: target, behavior: 'smooth' });
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', setup);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(setup);
    }

    setup();
})();
