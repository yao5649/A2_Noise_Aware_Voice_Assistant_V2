
'use strict';

// ==========================================
// 1. CONNECT HTML ELEMENTS
// ==========================================

const ui = {
    noise: document.getElementById('noise'),
    command: document.getElementById('command'),

    confidence: document.getElementById('confidence'),
    confidenceFill: document.getElementById('confidence-fill'),
    feedback: document.getElementById('feedback'),
    decisionStatus: document.getElementById('decision-status'),
    decisionExplanation: document.getElementById('decision-explanation'),

    simulate: document.getElementById('simulate'),
    confirm: document.getElementById('confirm'),
    cancel: document.getElementById('cancel'),
    retry: document.getElementById('retry'),
    reset: document.getElementById('reset'),

    thresholdSlider: document.getElementById('threshold-slider'),
    thresholdValue: document.getElementById('threshold-value'),

    metricConfidence: document.getElementById('metric-confidence'),
    metricThreshold: document.getElementById('metric-threshold'),
    metricExecuted: document.getElementById('metric-executed'),
    metricRetries: document.getElementById('metric-retries'),

    quietCount: document.getElementById('quiet-count'),
    mediumCount: document.getElementById('medium-count'),
    noisyCount: document.getElementById('noisy-count'),

    quietBar: document.getElementById('quiet-bar'),
    mediumBar: document.getElementById('medium-bar'),
    noisyBar: document.getElementById('noisy-bar'),

    log: document.getElementById('log'),
    emptyLog: document.getElementById('empty-log')
};

// ==========================================
// 2. CENTRAL APPLICATION STATE
// ==========================================

const state = {
    threshold: Number(ui.thresholdSlider.value),
    pendingCommand: '',
    currentConfidence: null,

    executed: 0,
    retries: 0,

    scenarios: {
        quiet: 0,
        medium: 0,
        noisy: 0
    },

    phase: 'ready'
};

// Simulated confidence scores

const scores = {
    quiet: 0.95,
    medium: 0.65,
    noisy: 0.30
};

// ==========================================
// 3. UPDATE CONFIDENCE DISPLAY
// ==========================================

function updateConfidenceDisplay(score) {

    if (score === null) {
        ui.confidence.textContent = 'Not available';
        ui.metricConfidence.textContent = '--';
        ui.confidenceFill.style.width = '0%';

        return;
    }

    const percentage = Math.round(score * 100);

    ui.confidence.textContent = percentage + '%';
    ui.metricConfidence.textContent = percentage + '%';

    ui.confidenceFill.style.width = percentage + '%';
}

// ==========================================
// 4. UPDATE DASHBOARD ANALYTICS
// ==========================================

function updateDashboard() {

    // Update threshold cards

    ui.thresholdValue.textContent =
        state.threshold + '%';

    ui.metricThreshold.textContent =
        state.threshold + '%';

    // Update execution statistics

    ui.metricExecuted.textContent =
        state.executed;

    ui.metricRetries.textContent =
        state.retries;

    // Update scenario counts

    ui.quietCount.textContent =
        state.scenarios.quiet;

    ui.mediumCount.textContent =
        state.scenarios.medium;

    ui.noisyCount.textContent =
        state.scenarios.noisy;

    // Update scenario comparison bars

    const maximum = Math.max(
        1,
        ...Object.values(state.scenarios)
    );

    ui.quietBar.style.width =
        (state.scenarios.quiet / maximum * 100) + '%';

    ui.mediumBar.style.width =
        (state.scenarios.medium / maximum * 100) + '%';

    ui.noisyBar.style.width =
        (state.scenarios.noisy / maximum * 100) + '%';
}

// ==========================================
// 5. INTERACTION HISTORY
// ==========================================

function addLog(message) {

    const item = document.createElement('li');

    item.textContent = message;

    ui.log.appendChild(item);

    ui.emptyLog.hidden = true;
}

// ==========================================
// 6. CONTROL BUTTON STATES
// ==========================================

function setPhase(phase) {

    state.phase = phase;

    const waiting = phase === 'confirm';

    ui.simulate.disabled = waiting;
    ui.noise.disabled = waiting;
    ui.command.disabled = waiting;

    // Prevent threshold changes during confirmation

    ui.thresholdSlider.disabled = waiting;

    ui.confirm.disabled = !waiting;
    ui.cancel.disabled = !waiting;

    ui.retry.disabled =
        phase !== 'retry' &&
        phase !== 'cancelled';

    ui.reset.disabled = false;
}

// ==========================================
// 7. SYSTEM DECISION ENGINE
// ==========================================

function decide(score) {

    const threshold = state.threshold / 100;

    // Automatic execution

    if (score >= threshold) {
        return 'execute';
    }

    // Ask user for confirmation

    if (score >= 0.50) {
        return 'confirm';
    }

    // Low confidence: request retry

    return 'retry';
}

// ==========================================
// 8. UPDATE SYSTEM RESPONSE
// ==========================================

function updateDecision(status, feedback, explanation) {

    ui.decisionStatus.textContent = status;

    ui.feedback.textContent = feedback;

    ui.decisionExplanation.textContent = explanation;
}

// ==========================================
// 9. EXECUTE COMMAND
// ==========================================

function executeCommand(text, source) {

    if (!text) return;

    state.executed++;

    updateDecision(
        'Command executed',
        'Command executed (simulated): ' + text,
        source === 'confirmed'
            ? 'The user confirmed the proposed command.'
            : 'Confidence met the automatic execution threshold.'
    );

    addLog('Executed (simulated): ' + text);

    state.pendingCommand = '';

    updateDashboard();

    setPhase('executed');
}

// ==========================================
// 10. SIMULATE VOICE INPUT
// ==========================================

ui.simulate.addEventListener('click', function () {

    const noiseLevel = ui.noise.value;

    const score = scores[noiseLevel];

    if (score === undefined) return;

    const selectedCommand = ui.command.value;

    state.pendingCommand = selectedCommand;
    state.currentConfidence = score;

    // Record scenario activity

    state.scenarios[noiseLevel]++;

    // Update confidence display

    updateConfidenceDisplay(score);

    updateDashboard();

    const percentage = Math.round(score * 100);

    addLog(
        noiseLevel + ' | ' +
        selectedCommand + ' | ' +
        percentage + '%'
    );

    // Evaluate confidence

    const decision = decide(score);

    // CASE 1: AUTOMATIC EXECUTION

    if (decision === 'execute') {

        executeCommand(selectedCommand, 'automatic');
    }

    // CASE 2: USER CONFIRMATION

    else if (decision === 'confirm') {

        updateDecision(
            'Confirmation required',
            'Did you mean: ' + selectedCommand +
            '? Please confirm or cancel.',
            'Confidence is below the automatic execution threshold but remains high enough for user confirmation.'
        );

        addLog('Confirmation requested.');

        setPhase('confirm');
    }

    // CASE 3: LOW CONFIDENCE

    else {

        state.retries++;

        updateDecision(
            'Low confidence - retry required',
            'Confidence is too low. No action was taken. Please try again.',
            'Confidence is below the 50% confirmation threshold. The command was not executed.'
        );

        addLog('Retry requested. No action taken.');

        state.pendingCommand = '';

        updateDashboard();

        setPhase('retry');
    }
});

// ==========================================
// 11. CONFIRM COMMAND
// ==========================================

ui.confirm.addEventListener('click', function () {

    if (!state.pendingCommand) return;

    addLog('User confirmed.');

    executeCommand(
        state.pendingCommand,
        'confirmed'
    );
});

// ==========================================
// 12. CANCEL COMMAND
// ==========================================

ui.cancel.addEventListener('click', function () {

    if (!state.pendingCommand) return;

    const cancelledCommand = state.pendingCommand;

    updateDecision(
        'Command cancelled',
        'Command cancelled. No action taken.',
        'The user rejected the proposed command. Nothing was executed.'
    );

    addLog('User cancelled: ' + cancelledCommand);

    state.pendingCommand = '';

    setPhase('cancelled');
});

// ==========================================
// 13. TRY AGAIN
// ==========================================

ui.retry.addEventListener('click', function () {

    state.pendingCommand = '';
    state.currentConfidence = null;

    updateConfidenceDisplay(null);

    updateDecision(
        'Ready for another attempt',
        'Choose your settings and simulate again.',
        'The previous command has been cleared. No action was taken.'
    );

    addLog('User chose to try again.');

    updateDashboard();

    setPhase('ready');
});

// ==========================================
// 14. ADJUST CONFIDENCE THRESHOLD
// ==========================================

ui.thresholdSlider.addEventListener('input', function () {

    state.threshold = Number(this.value);

    updateDashboard();
});

// ==========================================
// 15. RESET DASHBOARD
// ==========================================

ui.reset.addEventListener('click', function () {

    // Restore input settings

    ui.noise.value = 'quiet';
    ui.command.selectedIndex = 0;

    ui.thresholdSlider.value = 80;

    // Reset application state

    state.threshold = 80;

    state.pendingCommand = '';
    state.currentConfidence = null;

    state.executed = 0;
    state.retries = 0;

    state.scenarios = {
        quiet: 0,
        medium: 0,
        noisy: 0
    };

    // Clear interaction history

    ui.log.textContent = '';
    ui.emptyLog.hidden = false;

    // Restore response display

    updateConfidenceDisplay(null);

    updateDecision(
        'Waiting for input',
        'Choose your settings and simulate voice input.',
        'The system is ready to evaluate a simulated command.'
    );

    // Refresh all statistics

    updateDashboard();

    setPhase('ready');
});

// ==========================================
// 16. INITIALISE APPLICATION
// ==========================================

function initialiseDashboard() {

    updateConfidenceDisplay(null);

    updateDashboard();

    updateDecision(
        'Waiting for input',
        'Choose your settings and simulate voice input.',
        'The system is ready to evaluate a simulated command.'
    );

    setPhase('ready');

    console.log(
        'Noise-Aware Voice Assistant V2.0 initialised.'
    );
}

// Start application

initialiseDashboard();