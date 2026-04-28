/* Features mobile slider — manual paging via "next" button.
   Each click advances to the next column (uniqueing offsetLefts so the
   2-row narrow layout still pages correctly). Wraps to the start at the end.
   scrollIntoView keeps direction handling browser-native (LTR or RTL). */
(function () {
    const slider = document.querySelector('.features-slider');
    if (!slider) return;
    const grid = slider.querySelector('.features-grid');
    if (!grid) return;
    const nextBtn = slider.querySelector('.features-slider-next');

    const mq = window.matchMedia('(max-width: 900px)');
    let cards = [];
    let active = false;

    function setup() {
        teardown();
        if (!mq.matches) return;
        cards = Array.from(grid.querySelectorAll('.f-card'));
        if (cards.length < 2) return;
        active = true;
        if (nextBtn) nextBtn.addEventListener('click', onNextClick);
    }

    function teardown() {
        active = false;
        if (nextBtn) nextBtn.removeEventListener('click', onNextClick);
        cards = [];
    }

    function uniqueStops() {
        const seen = new Set();
        const stops = [];
        for (const c of cards) {
            const v = Math.round(c.offsetLeft);
            if (!seen.has(v)) { seen.add(v); stops.push(v); }
        }
        return stops;
    }

    function currentStopIndex(stops) {
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

    function onNextClick() {
        if (!active) return;
        const stops = uniqueStops();
        if (stops.length < 2) return;
        const cur = currentStopIndex(stops);
        const next = (cur + 1) % stops.length;
        const targetCard = cards.find(c => Math.round(c.offsetLeft) === stops[next]);
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
    }

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', setup);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(setup);
    }

    setup();
})();
