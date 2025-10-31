/**
 * BAYNET Guide Controller v0.53
 * Manages the interactive guided tour for a BAYNET application.
 * by SMZ
 * Released under the MIT License.
 */
class GuideController {
    constructor(app) {
        this.app = app;
        this.modelConfig = app.modelConfig;
        this.speechSynthesis = window.speechSynthesis;

        // State
        this.currentStepIndex = -1;
        this.guideActionResolver = null;
        this.isGuideMuted = false;

        // DOM Element Cache
        this.guideContainer = document.getElementById('guide-container');
        this.guidePopover = document.getElementById('guide-popover');
        this.guideHighlight = document.getElementById('guide-highlight');
        this.guideTitleEl = document.getElementById('guide-popover-title');
        this.guideContentEl = document.getElementById('guide-popover-content');
        this.guideProgressEl = document.getElementById('guide-popover-progress');
        this.guideNextBtn = document.getElementById('guide-next-btn');
        this.guidePrevBtn = document.getElementById('guide-prev-btn');
        this.guideEndBtn = document.getElementById('guide-end-btn');
        this.guideMuteBtn = document.getElementById('guide-mute-btn');
    }

    init() {
        if (!this.modelConfig.guidedTour || this.modelConfig.guidedTour.length === 0) {
            document.getElementById('mode-guide').style.display = 'none';
            return;
        }
        document.getElementById('mode-guide').addEventListener('click', () => this.startTour());
        this.guideNextBtn.addEventListener('click', () => this.nextStep());
        this.guidePrevBtn.addEventListener('click', () => this.prevStep());
        this.guideEndBtn.addEventListener('click', () => this.endTour());
        this.guideMuteBtn.addEventListener('click', () => this.toggleGuideMute());
        this.setupGuidePopoverDrag();
    }

    startTour() {
        if (this.currentStepIndex !== -1) return;
        this.app.resetSimulation();
        document.body.classList.add('guide-active');
        this.app.setMode('guide', true);
        this.currentStepIndex = 0;
        this.guideContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.showStep(this.currentStepIndex);
    }

    endTour() {
        if (this.currentStepIndex === -1) return;
        this.speechSynthesis.cancel();
        this.currentStepIndex = -1;
        this.guideContainer.style.display = 'none';
        document.body.classList.remove('guide-active');
        if (this.guideActionResolver) {
            this.guideActionResolver.element.removeEventListener(this.guideActionResolver.event, this.guideActionResolver.handler);
            this.guideActionResolver = null;
        }
        if (this.app.currentMode === 'guide') {
            this.app.setMode('base');
        }
        document.getElementById('ai-selection-modal').classList.remove('visible');
    }
    
    prevStep() {
        if (this.currentStepIndex > 0) {
            this.speechSynthesis.cancel();
            this.currentStepIndex--;
            this.showStep(this.currentStepIndex);
        }
    }

    nextStep() {
        this.speechSynthesis.cancel();
        this.currentStepIndex++;
        if (this.currentStepIndex >= this.modelConfig.guidedTour.length) {
            this.endTour();
        } else {
            this.showStep(this.currentStepIndex);
        }
    }
    
    speak(text) {
        if (this.isGuideMuted || !text) return;
        this.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = this.speechSynthesis.getVoices();
        if (this.app.currentLanguage === 'it') {
            utterance.voice = voices.find(v => v.lang.startsWith('it-') && (v.name.includes('Luca') || v.name.includes('Giorgio'))) 
                           || voices.find(v => v.lang.startsWith('it-') && !v.name.toLowerCase().includes('female')) 
                           || voices.find(v => v.lang.startsWith('it'));
            utterance.lang = 'it-IT';
        } else {
            utterance.voice = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Google US English'))) 
                           || voices.find(v => v.lang.startsWith('en-US') && !v.name.toLowerCase().includes('female')) 
                           || voices.find(v => v.lang.startsWith('en-US')) 
                           || voices.find(v => v.lang.startsWith('en'));
            utterance.lang = 'en-US';
        }
        this.speechSynthesis.speak(utterance);
    }
    
    toggleGuideMute() {
        this.isGuideMuted = !this.isGuideMuted;
        this.guideMuteBtn.textContent = this.isGuideMuted ? '🔇' : '🔊';
        if (this.isGuideMuted) {
            this.speechSynthesis.cancel();
        } else {
            const step = this.modelConfig.guidedTour[this.currentStepIndex];
            if(step) this.speak(this.app.T_guide(step.narration));
        }
    }

    showStep(index) {
        const step = this.modelConfig.guidedTour[index];
        this.speak(this.app.T_guide(step.narration));
        this.guideTitleEl.innerHTML = this.app.T_guide(step.title);
        this.guideContentEl.innerHTML = this.app.T_guide(step.content);
        this.guideProgressEl.textContent = `Step ${index + 1} of ${this.modelConfig.guidedTour.length}`;
        this.guidePrevBtn.disabled = index === 0;

        if (this.guideActionResolver) {
            this.guideActionResolver.element.removeEventListener(this.guideActionResolver.event, this.guideActionResolver.handler);
            this.guideActionResolver = null;
        }
        
        if (step.simulatedAction?.type === 'show-ai-badge') {
            document.getElementById('ai-ready-badge').textContent = '✨'; 
            document.getElementById('ai-modal-title').textContent = this.app.T('ai_modal_title_real');
        } else {
            this.app.updateAIVisuals();
        }

        const target = step.targetElement ? document.querySelector(step.targetElement) : null;
        
        if (step.targetElement?.startsWith('#ai-action-')) {
            this.app.positionModalRelativeToControls(document.getElementById('ai-selection-modal'), true);
            document.getElementById('ai-selection-modal').classList.add('visible');
        } else if(this.currentStepIndex > 0 && !this.modelConfig.guidedTour[this.currentStepIndex-1].targetElement?.startsWith('#ai-action-')) {
            document.getElementById('ai-selection-modal').classList.remove('visible');
        }
        
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            setTimeout(() => {
                const rect = target.getBoundingClientRect();
                this.updateGuideOverlay(rect);
                this.positionPopover(rect);
                const margin = 5;
                this.guideHighlight.style.left = `${rect.left - margin}px`;
                this.guideHighlight.style.top = `${rect.top - margin}px`;
                this.guideHighlight.style.width = `${rect.width + margin*2}px`;
                this.guideHighlight.style.height = `${rect.height + margin*2}px`;
            }, 400);
        } else {
            this.guideHighlight.style.width = '0px';
            this.updateGuideOverlay(null);
            this.guidePopover.style.top = '50%';
            this.guidePopover.style.left = '50%';
            this.guidePopover.style.transform = 'translate(-50%, -50%)';
        }
        
        if (step.waitForAction) {
            this.guideNextBtn.disabled = true;
            const actionTarget = document.querySelector(step.waitForAction.target || step.targetElement);
            actionTarget.style.pointerEvents = 'all'; 
            const eventType = step.waitForAction.type === 'click' ? 'click' : 'input';
            
            const handler = (e) => {
                if (step.waitForAction.propagate) {
                    // Don't prevent default, just check condition and unlock next
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                }

                let conditionMet = false;
                if (step.waitForAction.type === 'setValue') {
                    if (e.target.value >= step.waitForAction.value) {
                        conditionMet = true;
                    }
                } else {
                    conditionMet = true;
                }
                
                if (conditionMet) {
                    this.guideNextBtn.disabled = false;
                    actionTarget.removeEventListener(eventType, handler);
                    this.guideActionResolver = null;
                    
                    if (step.targetElement.startsWith('#ai-action-')) {
                        document.getElementById('ai-selection-modal').classList.remove('visible');
                        const agent = new AIAgent(this.app);
                        agent.run(step.targetElement.replace('#ai-action-', ''));
                    }
                }
            };

            // CRITICAL FIX: Do NOT use `{ once: true }` for input events that need continuous checking.
            // The handler now correctly removes itself once the condition is met.
            actionTarget.addEventListener(eventType, handler);
            this.guideActionResolver = { element: actionTarget, event: eventType, handler: handler };
        } else {
            this.guideNextBtn.disabled = false;
        }
    }

    positionPopover(targetRect) {
        const popoverRect = this.guidePopover.getBoundingClientRect();
        const positions = ['bottom', 'top', 'right', 'left'];
        let bestPosition = 'bottom';
        let maxArea = 0;

        for (const pos of positions) {
            let area = 0;
            if (pos === 'bottom') area = (window.innerHeight - targetRect.bottom) * window.innerWidth;
            if (pos === 'top') area = targetRect.top * window.innerWidth;
            if (pos === 'right') area = (window.innerWidth - targetRect.right) * window.innerHeight;
            if (pos === 'left') area = targetRect.left * window.innerHeight;
            if (area > maxArea) {
                maxArea = area;
                bestPosition = pos;
            }
        }

        let popoverTop = 0, popoverLeft = 0; 
        const offset = 15;
        if (bestPosition === 'bottom') { popoverTop = targetRect.bottom + offset; popoverLeft = targetRect.left + (targetRect.width - popoverRect.width) / 2; }
        else if (bestPosition === 'top') { popoverTop = targetRect.top - popoverRect.height - offset; popoverLeft = targetRect.left + (targetRect.width - popoverRect.width) / 2; }
        else if (bestPosition === 'left') { popoverTop = targetRect.top + (targetRect.height - popoverRect.height) / 2; popoverLeft = targetRect.left - popoverRect.width - offset; }
        else if (bestPosition === 'right') { popoverTop = targetRect.top + (targetRect.height - popoverRect.height) / 2; popoverLeft = targetRect.right + offset; }

        popoverTop = Math.max(10, Math.min(popoverTop, window.innerHeight - popoverRect.height - 10));
        popoverLeft = Math.max(10, Math.min(popoverLeft, window.innerWidth - popoverRect.width - 10));

        this.guidePopover.style.top = `${popoverTop}px`;
        this.guidePopover.style.left = `${popoverLeft}px`;
        this.guidePopover.style.transform = '';
    }

    updateGuideOverlay(rect) {
        const top = document.getElementById('guide-overlay-top');
        const bottom = document.getElementById('guide-overlay-bottom');
        const left = document.getElementById('guide-overlay-left');
        const right = document.getElementById('guide-overlay-right');
        if (!rect) {
            [top, bottom, left, right].forEach(p => { p.style.height = '0'; p.style.width = '0'; });
            return;
        }
        top.style.height = `${rect.top}px`;
        top.style.width = '100%';
        bottom.style.top = `${rect.bottom}px`;
        bottom.style.height = `calc(100% - ${rect.bottom}px)`;
        bottom.style.width = '100%';
        left.style.top = `${rect.top}px`;
        left.style.height = `${rect.height}px`;
        left.style.width = `${rect.left}px`;
        right.style.top = `${rect.top}px`;
        right.style.height = `${rect.height}px`;
        right.style.left = `${rect.right}px`;
        right.style.width = `calc(100% - ${rect.right}px)`;
    }

    setupGuidePopoverDrag() {
        let isDragging = false, startX, startY, initialX, initialY;
        const popover = this.guidePopover;

        const startDrag = (e) => {
            if (e.target.closest('.guide-btn')) return;
            isDragging = true;
            const event = e.touches ? e.touches[0] : e;
            startX = event.clientX; startY = event.clientY;
            initialX = popover.offsetLeft; initialY = popover.offsetTop;
            popover.style.transition = 'none'; popover.style.cursor = 'grabbing';
            e.preventDefault();
        };

        const doDrag = (e) => {
            if (!isDragging) return;
            const event = e.touches ? e.touches[0] : e;
            popover.style.left = `${initialX + event.clientX - startX}px`;
            popover.style.top = `${initialY + event.clientY - startY}px`;
        };

        const stopDrag = () => {
            isDragging = false;
            popover.style.transition = 'opacity 0.4s ease-in-out, top 0.4s ease-in-out, left 0.4s ease-in-out';
            popover.style.cursor = 'grab';
        };

        popover.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        popover.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', doDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }
}