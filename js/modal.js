/* Contact modal */
(function () {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    const triggers = document.querySelectorAll('.open-contact');

    function open(e) {
        if (e) e.preventDefault();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function close() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    triggers.forEach(function (el) {
        el.addEventListener('click', open);
    });

    modal.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-modal-close')) close();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
})();

/* Scroll spy — highlight active nav link by current section */
(function () {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const links = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu-links a[href^="#"]');
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    const ratios = new Map();

    function setActive(id) {
        links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            ratios.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId = null;
        let bestRatio = 0;
        ratios.forEach(function (ratio, id) {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestId = id;
            }
        });
        if (bestId) setActive(bestId);
    }, {
        rootMargin: '-72px 0px 0px 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (s) { observer.observe(s); });
})();

/* Mobile menu drawer */
(function () {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;

    const toggle = document.querySelector('.nav-toggle');

    function open() {
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }

    function close() {
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    if (toggle) toggle.addEventListener('click', open);

    menu.addEventListener('click', function (e) {
        if (e.target.closest('[data-menu-close]')) close();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
    });
})();
