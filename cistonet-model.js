/**
 * CistoNet Model Configuration v0.52
 * Contains all data and logic specific to the CistoNet model for Bladder Cancer.
 * This file is loaded by the generic BAYNET engine.
 * by SMZ
 * Released under the MIT License.
 */
const cistoNetModel = {
    version: "0.52",
    modelName: "CistoNet",
    modelDescriptionKey: "model_description_key",

    disclaimer: {
        title: "disclaimer_title",
        p1_strong: "disclaimer_p1_strong",
        p1_strong2: "disclaimer_p1_strong2",
        p2: "disclaimer_p2",
        accept: "disclaimer_accept"
    },
    
    translations: {
        // --- General UI & Titles ---
        model_description_key: { en: "Interactive Prognostic Simulator for Bladder Cancer", it: "Simulatore Prognostico Interattivo per il Cancro alla Vescica" },
        tab_input: { en: "Data Input", it: "Input Dati" },
        tab_analysis: { en: "Analysis & Prognosis", it: "Analisi & Prognosi" },
        tab_info: { en: "Info", it: "Info" },
        mode_guide: { en: "Guide", it: "Guida" },
        mode_base: { en: "Base", it: "Base" },
        mode_expert: { en: "Expert", it: "Esperto" },
        
        // --- Button Texts ---
        toggle_sim_start: { en: "Start Simulation", it: "Avvia Simulazione" },
        toggle_sim_pause: { en: "Pause Simulation", it: "Pausa Simulazione" },
        theme_toggle_dark: { en: "Dark Theme", it: "Tema Scuro" },
        theme_toggle_light: { en: "Light Theme", it: "Tema Chiaro" },
        reset_btn: { en: "Reset", it: "Reset" },
        share_btn: { en: "Copy Link", it: "Copia Link" },
        run_ai_assistant: { en: "Run AI Assistant", it: "Avvia Assistente IA" },
        
        // --- Button Tooltips ---
        tooltip_toggle_sim: { en: "Start or pause the automatic simulation, which randomly adjusts variables over time.", it: "Avvia o metti in pausa la simulazione automatica, che modifica casualmente le variabili nel tempo." },
        tooltip_ai_assistant_sim: { en: "Open the AI Assistant panel to run simulated analyses.", it: "Apri il pannello dell'Assistente IA per eseguire analisi simulate." },
        tooltip_ai_assistant_real: { en: "Open the AI Assistant panel. Analyses will be run in real-time by the local AI on your device.", it: "Apri il pannello dell'Assistente IA. Le analisi verranno eseguite in tempo reale dall'IA locale sul tuo dispositivo." },
        tooltip_theme: { en: "Switch between light and dark visual themes.", it: "Passa dal tema visivo chiaro a quello scuro e viceversa." },
        tooltip_reset: { en: "Reset all input variables and model parameters to their default values.", it: "Reimposta tutte le variabili di input e i parametri del modello ai loro valori predefiniti." },
        tooltip_share: { en: "Copy a unique URL of the current scenario to your clipboard to share it.", it: "Copia negli appunti un URL univoco dello scenario corrente per condividerlo." },
        tooltip_scenario_lr_typical: { en: "Load a predefined scenario for a typical, low-risk patient.", it: "Carica uno scenario predefinito per un paziente tipico a basso rischio." },
        tooltip_scenario_lr_elderly: { en: "Load a predefined scenario for an elderly, low-risk patient with comorbidities.", it: "Carica uno scenario predefinito per un paziente anziano a basso rischio con comorbidità." },
        tooltip_scenario_hr_advanced: { en: "Load a predefined scenario for a high-risk patient with advanced, muscle-invasive disease.", it: "Carica uno scenario predefinito per un paziente ad alto rischio con malattia avanzata muscolo-invasiva." },
        tooltip_scenario_hr_aggressive: { en: "Load a predefined scenario for a high-risk patient with aggressive, non-invasive disease.", it: "Carica uno scenario predefinito per un paziente ad alto rischio con malattia aggressiva non invasiva." },
        tooltip_legend_positive: { en: "Positive Influence: Factors that increase the probability of the target node.", it: "Influenza Positiva: Fattori che aumentano la probabilità del nodo di destinazione." },
        tooltip_legend_negative: { en: "Negative Influence: Factors that decrease the probability of the target node.", it: "Influenza Negativa: Fattori che diminuiscono la probabilità del nodo di destinazione." },

        // --- Scenarios ---
        scenario_lr_typical: { en: "Low Risk (Typical)", it: "Basso Rischio (Tipico)" },
        scenario_lr_elderly: { en: "Low Risk (Elderly)", it: "Basso Rischio (Anziano)" },
        scenario_hr_advanced: { en: "High Risk (Advanced)", it: "Alto Rischio (Avanzato)" },
        scenario_hr_aggressive: { en: "High Risk (Aggressive)", it: "Alto Rischio (Aggressivo)" },
        
        // --- Analysis Tab ---
        prognosis_summary_title: { en: "General Prognosis Summary", it: "Sintesi Prognosi Generale" },
        calculating: { en: "Calculating...", it: "Calcolo..." },
        clinical_validator_title: { en: "Clinical Validator", it: "Validatore Clinico" },
        simulation_goals_title: { en: "Simulation Goals", it: "Obiettivi di Simulazione" },
        model_calibration_title: { en: "Model Calibration", it: "Calibrazione Modello" },
        prognosis_favorable: { en: "Favorable Prognosis", it: "Prognosi Favorevole" },
        prognosis_intermediate: { en: "Intermediate Risk", it: "Rischio Intermedio" },
        prognosis_high_risk: { en: "High Risk", it: "Alto Rischio" },
        risk_drivers_label: { en: "Main Risk Factors", it: "Fattori di Rischio Principali" },
        protective_drivers_label: { en: "Key Protective Factors", it: "Fattori Protettivi Chiave" },
        balanced_profile: { en: "Balanced risk profile.", it: "Profilo di rischio bilanciato." },
        
        // --- Validator Messages ---
        validator_ok: { en: "✅ Clinical Coherence Respected", it: "✅ Coerenza Clinica Rispettata" },
        validator_cystectomy_low_risk: { en: "⚠️ <strong>Warning:</strong> Radical cystectomy is an overtreatment for low-risk disease.", it: "⚠️ <strong>Warning:</strong> La cistectomia radicale è un trattamento eccessivo per una malattia a basso rischio." },
        validator_adjuvant_low_risk: { en: "⚠️ <strong>Warning:</strong> Adjuvant therapy is rarely indicated for low-risk tumors.", it: "⚠️ <strong>Warning:</strong> La terapia adiuvante è raramente indicata per tumori a basso rischio." },
        validator_t1hg_no_adjuvant: { en: "⚠️ <strong>Warning:</strong> The absence of adjuvant therapy for a T1 high-grade tumor deviates from guidelines.", it: "⚠️ <strong>Warning:</strong> L'assenza di terapia adiuvante per un tumore T1 di alto grado è una deviazione dalle linee guida." },
        validator_cystectomy_adjuvant: { en: "⚠️ <strong>Info:</strong> Intravesical adjuvant therapy is not applicable after cystectomy.", it: "⚠️ <strong>Info:</strong> La terapia adiuvante intravescicole non si applica dopo cistectomia." },
        
        // --- Goals & Advanced Controls ---
        goal_qol_name: { en: "Minimum Quality of Life", it: "Qualità della Vita Minima" },
        goal_qol_tooltip: { en: "Set the desired minimum threshold for Quality of Life during automatic simulation.", it: "Imposta la soglia minima desiderata per la Qualità della Vita durante la simulazione automatica." },
        goal_survival_name: { en: "Minimum Survival", it: "Sopravvivenza Minima" },
        goal_survival_tooltip: { en: "Set the desired minimum threshold for 5-Year Survival during automatic simulation.", it: "Imposta la soglia minima desiderata per la Sopravvivenza a 5 Anni during la simulazione automatica." },
        adv_base_prob_label: { en: "Base Prob.", it: "Prob. di Base" },
        adv_base_prob_tooltip: { en: "Adjust the base probability of '{nodeName}' occurring in the absence of other factors.", it: "Regola la probabilità di base di '{nodeName}' che si verifichi in assenza di altri fattori." },
        adv_weight_label: { en: "Weight: {sourceNodeName}", it: "Peso: {sourceNodeName}" },
        adv_weight_tooltip: { en: "Adjust the influence (positive or negative) of '{sourceNodeName}' on '{nodeName}'.", it: "Regola l'influenza (positiva o negativa) di '{sourceNodeName}' su '{nodeName}'." },
        
        // --- Alerts & Modals ---
        alert_ok: { en: "OK", it: "OK" },
        alert_pause_sim: { en: "Pause the simulation to set evidence.", it: "Metti in pausa la simulazione per impostare l'evidenza." },
        alert_link_copied: { en: "Link Copied", it: "Link Copiato" },
        alert_link_copied_body: { en: "The scenario link has been copied to your clipboard.", it: "Il link dello scenario è stato copiato nei tuoi appunti." },
        alert_scenario_loaded: { en: "Scenario loaded from link. Simulation paused.", it: "Scenario caricato dal link. Simulazione in pausa." },
        disclaimer_title: { en: "Important Disclaimer", it: "Disclaimer Importante" },
        disclaimer_p1_strong: { en: "This tool is an educational simulator.", it: "Questo strumento è un simulatore educativo." },
        disclaimer_p1_strong2: { en: "IT IS NOT A MEDICAL DEVICE.", it: "NON È UNO STRUMENTO MEDICO." },
        disclaimer_p2: { en: "The predictions are based on a simplified model and should not be used for real medical decisions, which must only be made in consultation with a qualified physician.", it: "Le previsioni sono basate su un modello semplificato e non devono essere usate per decisioni mediche reali, che devono essere prese solo consultando un medico qualificato." },
        disclaimer_accept: { en: "I Accept and Continue", it: "Accetto e continuo" },
        settings_title: { en: "System Settings", it: "Impostazioni di Sistema" },
        settings_language: { en: "Default Language", it: "Lingua Predefinita" },
        settings_theme: { en: "Default Theme", it: "Tema Predefinito" },
        settings_network: { en: "Default Network", it: "Rete Predefinita" },
        settings_cancel: { en: "Cancel", it: "Annulla" },
        settings_save: { en: "Save and Reload", it: "Salva e Ricarica" },
        
        // --- AI Assistant Texts ---
        ai_modal_title_sim: { en: "AI Assistant (Simulation)", it: "Assistente IA (Simulazione)" },
        ai_modal_title_real: { en: "AI Assistant (Enabled)", it: "Assistente IA (Abilitato)" },
        ai_modal_subtitle: { en: "Select a task for the assistant to perform.", it: "Seleziona un'attività che l'assistente deve eseguire." },
        ai_modal_analyze: { en: "Analyze Treatment Strategy", it: "Analizza Strategia Terapeutica" },
        ai_modal_summarize: { en: "Summarize Current Patient", it: "Riassumi Paziente Attuale" },
        ai_modal_create: { en: "Create New Patient Case", it: "Crea Nuovo Caso Paziente" },
        ai_alert_title_sim: { en: "AI Simulation Complete", it: "Simulazione IA Completata" },
        ai_alert_title_real: { en: "AI Analysis Result", it: "Risultato Analisi IA" },
        
        ai_analyze_intro: { en: "Starting analysis for the current patient profile. The goal is to identify the optimal therapeutic strategy by balancing long-term survival with quality of life. Evaluating options...", it: "Avvio dell'analisi per il profilo paziente attuale. L'obiettivo è identificare la strategia terapeutica ottimale bilanciando la sopravvivenza a lungo termine con la qualità della vita. Valutazione delle opzioni in corso..." },
        ai_analyze_comparison: { en: "<b>Comparison of Strategies:</b><ul><li><b>Initial State:</b> Survival {initial_survival}%, QoL {initial_qol}%.</li><li><b>Strategy '{alt_name}':</b> Survival {alt_survival}%, QoL {alt_qol}%.</li></ul>", it: "<b>Confronto tra Strategie:</b><ul><li><b>Stato Iniziale:</b> Sopravvivenza {initial_survival}%, QoL {initial_qol}%.</li><li><b>Strategia '{alt_name}':</b> Sopravvivenza {alt_survival}%, QoL {alt_qol}%.</li></ul>" },
        ai_analyze_conclusion: { en: "The selected strategy offers the best-balanced outcome. While other options might slightly increase one metric, this choice provides a superior overall prognosis without excessively compromising the patient's quality of life.", it: "La strategia selezionata offre il risultato meglio bilanciato. Sebbene altre opzioni possano aumentare leggermente un parametro, questa scelta fornisce una prognosi complessiva superiore senza compromettere eccessivamente la qualità della vita del paziente." },
        ai_summary_intro: { en: "This is a clinical summary of the current patient profile:", it: "Questo è un riassunto clinico del profilo del paziente attuale:" },
        ai_summary_risk_factors: { en: "<b>Primary Risk Factors Identified:</b> {factors}.", it: "<b>Fattori di Rischio Primari Identificati:</b> {factors}." },
        ai_summary_no_risks: { en: "No significant risk factors identified; prognosis appears favorable.", it: "Nessun fattore di rischio significativo identificato; la prognosi appare favorevole." },
        ai_summary_protective_factors: { en: "<b>Key Protective Factors:</b> {factors}.", it: "<b>Fattori Protettivi Chiave:</b> {factors}." },
        risk_factor_age: { en: "advanced age", it: "età avanzata" },
        risk_factor_grade: { en: "high-grade tumor", it: "tumore di alto grado" },
        risk_factor_stage: { en: "advanced T stage", it: "stadio T elevato" },
        risk_factor_smoking: { en: "heavy smoking habit", it: "forte abitudine al fumo" },
        protective_factor_adjuvant: { en: "adjuvant therapy", it: "terapia adiuvante in corso" },
        protective_factor_experience: { en: "high surgical experience", it: "alta esperienza chirurgica" },
        ai_create_intro: { en: "To test the model's predictive capabilities, a new challenging scenario has been generated.", it: "Per testare le capacità predittive del modello, è stato generato un nuovo scenario complesso." },
        ai_create_description: { en: "This case represents a common but difficult clinical dilemma: a patient with a highly aggressive, non-invasive tumor (T1HG). The chosen treatment (re-TURBT + BCG) is aggressive but aims to preserve the bladder. This scenario is designed to explore the fine balance between controlling a high-risk tumor and avoiding radical surgery.", it: "Questo caso rappresenta un dilemma clinico comune ma difficile: un paziente con un tumore non-invasivo ma molto aggressivo (T1HG). Il trattamento scelto (re-TURBT + BCG) è aggressivo ma mira a preservare la vescica. Questo scenario è progettato per esplorare il sottile equilibrio tra il controllo di un tumore ad alto rischio ed evitare la chirurgia radicale." },
        ai_alert_optimal_found: { en: "Optimal Strategy Found:", it: "Strategia Ottimale Trovata:" },
        ai_alert_strategy: { en: "Strategy:", it: "Strategia:" },
        ai_alert_prognosis: { en: "Estimated Prognosis:", it: "Prognosi Stimata:" },
        ai_alert_survival: { en: "Survival", it: "Sopravvivenza" },
        ai_alert_qol: { en: "Quality of Life", it: "Qualità della Vita" },
        ai_alert_comment: { en: "AI Comment:", it: "Commento dell'IA:" },
        ai_strategy_turbt_bcg: { en: "Conservative (TURBT + Second Look + BCG)", it: "Conservativa (TURBT + Second Look + BCG)" },
        ai_strategy_cystectomy_only: { en: "Radical (Cystectomy)", it: "Radicale (Cistectomia)" },
        ai_strategy_turbt_only: { en: "Conservative (TURBT only)", it: "Conservativa (solo TURBT)" },
        ai_strategy_turbt_no_look: { en: "Conservative (TURBT + BCG, No Second Look)", it: "Conservativa (TURBT + BCG, No Second Look)" },
        ai_summary_title: { en: "AI Patient Summary", it: "Riepilogo Paziente IA" },
        ai_create_title: { en: "AI Case Generation", it: "Generazione Caso IA" },
        ai_show_data_json: { en: "Show data sent to AI (JSON)", it: "Visualizza dati inviati all'IA (JSON)" },
        
        // --- Units ---
        unit_years: { en: "years", it: "anni" },
    },

    validatorFunction: (networkState, T) => {
        const nodeMap = new Map(networkState.nodes.map(n => [n.id, n]));
        const isLowRisk = nodeMap.get('STADIO_T').value === 0 && nodeMap.get('GRADO_G').value === 0 && nodeMap.get('TUMOR_CHARS').value === 0;
        const isT1HighRisk = nodeMap.get('STADIO_T').value === 1 && nodeMap.get('GRADO_G').value === 1;
        const hasAdjuvantTx = nodeMap.get('ADJUVANT_TX').value === 1;
        const isCystectomy = nodeMap.get('TREATMENT_TYPE').value === 1;
        
        let messageKey = "validator_ok", isWarning = false;
        if (isCystectomy && isLowRisk) { messageKey = "validator_cystectomy_low_risk"; isWarning = true; } 
        else if (isLowRisk && hasAdjuvantTx) { messageKey = "validator_adjuvant_low_risk"; isWarning = true; } 
        else if (isT1HighRisk && !hasAdjuvantTx && !isCystectomy) { messageKey = "validator_t1hg_no_adjuvant"; isWarning = true; } 
        else if (isCystectomy && hasAdjuvantTx) { messageKey = "validator_cystectomy_adjuvant"; isWarning = true; }
        return { messageKey, isWarning };
    },

    network: {
        appName: "BAYNET",
        columns: [
            { id: 'patient', title: { en: "Patient Factors", it: "Fattori Paziente" }, x_rel: 0, width_rel: 0.2, color: "var(--bg-patient)" },
            { id: 'tumor', title: { en: "Pathological Factors", it: "Fattori Patologici" }, x_rel: 0.2, width_rel: 0.2, color: "var(--bg-tumor)" },
            { id: 'surgery', title: { en: "Surgery & Therapy", it: "Chirurgia & Terapia" }, x_rel: 0.4, width_rel: 0.2, color: "var(--bg-surgery)" },
            { id: 'clinical', title: { en: "Clinical Outcomes", it: "Esiti Clinici" }, x_rel: 0.6, width_rel: 0.2, color: "var(--bg-clinical)" },
            { id: 'patient-outcome', title: { en: "Patient Outcomes", it: "Esiti Paziente" }, x_rel: 0.8, width_rel: 0.2, color: "var(--bg-patient-outcome)" }
        ],
        nodes: [
            { id: 'PRIOR_RECID', name: {en: 'Previous Recurrences', it: 'Recidive Precedenti'}, value: 0.1, probability: 0.1, x_rel: 0.1, y_rel: 0.1, type: 'root', group: 'patient', variable_type: 'probability', tooltip: {en: "Indicates if the patient has had prior recurrences. <strong>Meaning:</strong> It's one of the strongest negative predictors. A high probability suggests a biologically unstable tumor, with a much higher risk of future <strong>recurrences</strong> and <strong>progression</strong>.", it: "Indica se il paziente ha già avuto recidive in passato. <strong>Significato:</strong> È uno dei più forti predittori negativi. Un'alta probabilità indica un tumore biologicamente instabile, con un rischio molto maggiore di future <strong>recidive</strong> e di <strong>progressione</strong>."}, slider_tooltip: {en: "Set the probability that the patient has a history of tumor recurrences.", it: "Imposta la probabilità che il paziente abbia una storia di recidive tumorali."} },
            { id: 'FUMO', name: {en: 'Smoking', it: 'Fumo'}, value: 0.5, probability: 0.5, x_rel: 0.1, y_rel: 0.3, type: 'root', group: 'patient', variable_type: 'probability', tooltip: {en: "Patient's smoking habit. <strong>Meaning:</strong> Smoking is a primary cause of bladder cancer. A high value represents a heavy smoker, increasing the risk of post-operative <strong>complications</strong> and <strong>recurrence</strong>.", it: "Abitudine al fumo del paziente. <strong>Significato:</strong> Il fumo è una delle cause primarie del cancro alla vescica. Un valore alto rappresenta un forte fumatore, aumentando il rischio di <strong>complicazioni</strong> post-operatorie e di <strong>recidiva</strong>."}, slider_tooltip: {en: "Define the patient's smoking habit level (from 0% non-smoker to 100% heavy smoker).", it: "Definisci il livello di abitudine al fumo del paziente (da 0% non fumatore a 100% forte fumatore)."} },
            { id: 'ALCOL', name: {en: 'Alcohol', it: 'Alcol'}, value: 0.3, probability: 0.3, x_rel: 0.1, y_rel: 0.5, type: 'root', group: 'patient', variable_type: 'probability', tooltip: {en: "Indicates chronic and/or excessive alcohol consumption. <strong>Meaning:</strong> It negatively impacts general health. A high value increases the risk of <strong>complications</strong> during and after surgery.", it: "Indica un consumo cronico e/o eccessivo di alcol. <strong>Significato:</strong> Impatta negativamente la salute generale. Un valore alto aumenta il rischio di <strong>complicazioni</strong> durante e dopo l'intervento chirurgico."}, slider_tooltip: {en: "Set the level of alcohol consumption (from 0% none to 100% high).", it: "Imposta il livello di consumo di alcol (da 0% nullo a 100% elevato)."} },
            { id: 'COMORBIDITIES', name: {en: 'Comorbidities', it: 'Comorbidità'}, value: 1, probability: 0.3, x_rel: 0.1, y_rel: 0.7, type: 'root', group: 'patient', variable_type: 'categorical', categories: [{l:{en:"None", it:"Nessuna"}, v:0.1}, {l:{en:"Mild", it:"Lieve"}, v:0.3}, {l:{en:"Severe", it:"Severa"}, v:0.8}], tooltip: {en: "Presence of other significant diseases (e.g., diabetes, heart problems). <strong>Meaning:</strong> A patient with severe comorbidities has a much higher risk of <strong>complications</strong> and reduced long-term <strong>survival</strong>.", it: "Presenza di altre malattie importanti (es. diabete, problemi cardiaci). <strong>Significato:</strong> Un paziente con comorbidità severe ha un rischio molto più elevato di <strong>complicazioni</strong> e una <strong>sopravvivenza</strong> a lungo termine ridotta."}, slider_tooltip: {en: "Select the patient's comorbidity level, from none to severe conditions.", it: "Seleziona il livello di comorbidità del paziente, dalla totale assenza a condizioni severe."} },
            { id: 'ETA_PAZIENTE', name: {en: 'Patient Age', it: 'Età Paziente'}, value: 65, probability: 0.4, x_rel: 0.1, y_rel: 0.9, type: 'root', group: 'patient', variable_type: 'continuous', min: 40, max: 90, tooltip: {en: "Patient's age at diagnosis. <strong>Meaning:</strong> Advanced age is an independent risk factor, increasing the risk of <strong>complications</strong> and reducing overall <strong>survival</strong>.", it: "Età del paziente alla diagnosi. <strong>Significato:</strong> L'età avanzata è un fattore di rischio indipendente, aumentando il rischio di <strong>complicazioni</strong> e riducendo la <strong>sopravvivenza</strong> generale."}, slider_tooltip: {en: "Set the patient's age at diagnosis.", it: "Imposta l'età del paziente alla diagnosi."} },
            { id: 'STADIO_T', name: {en: 'T Stage', it: 'Stadio T'}, value: 1, probability: 0.25, x_rel: 0.3, y_rel: 0.15, type: 'root', group: 'tumor', variable_type: 'categorical', categories: [{l:{en:"Ta", it:"Ta"}, v:0.1}, {l:{en:"T1", it:"T1"}, v:0.25}, {l:{en:"T2+", it:"T2+"}, v:0.8}], tooltip: {en: "Indicates how deeply the tumor has grown into the bladder wall. <strong>Meaning:</strong> It is the most important prognostic factor. <strong>Ta/T1:</strong> Non-muscle-invasive tumor. <strong>T2+:</strong> Muscle-invasive tumor, with a drastically higher risk of <strong>progression</strong>.", it: "Indica quanto in profondità il tumore è cresciuto nella parete della vescica. <strong>Significato:</strong> È il fattore prognostico più importante. <strong>Ta/T1:</strong> Tumore non-muscolo-invasivo. <strong>T2+:</strong> Tumore muscolo-invasivo, con un rischio drasticamente più alto di <strong>progressione</strong>."}, slider_tooltip: {en: "Set the tumor stage, from non-invasive (Ta) to muscle-invasive (T2+).", it: "Imposta lo stadio del tumore, da non-invasivo (Ta) a muscolo-invasivo (T2+)."} },
            { id: 'TUMOR_CHARS', name: {en: 'Size/Mult.', it: 'Dimens./Mult.'}, value: 1, probability: 0.5, x_rel: 0.3 + 0.035, y_rel: 0.30, type: 'root', group: 'tumor', variable_type: 'categorical', categories: [{l:{en:"Single <3cm", it:"Singolo <3cm"}, v:0.1}, {l:{en:"Single >3cm", it:"Singolo >3cm"}, v:0.5}, {l:{en:"Multiple", it:"Multiplo"}, v:0.9}], tooltip: {en: "Tumor characteristics. <strong>Meaning:</strong> Multiple or large (>3cm) tumors are harder to remove completely (<strong>positive margins</strong>) and have a higher probability of <strong>recurrence</strong>.", it: "Caratteristiche del tumore. <strong>Significato:</strong> Tumori multipli o di grandi dimensioni (>3cm) sono più difficili da rimuovere completamente (<strong>margini positivi</strong>) e hanno una probabilità più alta di <strong>recidiva</strong>."}, slider_tooltip: {en: "Define the size and multiplicity of the tumor.", it: "Definisci la dimensione e la molteplicità del tumore."} },
            { id: 'GRADO_G', name: {en: 'G Grade', it: 'Grado G'}, value: 0, probability: 0.3, x_rel: 0.3 - 0.035, y_rel: 0.45, type: 'root', group: 'tumor', variable_type: 'categorical', categories: [{l:{en:"Low", it:"Basso"}, v:0.3}, {l:{en:"High", it:"Alto"}, v:0.8}], tooltip: {en: "Appearance of the tumor cells. <strong>Meaning:</strong> It indicates biological aggressiveness. a <strong>High Grade</strong> tumor has a much higher probability of <strong>recurring</strong> and, especially, of <strong>progressing</strong>.", it: "Aspetto delle cellule tumorali. <strong>Significato:</strong> Indica l'aggressività biologica. Un tumore di <strong>Alto Grado</strong> ha una probabilità molto maggiore di <strong>recidivare</strong> e, soprattutto, di <strong>progredire</strong>."}, slider_tooltip: {en: "Set the tumor's cellular aggressiveness grade (Low or High).", it: "Imposta il grado di aggressività cellulare del tumore (Basso o Alto)."} },
            { id: 'CIS_LVI', name: {en: 'CIS/LVI', it: 'CIS/LVI'}, value: 0.3, probability: 0.3, x_rel: 0.3 + 0.035, y_rel: 0.60, type: 'root', group: 'tumor', variable_type: 'probability', tooltip: {en: "Presence of Carcinoma in Situ (CIS) or Lymphovascular Invasion (LVI). <strong>Meaning:</strong> These are two indicators of high aggressiveness. They significantly increase the risk of <strong>recurrence</strong> and <strong>progression</strong>.", it: "Presenza di Carcinoma in Situ (CIS) o Invasione Linfovascolare (LVI). <strong>Significato:</strong> Sono due indicatori di alta aggressività. Aumentano in modo molto significativo il rischio di <strong>recidiva</strong> e <strong>progressione</strong>."}, slider_tooltip: {en: "Set the probability of the presence of Carcinoma in Situ or Lymphovascular Invasion.", it: "Imposta la probabilità della presenza di Carcinoma in Situ o Invasione Linfovascolare."} },
            { id: 'HISTOLOGY', name: {en: 'Histology', it: 'Istologia'}, value: 0, probability: 0.1, x_rel: 0.3 - 0.035, y_rel: 0.75, type: 'root', group: 'tumor', variable_type: 'categorical', categories: [{l:{en:"Urothelial", it:"Uroteliale"}, v:0.1}, {l:{en:"Aggressive Var.", it:"Variante Aggress."}, v:0.9}], tooltip: {en: "Specific type of tumor cell. <strong>Meaning:</strong> 'Aggressive Variants' (e.g., micropapillary) have an intrinsically worse biology, which increases the risk of <strong>progression</strong> and reduces <strong>survival</strong>.", it: "Tipo specifico di cellula tumorale. <strong>Significato:</strong> Le 'Varianti Aggressive' (es. micropapillare) hanno una biologia intrinsecamente peggiore, che aumenta il rischio di <strong>progressione</strong> e riduce la <strong>sopravvivenza</strong>."}, slider_tooltip: {en: "Select the histological type of the tumor (standard Urothelial or an Aggressive Variant).", it: "Seleziona il tipo istologico del tumore (Uroteliale standard o una Variante Aggressiva)."} },
            { id: 'N_STATUS', name: {en: 'Lymph Nodes (N)', it: 'Linfonodi (N)'}, probability: 0.05, x_rel: 0.3, y_rel: 0.90, type: 'intermediate', group: 'tumor', base: 0.0, isLocked: 0, tooltip: {en: "Lymph node involvement (N+). Its probability increases with the T Stage.", it: "Coinvolgimento dei linfonodi (N+). La sua probabilità aumenta con lo Stadio T."} },
            { id: 'EXP_CHIR', name: {en: 'Surgeon Experience', it: 'Esperienza Chirurgo'}, value: 0.7, probability: 0.7, x_rel: 0.5, y_rel: 0.20, type: 'root', group: 'surgery', variable_type: 'probability', tooltip: {en: "Experience level of the surgeon/center. <strong>Meaning:</strong> High experience is a protective factor. It reduces the probability of <strong>complications</strong> and leaving residual tumor (<strong>positive margins</strong>).", it: "Livello di esperienza del chirurgo/centro. <strong>Significato:</strong> Un'alta esperienza è un fattore protettivo. Riduce la probabilità di <strong>complicazioni</strong> e di lasciare tumore residuo (<strong>margini positivi</strong>)."}, slider_tooltip: {en: "Define the experience level of the surgical team (from 0% low to 100% high).", it: "Definisci il livello di esperienza del team chirurgico (da 0% bassa a 100% alta)."} },
            { id: 'TREATMENT_TYPE', name: {en: 'Treatment Type', it: 'Tipo Trattamento'}, value: 0, probability: 0.0, x_rel: 0.5, y_rel: 0.43, type: 'root', group: 'surgery', variable_type: 'categorical', categories: [{l:{en:"TURBT", it:"TURBT"}, v:0.0}, {l:{en:"Cystectomy", it:"Cistectomia"}, v:1.0}], tooltip: {en: "Choice of surgical approach. <strong>Meaning:</strong> <strong>Radical Cystectomy</strong> is a major surgery with more <strong>complications</strong> and impact on <strong>QoL</strong>, but it nearly eliminates the risk of local recurrence/progression.", it: "Scelta dell'approccio chirurgico. <strong>Significato:</strong> La <strong>Cistectomia Radicale</strong> è un intervento maggiore con più <strong>complicazioni</strong> e impatto sulla <strong>QoL</strong>, ma quasi azzera il rischio di recidiva/progressione locale."}, slider_tooltip: {en: "Choose the type of surgery: conservative (TURBT) or radical (Cystectomy).", it: "Scegli il tipo di intervento chirurgico: conservativo (TURBT) o radicale (Cistectomia)."} },
            { id: 'SECOND_LOOK', name: {en: 'Second Look', it: 'Second Look'}, value: 0, probability: 0.0, x_rel: 0.5, y_rel: 0.66, type: 'root', group: 'surgery', variable_type: 'categorical', categories: [{l:{en:"No", it:"No"}, v:0.0}, {l:{en:"Yes", it:"Sì"}, v:1.0}], tooltip: {en: "Indicates if a second resection (re-TURBT) is performed. <strong>Meaning:</strong> It's a standard procedure for T1/high-grade tumors to remove residual tumor, reducing the risk of <strong>positive margins</strong>.", it: "Indica se viene eseguita una seconda resezione (re-TURBT). <strong>Significato:</strong> È una procedura standard per tumori T1/alto grado per rimuovere tumore residuo, riducendo il rischio di <strong>margini positivi</strong>."}, slider_tooltip: {en: "Indicate if a second control resection (re-TURBT) was performed.", it: "Indica se è stata eseguita una seconda resezione di controllo (re-TURBT)."} },
            { id: 'ADJUVANT_TX', name: {en: 'Adjuvant Therapy', it: 'Terapia Adiuvante'}, value: 0, probability: 0.0, x_rel: 0.5, y_rel: 0.89, type: 'root', group: 'surgery', variable_type: 'categorical', categories: [{l:{en:"None", it:"Nessuna"}, v:0.0}, {l:{en:"BCG/Chemo", it:"BCG/Chemo"}, v:1.0}], tooltip: {en: "Intravesical therapy (e.g., BCG) performed after TURBT. <strong>Meaning:</strong> It is a very powerful tool that significantly reduces the risk of <strong>recurrence</strong> and <strong>progression</strong>.", it: "Terapia intravesicale (es. BCG) eseguita dopo la TURBT. <strong>Significato:</strong> È uno strumento potentissimo che riduce significativamente il rischio di <strong>recidiva</strong> e <strong>progressione</strong>."}, slider_tooltip: {en: "Specify if intravesical adjuvant therapy (e.g., BCG) was administered.", it: "Specifica se è stata somministrata una terapia adiuvante intravescicole (es. BCG)."} },
            { id: 'RESEZ', name: {en: 'Positive Margins', it: 'Margini Positivi'}, probability: 0.2, x_rel: 0.7, y_rel: 0.1, type: 'intermediate', group: 'clinical', base: 0.05, isLocked: 0, tooltip: {en: "Probability of residual tumor after resection.", it: "Probabilità di tumore residuo dopo la resezione."} },
            { id: 'COMPLIC', name: {en: 'Complications', it: 'Complicazioni'}, probability: 0.2, x_rel: 0.7 + 0.035, y_rel: 0.3, type: 'intermediate', group: 'clinical', base: 0.05, isLocked: 0, tooltip: {en: "Probability of post-operative complications.", it: "Probabilità di complicazioni post-operatorie."} },
            { id: 'RECID', name: {en: 'Recurrence', it: 'Recidiva'}, probability: 0.3, x_rel: 0.7, y_rel: 0.5, type: 'intermediate', group: 'clinical', base: 0.05, isLocked: 0, tooltip: {en: "Probability that the tumor returns (without worsening stage/grade).", it: "Probabilità che il tumore ritorni (senza peggiorare stadio/grado)."} },
            { id: 'PROGRESSION', name: {en: 'Progression', it: 'Progressione'}, probability: 0.1, x_rel: 0.7, y_rel: 0.7, type: 'intermediate', group: 'clinical', base: 0.02, isLocked: 0, tooltip: {en: "Probability that the disease worsens to a higher stage or grade. A very negative outcome.", it: "Probabilità che la malattia peggiori a uno stadio o grado superiore. Un esito molto negativo."} },
            { id: 'M_STATUS', name: {en: 'Metastases (M)', it: 'Metastasi (M)'}, probability: 0.02, x_rel: 0.7, y_rel: 0.9, type: 'intermediate', group: 'clinical', base: 0.0, isLocked: 0, tooltip: {en: "Distant metastases (M+). Its probability increases with T Stage and progression.", it: "Metastasi a distanza (M+). La sua probabilità aumenta con lo Stadio T e la progressione."} },
            { id: 'QOL', name: {en: 'Quality of Life', it: 'Qualità della Vita'}, probability: 0.7, x_rel: 0.9, y_rel: 0.3, type: 'outcome', group: 'patient-outcome', base: 0.9, isLocked: 0, tooltip: {en: "Patient's perceived Quality of Life (QoL). <strong>100%:</strong> Full function, no limitations. <strong>~75%:</strong> Mild, manageable impact. <strong>~50%:</strong> Significant impact limiting daily life (e.g., stoma management, chronic anxiety). <strong>&lt;25%:</strong> Severely compromised quality of life.", it: "Qualità della Vita (QoL) percepita dal paziente. <strong>100%:</strong> Piena funzionalità, nessuna limitazione. <strong>~75%:</strong> Impatto lieve, gestibile. <strong>~50%:</strong> Impatto significativo che limita la vita quotidiana (es. gestione stomia, ansia cronica). <strong>&lt;25%:</strong> Qualità della vita gravemente compromessa."} },
            { id: 'SURVIVAL', name: {en: '5-Year Survival', it: 'Sopravvivenza a 5 Anni'}, probability: 0.8, x_rel: 0.9, y_rel: 0.7, type: 'outcome', group: 'patient-outcome', base: 0.95, isLocked: 0, tooltip: {en: "Statistical probability of being alive 5 years after diagnosis. <strong>100%:</strong> Excellent prognosis. <strong>70-90%:</strong> Good prognosis (low-risk disease). <strong>&lt;50%:</strong> Severe prognosis (advanced disease or severe comorbidities).", it: "Probabilità statistica di essere vivi a 5 anni dalla diagnosi. <strong>100%:</strong> Prognosi eccellente. <strong>70-90%:</strong> Prognosi buona (malattia a basso rischio). <strong>&lt;50%:</strong> Prognosi severa (malattia avanzata o comorbidità gravi)."} }
        ],
        arcs: [
            { source: 'PRIOR_RECID', target: 'RECID', weight: 0.4, tooltip: { en: "A history of recurrences is a strong predictor of new recurrences.", it: "Una storia di recidive è un forte predittore di nuove recidive." } },
            { source: 'PRIOR_RECID', target: 'PROGRESSION', weight: 0.2, tooltip: { en: "A history of recurrences also increases the risk of progression.", it: "Una storia di recidive aumenta anche il rischio di progressione." } },
            { source: 'FUMO', target: 'COMPLIC', weight: 0.1, tooltip: { en: "Smoking increases the risk of systemic complications.", it: "Il fumo aumenta il rischio di complicazioni sistemiche." } },
            { source: 'FUMO', target: 'RECID', weight: 0.2, tooltip: { en: "Smoking increases the biological risk of recurrence.", it: "Il fumo aumenta il rischio biologico di recidiva." } },
            { source: 'ALCOL', target: 'COMPLIC', weight: 0.2, tooltip: { en: "Alcohol abuse increases the risk of complications.", it: "L'abuso di alcol aumenta il rischio di complicanze." } },
            { source: 'COMORBIDITIES', target: 'COMPLIC', weight: 0.6, tooltip: { en: "Comorbidities significantly increase the risk of complications.", it: "Le comorbidità aumentano significativamente il rischio di complicazioni." } },
            { source: 'COMORBIDITIES', target: 'SURVIVAL', weight: -0.3, tooltip: { en: "Comorbidities reduce overall life expectancy.", it: "Le comorbidità riducono l'aspettativa di vita generale." } },
            { source: 'ETA_PAZIENTE', target: 'COMPLIC', weight: 0.4, tooltip: { en: "Older/frail patients have more complications.", it: "Pazienti più anziani/fragili hanno più complicazioni." } },
            { source: 'ETA_PAZIENTE', target: 'SURVIVAL', weight: -0.2, tooltip: { en: "Advanced age reduces overall life expectancy.", it: "L'età avanzata riduce l'aspettativa di vita generale." } },
            { source: 'STADIO_T', target: 'RESEZ', weight: 0.5, tooltip: { en: "Deeper tumors are harder to resect completely.", it: "Tumori più profondi sono più difficili da resecare completamente." } },
            { source: 'STADIO_T', target: 'PROGRESSION', weight: 0.6, tooltip: { en: "An advanced T stage is the main risk factor for progression.", it: "Uno stadio T avanzato è il principale fattore di rischio per la progressione." } },
            { source: 'STADIO_T', target: 'N_STATUS', weight: 0.8, tooltip: { en: "A high T Stage drastically increases the risk of lymph node involvement.", it: "Un alto Stadio T aumenta drasticamente il rischio di coinvolgimento linfonodale." } },
            { source: 'TUMOR_CHARS', target: 'RECID', weight: 0.5, tooltip: { en: "Large or multiple tumors have a high probability of recurrence.", it: "Tumori grandi o multipli hanno un'alta probabilità di recidiva." } },
            { source: 'TUMOR_CHARS', target: 'RESEZ', weight: 0.2, tooltip: { en: "Large or multiple tumors are harder to resect with clean margins.", it: "Tumori grandi o multipli sono più difficili da resecare con margini puliti." } },
            { source: 'GRADO_G', target: 'RECID', weight: 0.3, tooltip: { en: "High-grade tumors tend to recur.", it: "Tumori di alto grado tendono a recidivare." } },
            { source: 'GRADO_G', target: 'PROGRESSION', weight: 0.4, tooltip: { en: "High grade is a strong predictor of progression to higher stages.", it: "L'alto grado è un forte predittore di progressione a stadi superiori." } },
            { source: 'CIS_LVI', target: 'RECID', weight: 0.4, tooltip: { en: "CIS/LVI are strong predictors of recurrence.", it: "CIS/LVI sono forti predittori di recidiva." } },
            { source: 'CIS_LVI', target: 'PROGRESSION', weight: 0.5, tooltip: { en: "CIS/LVI are very strong indicators of progression risk.", it: "CIS/LVI sono fortissimi indicatori di rischio di progressione." } },
            { source: 'HISTOLOGY', target: 'RECID', weight: 0.2, tooltip: { en: "Aggressive variants increase the risk of recurrence.", it: "Le varianti aggressive aumentano il rischio di recidiva." } },
            { source: 'HISTOLOGY', target: 'PROGRESSION', weight: 0.3, tooltip: { en: "Aggressive variants have a high probability of progressing.", it: "Le varianti aggressive hanno un'alta probabilità di progredire." } },
            { source: 'N_STATUS', target: 'SURVIVAL', weight: -0.6, tooltip: { en: "Positive lymph nodes drastically worsen the prognosis.", it: "I linfonodi positivi peggiorano drasticamente la prognosi." } },
            { source: 'EXP_CHIR', target: 'RESEZ', weight: -0.5, tooltip: { en: "An experienced surgeon reduces the risk of positive margins.", it: "Un chirurgo esperto riduce il rischio di margini positivi." } },
            { source: 'EXP_CHIR', target: 'COMPLIC', weight: -0.3, tooltip: { en: "An experienced surgeon reduces the risk of complications.", it: "Un chirurgo esperto riduce il rischio di complicazioni." } },
            { source: 'TREATMENT_TYPE', target: 'COMPLIC', weight: 0.4, tooltip: { en: "A radical cystectomy is a major surgery with higher risks of complications.", it: "Una cistectomia radicale è un intervento maggiore con più rischi di complicanze." } },
            { source: 'TREATMENT_TYPE', target: 'RESEZ', weight: -0.9, tooltip: { en: "A radical cystectomy nearly eliminates the risk of positive margins.", it: "Una cistectomia radicale quasi annulla il rischio di margini positivi." } },
            { source: 'TREATMENT_TYPE', target: 'QOL', weight: -0.6, tooltip: { en: "Radical cystectomy has a significant and permanent impact on quality of life.", it: "La cistectomia radicale ha un impatto significativo e permanente sulla qualità della vita." } },
            { source: 'SECOND_LOOK', target: 'RESEZ', weight: -0.5, tooltip: { en: "The second-look resection (re-TURBT) reduces residual tumor and improves staging.", it: "La resezione di revisione (re-TURBT) riduce il tumore residuo e migliora la stadiazione." } },
            { source: 'ADJUVANT_TX', target: 'RECID', weight: -0.7, tooltip: { en: "Adjuvant therapy (BCG) is very effective in preventing recurrences.", it: "La terapia adiuvante (BCG) è molto efficace nel prevenire le recidive." } },
            { source: 'ADJUVANT_TX', target: 'PROGRESSION', weight: -0.5, tooltip: { en: "Adjuvant therapy (BCG) reduces the risk of progression.", it: "La terapia adiuvante (BCG) riduce il rischio di progressione." } },
            { source: 'RESEZ', target: 'RECID', weight: 0.5, tooltip: { en: "Positive margins are a strong cause of recurrence.", it: "I margini positivi sono una causa forte di recidiva." } },
            { source: 'RECID', target: 'QOL', weight: -0.3, tooltip: { en: "Recurrence causes anxiety and requires further treatments, reducing quality of life.", it: "La recidiva genera ansia e richiede ulteriori trattamenti, riducendo la qualità della vita." } },
            { source: 'PROGRESSION', target: 'SURVIVAL', weight: -0.8, tooltip: { en: "Progression to muscle-invasive disease critically impacts survival.", it: "La progressione a malattia muscolo-invasiva impatta criticamente sulla sopravvivenza." } },
            { source: 'PROGRESSION', target: 'QOL', weight: -0.6, tooltip: { en: "Progression requires more aggressive treatments with a strong impact on quality of life.", it: "La progressione richiede trattamenti più aggressivi con un forte impatto sulla qualità della vita." } },
            { source: 'PROGRESSION', target: 'M_STATUS', weight: 0.7, tooltip: { en: "Local progression increases the risk of developing distant metastases.", it: "La progressione locale aumenta il rischio di sviluppare metastasi a distanza." } },
            { source: 'COMPLIC', target: 'QOL', weight: -0.7, tooltip: { en: "Post-operative complications worsen the quality of life.", it: "Le complicazioni post-operatorie peggiorano la qualità della vita." } },
            { source: 'M_STATUS', target: 'SURVIVAL', weight: -0.9, tooltip: { en: "Distant metastases critically impact survival.", it: "Le metastasi a distanza impattano in modo critico la sopravvivenza." } }
        ],
        special_rules: [
             { 
                condition: (nodeMap) => nodeMap.get('TREATMENT_TYPE').probability > 0.5,
                action: (nodeMap) => {
                    const recid = nodeMap.get('RECID');
                    const progression = nodeMap.get('PROGRESSION');
                    if(recid) recid.probability = 0.01;
                    if(progression) progression.probability = 0.01;
                },
                description: "Radical Cystectomy nearly eliminates local recurrence/progression risk."
            },
            {
                condition: (nodeMap) => true,
                action: (nodeMap, engine) => {
                    const recidNode = nodeMap.get('RECID');
                    if (!recidNode) return;
                    
                    const gradoG = nodeMap.get('GRADO_G').probability;
                    const cisLvi = nodeMap.get('CIS_LVI').probability;
                    const interactionInfluence = (gradoG * cisLvi * 0.3);

                    if (recidNode.base > 0.5) {
                        recidNode.probability *= (1 + interactionInfluence);
                    } else {
                        recidNode.probability += (1 - recidNode.base) * interactionInfluence;
                    }
                    recidNode.probability = Math.max(0, Math.min(1, recidNode.probability));
                },
                description: "Adds a synergistic interaction effect between Grade and CIS/LVI on Recurrence."
            }
        ]
    },
    scenarios: {
        'lr-typical': {"PRIOR_RECID":0.01,"FUMO":0.1,"ALCOL":0.1,"COMORBIDITIES":0,"ETA_PAZIENTE":55,"STADIO_T":0,"TUMOR_CHARS":0,"GRADO_G":0,"CIS_LVI":0.01,"HISTOLOGY":0,"EXP_CHIR":0.9,"TREATMENT_TYPE":0,"SECOND_LOOK":0,"ADJUVANT_TX":0},
        'lr-elderly': {"PRIOR_RECID":0.05,"FUMO":0.1,"ALCOL":0.1,"COMORBIDITIES":1,"ETA_PAZIENTE":80,"STADIO_T":0,"TUMOR_CHARS":0,"GRADO_G":0,"CIS_LVI":0.01,"HISTOLOGY":0,"EXP_CHIR":0.8,"TREATMENT_TYPE":0,"SECOND_LOOK":0,"ADJUVANT_TX":0},
        'hr-advanced': {"PRIOR_RECID":0.4,"FUMO":0.8,"ALCOL":0.2,"COMORBIDITIES":1,"ETA_PAZIENTE":72,"STADIO_T":2,"TUMOR_CHARS":1,"GRADO_G":1,"CIS_LVI":0.5,"HISTOLOGY":0,"EXP_CHIR":0.7,"TREATMENT_TYPE":1,"SECOND_LOOK":0,"ADJUVANT_TX":0},
        'hr-aggressive': {"PRIOR_RECID":0.6,"FUMO":0.9,"ALCOL":0.5,"COMORBIDITIES":0,"ETA_PAZIENTE":65,"STADIO_T":1,"TUMOR_CHARS":2,"GRADO_G":1,"CIS_LVI":0.8,"HISTOLOGY":0,"EXP_CHIR":0.6,"TREATMENT_TYPE":0,"SECOND_LOOK":1,"ADJUVANT_TX":1}
    },

    guidedTour: [
        {
            title: { en: 'Welcome to BAYNET', it: 'Benvenuto in BAYNET' },
            content: { en: 'This guided presentation will showcase the key features of the simulator.', it: 'Questa presentazione guidata mostrerà le funzionalità chiave del simulatore.' },
            narration: { en: "Welcome to BAYNET. This guided presentation will showcase the key features of the simulator.", it: "Benvenuto in BAYNET. Questa presentazione guidata mostrerà le funzionalità chiave del simulatore." },
        },
        {
            title: { en: 'Understanding the Core Concept', it: 'Comprendere il Concetto Base' },
            content: { en: 'BAYNET is an interactive simulator for Bayesian Networks. This model, CistoNet, is for medical prognosis and features a demo of a future, on-device AI assistant.', it: 'BAYNET è un simulatore interattivo per Reti Bayesiane. Questo modello, CistoNet, è per la prognosi medica e include una demo di un futuro assistente IA on-device.' },
            narration: { en: "First, what are you looking at? BAYNET is an interactive simulator for Bayesian Networks. A Bayesian Network is a powerful way to represent cause-and-effect relationships. The model we are exploring today is called CistoNet, and it is applied to medical prognosis. It also features a demonstration of how a future, on-device AI can assist in decision-making.", it: "Per prima cosa, cosa stai guardando? BAYNET è un simulatore interattivo per Reti Bayesiane, un modo potente per rappresentare le relazioni di causa-effetto. Il modello che esploriamo oggi si chiama CistoNet, ed è applicato alla prognosi medica. Include anche una dimostrazione di come una futura IA, eseguita sul dispositivo, possa assistere nel processo decisionale." }
        },
        {
            targetElement: '#main-action-buttons',
            title: { en: 'Main Action Buttons', it: 'Pulsanti di Azione Principali' },
            content: { en: 'These are the main controls: start simulation, open the AI assistant, change theme, reset, and share your scenario.', it: "Questi sono i controlli principali: avvia la simulazione, apri l'assistente IA, cambia tema, resetta e condividi il tuo scenario." },
            narration: { en: "Here you find the main action buttons. You can start an automatic simulation, open the AI assistant, switch the visual theme, reset the scenario to its default state, and copy a link to share your current setup.", it: "Qui trovi i pulsanti di azione principali. Puoi avviare una simulazione automatica, aprire l'assistente IA, cambiare il tema visivo, resettare lo scenario allo stato predefinito e copiare un link per condividere la configurazione corrente." }
        },
        {
            targetElement: '#man-header-patient',
            title: { en: 'Patient Factors', it: 'Fattori del Paziente' },
            content: { en: 'The controls are grouped by category. Click here to open the Patient Factors panel.', it: 'I controlli sono raggruppati per categoria. Clicca qui per aprire il pannello dei Fattori del Paziente.' },
            narration: { en: "The controls are grouped by category. To modify a patient's characteristics, you first need to open the corresponding panel. Click now on 'Patient Factors' to expand it.", it: "I controlli sono raggruppati per categoria. Per modificare le caratteristiche di un paziente, devi prima aprire il pannello corrispondente. Clicca ora su 'Fattori Paziente' per espanderlo." },
            waitForAction: { type: 'click', propagate: true }
        },
        {
            targetElement: '#control-ETA_PAZIENTE',
            title: { en: 'Interactive Controls', it: 'Controlli Interattivi' },
            content: { en: 'Now that the panel is open, let\'s try changing the patient\'s age to 85.', it: 'Ora che il pannello è aperto, proviamo a cambiare l\'età del paziente a 85 anni.' },
            narration: { en: "Now that the panel is open, let's try a simple interaction. We will increase the Patient's Age to 85. Please move the slider.", it: "Ora che il pannello è aperto, proviamo una semplice interazione. Aumenteremo l'età del paziente a 85 anni. Per favore, sposta il cursore." },
            waitForAction: { type: 'setValue', target: '#input-ETA_PAZIENTE', value: '85' }
        },
        {
            targetElement: '#node-COMPLIC',
            title: { en: 'Observing the Impact', it: 'Osservare l\'Impatto' },
            content: { en: 'Notice how the "Complications" node grew instantly. This shows the direct probabilistic link between age and surgical risk.', it: 'Nota come il nodo "Complicazioni" è cresciuto istantaneamente. Questo mostra il legame probabilistico diretto tra età e rischio chirurgico.' },
            narration: { en: "Excellent. Notice how the 'Complications' node in the graph grew instantly. This visualizes the direct probabilistic link between advanced age and higher surgical risk. Every change you make updates the entire network in real time.", it: "Eccellente. Nota come il nodo 'Complicazioni' è cresciuto istantaneamente. Questo visualizza il legame probabilistico diretto tra età avanzata e un maggiore rischio chirurgico. Ogni modifica che fai aggiorna l'intera rete in tempo reale." }
        },
        {
            targetElement: '#node-QOL',
            title: { en: 'Hover for Info', it: 'Passa per le Info' },
            content: { en: 'Hover your mouse over a node like "Quality of Life" to see a detailed explanation of what it represents.', it: 'Passa il mouse su un nodo come "Qualità della Vita" per vedere una spiegazione dettagliata di cosa rappresenta.'},
            narration: { en: 'To understand what each node means, simply hover your mouse over it. Try it now on the Quality of Life node to see a detailed tooltip with its definition.', it: 'Per capire cosa significa ogni nodo, basta passarci sopra il mouse. Prova ora sul nodo Qualità della Vita per vedere un tooltip dettagliato con la sua definizione.'}
        },
        {
            targetElement: '#node-QOL',
            title: { en: 'Click to Focus', it: 'Clicca per Focalizzare' },
            content: { en: 'Now, click the same node. The controls on the right will automatically focus on its parameters for deeper analysis.', it: 'Ora, clicca sullo stesso nodo. I controlli sulla destra si focalizzeranno automaticamente sui suoi parametri per un\'analisi più approfondita.'},
            narration: { en: 'If you want to dive deeper into how a node is calculated, click on it. Clicking a node automatically scrolls the control panel to its relevant section. In Expert Mode, this would show its internal parameters.', it: 'Se vuoi approfondire come viene calcolato un nodo, cliccaci sopra. Cliccando su un nodo, il pannello di controllo scorre automaticamente alla sua sezione pertinente. In Modalità Esperto, questo mostrerebbe i suoi parametri interni.'},
            waitForAction: { type: 'click', propagate: true }
        },
        {
            targetElement: '#scenario-hr-aggressive',
            title: { en: 'Using Scenarios', it: 'Usare gli Scenari' },
            content: { en: 'Let\'s load a High-Risk patient case to prepare for the AI analysis.', it: 'Carichiamo il caso di un paziente ad Alto Rischio per preparare l\'analisi IA.' },
            narration: { en: "Manually setting every variable can be slow. Let's load a complex, high-risk scenario to see how the AI can help.", it: "Impostare manualmente ogni variabile può essere lento. Carichiamo uno scenario complesso ad alto rischio per vedere come l'IA può aiutarci." },
            waitForAction: { type: 'click' }
        },
        {
            targetElement: '#run-ai-assistant',
            title: { en: 'The AI Assistant', it: 'L\'Assistente IA' },
            content: { en: 'On a standard device, the assistant runs powerful simulations to guide decisions.', it: 'Su un dispositivo standard, l\'assistente esegue potenti simulazioni per guidare le decisioni.' },
            narration: { en: "For a complex case like this, making the best decision is not easy. The AI Assistant can help. On a standard device, it runs powerful simulations to find optimal strategies.", it: "Per un caso complesso come questo, prendere la decisione migliore non è facile. L'Assistente IA può aiutare. Su un dispositivo standard, esegue potenti simulazioni per trovare strategie ottimali." }
        },
        {
            targetElement: '#run-ai-assistant',
            title: { en: 'AI Ready Devices', it: 'Dispositivi AI Ready' },
            content: { en: 'On next-gen devices, BAYNET detects the local AI. The ✨ icon appears, indicating that analyses are now real and fully private.', it: 'Sui dispositivi di nuova generazione, BAYNET rileva l\'IA locale. Appare l\'icona ✨, che indica che le analisi ora sono reali e totalmente private.' },
            narration: { en: "However, on a next-generation device with built-in AI, BAYNET detects this capability and upgrades itself. Watch. The sparkle icon appears, indicating that the AI is now live and running locally on your device, ensuring total privacy. Analyses are now real, dynamic computations.", it: "Tuttavia, su un dispositivo di nuova generazione con IA integrata, BAYNET rileva questa capacità e si potenzia. Guarda. L'icona a scintilla appare, indicando che l'IA è ora attiva e in esecuzione localmente sul tuo dispositivo, garantendo una privacy totale. Le analisi ora sono calcoli reali e dinamici." },
            simulatedAction: { type: 'show-ai-badge' }
        },
        {
            targetElement: '#ai-action-analyze',
            title: { en: 'Finding the Best Strategy', it: 'Trovare la Strategia Migliore' },
            content: { en: 'Let\'s ask the AI to find the optimal treatment strategy.', it: 'Chiediamo all\'IA di trovare la strategia terapeutica ottimale.' },
            narration: { en: "Now, let's ask the AI to perform its most important task: finding the optimal treatment strategy. Click the button to begin the analysis.", it: "Ora, chiediamo all'IA di svolgere il suo compito più importante: trovare la strategia terapeutica ottimale. Clicca il pulsante per iniziare l'analisi." },
            waitForAction: { type: 'click' }
        },
        {
            title: { en: 'Presentation Complete', it: 'Presentazione Completata' },
            content: { en: 'The AI has analyzed the options and set the optimal strategy. You can now explore all the features freely.', it: 'L\'IA ha analizzato le opzioni e impostato la strategia ottimale. Ora puoi esplorare liberamente tutte le funzionalità.' },
            narration: { en: "The AI analyzed the options and automatically configured the simulator to the best strategy it found, explaining its reasoning. This concludes our presentation. You can now explore all the features of BAYNET freely.", it: "L'IA ha analizzato le opzioni e ha configurato automaticamente il simulatore sulla migliore strategia trovata, spiegandone il ragionamento. Questo conclude la nostra presentazione. Ora puoi esplorare liberamente tutte le funzionalità di BAYNET." }
        }
    ],

    infoTabContent: {
        en: `
            <div class="version-info">
                <p><strong>Engine:</strong> BAYNET {version}</p>
                <p><strong>Model:</strong> CistoNet</p>
                <p><strong>Author:</strong> SMZ</p>
            </div>
            <h2>What is BAYNET?</h2>
            <p><strong>BAYNET</strong> is a generic simulation engine based on a <strong>Bayesian Network</strong>, a powerful model that represents cause-and-effect relationships. This page runs the <strong>CistoNet</strong> model, which is specific to bladder cancer prognosis.</p>
            <p><strong>IT IS NOT A MEDICAL DEVICE.</strong> Its purpose is educational, allowing users to explore how different variables influence potential outcomes in a simplified, probabilistic model.</p>
            
            <h2>The AI Assistant: Your Interactive Decision Partner</h2>
            <p>The AI Assistant integrated within BAYNET is a demonstration of the future of intelligent data analysis. Depending on your device, it operates in two modes:</p>
            <ul>
                <li><strong>Simulation Mode (Default):</strong> The AI runs pre-scripted, yet powerful, analyses to simulate how a real AI would work.</li>
                <li><strong>Live AI Mode (✨ icon visible):</strong> On compatible next-generation devices, BAYNET detects and uses the built-in AI (like Gemini Nano). All analyses are performed in real-time, 100% locally on your device, ensuring total privacy. This feature is experimental and not fully optimized.</li>
            </ul>
            <h3>Available AI Actions:</h3>
            <p>The AI Assistant can perform several tasks, such as analyzing the optimal treatment strategy by balancing survival and quality of life, summarizing a patient's case, or creating a new challenging scenario for study.</p>

            <h2>License</h2>
            <p>The BAYNET simulation engine and the CistoNet model are open source software released under the <strong>MIT License</strong>. You are free to use, modify, and distribute this software.</p>
        `,
        it: `
            <div class="version-info">
                <p><strong>Motore:</strong> BAYNET {version}</p>
                <p><strong>Modello:</strong> CistoNet</p>
                <p><strong>Autore:</strong> SMZ</p>
            </div>
            <h2>Cos'è BAYNET?</h2>
            <p><strong>BAYNET</strong> è un motore di simulazione generico basato su una <strong>Rete Bayesiana</strong>, un potente modello che rappresenta relazioni di causa-effetto. Questa pagina sta eseguendo il modello <strong>CistoNet</strong>, specifico per la prognosi del cancro alla vescica.</p>
            <p><strong>NON È UNO STRUMENTO MEDICO.</strong> Il suo scopo è educativo, per consentire agli utenti di esplorare come le diverse variabili influenzano i possibili esiti in un modello probabilistico semplificato.</p>

            <h2>L'Assistente AI: Il Tuo Partner Decisionale Interattivo</h2>
            <p>L'Assistente AI integrato in BAYNET è una dimostrazione del futuro dell'analisi intelligente dei dati. A seconda del tuo dispositivo, opera in due modalità:</p>
            <ul>
                <li><strong>Modalità Simulazione (Predefinita):</strong> L'IA esegue analisi pre-programmate ma potenti, per simulare come funzionerebbe una vera IA.</li>
                <li><strong>Modalità IA Live (icona ✨ visibile):</strong> Su dispositivi compatibili di nuova generazione, BAYNET rileva e utilizza l'IA integrata (come Gemini Nano). Tutte le analisi sono eseguite in tempo reale, 100% localmente sul tuo dispositivo, garantendo una privacy totale. Questa funzionalità è sperimentale e non completamente ottimizzata.</li>
            </ul>
            <h3>Azioni IA Disponibili:</h3>
            <p>L'Assistente AI può eseguire diversi compiti, come analizzare la strategia terapeutica ottimale bilanciando sopravvivenza e qualità della vita, riassumere il caso di un paziente o creare un nuovo scenario complesso da studiare.</p>

            <h2>Licenza</h2>
            <p>Il motore di simulazione BAYNET e il modello CistoNet sono software open source rilasciati sotto la <strong>Licenza MIT</strong>. Sei libero di utilizzare, modificare e distribuire questo software.</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof BayNetApp === 'undefined') {
        console.error("BAYNET Error: Engine `BayNetApp` not found. Make sure to load baynet-engine.js.");
        document.body.innerHTML = "<h1>Error: Engine Not Found</h1><p>The BAYNET engine file could not be loaded. Please check the file `baynet-engine.js`.</p>";
        return;
    }

    const app = new BayNetApp(cistoNetModel);
    app.init();

    const agent = new AIAgent(app);
    document.getElementById('ai-action-analyze').addEventListener('click', () => agent.run('analyze'));
    document.getElementById('ai-action-summarize').addEventListener('click', () => agent.run('summarize'));
    document.getElementById('ai-action-create').addEventListener('click', () => agent.run('create'));
});