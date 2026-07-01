document.addEventListener('DOMContentLoaded', () => {
    
    let isSystemDown = false;
    let networkChart = null; 
    
    const cpuVal = document.getElementById('cpu-val');
    const cpuBar = document.getElementById('cpu-bar');

    // 1. SISTEMA GENERAL DE NOTIFICACIONES TOAST
    function showToast(message, icon = "✨") {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${icon}</span> <p>${message}</p>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // 2. INICIALIZACIÓN DE LA GRÁFICA (CHART.JS - COLOR LILA COZY)
    const ctx = document.getElementById('networkChart');
    if (ctx) {
        networkChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['10s ago', '8s ago', '6s ago', '4s ago', '2s ago', 'Ahora'],
                datasets: [{
                    label: 'Tráfico Mbps',
                    data: [35, 42, 28, 65, 48, 52],
                    borderColor: '#bca7eb',
                    backgroundColor: 'rgba(188, 167, 235, 0.08)',
                    borderWidth: 2.5,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 0, max: 100, grid: { display: false } },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    function getRandomUsage(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Bucle de actualización cada 2.5 segundos
    setInterval(() => {
        if (isSystemDown) return; 

        if (cpuVal && cpuBar) {
            const currentCpu = getRandomUsage(15, 45);
            cpuVal.textContent = `${currentCpu}%`;
            cpuBar.style.width = `${currentCpu}%`;
        }

        if (networkChart) {
            networkChart.data.datasets[0].data.shift();
            networkChart.data.datasets[0].data.push(getRandomUsage(25, 80));
            networkChart.update();
        }
    }, 2500);

    // 3. BUSCADOR DE LA TABLA DHCP
    const searchInput = document.getElementById('lan-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const text = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#lan-table-body tr');
            rows.forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(text) ? '' : 'none';
            });
        });
    }

    // 4. LÓGICA INTERACTIVA DEL ORQUESTRADOR DOCKER
    window.controlContainer = function(id, action) {
        if (isSystemDown) {
            showToast("Error de comunicación con el Docker Daemon remoto", "❌");
            return;
        }

        const badge = document.getElementById(`status-dk-${id}`);
        const card = document.getElementById(`dk-${id}`);
        const stopBtn = card.querySelector('.dk-btn.stop');
        const startBtn = card.querySelector('.dk-btn.start');

        if (action === 'stop') {
            badge.textContent = "exited(0)";
            badge.className = "srv-badge offline";
            card.classList.add('paused');
            stopBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
            showToast(`Contenedor [docker-${id}] detenido.`, "⏹️");
        } 
        else if (action === 'start') {
            badge.textContent = "starting...";
            badge.className = "srv-badge";
            
            setTimeout(() => {
                badge.textContent = "running";
                badge.className = "srv-badge online";
                card.classList.remove('paused');
                startBtn.classList.add('hidden');
                stopBtn.classList.remove('hidden');
                showToast(`Contenedor [docker-${id}] iniciado.`, "🐳");
            }, 1000);
        } 
        else if (action === 'restart') {
            badge.textContent = "restarting...";
            badge.className = "srv-badge";
            setTimeout(() => {
                badge.textContent = "running";
                badge.className = "srv-badge online";
                card.classList.remove('paused');
                startBtn.classList.add('hidden');
                stopBtn.classList.remove('hidden');
                showToast(`Contenedor [docker-${id}] reiniciado.`, "🔄");
            }, 1200);
        }
    };

    // 5. GESTOR DE IPTABLES BAN/UNBAN
    window.toggleBan = function(id) {
        const btn = document.querySelector(`#bad-ip-${id} .ban-btn`);
        if (btn.classList.contains('active-ban')) {
            btn.className = "ban-btn unbanned";
            btn.textContent = "Banned";
            showToast("Regla eliminada de iptables.", "🔓");
        } else {
            btn.className = "ban-btn active-ban";
            btn.textContent = "Unban";
            showToast("IP bloqueada de nuevo en la cadena DROP.", "🛡️");
        }
    };

    // 6. SIMULACIÓN DE GENERACIÓN DE BACKUPS (.TAR.GZ)
    const backupBtn = document.getElementById('backup-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => {
            if (isSystemDown) {
                showToast("Fallo al empaquetar: Almacenamiento fuera de línea.", "❌");
                return;
            }

            const wrapper = document.getElementById('backup-progress-wrapper');
            const percentText = document.getElementById('backup-percent');
            const bar = document.getElementById('backup-bar');
            const successBox = document.getElementById('backup-success-msg');

            backupBtn.disabled = true;
            wrapper.classList.remove('hidden');
            successBox.classList.add('hidden');
            
            let count = 0;
            const interval = setInterval(() => {
                count += getRandomUsage(15, 25);
                if (count >= 100) {
                    count = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        wrapper.classList.add('hidden');
                        successBox.classList.remove('hidden');
                        backupBtn.disabled = false;
                        showToast("Copia de seguridad subida al NAS con éxito.", "📦");
                        
                        const logsWrapper = document.getElementById('logs-wrapper');
                        if (logsWrapper) {
                            const newLog = document.createElement('div');
                            newLog.className = 'log-item info';
                            newLog.innerHTML = `<span class="log-dot"></span><div class="log-info"><p class="log-msg">Copia de seguridad del sistema generada manualmente.</p><span class="log-time">Ahora mismo</span></div>`;
                            logsWrapper.insertBefore(newLog, logsWrapper.firstChild);
                        }
                    }, 500);
                }
                percentText.textContent = `${count}%`;
                bar.style.width = `${count}%`;
            }, 400);
        });
    }

    // 7. SISTEMA DE NAVEGACIÓN SINGLE PAGE APPLICATION
    const menuButtons = document.querySelectorAll('.menu-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const subtexts = {
        'vision-general': 'Monitorización en tiempo real de la infraestructura ligera.',
        'servidores': 'Control de estado, contenedores activos y daemons base.',
        'dispositivos': 'Mapeo de la red local, direccionamiento IP y DHCP.',
        'herramientas': 'Consola de diagnóstico ICMP e instrumentos de ciberseguridad perimetral.'
    };

    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            menuButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');

            const targetId = button.getAttribute('data-target');
            const targetTab = document.getElementById(targetId);
            if (targetTab) targetTab.classList.add('active');

            if (pageTitle && pageSubtitle) {
                pageTitle.textContent = button.textContent.substring(2).trim();
                pageSubtitle.textContent = subtexts[targetId] || '';
            }
        });
    });

    // 8. CONTROL DE TEMAS
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (isSystemDown) {
                showToast("No se puede cambiar de entorno durante una alerta crítica.", "⚠️");
                return;
            }
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showToast(`Interfaz adaptada al Modo ${newTheme === 'dark' ? 'Oscuro' : 'Claro'}`, "🎨");
        });
    }

    // 9. FORMULARIO DE PING
    const pingForm = document.getElementById('ping-form');
    if (pingForm) {
        pingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const host = document.getElementById('ping-input').value;
            const loader = document.getElementById('ping-loader');
            const resultBox = document.getElementById('ping-result');
            const terminal = document.getElementById('ping-terminal-text');

            loader.classList.remove('hidden');
            resultBox.classList.add('hidden');

            setTimeout(() => {
                loader.classList.add('hidden');
                resultBox.classList.remove('hidden');
                
                if (isSystemDown) {
                    terminal.textContent = `PING ${host}: Network is unreachable.`;
                    showToast("Error de diagnóstico perimetral", "❌");
                } else {
                    terminal.textContent = `Haciendo ping a ${host} [ICMP echo-request]:\n` +
                                           `Respuesta desde ${host}: bytes=32 tiempo=${getRandomUsage(8,18)}ms TTL=64\n` +
                                           `Comprobación terminada sin pérdidas.`;
                    showToast(`Ping exitoso a ${host}`, "✅");
                }
            }, 1000);
        });
    }

    // 10. REINICIAR SERVICIOS CORE SYSTEMD
    window.restartService = function(serviceId) {
        if (isSystemDown) {
            showToast("Incapaz de mandar señal SIGTERM: Servidor inaccesible.", "❌");
            return;
        }

        const badge = document.getElementById(`status-${serviceId}`);
        if (!badge) return;

        badge.textContent = "restarting...";
        badge.className = "srv-badge";

        setTimeout(() => {
            badge.textContent = "running";
            badge.className = "srv-badge online";
            showToast(`Servicio systemd [${serviceId}.service] reiniciado.`, "⚙️");
        }, 1200);
    };

    // 11. BOTÓN DE PÁNICO (AFECTA A TODO EL ENTORNO LÓGICO)
    const panicBtn = document.getElementById('panic-btn');
    const globalStatus = document.getElementById('global-status');
    const badgeUbuntu = document.getElementById('badge-ubuntu');
    const badgeNas = document.getElementById('badge-nas');
    const replicaBadge = document.getElementById('replica-badge');
    
    if (panicBtn) {
        panicBtn.addEventListener('click', () => {
            isSystemDown = !isSystemDown;
            const coreServices = ['ssh', 'nginx', 'dhcp'];
            const dockers = ['wp', 'db', 'proxy'];

            if (isSystemDown) {
                document.body.classList.add('critical-panic');
                if (globalStatus) globalStatus.textContent = "Error del Sistema (Offline)";
                panicBtn.textContent = "🔧 Recuperar Red";
                showToast("¡CRÍTICO! Caída total de los nodos.", "🚨");

                if (cpuVal) cpuVal.textContent = "0%";
                if (cpuBar) cpuBar.style.width = "0%";
                if (badgeUbuntu) { badgeUbuntu.className = "badge offline"; badgeUbuntu.textContent = "Offline"; }
                if (badgeNas) { badgeNas.className = "badge offline"; badgeNas.textContent = "Offline"; }
                if (replicaBadge) { replicaBadge.className = "badge offline"; replicaBadge.textContent = "DOCKER_DOWN"; }

                if (networkChart) {
                    networkChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
                    networkChart.update();
                }

                coreServices.forEach(id => {
                    const b = document.getElementById(`status-${id}`);
                    if (b) { b.className = "srv-badge offline"; b.textContent = "failed"; }
                });

                dockers.forEach(id => {
                    const b = document.getElementById(`status-${id}`);
                    if (b) { b.className = "srv-badge offline"; b.textContent = "error"; }
                });

            } else {
                document.body.classList.remove('critical-panic');
                if (globalStatus) globalStatus.textContent = "Red Estable";
                panicBtn.textContent = "🚨 Simular Caída";
                showToast("Infraestructura levantada.", "💚");

                if (badgeUbuntu) { badgeUbuntu.className = "badge online"; badgeUbuntu.textContent = "Online"; }
                if (badgeNas) { badgeNas.className = "badge online"; badgeNas.textContent = "Online"; }
                if (replicaBadge) { replicaBadge.className = "badge online"; replicaBadge.textContent = "Master-Slave OK"; }

                coreServices.forEach(id => {
                    const b = document.getElementById(`status-${id}`);
                    if (b) { b.className = "srv-badge online"; b.textContent = "running"; }
                });

                dockers.forEach(id => {
                    const b = document.getElementById(`status-${id}`);
                    if (b) { b.className = "srv-badge online"; b.textContent = "running"; }
                    const card = document.getElementById(`dk-${id}`);
                    if (card) {
                        card.classList.remove('paused');
                        card.querySelector('.dk-btn.start').classList.add('hidden');
                        card.querySelector('.dk-btn.stop').classList.remove('hidden');
                    }
                });
            }
        });
    }
});