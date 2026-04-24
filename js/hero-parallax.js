/* Hero dunes parallax — scroll (depth) + mouse (3D feel) */
(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const img = document.querySelector('.hero-bg-image');
    const hero = document.getElementById('hero');
    if (!img || !hero) return;

    const SCROLL_SPEED = 0.35;
    const MOUSE_STRENGTH = 18;

    let scrollOffset = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(render);
            ticking = true;
        }
    }

    function render() {
        ticking = false;
        // skip parallax on mobile — CSS positions the image statically there
        if (window.innerWidth < 900) {
            img.style.transform = '';
            return;
        }
        const rect = hero.getBoundingClientRect();
        if (!(rect.bottom < 0 || rect.top > window.innerHeight)) {
            scrollOffset = -rect.top * SCROLL_SPEED;
        }
        img.style.transform = `translate3d(${mouseX}px, ${scrollOffset + mouseY}px, 0)`;
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    window.addEventListener('mousemove', function (e) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        // background moves opposite to cursor for depth illusion
        mouseX = ((e.clientX - cx) / cx) * -MOUSE_STRENGTH;
        mouseY = ((e.clientY - cy) / cy) * -MOUSE_STRENGTH;
        requestTick();
    }, { passive: true });

    render();
})();
