/* Why Murabex mobile carousel — manual only (swipe + next button),
   infinite loop via cloned first card. No autoplay. */
(function () {
    const slider = document.querySelector('.why-slider');
    if (!slider) return;
    const grid = slider.querySelector('.why-grid');
    if (!grid) return;
    const nextBtn = slider.querySelector('.why-slider-next');

    const mq = window.matchMedia('(max-width: 560px)');

    let cards = [];
    let originalCount = 0;
    let resetting = false;
    let scrollEndTimer = null;
    let active = false;

    function getOriginals() {
        return Array.from(grid.querySelectorAll('.w-card:not(.is-clone)'));
    }

    function setup() {
        teardown();
        if (!mq.matches) return;

        const originals = getOriginals();
        originalCount = originals.length;
        if (originalCount < 2) return;

        const clone = originals[0].cloneNode(true);
        clone.classList.add('is-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
        grid.appendChild(clone);

        cards = Array.from(grid.querySelectorAll('.w-card'));
        active = true;

        grid.scrollTo({ left: 0, behavior: 'auto' });

        grid.addEventListener('scroll', onScroll, { passive: true });
        if (nextBtn) nextBtn.addEventListener('click', onNextClick);
    }

    function teardown() {
        active = false;
        grid.querySelectorAll('.w-card.is-clone').forEach(n => n.remove());
        grid.removeEventListener('scroll', onScroll);
        if (nextBtn) nextBtn.removeEventListener('click', onNextClick);
        cards = [];
        originalCount = 0;
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

    function scrollToIndex(i, smooth) {
        const card = cards[i];
        if (!card) return;
        grid.scrollTo({
            left: card.offsetLeft,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }

    function onNextClick() {
        const next = currentIndex() + 1;
        if (next > originalCount) scrollToIndex(0, true);
        else scrollToIndex(next, true);
    }

    function onScroll() {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            if (!active) return;
            if (resetting) {
                resetting = false;
                return;
            }
            // landed on the cloned first card → silently jump back to real first
            if (currentIndex() === originalCount) {
                resetting = true;
                scrollToIndex(0, false);
            }
        }, 200);
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', setup);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(setup);
    }

    setup();
})();
