/* Language switcher — navigates between index.html (EN) and
   index.ar.html (AR). Active state is derived from <html lang>, so
   refreshing the page or landing on either URL shows the right tab. */
(function () {
    const switches = document.querySelectorAll('.lang-switch');
    if (!switches.length) return;

    const currentLang = document.documentElement.lang === 'ar' ? 'ar' : 'en';

    function syncActive() {
        switches.forEach(function (group) {
            group.querySelectorAll('.lang-btn').forEach(function (btn) {
                const isActive = btn.dataset.lang === currentLang;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        });
    }

    function targetUrl(lang) {
        const path = window.location.pathname;
        const hash = window.location.hash;
        const arFile = 'index.ar.html';
        const enFile = 'index.html';

        // Strip trailing filename from path (works for both /folder/ and /folder/index.html etc.)
        let basePath = path;
        if (basePath.endsWith('/' + arFile)) {
            basePath = basePath.slice(0, -arFile.length);
        } else if (basePath.endsWith('/' + enFile)) {
            basePath = basePath.slice(0, -enFile.length);
        } else if (!basePath.endsWith('/')) {
            basePath = basePath + '/';
        }

        return basePath + (lang === 'ar' ? arFile : enFile) + hash;
    }

    switches.forEach(function (group) {
        group.addEventListener('click', function (e) {
            const btn = e.target.closest('.lang-btn');
            if (!btn) return;
            const targetLang = btn.dataset.lang;
            if (!targetLang || targetLang === currentLang) return;
            window.location.href = targetUrl(targetLang);
        });
    });

    syncActive();
})();
