(function () {
    const centers = [
        { x: 120, y: 135 }, { x: 300, y: 135 }, { x: 480, y: 135 },
        { x: 660, y: 135 }, { x: 840, y: 135 }, { x: 1020, y: 135 },
        { x: 1020, y: 300 }, { x: 840, y: 300 }, { x: 660, y: 300 },
        { x: 300, y: 300 }, { x: 120, y: 300 }
    ];

    const TOTAL = centers.length;
    const STEP_DURATION = 4000;
    const TRAVEL_DURATION = 1800;
    const PAUSE_AT_END = 4500;

    const statusLabels = [
        'Draft', 'Review', 'Approved', 'Execute', 'Liquidity Found',
        'Acquisition', 'Acquired', 'Hold', 'Transfer', 'Complete', 'Done'
    ];

    const svg = document.getElementById('lifecycle-svg');
    if (!svg) return;

    const nodes = svg.querySelectorAll('.lc-node');
    const particle = document.getElementById('particle');
    const fwdEdges = svg.querySelectorAll('.fwd-edge');
    const statusEl = document.querySelector('.lc-status-value');
    let currentStep = -1;
    let isRunning = false;

    function setStatus(text) {
        if (statusEl) statusEl.textContent = text;
    }

    function resetAll() {
        nodes.forEach(function (g) {
            var bg = g.querySelector('.node-bg');
            var glow = g.querySelector('.node-glow');
            bg.setAttribute('fill', 'rgba(201,168,76,0.05)');
            bg.setAttribute('stroke', 'rgba(201,168,76,0.2)');
            bg.setAttribute('stroke-width', '1');
            glow.setAttribute('opacity', '0');
            g.querySelectorAll('text').forEach(function (t) {
                t.setAttribute('fill', t.classList.contains('node-desc') ? '#4e4a44' : '#8a8680');
            });
        });
        fwdEdges.forEach(function (e) {
            e.setAttribute('stroke', '#3d3828');
            e.setAttribute('stroke-width', '1');
            e.setAttribute('marker-end', 'url(#arrow-dim)');
        });
        particle.setAttribute('opacity', '0');
        currentStep = -1;
    }

    function highlightNode(index, isCurrent) {
        var g = nodes[index];
        if (!g) return;
        var bg = g.querySelector('.node-bg');
        var glow = g.querySelector('.node-glow');

        if (isCurrent) {
            bg.setAttribute('fill', '#e4ca7a');
            bg.setAttribute('stroke', '#c9a84c');
            bg.setAttribute('stroke-width', '1');
            glow.setAttribute('opacity', '1');
            g.querySelectorAll('text').forEach(function (t) {
                t.setAttribute('fill', t.classList.contains('node-desc') ? 'rgba(26,26,26,0.7)' : '#1a1a1a');
            });
        } else {
            bg.setAttribute('fill', 'rgba(201,168,76,0.18)');
            bg.setAttribute('stroke', 'rgba(201,168,76,0.5)');
            bg.setAttribute('stroke-width', '1');
            glow.setAttribute('opacity', '0');
            g.querySelectorAll('text').forEach(function (t) {
                t.setAttribute('fill', t.classList.contains('node-desc') ? '#8a8680' : '#e4ca7a');
            });
        }
    }

    function highlightEdge(index) {
        if (index < fwdEdges.length) {
            var e = fwdEdges[index];
            e.setAttribute('stroke', '#c9a84c');
            e.setAttribute('stroke-width', '1.5');
            e.setAttribute('marker-end', 'url(#arrow-gold)');
        }
    }

    function animateParticle(fromIdx, toIdx, duration) {
        var from = centers[fromIdx];
        var to = centers[toIdx];
        particle.setAttribute('cx', from.x);
        particle.setAttribute('cy', from.y);
        particle.setAttribute('opacity', '0.9');

        var startTime = performance.now();
        function step(now) {
            var progress = Math.min((now - startTime) / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3);
            particle.setAttribute('cx', from.x + (to.x - from.x) * ease);
            particle.setAttribute('cy', from.y + (to.y - from.y) * ease);
            if (progress < 1 && isRunning) {
                requestAnimationFrame(step);
            } else {
                particle.setAttribute('opacity', '0');
            }
        }
        requestAnimationFrame(step);
    }

    function advance() {
        if (!isRunning) return;
        currentStep++;

        if (currentStep >= TOTAL) {
            setTimeout(function () {
                if (isRunning) {
                    resetAll();
                    setStatus('—');
                    setTimeout(advance, 400);
                }
            }, PAUSE_AT_END);
            return;
        }

        for (var i = 0; i < currentStep; i++) {
            highlightNode(i, false);
        }
        highlightNode(currentStep, true);
        setStatus(statusLabels[currentStep]);

        if (currentStep > 0) {
            highlightEdge(currentStep - 1);
            animateParticle(currentStep - 1, currentStep, TRAVEL_DURATION);
        }

        setTimeout(advance, STEP_DURATION);
    }

    new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                if (!isRunning) {
                    isRunning = true;
                    resetAll();
                    advance();
                }
            } else {
                isRunning = false;
                resetAll();
            }
        });
    }, { threshold: 0.3 }).observe(document.getElementById('lifecycle'));
})();
