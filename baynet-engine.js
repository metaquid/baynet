/**
 * BAYNET Engine v0.53
 * A generic, domain-agnostic Bayesian Network simulation engine.
 * It requires a model configuration object to be provided.
 * by SMZ
 * Released under the MIT License.
 */

class BayesianNetworkEngine {
    constructor(modelConfig) {
        this.modelConfig = modelConfig;
    }

    calculateProbabilities(networkState) {
        const nodeMap = new Map(networkState.nodes.map(n => [n.id, n]));

        networkState.nodes.forEach(node => {
            if (node.type === 'root') {
                if (node.variable_type === 'continuous') {
                    node.probability = Math.max(0, (node.value - 50) / (node.max - 50));
                } else if (node.variable_type === 'categorical') {
                    node.probability = node.categories[node.value].v;
                } else if (node.variable_type === 'probability') {
                    node.probability = node.value;
                }
            }
        });

        for (let i = 0; i < 5; i++) {
            for (const node of networkState.nodes) {
                if (node.isLocked > 0 || node.type === 'root') continue;

                let totalInfluence = 0;
                const parentArcs = networkState.arcs.filter(arc => arc.target === node.id);
                
                parentArcs.forEach(arc => {
                    const parentNode = nodeMap.get(arc.source);
                    totalInfluence += parentNode.probability * arc.weight;
                });
                
                if (node.base > 0.5) {
                    node.probability = node.base * (1 + totalInfluence);
                } else {
                    node.probability = node.base + (1 - node.base) * totalInfluence;
                }
                node.probability = Math.max(0, Math.min(1, node.probability));
            }
        }

        if (networkState.special_rules) {
            networkState.special_rules.forEach(rule => {
                if (rule.condition(nodeMap)) {
                    rule.action(nodeMap, this);
                }
            });
        }
        return networkState;
    }
}


class BayNetApp {
    constructor(modelConfig) {
        this.modelConfig = modelConfig;
        this.engine = new BayesianNetworkEngine(modelConfig);
        this.guideController = new GuideController(this);
        
        this.networkState = this.createNetworkState(this.modelConfig.network);
        this.isSimulationRunning = false;
        this.currentLanguage = 'en';
        this.currentTheme = 'dark';
        this.currentMode = 'base';
        this.isRealAIAvailable = false;
        this.simulationInterval = null;

        this.svg = document.getElementById('bayesian-svg');
        this.svgNS = "http://www.w3.org/2000/svg";
        this.tooltip = document.getElementById('tooltip');
        this.toggleBtn = document.getElementById('toggle-sim');
        this.manualInputsContainer = document.getElementById('manual-inputs');
        
        this.boundUpdateTooltipPosition = this.updateTooltipPosition.bind(this);
    }
    
    init() {
        this.isRealAIAvailable = typeof window.ai?.createTextSession === 'function';
        
        this.loadSettings();
        this.applyTheme();
        
        this.updateAllUIText();

        this.handleDisclaimer();
        
        this.setupEventListeners();
        this.guideController.init();
        this.loadScenarioFromURL();
        this.setMode('base');
        
        this.simulationInterval = setInterval(() => this.simulateTimeStep(), 1500);
        this.exposeAPI();
        
        this.runUpdate();
    }

    handleDisclaimer() {
        if (this.modelConfig.disclaimer) {
            const container = document.getElementById('disclaimer-content');
            container.innerHTML = `
                <h2 data-translate="${this.modelConfig.disclaimer.title}">${this.T(this.modelConfig.disclaimer.title)}</h2>
                <p><strong data-translate="${this.modelConfig.disclaimer.p1_strong}">${this.T(this.modelConfig.disclaimer.p1_strong)}</strong> <strong data-translate="${this.modelConfig.disclaimer.p1_strong2}">${this.T(this.modelConfig.disclaimer.p1_strong2)}</strong></p>
                <p data-translate="${this.modelConfig.disclaimer.p2}">${this.T(this.modelConfig.disclaimer.p2)}</p>
                <button id="disclaimer-accept-btn" data-translate="${this.modelConfig.disclaimer.accept}">${this.T(this.modelConfig.disclaimer.accept)}</button>
            `;
            document.getElementById('disclaimer-modal').classList.add('visible');
            document.getElementById('disclaimer-accept-btn').onclick = () => {
                document.getElementById('disclaimer-modal').classList.remove('visible');
            };
        }
    }

    setupEventListeners() {
        const settingsModal = document.getElementById('settings-modal');
        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('setting-language').value = this.currentLanguage;
            document.getElementById('setting-theme').value = this.currentTheme;
            settingsModal.classList.add('visible');
        });
        document.getElementById('settings-cancel-btn').addEventListener('click', () => settingsModal.classList.remove('visible'));
        document.getElementById('settings-save-btn').addEventListener('click', () => {
            localStorage.setItem('baynet_lang', document.getElementById('setting-language').value);
            localStorage.setItem('baynet_theme', document.getElementById('setting-theme').value);
            window.location.reload();
        });
        
        const aiModal = document.getElementById('ai-selection-modal');
        document.getElementById('run-ai-assistant').addEventListener('click', () => {
            this.positionModalRelativeToControls(aiModal, true);
            aiModal.classList.add('visible');
        });
        document.getElementById('ai-cancel-btn').addEventListener('click', () => aiModal.classList.remove('visible'));
        
        document.getElementById('alert-ok-btn').addEventListener('click', () => document.getElementById('alert-modal').classList.remove('visible'));
        
        this.setupModalDrag(aiModal, document.getElementById('ai-modal-drag-handle'));

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('baynet_theme', this.currentTheme);
            this.applyTheme();
            this.updateThemeButtonText();
        });
        
        document.getElementById('mode-base').addEventListener('click', () => this.setMode('base'));
        document.getElementById('mode-expert').addEventListener('click', () => this.setMode('expert'));
        
        Object.keys(this.modelConfig.scenarios).forEach(scenarioId => {
            const btn = document.getElementById(`scenario-${scenarioId.replace(/_/g, '-')}`);
            if(btn) btn.addEventListener('click', () => this.loadScenario(scenarioId));
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => this.resetSimulation());
        document.getElementById('share-btn').addEventListener('click', () => this.shareScenario());
        this.toggleBtn.addEventListener('click', () => this.toggleSimulation());

        document.getElementById('close-inspector-btn').addEventListener('click', () => this.hideMobileInspector());
        window.addEventListener('resize', this.debounce(() => {
            this.renderNetwork();
            document.querySelectorAll('.modal-content[style*="left"]').forEach(modalContent => {
                const modal = modalContent.closest('.visible');
                if (modal) this.positionModalRelativeToControls(modal);
            });
        }, 150));
        
        this.setupResizer();
    }
    
    loadSettings() {
        this.currentLanguage = localStorage.getItem('baynet_lang') || 'en';
        this.currentTheme = localStorage.getItem('baynet_theme') || 'dark';
    }

    applyTheme() {
        document.body.classList.toggle('dark-mode', this.currentTheme === 'dark');
    }

    createNetworkState(networkConfig) {
        return {
            ...networkConfig,
            nodes: JSON.parse(JSON.stringify(networkConfig.nodes)),
            arcs: JSON.parse(JSON.stringify(networkConfig.arcs))
        };
    }
    
    cloneNetworkState(state) {
        return {
           ...state,
           nodes: JSON.parse(JSON.stringify(state.nodes)),
           arcs: JSON.parse(JSON.stringify(state.arcs))
       };
    }

    debounce(func, wait) { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; }
    
    T(key, params = {}) {
        let text = this.modelConfig.translations[key]?.[this.currentLanguage] || this.modelConfig.translations[key]?.['en'] || `[${key}]`;
        Object.entries(params).forEach(([param, value]) => { text = text.replace(new RegExp(`{${param}}`, 'g'), value); });
        return text;
    }

    T_guide(translationObject) {
        return translationObject[this.currentLanguage] || translationObject['en'];
    }
    
    positionModalRelativeToControls(modal, isFirstAppearance = false) {
        const modalContent = modal.querySelector('.modal-content');
        
        if (isFirstAppearance || !modalContent.style.left || modalContent.style.left === "0px") {
            const controlsPanel = document.querySelector('.controls');
            const headerPanel = document.getElementById('model-description');

            if (controlsPanel && headerPanel) {
                const panelRect = controlsPanel.getBoundingClientRect();
                const headerRect = headerPanel.getBoundingClientRect();
                
                modalContent.style.position = 'fixed';
                modalContent.style.width = `${panelRect.width - 40}px`;
                modalContent.style.left = `${panelRect.left + 20}px`;
                modalContent.style.top = `${headerRect.bottom + 20}px`;
                modalContent.style.transform = 'none';
                modalContent.style.margin = '0';
            }
        }

        const rect = modalContent.getBoundingClientRect();
        let currentLeft = parseFloat(modalContent.style.left);
        let currentTop = parseFloat(modalContent.style.top);

        if (rect.right > window.innerWidth) {
            currentLeft = window.innerWidth - rect.width - 20;
        }
        if (rect.bottom > window.innerHeight) {
            currentTop = window.innerHeight - rect.height - 20;
        }
        if (rect.left < 0) {
            currentLeft = 20;
        }
        if (rect.top < 0) {
            currentTop = 20;
        }
        modalContent.style.left = `${currentLeft}px`;
        modalContent.style.top = `${currentTop}px`;
    }
    
    showAlert(title, body, isDraggable = true) {
        const modal = document.getElementById('alert-modal');
        document.getElementById('alert-title').innerHTML = title;
        document.getElementById('alert-body').innerHTML = body;
        document.getElementById('alert-ok-btn').textContent = this.T('alert_ok');
        
        this.positionModalRelativeToControls(modal, true);
        modal.classList.add('visible');
        
        if (isDraggable) {
            this.setupModalDrag(modal, document.getElementById('alert-drag-handle'));
        }
    }
    
    isMobile() { return window.innerWidth <= 800; }
    
    runUpdate() {
        this.networkState = this.engine.calculateProbabilities(this.networkState);
        this.renderNetwork();
        this.updateUI();
    }

    updateAllUIText() {
        document.documentElement.lang = this.currentLanguage;
        document.querySelectorAll('[data-translate]').forEach(el => {
            el.innerHTML = this.T(el.getAttribute('data-translate'));
        });
        
        this.updateThemeButtonText();
        this.toggleBtn.textContent = this.isSimulationRunning ? this.T('toggle_sim_pause') : this.T('toggle_sim_start');
        
        document.getElementById('main-title').innerHTML = this.networkState.appName;
        document.getElementById('model-title').innerHTML = this.modelConfig.modelName;
        document.getElementById('model-description').innerHTML = this.T(this.modelConfig.modelDescriptionKey);
        document.title = `BAYNET: ${this.modelConfig.modelName} Simulator`;
        
        this.updateAIVisuals();
        this.applyTooltips();
        this.setupControls();
        this.setupAdvancedControls();
        this.setupGoalControls();
        this.setupInfoTab();
    }

    updateThemeButtonText() {
        const isDark = document.body.classList.contains('dark-mode');
        document.getElementById('theme-toggle').textContent = isDark ? this.T('theme_toggle_light') : this.T('theme_toggle_dark');
    }

    updateAIVisuals() {
        const titleKey = this.isRealAIAvailable ? 'ai_modal_title_real' : 'ai_modal_title_sim';
        document.getElementById('ai-modal-title').textContent = this.T(titleKey);
        
        const badge = document.getElementById('ai-ready-badge');
        badge.textContent = this.isRealAIAvailable ? '✨' : '';
        badge.title = this.isRealAIAvailable ? 'Local AI Enabled' : '';
    }

    applyTooltips() {
        const tooltips = {
            'toggle-sim': 'tooltip_toggle_sim',
            'run-ai-assistant': this.isRealAIAvailable ? 'tooltip_ai_assistant_real' : 'tooltip_ai_assistant_sim',
            'theme-toggle': 'tooltip_theme',
            'reset-btn': 'tooltip_reset',
            'share-btn': 'tooltip_share',
            'scenario-lr-typical': 'tooltip_scenario_lr_typical',
            'scenario-lr-elderly': 'tooltip_scenario_lr_elderly',
            'scenario-hr-advanced': 'tooltip_scenario_hr_advanced',
            'scenario-hr-aggressive': 'tooltip_scenario_hr_aggressive',
        };
        for (const [id, key] of Object.entries(tooltips)) {
            const el = document.getElementById(id);
            if (el) el.title = this.T(key);
        }
    }

    renderNetwork() {
        if (!this.svg?.getBoundingClientRect) return;
        const { width: containerWidth, height: containerHeight } = document.querySelector('.main-content').getBoundingClientRect();
        const svgWidth = this.isMobile() ? 1200 : containerWidth - 20; 
        const svgHeight = containerHeight - 20;
        if(svgWidth <= 0 || svgHeight <= 0) return;
        
        this.svg.setAttribute('width', svgWidth);
        this.svg.setAttribute('height', svgHeight);
        this.svg.innerHTML = '';

        const nodeMap = new Map(this.networkState.nodes.map(n => [n.id, n]));
        
        this.renderColumns(svgWidth, svgHeight);
        this.renderArcs(nodeMap, svgWidth, svgHeight);
        this.renderNodes(nodeMap, svgWidth, svgHeight);
        this.renderArcMarkers(nodeMap, svgWidth, svgHeight);

        const legendPositive = document.createElementNS(this.svgNS, 'text');
        legendPositive.setAttribute('x', svgWidth - 50); 
        legendPositive.setAttribute('y', svgHeight - 35);
        legendPositive.setAttribute('text-anchor', 'middle');
        legendPositive.style.fill = 'var(--arc-positive-color)'; 
        legendPositive.style.fontSize = '30px';
        legendPositive.style.cursor = 'pointer';
        legendPositive.textContent = '+';
        legendPositive.addEventListener('mouseover', (evt) => this.showTooltip(evt, this.T('tooltip_legend_positive'), legendPositive));
        legendPositive.addEventListener('mouseout', () => this.hideTooltip(legendPositive));
        this.svg.appendChild(legendPositive);
        
        const legendNegative = document.createElementNS(this.svgNS, 'text');
        legendNegative.setAttribute('x', svgWidth - 25); 
        legendNegative.setAttribute('y', svgHeight - 35);
        legendNegative.setAttribute('text-anchor', 'middle');
        legendNegative.style.fill = 'var(--arc-negative-color)'; 
        legendNegative.style.fontSize = '30px';
        legendNegative.style.cursor = 'pointer';
        legendNegative.textContent = '-';
        legendNegative.addEventListener('mouseover', (evt) => this.showTooltip(evt, this.T('tooltip_legend_negative'), legendNegative));
        legendNegative.addEventListener('mouseout', () => this.hideTooltip(legendNegative));
        this.svg.appendChild(legendNegative);

        const watermark = document.createElementNS(this.svgNS, 'text');
        watermark.setAttribute('x', svgWidth - 15); watermark.setAttribute('y', svgHeight - 15);
        watermark.setAttribute('text-anchor', 'end'); watermark.setAttribute('class', 'svg-watermark');
        watermark.textContent = `by SMZ`;
        this.svg.appendChild(watermark);
    }

    renderColumns(svgWidth, svgHeight) {
        this.networkState.columns.forEach(col => {
            const bg = document.createElementNS(this.svgNS, 'rect'); 
            bg.id = `col-bg-${col.id}`; bg.classList.add('column-bg');
            bg.setAttribute('x', col.x_rel * svgWidth); bg.setAttribute('y', 0);
            bg.setAttribute('width', col.width_rel * svgWidth); bg.setAttribute('height', svgHeight);
            bg.setAttribute('fill', col.color);
            this.svg.appendChild(bg);

            const title = document.createElementNS(this.svgNS, 'text'); 
            title.setAttribute('x', (col.x_rel + col.width_rel / 2) * svgWidth);
            title.setAttribute('y', 20); title.classList.add('column-title'); 
            title.textContent = this.T_guide(col.title);
            this.svg.appendChild(title);
        });
    }

    renderDefs() {}
    
    renderArcs(nodeMap, svgWidth, svgHeight) {
        this.networkState.arcs.forEach(arc => {
            const sourceNode = nodeMap.get(arc.source); const targetNode = nodeMap.get(arc.target);
            if (!sourceNode || !targetNode) return;
            const sourceX = sourceNode.x_rel * svgWidth; const sourceY = sourceNode.y_rel * svgHeight;
            const targetX = targetNode.x_rel * svgWidth; const targetY = targetNode.y_rel * svgHeight;
            
            const line = document.createElementNS(this.svgNS, 'line'); 
            line.id = `arc-line-${arc.source}-${arc.target}`;
            line.setAttribute('x1', sourceX); line.setAttribute('y1', sourceY);
            line.setAttribute('x2', targetX); line.setAttribute('y2', targetY);
            line.classList.add('arc-line');

            if (arc.weight >= 0) {
                line.classList.add('arc-positive');
            } else {
                line.classList.add('arc-negative');
            }
            
            line.setAttribute('stroke-width', Math.abs(arc.weight) * 5 + 1);
            
            const tooltipContent = this.T_guide(arc.tooltip);
            line.addEventListener('mouseover', (evt) => { 
                this.showTooltip(evt, tooltipContent, line);
                line.classList.add('highlight');
            });
            line.addEventListener('mouseout', () => { 
                this.hideTooltip(line); 
                line.classList.remove('highlight');
            });
            this.svg.appendChild(line);
        });
    }

    renderNodes(nodeMap, svgWidth, svgHeight) {
        this.networkState.nodes.forEach(node => {
            const cx = node.x_rel * svgWidth; const cy = node.y_rel * svgHeight;
            const size = node.probability * 30 + 20;
            const isRoot = node.type === 'root';

            const group = document.createElementNS(this.svgNS, 'g'); 
            group.id = `node-${node.id}`;
            group.classList.add('node-group');
            if (node.isLocked > 0) group.classList.add('locked');

            group.addEventListener('mouseover', (evt) => this.showTooltip(evt, node.id, group));
            group.addEventListener('mouseout', () => this.hideTooltip(group));
            group.addEventListener('click', () => {
                if (document.body.classList.contains('guide-active')) return;
                if (this.isMobile()) this.showMobileInspector(node);
                else if (isRoot) this.focusOnRootControl(node);
                else this.focusOnAdvancedControl(node);
            });
            
            const shapeRef = isRoot ? document.createElementNS(this.svgNS, 'circle') : document.createElementNS(this.svgNS, 'rect');
            shapeRef.setAttribute('class', 'node-shape-ref');
            const maxSize = 50;
            if (isRoot) { shapeRef.setAttribute('cx', cx); shapeRef.setAttribute('cy', cy); shapeRef.setAttribute('r', maxSize); } 
            else { shapeRef.setAttribute('x', cx - maxSize); shapeRef.setAttribute('y', cy - maxSize); shapeRef.setAttribute('width', maxSize * 2); shapeRef.setAttribute('height', maxSize * 2); shapeRef.setAttribute('rx', 8); }
            group.appendChild(shapeRef);

            const shape = isRoot ? document.createElementNS(this.svgNS, 'circle') : document.createElementNS(this.svgNS, 'rect');
            shape.setAttribute('class', 'node-shape');
            if (isRoot) { shape.setAttribute('cx', cx); shape.setAttribute('cy', cy); shape.setAttribute('r', size); } 
            else { shape.setAttribute('x', cx - size); shape.setAttribute('y', cy - size); shape.setAttribute('width', size * 2); shape.setAttribute('height', size * 2); shape.setAttribute('rx', 8); }
            group.appendChild(shape);
            
            const nodeName = this.T_guide(node.name);
            const nameLines = nodeName.split(' ');
            const text = document.createElementNS(this.svgNS, 'text');
            text.setAttribute('class', 'node-label');
            text.setAttribute('y', cy);

            const tspan1 = document.createElementNS(this.svgNS, 'tspan');
            tspan1.setAttribute('x', cx);
            tspan1.setAttribute('dy', nameLines.length > 1 ? '-0.6em' : '0.35em');
            tspan1.textContent = nameLines[0];
            text.appendChild(tspan1);
            
            if (nameLines.length > 1) {
                const tspan2 = document.createElementNS(this.svgNS, 'tspan');
                tspan2.setAttribute('x', cx);
                tspan2.setAttribute('dy', '1.2em');
                tspan2.textContent = nameLines.slice(1).join(' ');
                text.appendChild(tspan2);
            }
            group.appendChild(text);

            const probLabel = document.createElementNS(this.svgNS, 'text');
            probLabel.setAttribute('x', cx); probLabel.setAttribute('y', cy + size + 15);
            probLabel.setAttribute('class', 'node-probability'); 
            
            let labelText = `${(node.probability * 100).toFixed(0)}%`;
            if (node.variable_type === 'continuous') { labelText = `${node.value} ${this.T('unit_years')}`; } 
            else if (node.variable_type === 'categorical') { labelText = this.T_guide(node.categories[node.value].l); }
            probLabel.textContent = labelText;
            if (!isRoot) probLabel.classList.add('calculated-prob');
            group.appendChild(probLabel);
            
            if (!isRoot) {
                 const lockIcon = document.createElementNS(this.svgNS, 'text'); 
                 lockIcon.setAttribute('x', cx + size); lockIcon.setAttribute('y', cy - size + 5); 
                 lockIcon.setAttribute('class', 'lock-icon'); 
                 lockIcon.textContent = ['🔓', '🔒⬆️', '🔒⬇️'][node.isLocked]; 
                 lockIcon.onclick = (e) => { e.stopPropagation(); this.handleLockClick(node); }; 
                 group.appendChild(lockIcon);
            }
            this.svg.appendChild(group);
        });
    }
	
	renderArcMarkers(nodeMap, svgWidth, svgHeight) {
        const drawMarker = (arc) => {
            const sourceNode = nodeMap.get(arc.source);
            const targetNode = nodeMap.get(arc.target);
            if (!sourceNode || !targetNode) return;

            const targetX = targetNode.x_rel * svgWidth; const targetY = targetNode.y_rel * svgHeight;
            const sourceX = sourceNode.x_rel * svgWidth; const sourceY = sourceNode.y_rel * svgHeight;

            const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
            const targetRadius = (targetNode.type === 'root') ? targetNode.probability * 30 + 20 + 5 : Math.sqrt(2 * Math.pow(targetNode.probability * 30 + 20, 2))/2 + 5;
            
            const endX = targetX - targetRadius * Math.cos(angle); const endY = targetY - targetRadius * Math.sin(angle);

            const marker = document.createElementNS(this.svgNS, 'path');
            const markerSize = 16;
            const p1 = `${endX},${endY}`;
            const p2 = `${endX - markerSize * Math.cos(angle - Math.PI/6)},${endY - markerSize * Math.sin(angle - Math.PI/6)}`;
            const p3 = `${endX - markerSize * Math.cos(angle + Math.PI/6)},${endY - markerSize * Math.sin(angle + Math.PI/6)}`;
            
            marker.setAttribute('d', `M ${p1} L ${p2} L ${p3} Z`);
            const isHighlighted = document.getElementById(`arc-line-${arc.source}-${arc.target}`)?.classList.contains('highlight');
            const color = isHighlighted ? 'var(--highlight-color)' : (arc.weight >= 0 ? 'var(--arc-positive-color)' : 'var(--arc-negative-color)');
            marker.style.fill = color;
            this.svg.appendChild(marker);
        };
        
        const highlightedArcs = [];
        const regularArcs = [];
        this.networkState.arcs.forEach(arc => {
            if (document.getElementById(`arc-line-${arc.source}-${arc.target}`)?.classList.contains('highlight')) {
                highlightedArcs.push(arc);
            } else {
                regularArcs.push(arc);
            }
        });

        regularArcs.forEach(drawMarker);
        highlightedArcs.forEach(drawMarker);
    }

    updateUI() {
        this.updatePrognosisSummary();
        if(this.modelConfig.validatorFunction) {
            const { messageKey, isWarning } = this.modelConfig.validatorFunction(this.networkState, this.T);
            const validatorEl = document.getElementById('clinical-validator');
            validatorEl.className = isWarning ? 'warning' : 'ok';
            document.getElementById('clinical-validator-content').innerHTML = this.T(messageKey);
        }
        if (this.isSimulationRunning) {
            this.updateControls();
            this.updateAdvancedControls();
        }
    }
    
    updatePrognosisSummary() {
        const nodeMap = new Map(this.networkState.nodes.map(n => [n.id, n]));
        const survival = nodeMap.get('SURVIVAL')?.probability || 0;
        const progression = nodeMap.get('PROGRESSION')?.probability || 0;
        const qol = nodeMap.get('QOL')?.probability || 0;
        
        const summaryEl = document.getElementById('summary-value');
        const driversEl = document.getElementById('summary-drivers');
        
        let score = (survival * 0.6) + ((1 - progression) * 0.3) + (qol * 0.1);
        let summaryTextKey = "prognosis_intermediate", color = "var(--color-tumor)";
        if(score > 0.7) { summaryTextKey = "prognosis_favorable"; color = "var(--color-patient-outcome)"; }
        else if (score < 0.45) { summaryTextKey = "prognosis_high_risk"; color = "var(--color-clinical)"; }
        
        summaryEl.textContent = this.T(summaryTextKey);
        summaryEl.style.backgroundColor = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        summaryEl.style.color = color;
        
        const factorImpacts = new Map();
        this.networkState.arcs.forEach(arc => {
            const sourceNode = nodeMap.get(arc.source);
            if (sourceNode?.type === 'root') {
                const impact = sourceNode.probability * arc.weight;
                if (!factorImpacts.has(sourceNode.id)) {
                    factorImpacts.set(sourceNode.id, { name: this.T_guide(sourceNode.name), totalImpact: 0 });
                }
                factorImpacts.get(sourceNode.id).totalImpact += impact;
            }
        });

        const sortedFactors = Array.from(factorImpacts.values()).sort((a,b) => Math.abs(b.totalImpact) - Math.abs(a.totalImpact));
        const riskDrivers = sortedFactors.filter(f => f.totalImpact > 0.05).slice(0, 3).map(f => f.name.split(' ')[0]);
        const protectiveDrivers = sortedFactors.filter(f => f.totalImpact < -0.05).slice(0, 2).map(f => f.name.split(' ')[0]);
        
        let driversText = '';
        if (riskDrivers.length > 0) driversText += `${this.T('risk_drivers_label')}: ${riskDrivers.join(', ')}. `;
        if (protectiveDrivers.length > 0) driversText += `${this.T('protective_drivers_label')}: ${protectiveDrivers.join(', ')}.`;
        driversEl.textContent = driversText || this.T('balanced_profile');
    }

    setupControls() {
        this.manualInputsContainer.innerHTML = '';
        const groupTitles = Object.fromEntries(this.networkState.columns.filter(c => c.id).map(c => [c.id, c.title]));
        const rootNodeGroups = [...new Set(this.networkState.nodes.filter(n => n.type === 'root' && n.group).map(n => n.group))];
        
        rootNodeGroups.forEach(groupKey => {
            const header = document.createElement('h2'); header.className = 'accordion-header';
            header.id = `man-header-${groupKey}`;
            header.textContent = this.T_guide(groupTitles[groupKey]);
            this.manualInputsContainer.appendChild(header);

            const content = document.createElement('div'); content.className = 'accordion-content';
            header.addEventListener('click', () => {
                const isActive = header.classList.toggle('active');
                document.querySelectorAll('#manual-inputs .accordion-header.active').forEach(h => { if(h !== header) h.classList.remove('active'); });
                document.querySelectorAll('#manual-inputs .accordion-content').forEach(c => c.style.maxHeight = null);
                if(isActive) content.style.maxHeight = content.scrollHeight + "px";
            });
            this.networkState.nodes
                .filter(n => n.type === 'root' && n.group === groupKey)
                .forEach(node => this.createControlForNode(node, content));
            this.manualInputsContainer.appendChild(content);
        });
    }

    createControlForNode(node, container) {
        const groupEl = document.createElement('div');
        groupEl.className = 'control-group';
        groupEl.id = `control-${node.id}`;
        
        const label = document.createElement('label');
        label.htmlFor = `input-${node.id}`;
        label.textContent = this.T_guide(node.name);
        if (node.slider_tooltip) label.title = this.T_guide(node.slider_tooltip);

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        label.appendChild(valueDisplay);

        const updateNodeValue = (newValue) => {
            const parsedValue = (node.variable_type === 'probability') ? parseFloat(newValue) : parseInt(newValue);
            if (node.value !== parsedValue) {
                node.value = parsedValue;
                this.runUpdate();
            }
        };
        const debouncedUpdate = this.debounce(updateNodeValue, 50);

        const updateDisplay = (value) => {
            if (node.variable_type === 'continuous') valueDisplay.textContent = `${value} ${this.T('unit_years')}`;
            else if (node.variable_type === 'categorical') valueDisplay.textContent = this.T_guide(node.categories[value].l);
            else valueDisplay.textContent = `${(parseFloat(value) * 100).toFixed(0)}%`;
        };

        const inputEl = document.createElement('input');
        inputEl.type = 'range';
        inputEl.id = `input-${node.id}`;

        if (node.variable_type === 'continuous') {
            inputEl.min = node.min; inputEl.max = node.max; inputEl.step = 1;
        } else if (node.variable_type === 'probability') {
            inputEl.min = 0; inputEl.max = 1; inputEl.step = 0.01;
        } else {
            inputEl.min = 0; inputEl.max = node.categories.length - 1; inputEl.step = 1;
        }
        inputEl.value = node.value;
        
        groupEl.appendChild(label);
        groupEl.appendChild(inputEl);
        
        updateDisplay(node.value);

        inputEl.oninput = (e) => { 
            if(this.isSimulationRunning) return;
            updateDisplay(e.target.value); 
            debouncedUpdate(e.target.value); 
        };
        inputEl.onchange = (e) => { 
             if(this.isSimulationRunning) return;
            updateNodeValue(e.target.value); 
        };
        
        container.appendChild(groupEl);
    }
    
    showTooltip(evt, textOrId, element) { 
        if(this.isMobile()) return; 

        element.addEventListener('mousemove', this.boundUpdateTooltipPosition);
        this.tooltip.currentElement = element;

        const nodeMap = new Map(this.networkState.nodes.map(n => [n.id, n]));
        let dynamicText = textOrId;
        const node = nodeMap.get(textOrId);
        
        if (node) {
            dynamicText = `<p>${this.T_guide(node.tooltip)}</p>`;
            this.highlightNodeAndArcs(node.id, true);

            if(node.type !== 'root' && node.isLocked === 0){
                let formula = `<strong>P(${(node.probability*100).toFixed(1)}%) = </strong><div class="formula">`;
                let totalInfluence = 0;
                const parentArcs = this.networkState.arcs.filter(arc => arc.target === node.id);
                parentArcs.forEach(arc => {
                    const parent = nodeMap.get(arc.source);
                    totalInfluence += parent.probability * arc.weight;
                });
                
                if (node.id === 'RECID' && this.modelConfig.modelName === 'CistoNet') {
                    const gradoGNode = nodeMap.get('GRADO_G');
                    const cisLviNode = nodeMap.get('CIS_LVI');
                    totalInfluence += gradoGNode.probability * cisLviNode.probability * 0.3;
                }
                
                let finalProb;
                if(node.base > 0.5) { finalProb = node.base * (1 + totalInfluence); } 
                else { finalProb = node.base + (1 - node.base) * totalInfluence; }
                let formulaType = (node.base > 0.5) ? `P = Base * (1 + Σ(Infl))` : `P = Base + (1-Base) * Σ(Infl)`;
                formula += `${formulaType}\n--------------------------------\nBase: ${node.base.toFixed(2)}\n\nInfluences:\n`;
                parentArcs.forEach(arc => {
                    const parent = nodeMap.get(arc.source);
                    const influence = parent.probability * arc.weight;
                    const parentName = this.T_guide(parent.name);
                    formula += `  ${parentName.split(' ')[0]}: P(${(parent.probability*100).toFixed(0)}%)*w(${arc.weight.toFixed(1)}) = ${influence.toFixed(3)}\n`;
                });
                if (node.id === 'RECID' && this.modelConfig.modelName === 'CistoNet') {
                    const gradoGNode = nodeMap.get('GRADO_G');
                    const cisLviNode = nodeMap.get('CIS_LVI');
                    const interactionInfluence = gradoGNode.probability * cisLviNode.probability * 0.3;
                    formula += `  Interaction (G*CIS): ${interactionInfluence.toFixed(3)}\n`;
                }
                formula += `--------------------------------\nΣ(Influences): ${totalInfluence.toFixed(3)}\n\nResult Calculation:\n`;
                if(node.base > 0.5) { formula += `  P = ${node.base.toFixed(2)} * (1 + ${totalInfluence.toFixed(3)}) = ${finalProb.toFixed(3)}`;} 
                else { formula += `  P = ${node.base.toFixed(2)} + (1-${node.base.toFixed(2)}) * ${totalInfluence.toFixed(3)} = ${finalProb.toFixed(3)}`;}
                const clampedProb = Math.max(0, Math.min(1, finalProb));
                if (Math.abs(clampedProb - finalProb) > 0.0001) { formula += `\n  (clamped to ${clampedProb.toFixed(3)})`;}
                formula += `</div>`;
                dynamicText += formula;
            }
        } else {
             dynamicText = textOrId;
        }
        
        this.tooltip.innerHTML = dynamicText;
        this.tooltip.style.visibility = 'visible';
        this.tooltip.style.opacity = '1';
        
        this.updateTooltipPosition(evt);
    }

    updateTooltipPosition(evt) {
        if (!this.tooltip.currentElement) return;

        const mainRect = document.querySelector('.main-content').getBoundingClientRect();
        const elRect = this.tooltip.currentElement.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        const centerX = elRect.left + elRect.width / 2;
        const centerY = elRect.top + elRect.height / 2;
        const dx = evt.clientX - centerX;
        const dy = evt.clientY - centerY;

        const amplification = 2.0;
        const repulsion = (elRect.width / 2) + 20;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        let offsetX = dx * amplification;
        let offsetY = dy * amplification;

        if (dist > 0 && dist < repulsion) {
            offsetX = (dx / dist) * repulsion;
            offsetY = (dy / dist) * repulsion;
        }

        let left = (elRect.left - mainRect.left + elRect.width/2) + offsetX - tooltipRect.width/2;
        let top = (elRect.top - mainRect.top + elRect.height/2) + offsetY - tooltipRect.height/2;

        const margin = 10;
        left = Math.max(margin, Math.min(left, mainRect.width - tooltipRect.width - margin));
        top = Math.max(margin, Math.min(top, mainRect.height - tooltipRect.height - margin));
        
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    hideTooltip(element) { 
        element.removeEventListener('mousemove', this.boundUpdateTooltipPosition);
        this.tooltip.currentElement = null;
        this.tooltip.style.visibility = 'hidden'; 
        this.tooltip.style.opacity = '0'; 
        this.networkState.nodes.forEach(node => this.highlightNodeAndArcs(node.id, false));
    }

    highlightNodeAndArcs(nodeId, shouldHighlight) {
        document.getElementById(`node-${nodeId}`)?.classList.toggle('highlight-arcs', shouldHighlight);
        this.networkState.arcs
            .filter(arc => arc.source === nodeId || arc.target === nodeId)
            .forEach(arc => {
                const arcEl = document.getElementById(`arc-line-${arc.source}-${arc.target}`);
                if (arcEl) {
                    arcEl.classList.toggle('highlight', shouldHighlight);
                }
            });
        this.renderArcMarkers(new Map(this.networkState.nodes.map(n => [n.id, n])), this.svg.width.baseVal.value, this.svg.height.baseVal.value);
    }
    
    toggleSimulation() { 
        this.isSimulationRunning = !this.isSimulationRunning;
        this.toggleBtn.textContent = this.T(this.isSimulationRunning ? 'toggle_sim_pause' : 'toggle_sim_start');
        this.toggleBtn.classList.toggle('running', this.isSimulationRunning);
    }
    
    simulateTimeStep() {
        if (!this.isSimulationRunning) return;
        document.querySelectorAll('.sim-flash').forEach(el => el.classList.remove('sim-flash'));
        const nodeMap = new Map(this.networkState.nodes.map(n => [n.id, n]));
        const qolThreshold = parseFloat(document.getElementById('goal-qol').value);
        const survivalThreshold = parseFloat(document.getElementById('goal-survival').value);
        const currentQoL = nodeMap.get('QOL').probability;
        const currentSurvival = nodeMap.get('SURVIVAL').probability;
        if (currentQoL < qolThreshold || currentSurvival < survivalThreshold) {
            for (let i = 0; i < 10; i++) { 
                const tempState = this.cloneNetworkState(this.networkState);
                const rootNodes = this.networkState.nodes.filter(n => n.type === 'root');
                const randomNode = rootNodes[Math.floor(Math.random() * rootNodes.length)];
                if (randomNode.variable_type === 'continuous') { randomNode.value = Math.round(Math.max(randomNode.min, Math.min(randomNode.max, randomNode.value + (Math.random() - 0.5) * 20))); }
                else if (randomNode.variable_type === 'probability') { randomNode.value = Math.max(0, Math.min(1, randomNode.value + (Math.random() - 0.5) * 0.5)); }
                else if (randomNode.variable_type === 'categorical') { randomNode.value = Math.floor(Math.random() * randomNode.categories.length); }
                
                this.networkState = this.engine.calculateProbabilities(this.networkState);
                const newNodeMap = new Map(this.networkState.nodes.map(n => [n.id, n]));
                
                const newQoL = newNodeMap.get('QOL').probability;
                const newSurvival = newNodeMap.get('SURVIVAL').probability;

                if ((currentQoL < qolThreshold && newQoL > currentQoL) || (currentSurvival < survivalThreshold && newSurvival > currentSurvival)) {
                    document.getElementById(`control-${randomNode.id}`)?.classList.add('sim-flash');
                    break;
                } else {
                    this.networkState = tempState;
                }
            }
        }
        this.runUpdate();
    }
    
    handleLockClick(node) {
        if (this.isSimulationRunning) { this.showAlert('Info', this.T('alert_pause_sim'), false); return; }
        node.isLocked = (node.isLocked + 1) % 3;
        if (node.isLocked === 1) node.probability = 0.9;
        if (node.isLocked === 2) node.probability = 0.1;
        this.runUpdate();
    }

    resetSimulation() {
        if (this.isSimulationRunning) this.toggleSimulation();
        this.networkState = this.createNetworkState(this.modelConfig.network);
        this.setupControls();
        this.setupAdvancedControls();
        this.setupGoalControls();
        this.runUpdate();
    }

    shareScenario() {
        const params = new URLSearchParams();
        this.networkState.nodes.forEach(node => {
            if(node.type === 'root') params.set(node.id, node.value);
        });
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url)
            .then(() => this.showAlert(this.T('alert_link_copied'), `<p>${this.T('alert_link_copied_body')}</p><pre>${url}</pre>`, false));
    }
	
	loadScenarioFromURL() {
        const params = new URLSearchParams(window.location.search);
        if (params.toString() === "") return;
        let loaded = false;
        this.networkState.nodes.forEach(node => {
            if(node.type === 'root' && params.has(node.id)) {
                node.value = (node.variable_type === 'probability') ? parseFloat(params.get(node.id)) : parseInt(params.get(node.id));
                loaded = true;
            }
        });
        if(loaded) {
            this.showAlert('Info', this.T('alert_scenario_loaded'), false);
            if (this.isSimulationRunning) this.toggleSimulation();
        }
    }
    
    loadScenario(type) {
        const scenario = this.modelConfig.scenarios[type];
        if (!scenario) return;
        this.networkState.nodes.forEach(node => {
            if (node.type === 'root' && scenario[node.id] !== undefined) {
                node.value = scenario[node.id];
            }
        });
        if (this.isSimulationRunning) this.toggleSimulation();
        this.setupControls();
        this.runUpdate();
    }

    setMode(newMode, fromTour = false) {
        if (!fromTour && newMode === 'guide') {
            this.guideController.startTour();
            return;
        }
        if (!fromTour && this.currentMode === 'guide') {
            this.guideController.endTour();
        }
        this.currentMode = newMode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`mode-${newMode}`).classList.add('active');
        document.getElementById('model-calibration').style.display = (newMode === 'expert') ? 'block' : 'none';
        if (newMode === 'expert') {
            document.querySelector('.tab-btn[data-tab="analysis-tab"]').click();
        }
    }
    
    setupInfoTab() {
        const version = this.modelConfig.version || 'N/A';
        let content = this.T_guide(this.modelConfig.infoTabContent);
        content = content.replace(/{version}/g, version);
        document.getElementById('info-tab-content-wrapper').innerHTML = content;
    }
    
    focusOnRootControl(node) {
        if (document.body.classList.contains('guide-active')) return;
        document.querySelector('.tab-btn[data-tab="input-tab"]').click();
        setTimeout(() => {
            const header = document.getElementById(`man-header-${node.group}`);
            if (header && !header.classList.contains('active')) header.click();
            setTimeout(() => {
                document.getElementById(`control-${node.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 350);
        }, 50);
    }

    focusOnAdvancedControl(node) {
        if (document.body.classList.contains('guide-active')) return;
        if (this.currentMode !== 'expert') this.setMode('expert');
        const analysisTabBtn = document.querySelector('.tab-btn[data-tab="analysis-tab"]');
        if (!analysisTabBtn.classList.contains('active')) { analysisTabBtn.click(); }
        setTimeout(() => {
            const header = document.getElementById(`adv-header-${node.id}`);
            if (header) {
                if (!header.classList.contains('active')) { header.click(); }
                setTimeout(() => { header.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 350);
            }
        }, 50);
    }
    
    setupGoalControls() {
        const container = document.getElementById('goal-controls');
        container.innerHTML = '';
        const goals = [
            { id: 'qol', nameKey: 'goal_qol_name', value: 0.5, tooltipKey: 'goal_qol_tooltip' },
            { id: 'survival', nameKey: 'goal_survival_name', value: 0.5, tooltipKey: 'goal_survival_tooltip' }
        ];
        goals.forEach(goal => {
            const groupEl = document.createElement('div'); groupEl.className = 'control-group';
            const label = document.createElement('label'); label.textContent = this.T(goal.nameKey); label.title = this.T(goal.tooltipKey);
            const valueDisplay = document.createElement('span'); valueDisplay.className = 'value-display';
            valueDisplay.textContent = `${(goal.value * 100).toFixed(0)}%`;
            label.appendChild(valueDisplay);
            const slider = document.createElement('input');
            slider.type = 'range'; slider.id = `goal-${goal.id}`; slider.min = 0; slider.max = 1; slider.step = 0.01; slider.value = goal.value;
            slider.oninput = (e) => { valueDisplay.textContent = `${(parseFloat(e.target.value) * 100).toFixed(0)}%`; };
            groupEl.appendChild(label); groupEl.appendChild(slider); container.appendChild(groupEl);
        });
    }

    setupAdvancedControls() {
        const container = document.getElementById('advanced-controls');
        container.innerHTML = '';
        this.networkState.nodes.forEach((node) => {
            if (node.type === 'root') return;
            const header = document.createElement('h3'); header.className = 'accordion-header';
            header.id = `adv-header-${node.id}`; header.textContent = this.T_guide(node.name);
            container.appendChild(header);
            const content = document.createElement('div'); content.className = 'accordion-content';
            
            this.createAdvancedControlsForNode(node, content);

            container.appendChild(content);
            header.addEventListener('click', () => {
                const isActive = header.classList.toggle('active');
                document.querySelectorAll('#advanced-controls .accordion-header.active').forEach(h => { if(h !== header) h.classList.remove('active'); });
                document.querySelectorAll('#advanced-controls .accordion-content').forEach(c => c.style.maxHeight = null);
                if (isActive) content.style.maxHeight = content.scrollHeight + "px";
            });
        });
    }
    
    createAdvancedControlsForNode(node, container) {
        const nodeIndex = this.networkState.nodes.findIndex(n => n.id === node.id);
        const nodeMap = new Map(this.networkState.nodes.map(n => [n.id, n]));
        
        const updateNodeBase = (newValue) => {
            this.networkState.nodes[nodeIndex].base = parseFloat(newValue);
            this.runUpdate();
        };
        const debouncedUpdateBase = this.debounce(updateNodeBase, 50);

        const baseGroup = document.createElement('div');
        baseGroup.className = 'control-group'; baseGroup.id = `control-base-${node.id}`;
        const baseLabel = document.createElement('div'); baseLabel.className = 'control-label';
        baseLabel.textContent = this.T('adv_base_prob_label'); baseLabel.title = this.T('adv_base_prob_tooltip', { nodeName: this.T_guide(node.name) });
        const baseValue = document.createElement('span'); baseValue.className = 'value-display'; baseValue.textContent = node.base.toFixed(2);
        baseLabel.appendChild(baseValue);
        const baseSlider = document.createElement('input');
        baseSlider.type = 'range'; baseSlider.min = 0; baseSlider.max = 1; baseSlider.step = 0.01; baseSlider.value = node.base;
        baseSlider.oninput = (e) => { 
            if(this.isSimulationRunning) return;
            baseValue.textContent = parseFloat(e.target.value).toFixed(2); 
            debouncedUpdateBase(e.target.value); 
        };
        baseSlider.onchange = (e) => { 
            if(this.isSimulationRunning) return;
            updateNodeBase(e.target.value); 
        };
        baseGroup.appendChild(baseLabel); baseGroup.appendChild(baseSlider); container.appendChild(baseGroup);

        this.networkState.arcs.forEach((arc, arcIndex) => {
            if (arc.target === node.id) {
                const sourceNode = nodeMap.get(arc.source);
                if (!sourceNode) return;

                const updateArcWeight = (newValue) => {
                    this.networkState.arcs[arcIndex].weight = parseFloat(newValue);
                    this.runUpdate();
                };
                const debouncedUpdateArc = this.debounce(updateArcWeight, 50);

                const sourceNodeName = this.T_guide(sourceNode.name);
                const arcGroup = document.createElement('div'); arcGroup.className = 'control-group'; arcGroup.id = `control-arc-${arcIndex}`;
                const arcLabel = document.createElement('div'); arcLabel.className = 'control-label';
                arcLabel.textContent = this.T('adv_weight_label', { sourceNodeName: sourceNodeName.split(' ')[0] });
                arcLabel.title = this.T('adv_weight_tooltip', { sourceNodeName: sourceNodeName, nodeName: this.T_guide(node.name) });
                const arcValue = document.createElement('span'); arcValue.className = 'value-display'; arcValue.textContent = arc.weight.toFixed(2);
                arcLabel.appendChild(arcValue);
                const arcSlider = document.createElement('input');
                arcSlider.type = 'range'; arcSlider.min = -1; arcSlider.max = 1; arcSlider.step = 0.05; arcSlider.value = arc.weight;
                arcSlider.oninput = (e) => { 
                    if(this.isSimulationRunning) return;
                    arcValue.textContent = parseFloat(e.target.value).toFixed(2); 
                    debouncedUpdateArc(e.target.value); 
                };
                arcSlider.onchange = (e) => {
                    if(this.isSimulationRunning) return;
                    updateArcWeight(e.target.value);
                };
                arcGroup.appendChild(arcLabel); arcGroup.appendChild(arcSlider); container.appendChild(arcGroup);
            }
        });
    }
    
    updateControls() {
        this.networkState.nodes.forEach(node => {
            if(node.type === 'root'){
                const inputEl = document.getElementById(`input-${node.id}`);
                if (!inputEl) return;
                const valueDisplay = inputEl.previousElementSibling.querySelector('.value-display');
                if(inputEl.value != node.value) inputEl.value = node.value;
                if(node.variable_type === 'continuous') { valueDisplay.textContent = `${node.value} ${this.T('unit_years')}`; }
                else if (node.variable_type === 'categorical') { valueDisplay.textContent = this.T_guide(node.categories[node.value].l); }
                else { valueDisplay.textContent = `${(node.value * 100).toFixed(0)}%`; }
            }
        });
    }

    updateAdvancedControls() {
        this.networkState.nodes.forEach(node => {
            if (node.type !== 'root') {
                const baseControl = document.querySelector(`#control-base-${node.id}`);
                if (baseControl) { baseControl.querySelector('input').value = node.base; baseControl.querySelector('.value-display').textContent = node.base.toFixed(2); }
            }
        });
        this.networkState.arcs.forEach((arc, arcIndex) => {
            const arcControl = document.querySelector(`#control-arc-${arcIndex}`);
            if (arcControl) { arcControl.querySelector('input').value = arc.weight; arcControl.querySelector('.value-display').textContent = arc.weight.toFixed(2); }
        });
    }
    
    showMobileInspector(node) {
        this.hideMobileInspector();
        document.getElementById('main-app-content').style.display = 'none';
        document.getElementById('controls-header').style.display = 'none';
        const inspector = document.getElementById('mobile-inspector');
        const titleEl = document.getElementById('mobile-inspector-title');
        const tooltipEl = document.getElementById('mobile-inspector-tooltip');
        const controlsEl = document.getElementById('mobile-inspector-controls');

        this.highlightNodeAndArcs(node.id, true);

        titleEl.textContent = this.T_guide(node.name);
        tooltipEl.innerHTML = this.T_guide(node.tooltip);
        controlsEl.innerHTML = '';

        if (node.type === 'root') {
            this.createControlForNode(node, controlsEl);
        } else {
            const info = document.createElement('p');
            info.innerHTML = `Calculated Probability: <strong>${(node.probability * 100).toFixed(0)}%</strong>`;
            controlsEl.appendChild(info);
            if(this.currentMode === 'expert') {
                this.createAdvancedControlsForNode(node, controlsEl);
            }
        }
        inspector.style.display = 'block';
    }

    hideMobileInspector() {
        document.getElementById('mobile-inspector').style.display = 'none';
        document.getElementById('main-app-content').style.display = 'block';
        document.getElementById('controls-header').style.display = 'block';
        document.querySelectorAll('.highlight-arcs').forEach(el => this.highlightNodeAndArcs(el.id.replace('node-',''), false));
    }
    
    setupResizer() {
        const resizer = document.getElementById('resizer');
        const mainContent = document.querySelector('.main-content');
        const controls = document.querySelector('.controls');
        let isResizing = false;
        const doDrag = (e) => {
            if (!isResizing) return;
            if (this.isMobile()) {
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                const totalHeight = window.innerHeight;
                const mainHeight = clientY;
                const controlsHeight = totalHeight - mainHeight - resizer.offsetHeight;
                if (mainHeight > 100 && controlsHeight > 120) {
                    mainContent.style.flex = `0 1 ${mainHeight}px`;
                    controls.style.flex = `1 1 ${controlsHeight}px`;
                }
            } else {
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const totalWidth = window.innerWidth;
                const mainWidth = clientX;
                const controlsWidth = totalWidth - mainWidth - resizer.offsetWidth;
                if (mainWidth > 300 && controlsWidth > 320) {
                        mainContent.style.flex = `0 1 ${mainWidth}px`;
                        controls.style.flex = `1 1 ${controlsWidth}px`;
                }
            }
            this.debounce(this.renderNetwork.bind(this), 50)();
            e.preventDefault();
        };
        const stopDrag = () => {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', doDrag);
            document.removeEventListener('touchend', stopDrag);
        };
        const startDrag = (e) => {
            isResizing = true;
            document.body.style.cursor = this.isMobile() ? 'ns-resize' : 'ew-resize';
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', doDrag, { passive: false });
            document.addEventListener('touchend', stopDrag);
            e.preventDefault();
        };
        resizer.addEventListener('mousedown', startDrag);
        resizer.addEventListener('touchstart', startDrag, { passive: false });
    }

    setupModalDrag(modal, handle) {
        if (!handle) return;
        let isDragging = false, startX, startY, initialX, initialY;
        const content = modal.querySelector('.modal-content');

        const dragStart = (e) => {
            isDragging = true;
            const event = e.touches ? e.touches[0] : e;
            startX = event.clientX;
            startY = event.clientY;
            
            content.style.position = 'fixed'; 
            const rect = content.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            handle.style.cursor = 'grabbing';
        };

        const doDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); 
            const event = e.touches ? e.touches[0] : e;
            
            let newX = initialX + event.clientX - startX;
            let newY = initialY + event.clientY - startY;

            const contentWidth = content.offsetWidth;
            const contentHeight = content.offsetHeight;
            const padding = 10;

            newX = Math.max(padding, Math.min(newX, window.innerWidth - contentWidth - padding));
            newY = Math.max(padding, Math.min(newY, window.innerHeight - contentHeight - padding));
            
            content.style.left = `${newX}px`;
            content.style.top = `${newY}px`;
        };

        const stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            handle.style.cursor = 'grab';
        };

        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        
        handle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            dragStart(e);
        }, { passive: false });
        document.addEventListener('touchmove', doDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }
    
    exposeAPI() {
         window.BayNetAPI = {
            setNodeValue: (nodeId, value) => {
                const node = this.networkState.nodes.find(n => n.id === nodeId && n.type === 'root');
                if (!node) return false;
                node.value = (node.variable_type === 'probability') ? parseFloat(value) : parseInt(value);
                this.runUpdate(); this.updateControls();
                return true;
            },
            setScenario: (scenarioObject) => {
                let updated = false;
                for (const [nodeId, value] of Object.entries(scenarioObject)) {
                    const node = this.networkState.nodes.find(n => n.id === nodeId && n.type === 'root');
                    if (node) {
                        node.value = (node.variable_type === 'probability') ? parseFloat(value) : parseInt(value);
                        updated = true;
                        document.getElementById(`control-${nodeId}`)?.classList.add('ai-flash');
                    }
                }
                if (updated) { this.runUpdate(); this.updateControls(); }
                return updated;
            },
            getResults: () => {
                const results = {};
                this.networkState.nodes.forEach(n => {
                    results[n.id] = { name: this.T_guide(n.name), probability: n.probability };
                });
                return results;
            },
            getNodesConfig: () => {
                return this.networkState.nodes
                    .filter(n => n.type === 'root')
                    .map(n => ({
                        id: n.id, name: this.T_guide(n.name), type: n.variable_type,
                        min: n.min, max: n.max,
                        categories: n.categories?.map((c, i) => ({ label: this.T_guide(c.l), value: i })),
                        currentValue: n.value
                    }));
            },
            toggleAutoSim: (forceState) => {
                if (forceState === undefined) this.toggleSimulation();
                else if ((forceState === 'stop' && this.isSimulationRunning) || (forceState === 'start' && !this.isSimulationRunning)) {
                    this.toggleSimulation();
                }
                return this.isSimulationRunning;
            }
        };
    }
}

class AIAgent {
    constructor(app) {
        this.app = app;
        this.api = window.BayNetAPI;
        this.T = app.T.bind(app);
        this.isRunning = false;
    }

    async run(task) {
        if (this.isRunning) return;
        this.isRunning = true;
        document.querySelectorAll('.ai-action-btn').forEach(btn => btn.disabled = true);
        this.api.toggleAutoSim('stop');
        document.getElementById('ai-selection-modal').classList.remove('visible');

        try {
            switch (task) {
                case 'analyze': await this._runAnalyzeStrategy(); break;
                case 'summarize': this._runSummarizeScenario(); break;
                case 'create': this._runCreateScenario(); break;
            }
        } catch (e) {
            console.error("AI Assistant Error:", e);
            this.app.showAlert("Error", "An error occurred during AI analysis.");
        } finally {
            this.isRunning = false;
            document.querySelectorAll('.ai-action-btn').forEach(btn => btn.disabled = false);
        }
    }

    _getAIName() {
        return this.app.isRealAIAvailable ? "Gemini Nano" : "Gemini Nano (simulated)";
    }

    _getCurrentStateAsJson() {
        const inputs = this.api.getNodesConfig();
        const results = this.api.getResults();
        const data = {
            patient_inputs: inputs.map(i => ({id: i.id, name: i.name, value: i.currentValue})),
            current_prognosis: {
                SURVIVAL: results.SURVIVAL,
                PROGRESSION: results.PROGRESSION,
                QOL: results.QOL,
            }
        };
        return JSON.stringify(data, null, 2);
    }
    
    async _runAnalyzeStrategy() {
        const initialResults = this.api.getResults();
        const initialStateJson = this._getCurrentStateAsJson();

        this.app.showAlert(this.T('ai_alert_title_sim'), `<i>${this._getAIName()}: ${this.T('ai_analyze_intro')}</i>`, true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const strategies = [
            { nameKey: "ai_strategy_turbt_only", changes: { "TREATMENT_TYPE": 0, "SECOND_LOOK": 0, "ADJUVANT_TX": 0 } },
            { nameKey: "ai_strategy_turbt_no_look", changes: { "TREATMENT_TYPE": 0, "SECOND_LOOK": 0, "ADJUVANT_TX": 1 } },
            { nameKey: "ai_strategy_turbt_bcg", changes: { "TREATMENT_TYPE": 0, "SECOND_LOOK": 1, "ADJUVANT_TX": 1 } },
            { nameKey: "ai_strategy_cystectomy_only", changes: { "TREATMENT_TYPE": 1, "SECOND_LOOK": 0, "ADJUVANT_TX": 0 } },
        ];
        
        let bestStrategy = null;
        let maxScore = -1;
        let allResults = [];

        for (const strategy of strategies) {
            this.api.setScenario(strategy.changes);
            await new Promise(resolve => setTimeout(resolve, 800));
            const results = this.api.getResults();
            const score = (results.SURVIVAL.probability * 0.7) + (results.QOL.probability * 0.3);
            allResults.push({ ...strategy, survival: results.SURVIVAL.probability, qol: results.QOL.probability });
            if (score > maxScore) {
                maxScore = score;
                bestStrategy = { ...strategy, survival: results.SURVIVAL.probability, qol: results.QOL.probability };
            }
        }
        
        this.api.setScenario(bestStrategy.changes);
        
        const altStrategy = allResults.find(r => r.nameKey === "ai_strategy_cystectomy_only");

        const alertTitle = this.T('ai_alert_title_sim');
        const alertBody = `
            <p><i>${this._getAIName()}: Analysis complete.</i></p>
            <hr>
            <strong>${this.T('ai_alert_optimal_found')}</strong>
            <ul>
                <li><strong>${this.T('ai_alert_strategy')}:</strong> ${this.T(bestStrategy.nameKey)}</li>
                <li><strong>${this.T('ai_alert_prognosis')}:</strong> ${this.T('ai_alert_survival')} <b>${(bestStrategy.survival * 100).toFixed(0)}%</b>, ${this.T('ai_alert_qol')} <b>${(bestStrategy.qol * 100).toFixed(0)}%</b></li>
            </ul>
            ${this.T('ai_analyze_comparison', {
                initial_survival: (initialResults.SURVIVAL.probability * 100).toFixed(0),
                initial_qol: (initialResults.QOL.probability * 100).toFixed(0),
                alt_name: this.T(altStrategy.nameKey),
                alt_survival: (altStrategy.survival * 100).toFixed(0),
                alt_qol: (altStrategy.qol * 100).toFixed(0),
            })}
            <p><em>${this.T('ai_analyze_conclusion')}</em></p>
            <details>
                <summary>${this.T('ai_show_data_json')}</summary>
                <pre>${initialStateJson}</pre>
            </details>
        `;
        this.app.showAlert(alertTitle, alertBody);
    }
    
    _runSummarizeScenario() {
        const nodes = this.api.getNodesConfig();
        
        let riskFactors = [];
        if (nodes.find(n => n.id === 'ETA_PAZIENTE').currentValue > 75) riskFactors.push(this.T('risk_factor_age'));
        if (nodes.find(n => n.id === 'GRADO_G').currentValue === 1) riskFactors.push(this.T('risk_factor_grade'));
        if (nodes.find(n => n.id === 'STADIO_T').currentValue > 0) riskFactors.push(this.T('risk_factor_stage'));
        if (nodes.find(n => n.id === 'FUMO').currentValue > 0.6) riskFactors.push(this.T('risk_factor_smoking'));

        let protectiveFactors = [];
        if (nodes.find(n => n.id === 'ADJUVANT_TX').currentValue === 1) protectiveFactors.push(this.T('protective_factor_adjuvant'));
        if (nodes.find(n => n.id === 'EXP_CHIR').currentValue > 0.8) protectiveFactors.push(this.T('protective_factor_experience'));
        
        let summaryText = `<p><i>${this._getAIName()}: ${this.T('ai_summary_intro')}</i></p>`;
        if (riskFactors.length > 0) {
            summaryText += `<p>${this.T('ai_summary_risk_factors', { factors: riskFactors.join(', ') })}</p>`;
        } else {
            summaryText += `<p>${this.T('ai_summary_no_risks')}</p>`;
        }
        if (protectiveFactors.length > 0) {
            summaryText += `<p>${this.T('ai_summary_protective_factors', { factors: protectiveFactors.join(', ') })}</p>`;
        }
        
        const alertBody = `${summaryText}
            <details>
                <summary>${this.T('ai_show_data_json')}</summary>
                <pre>${this._getCurrentStateAsJson()}</pre>
            </details>
        `;
        this.app.showAlert(this.T('ai_summary_title'), alertBody);
    }

    _runCreateScenario() {
        this.app.loadScenario('hr-aggressive');
        const alertBody = `
            <p><i>${this._getAIName()}: ${this.T('ai_create_intro')}</i></p>
            <p>${this.T('ai_create_description')}</p>
        `;
        this.app.showAlert(this.T('ai_create_title'), alertBody);
    }
}

window.BayNetApp = BayNetApp;
window.AIAgent = AIAgent;