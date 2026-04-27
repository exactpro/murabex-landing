(function () {
    /* === STATIC MODE ===
       Animation removed by request. The full original cycling animation
       (sequential node highlighting + particle travel between nodes) is
       preserved as a commented block at the bottom of this file. To restore:
       replace the body of this IIFE with the code in that block. */

    const VISITED = [0, 1];          // Draft, Review
    const CURRENT = 2;                // Approved
    const VISITED_EDGES = [0, 1];    // Draft→Review, Review→Approved

    const statusLabels = [
        'Draft', 'Review', 'Approved', 'Execute', 'Liquidity Found',
        'Acquisition', 'Acquired', 'Hold', 'Transfer', 'Complete', 'Done'
    ];

    const svg = document.getElementById('lifecycle-svg');
    if (!svg) return;

    const nodes = svg.querySelectorAll('.lc-node');
    const fwdEdges = svg.querySelectorAll('.fwd-edge');
    const statusEl = document.querySelector('.lc-status-value');

    function setNodeVisited(index) {
        const g = nodes[index];
        if (!g) return;
        const bg = g.querySelector('.node-bg');
        const glow = g.querySelector('.node-glow');
        bg.setAttribute('fill', '#1A2048');
        bg.setAttribute('stroke', '#4A7BFF');
        bg.setAttribute('stroke-width', '1');
        glow.setAttribute('opacity', '0');
        g.querySelectorAll('text').forEach(function (t) {
            t.setAttribute('fill', t.classList.contains('node-desc') ? '#C5CBE0' : '#FFFFFF');
        });
    }

    function setNodeCurrent(index) {
        const g = nodes[index];
        if (!g) return;
        const bg = g.querySelector('.node-bg');
        const glow = g.querySelector('.node-glow');
        bg.setAttribute('fill', '#E1B047');
        bg.setAttribute('stroke', '#E1B047');
        bg.setAttribute('stroke-width', '1');
        glow.setAttribute('opacity', '1');
        g.querySelectorAll('text').forEach(function (t) {
            t.setAttribute('fill', t.classList.contains('node-desc') ? 'rgba(26,26,26,0.7)' : '#1a1a1a');
        });
    }

    function highlightEdge(index) {
        const e = fwdEdges[index];
        if (!e) return;
        e.setAttribute('stroke', '#4A7BFF');
        e.setAttribute('stroke-width', '1.5');
        e.setAttribute('marker-end', 'url(#arrow-blue)');
    }

    VISITED.forEach(setNodeVisited);
    setNodeCurrent(CURRENT);
    VISITED_EDGES.forEach(highlightEdge);
    if (statusEl) statusEl.textContent = statusLabels[CURRENT];

    /* === ORIGINAL ANIMATED VERSION (preserved for future restoration) ===
       To bring the animation back: delete everything above inside this IIFE
       and uncomment the block below.

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
            bg.setAttribute('fill', '#E1B047');
            bg.setAttribute('stroke', '#E1B047');
            bg.setAttribute('stroke-width', '1');
            glow.setAttribute('opacity', '1');
            g.querySelectorAll('text').forEach(function (t) {
                t.setAttribute('fill', t.classList.contains('node-desc') ? 'rgba(26,26,26,0.7)' : '#1a1a1a');
            });
        } else {
            bg.setAttribute('fill', '#1A2048');
            bg.setAttribute('stroke', '#4A7BFF');
            bg.setAttribute('stroke-width', '1');
            glow.setAttribute('opacity', '0');
            g.querySelectorAll('text').forEach(function (t) {
                t.setAttribute('fill', t.classList.contains('node-desc') ? '#C5CBE0' : '#FFFFFF');
            });
        }
    }

    function highlightEdge(index) {
        if (index < fwdEdges.length) {
            var e = fwdEdges[index];
            e.setAttribute('stroke', '#4A7BFF');
            e.setAttribute('stroke-width', '1.5');
            e.setAttribute('marker-end', 'url(#arrow-blue)');
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

    === END OF ORIGINAL ANIMATED VERSION === */
})();
