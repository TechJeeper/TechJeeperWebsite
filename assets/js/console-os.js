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
        if (orbit && !window.TJ_LIVE_ALT) {
            const wobble = Math.sin(Date.now() / 4000) * 1.8;
            orbit.textContent = `ALT ${(408 + wobble).toFixed(1)}km`;
        }

        const cpu = document.getElementById('os-cpu');
        if (cpu) cpu.textContent = `${10 + Math.floor(Math.random() * 9)}%`;
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

    function initSolarTelemetry() {
        const canvas = document.getElementById('os-solar');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const swEl = document.getElementById('os-sw-speed');
        const kpEl = document.getElementById('os-kp-val');
        const magEl = document.getElementById('os-mag-val');
        const flareEl = document.getElementById('os-flare-class');
        const orbitEl = document.getElementById('os-orbit');

        const state = {
            windSpeed: 360,
            bt: 5,
            bz: -1,
            kp: 2.3,
            flareClass: 'B1.2',
            xraySeries: [],
            mode: 'flux', // 'flux' (GOES X-ray + solar wind stream) or 'sun' (heliosphere view)
            particles: Array.from({ length: 34 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                s: Math.random() * 1.2 + 0.5
            }))
        };

        canvas.addEventListener('click', () => {
            state.mode = state.mode === 'flux' ? 'sun' : 'flux';
            logLine(
                'NOAA',
                state.mode === 'flux'
                    ? `GOES X-ray flux · ${state.flareClass} · wind ${state.windSpeed} km/s`
                    : `DSCOVR solar wind · ${state.windSpeed} km/s · Kp ${state.kp}`
            );
        });

        function classifyFlux(flux) {
            if (!flux || flux <= 0) return 'A1.0';
            const exp = Math.floor(Math.log10(flux));
            const mant = (flux / Math.pow(10, exp)).toFixed(1);
            if (exp < -7) return `A${mant}`;
            if (exp === -7) return `B${mant}`;
            if (exp === -6) return `C${mant}`;
            if (exp === -5) return `M${mant}`;
            return `X${mant}`;
        }

        async function fetchSpaceWeather() {
            try {
                const [windRes, magRes, kpRes, xrayRes] = await Promise.allSettled([
                    fetch('https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json').then((r) => r.json()),
                    fetch('https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json').then((r) => r.json()),
                    fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json').then((r) => r.json()),
                    fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json').then((r) => r.json())
                ]);

                if (windRes.status === 'fulfilled' && windRes.value && windRes.value[0]) {
                    const sp = Number(windRes.value[0].proton_speed);
                    if (!Number.isNaN(sp) && sp > 0) {
                        state.windSpeed = sp;
                        if (swEl) swEl.textContent = `${sp} km/s`;
                    }
                }

                if (magRes.status === 'fulfilled' && magRes.value && magRes.value[0]) {
                    state.bt = magRes.value[0].bt;
                    state.bz = magRes.value[0].bz_gsm;
                    if (magEl) magEl.textContent = `${state.bz}/${state.bt} nT`;
                }

                if (kpRes.status === 'fulfilled' && Array.isArray(kpRes.value)) {
                    const observed = kpRes.value.filter((row) => row && row.observed === 'observed');
                    const last = observed[observed.length - 1] || kpRes.value[kpRes.value.length - 1];
                    if (last && last.kp != null) {
                        state.kp = Number(last.kp).toFixed(1);
                        if (kpEl) kpEl.textContent = `Kp ${state.kp}`;
                    }
                }

                if (xrayRes.status === 'fulfilled' && Array.isArray(xrayRes.value)) {
                    const longWave = xrayRes.value.filter((d) => d.energy === '0.1-0.8nm' && d.flux > 0);
                    const samples = (longWave.length ? longWave : xrayRes.value).slice(-90);
                    state.xraySeries = samples.map((d) => Number(d.flux) || 1e-8);
                    const latestFlux = state.xraySeries[state.xraySeries.length - 1];
                    if (latestFlux) {
                        state.flareClass = classifyFlux(latestFlux);
                        if (flareEl) flareEl.textContent = `XRAY ${state.flareClass}`;
                    }
                }

                logLine('NOAA', `live solar wind ${state.windSpeed} km/s · ${state.flareClass} · Kp ${state.kp}`);
            } catch (_) {
                if (flareEl) flareEl.textContent = 'LIVE // SIM';
            }

            // Also fetch live ISS altitude for the top bar
            try {
                const iss = await fetch('https://api.wheretheiss.at/v1/satellites/25544').then((r) => r.json());
                if (iss && iss.altitude && orbitEl) {
                    window.TJ_LIVE_ALT = Number(iss.altitude);
                    orbitEl.textContent = `ISS ${window.TJ_LIVE_ALT.toFixed(1)}km`;
                }
            } catch (_) {
                /* keep default altitude */
            }
        }

        let t = 0;
        function draw() {
            ctx.clearRect(0, 0, w, h);
            t += 0.03;

            // Subtle grid
            ctx.strokeStyle = 'rgba(0, 191, 255, 0.1)';
            ctx.lineWidth = 1;
            for (let gx = 40; gx < w; gx += 40) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, h);
                ctx.stroke();
            }
            for (let gy = 35; gy < h; gy += 35) {
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.lineTo(w, gy);
                ctx.stroke();
            }

            // Solar wind particles streaming from left (Sun) to right (Magnetosphere)
            const speedFactor = Math.max(0.4, Math.min(2.6, (state.windSpeed - 250) / 220));
            state.particles.forEach((p) => {
                if (!reduced) {
                    p.x += p.s * speedFactor;
                    if (p.x > w) {
                        p.x = 0;
                        p.y = Math.random() * h;
                    }
                }
                ctx.fillStyle = 'rgba(255, 179, 71, 0.35)';
                ctx.fillRect(p.x, p.y, 2.2, 1.2);
            });

            // Glowing Sun corona on left edge
            const sunGrad = ctx.createRadialGradient(0, h / 2, 2, 0, h / 2, 54);
            sunGrad.addColorStop(0, 'rgba(255, 195, 85, 0.95)');
            sunGrad.addColorStop(0.35, 'rgba(255, 130, 40, 0.42)');
            sunGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.arc(0, h / 2, 54, -Math.PI / 2, Math.PI / 2);
            ctx.fill();

            if (state.mode === 'flux') {
                // Plot GOES 6-hour X-ray flux curve (log scale -9 to -4)
                const series = state.xraySeries.length
                    ? state.xraySeries
                    : Array.from({ length: 60 }, (_, i) => 1e-7 * (1 + 0.4 * Math.sin(i * 0.2 + t)));

                ctx.beginPath();
                series.forEach((val, idx) => {
                    const x = 18 + (idx / Math.max(1, series.length - 1)) * (w - 26);
                    const logv = Math.max(-9, Math.min(-4, Math.log10(Math.max(1e-9, val))));
                    const norm = (logv - -9) / 5; // 0..1
                    const y = h - 18 - norm * (h - 36);
                    if (idx === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.strokeStyle = '#1ce4ff';
                ctx.lineWidth = 1.8;
                ctx.stroke();

                // Fill under flux curve
                ctx.lineTo(w - 8, h - 14);
                ctx.lineTo(18, h - 14);
                ctx.closePath();
                const fillG = ctx.createLinearGradient(0, 15, 0, h - 14);
                fillG.addColorStop(0, 'rgba(28, 228, 255, 0.28)');
                fillG.addColorStop(1, 'rgba(28, 228, 255, 0.02)');
                ctx.fillStyle = fillG;
                ctx.fill();

                // Caption
                ctx.fillStyle = 'rgba(232, 244, 255, 0.72)';
                ctx.font = '10px "IBM Plex Mono", monospace';
                ctx.fillText('GOES-18 X-RAY FLUX (6H)', 10, 14);
            } else {
                // Magnetosphere bow shock visualization
                const ex = w * 0.74;
                const ey = h / 2;
                ctx.strokeStyle = 'rgba(0, 191, 255, 0.55)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(ex, ey, 28 + Math.sin(t * 2) * 2, Math.PI * 0.55, Math.PI * 1.45);
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = '#00bfff';
                ctx.arc(ex, ey, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(232, 244, 255, 0.72)';
                ctx.font = '10px "IBM Plex Mono", monospace';
                ctx.fillText('DSCOVR SOLAR WIND -> EARTH', 10, 14);
            }

            if (radarPulse > 0.02) {
                ctx.strokeStyle = `rgba(61, 255, 160, ${radarPulse})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(1, 1, w - 2, h - 2);
                radarPulse *= 0.9;
            }

            requestAnimationFrame(draw);
        }

        draw();
        fetchSpaceWeather();
        setInterval(fetchSpaceWeather, 60000);
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
        initSolarTelemetry();
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
