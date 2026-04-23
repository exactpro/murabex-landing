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
