/* Architecture diagram — flow tab switcher.
   Each .arch-diagram has a tab bar; clicking a tab updates
   data-active-flow on the diagram root, which CSS uses to dim
   non-matching nodes/arrows. */
(function () {
    const diagrams = document.querySelectorAll('.arch-diagram');
    diagrams.forEach(function (diagram) {
        const tabs = diagram.querySelectorAll('.arch-tab');
        if (!tabs.length) return;

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const flow = tab.dataset.flow;
                if (!flow) return;
                tabs.forEach(function (t) {
                    const isActive = t === tab;
                    t.classList.toggle('is-active', isActive);
                    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
                });
                diagram.setAttribute('data-active-flow', flow);
            });
        });
    });
})();
