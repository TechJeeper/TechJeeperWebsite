/**
 * TJ-COMMS — live interactive orbital console with in-console view switching
 */
(function () {
    const FEED = [
        { tag: 'SYS', text: 'uplink handshake complete' },
        { tag: 'SHOP', text: 'etsy bay catalog synced' },
        { tag: 'NET', text: 'discord relay online' },
        { tag: 'LAB', text: 'printventory heartbeat ok' },
        { tag: 'STR', text: 'twitch deck on standby' },
        { tag: 'NAV', text: 'portfolio module mounted' },
        { tag: 'PWR', text: 'filament stores nominal' },
        { tag: 'ORB', text: 'perigee pass in 14m' }
    ];

    const CREW_QUIPS = [
        '"Systems green. Pick a channel."',
        '"Nozzle temp stable at 215°C in zero-G."',
        '"Try typing \'projects\', \'support\', or \'party\' in the prompt."',
        '"Etsy bay has fresh prints ready to ship."',
        '"Don\'t touch the red switch. There is no red switch."'
    ];

    const APP_KEYS = {
        F1: 'shop',
        F2: 'projects',
        F3: 'comms',
        F4: 'support'
    };

    const VIEW_META = {
        home: { chan: 'CH-00 STANDBY', log: 'returned to standby monitor' },
        projects: { chan: 'CH-02 // LAB ARCHIVE', log: 'mounted LAB ARCHIVE in main viewport' },
        support: { chan: 'CH-04 // RESUPPLY', log: 'mounted RESUPPLY BAY in main viewport' }
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let booted = false;
    let feedIndex = 0;
    let currentView = 'home';
    let radarPulse = 0;
    let blips = [
        { a: 0.6, r: 0.45, label: 'SHOP' },
        { a: 1.9, r: 0.68, label: 'PROJ' },
        { a: 3.1, r: 0.35, label: 'COMM' },
        { a: 4.2, r: 0.78, label: 'SUPP' },
        { a: 5.4, r: 0.55, label: 'STRM' }
    ];

    function boot() {
        if (booted) return;
        booted = true;
        document.body.classList.add('os-booted');
    }

    function logLine(tag, text) {
        const body = document.getElementById('os-feed');
        if (!body) return;
        const p = document.createElement('p');
        const stamp = new Date().toISOString().slice(11, 19);
        p.innerHTML = `<span class="tag">[${stamp}] ${tag}</span> ${text}`;
        body.prepend(p);
        while (body.children.length > 6) body.removeChild(body.lastChild);
    }

    function pushFeedLine() {
        const item = FEED[feedIndex % FEED.length];
        feedIndex += 1;
        logLine(item.tag, item.text);
    }

    function updateTelemetry() {
        const clock = document.getElementById('os-clock');
        if (clock) clock.textContent = new Date().toISOString().slice(11, 19) + ' Z';

        const orbit = document.getElementById('os-orbit');
        if (orbit) {
            const wobble = Math.sin(Date.now() / 4000) * 1.8;
            orbit.textContent = `ALT ${(408 + wobble).toFixed(1)}km`;
        }

        const cpu = document.getElementById('os-cpu');
        if (cpu) cpu.textContent = `${10 + Math.floor(Math.random() * 9)}%`;

        const brg = document.getElementById('os-bearing');
        if (brg) {
            const deg = Math.floor((Date.now() / 120) % 360);
            brg.textContent = `BRG ${String(deg).padStart(3, '0')}°`;
        }
    }

    function switchView(viewName, updateHash = true) {
        const views = document.querySelectorAll('.os-view[data-view]');
        if (!views.length) return;

        const target = VIEW_META[viewName] ? viewName : 'home';
        currentView = target;

        views.forEach((v) => {
            const active = v.dataset.view === target;
            v.hidden = !active;
            v.classList.toggle('is-active', active);
        });

        document.body.classList.toggle('os-window-open', target !== 'home');

        document.querySelectorAll('.os-app').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.viewTarget === target);
        });

        const chan = document.getElementById('os-chan-readout');
        if (chan && VIEW_META[target]) {
            chan.textContent = VIEW_META[target].chan;
        }

        if (updateHash) {
            if (target === 'home') {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            } else {
                history.replaceState(null, '', `#${target}`);
            }
        }

        radarPulse = 1;
        if (VIEW_META[target]) {
            logLine('NAV', VIEW_META[target].log);
        }
    }

    function initStarfield() {
        const canvas = document.getElementById('os-starfield');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let stars = [];
        let w = 0;
        let h = 0;
        let mx = 0;
        let my = 0;

        function resize() {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.width = Math.max(1, Math.floor(rect.width * dpr));
            h = canvas.height = Math.max(1, Math.floor(rect.height * dpr));
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            const count = Math.max(60, Math.floor((rect.width * rect.height) / 3800));
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                z: Math.random() * 0.8 + 0.2,
                r: Math.random() * 1.5 + 0.3,
                a: Math.random() * 0.7 + 0.25
            }));
        }

        window.addEventListener('mousemove', (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 18;
            my = (e.clientY / window.innerHeight - 0.5) * 12;
        });

        function draw() {
            ctx.clearRect(0, 0, w, h);
            const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, w * 0.6);
            g.addColorStop(0, 'rgba(0, 110, 175, 0.2)');
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            stars.forEach((st) => {
                if (!reduced) {
                    st.y += st.z * 0.22;
                    if (st.y > h) {
                        st.y = 0;
                        st.x = Math.random() * w;
                    }
                }
                const px = (st.x + mx * st.z + w) % w;
                const py = (st.y + my * st.z + h) % h;
                ctx.beginPath();
                ctx.fillStyle = `rgba(185, 228, 255, ${st.a})`;
                ctx.arc(px, py, st.r, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }

        resize();
        draw();
        window.addEventListener('resize', resize);
    }

    function initRadar() {
        const canvas = document.getElementById('os-radar');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const R = w * 0.45;
        let angle = 0;

        canvas.addEventListener('click', () => {
            radarPulse = 1;
            logLine('SCAN', `sector ping · ${blips.length} targets locked`);
        });

        function draw() {
            ctx.clearRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(0, 191, 255, 0.25)';
            ctx.lineWidth = 1;
            [0.33, 0.66, 1].forEach((f) => {
                ctx.beginPath();
                ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
                ctx.stroke();
            });

            ctx.beginPath();
            ctx.moveTo(cx - R, cy);
            ctx.lineTo(cx + R, cy);
            ctx.moveTo(cx, cy - R);
            ctx.lineTo(cx, cy + R);
            ctx.stroke();

            if (!reduced) angle = (angle + 0.025) % (Math.PI * 2);
            for (let i = 0; i < 24; i++) {
                const a0 = angle - i * 0.03;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, R, a0 - 0.035, a0);
                ctx.closePath();
                ctx.fillStyle = `rgba(0, 191, 255, ${(1 - i / 24) * 0.22})`;
                ctx.fill();
            }

            blips.forEach((b) => {
                const bx = cx + Math.cos(b.a) * R * b.r;
                const by = cy + Math.sin(b.a) * R * b.r;
                const diff = ((angle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
                const glow = Math.max(0.25, 1 - diff / 3.5);
                ctx.beginPath();
                ctx.fillStyle = `rgba(61, 255, 160, ${glow})`;
                ctx.arc(bx, by, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            if (radarPulse > 0.02) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(28, 228, 255, ${radarPulse})`;
                ctx.lineWidth = 2;
                ctx.arc(cx, cy, R * (1 - radarPulse * 0.8), 0, Math.PI * 2);
                ctx.stroke();
                radarPulse *= 0.92;
            }

            requestAnimationFrame(draw);
        }

        draw();
    }

    function initTilt() {
        if (reduced) return;
        const bezel = document.getElementById('console-bezel');
        if (!bezel) return;
        window.addEventListener('mousemove', (e) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            bezel.style.setProperty('--tilt-y', `${(nx * 2.2).toFixed(2)}deg`);
            bezel.style.setProperty('--tilt-x', `${(1.8 - ny * 1.6).toFixed(2)}deg`);
        });
    }

    function tuneChannel(el) {
        const monitor = document.getElementById('os-monitor');
        const code = document.getElementById('os-mon-code');
        const lock = document.getElementById('os-mon-lock');
        const title = document.getElementById('os-mon-title');
        const desc = document.getElementById('os-mon-desc');
        const chan = document.getElementById('os-chan-readout');

        if (!el) return;

        if (currentView === 'home') {
            document.querySelectorAll('.os-app').forEach((a) => a.classList.toggle('active', a === el));
        }

        if (monitor) monitor.classList.add('tuned');
        if (code) code.textContent = el.dataset.code || 'CH-00';
        if (lock) lock.textContent = 'SIGNAL LOCKED · CLICK TO OPEN';
        if (title) title.textContent = el.dataset.title || '';
        if (desc) desc.textContent = el.dataset.desc || '';
        if (chan && el.dataset.code && currentView === 'home') {
            chan.textContent = el.dataset.code.split('//')[0].trim();
        }

        radarPulse = 0.85;
    }

    function bindChannels() {
        const apps = document.querySelectorAll('.os-app');
        apps.forEach((app) => {
            app.addEventListener('mouseenter', () => tuneChannel(app));
            app.addEventListener('focus', () => tuneChannel(app));
        });

        document.querySelectorAll('[data-view-target]').forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                const target = trigger.dataset.viewTarget;
                if (!target) return;
                e.preventDefault();
                // Toggle back to home if clicking the already-open channel button
                if (trigger.classList.contains('os-app') && currentView === target) {
                    switchView('home');
                } else {
                    switchView(target);
                }
            });
        });

        // Sub-tabs inside Projects & Support OS windows
        document.querySelectorAll('.os-subtab[data-pane-target]').forEach((tab) => {
            tab.addEventListener('click', () => {
                const group = tab.dataset.paneGroup;
                const targetId = tab.dataset.paneTarget;
                document.querySelectorAll(`.os-subtab[data-pane-group="${group}"]`).forEach((t) => {
                    t.classList.toggle('is-active', t === tab);
                });
                document.querySelectorAll(`.os-pane[data-pane="${group}"]`).forEach((pane) => {
                    pane.hidden = pane.id !== targetId;
                });
                radarPulse = 0.6;
            });
        });

        const relayStatus = document.getElementById('os-relay-status');
        document.querySelectorAll('.os-relay').forEach((rel) => {
            rel.addEventListener('mouseenter', () => {
                if (relayStatus) relayStatus.textContent = rel.dataset.relay || 'LOCKED';
            });
            rel.addEventListener('mouseleave', () => {
                if (relayStatus) relayStatus.textContent = '5 ONLINE';
            });
        });
    }

    function bindCrew() {
        const crew = document.querySelector('.os-crew');
        const line = document.getElementById('os-crew-line');
        if (!crew || !line) return;
        let idx = 0;
        crew.addEventListener('click', () => {
            idx = (idx + 1) % CREW_QUIPS.length;
            line.textContent = CREW_QUIPS[idx];
            logLine('CREW', CREW_QUIPS[idx].replace(/"/g, ''));
        });
    }

    function bindCLI() {
        const form = document.getElementById('os-cli');
        const input = document.getElementById('os-cli-input');
        if (!form || !input) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const raw = input.value.trim().toLowerCase();
            input.value = '';
            if (!raw) return;

            if (raw === 'home' || raw === 'clear' || raw === 'close' || raw === 'standby') {
                switchView('home');
                return;
            }

            if (raw === 'projects' || raw === 'portfolio') {
                switchView('projects');
                return;
            }

            if (raw === 'support' || raw === 'affiliates') {
                switchView('support');
                return;
            }

            const appMatch = document.querySelector(`.os-app[data-app="${raw}"]`);
            if (appMatch) {
                tuneChannel(appMatch);
                logLine('CMD', `opening ${raw}…`);
                setTimeout(() => appMatch.click(), 200);
                return;
            }

            if (raw === 'help' || raw === '?') {
                logLine('HELP', 'cmds: projects, support, shop, comms, home, scan, party');
            } else if (raw === 'scan') {
                radarPulse = 1;
                logLine('SCAN', 'deep-space sweep complete · all stations nominal');
            } else if (raw === 'party' || raw === 'overdrive') {
                const on = document.body.classList.toggle('os-overdrive');
                logLine('SYS', on ? 'OVERDRIVE ENGAGED' : 'overdrive disengaged');
            } else {
                logLine('ERR', `unknown cmd "${raw}" · try help`);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initStarfield();
        initRadar();
        initTilt();
        bindChannels();
        bindCrew();
        bindCLI();

        updateTelemetry();
        pushFeedLine();
        setInterval(updateTelemetry, 1000);
        setInterval(pushFeedLine, 3000);

        // Initial view from hash or global override (for portfolio.html / support.html)
        const initial =
            window.TJ_INITIAL_VIEW ||
            (window.location.hash ? window.location.hash.replace('#', '').toLowerCase() : 'home');
        if (initial === 'projects' || initial === 'support') {
            boot();
            switchView(initial, false);
        }

        window.addEventListener('hashchange', () => {
            const h = window.location.hash.replace('#', '').toLowerCase() || 'home';
            switchView(h, false);
        });

        document.addEventListener('keydown', (e) => {
            if (!booted) {
                boot();
                return;
            }
            if (e.key === 'Escape' && currentView !== 'home') {
                switchView('home');
                return;
            }
            const keyApp = APP_KEYS[e.key];
            if (keyApp) {
                e.preventDefault();
                const link = document.querySelector(`.os-app[data-app="${keyApp}"]`);
                if (link) link.click();
            }
        });

        const bootEl = document.getElementById('os-boot');
        if (bootEl) bootEl.addEventListener('click', boot);
        setTimeout(boot, 1100);
    });
})();
