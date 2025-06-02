document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const nextQuestionButton = document.getElementById('next-question-button');

    const diagnosticosCorretosDisplay = document.getElementById('diagnosticos-corretos');
    const fichasRestantesDisplay = document.getElementById('fichas-restantes');

    const questionTitleDisplay = document.getElementById('question-title');
    const questionTextDisplay = document.getElementById('question-text');
    const optionsArea = document.getElementById('options-area');

    const feedbackTextDisplay = document.getElementById('feedback-text');
    const feedbackArea = document.getElementById('feedback-area');

    const endTitleDisplay = document.getElementById('end-title');
    const endMessageDisplay = document.getElementById('end-message');
    const finalScoreDisplay = document.getElementById('final-score');

    // Elementos para a funcionalidade de DICA
    const hintButton = document.getElementById('hint-button');
    const hintsRemainingDisplay = document.getElementById('hints-remaining-count');
    const startScreenHintsDisplay = document.getElementById('start-screen-hints');


    // --- Constants & Game Configuration ---
    const TOTAL_DIAGNOSTICOS_TO_WIN = 4;
    const INITIAL_CHANCES = 5;
    const MAX_HINTS_PER_GAME = 2; // Número máximo de dicas por jogo
    const HIDDEN_CLASS = 'hidden';
    const CORRECT_CLASS = 'correct';
    const INCORRECT_CLASS = 'incorrect';
    const SELECTED_CLASS = 'selected';
    const HINT_REMOVED_CLASS = 'hint-removed'; // Classe para opção removida pela dica

    const SCREEN_FADE_OUT_CLASS = 'screen-fade-out';
    const SCREEN_FADE_IN_CLASS = 'screen-fade-in';
    const ELEMENT_FADE_IN_CLASS = 'element-fade-in';
    const OPTION_APPEAR_CLASS = 'option-button-appear';
    const ANIMATION_DELAY = 500;

    // --- Question Bank (Mantido o seu) ---
    const questions = [
        {
            question: "Um organismo que vive DENTRO ou SOBRE outro organismo (hospedeiro), se beneficiando e geralmente causando algum dano a ele, é chamado de?",
            options: ["Predador", "Parasita", "Comensal", "Mutualista"],
            correctAnswer: "Parasita",
            explanation: "Correto! Parasitas dependem do hospedeiro para sobreviver, muitas vezes causando doenças. Entender isso é o primeiro passo para a prevenção!"
        },
        {
            question: "Qual destes é um pequeno inseto sem asas que vive no couro cabeludo humano e se alimenta de sangue, causando coceira intensa?",
            options: ["Formiga", "Barata", "Piolho", "Abelha"],
            correctAnswer: "Piolho",
            explanation: "Correto! Piolhos (pediculose) são comuns, especialmente em crianças. A principal transmissão é por contato direto cabeça com cabeça, não necessariamente por falta de higiene."
        },
        {
            question: "Lavar as mãos com frequência, especialmente antes de comer e após usar o banheiro, ajuda a prevenir a ingestão de ovos de qual tipo de parasita intestinal comum?",
            options: ["Mosquitos da malária", "Carrapatos", "Lombrigas (Ascaris)", "Larvas de bicho geográfico"],
            correctAnswer: "Lombrigas (Ascaris)",
            explanation: "Correto! Muitos parasitas intestinais, como a lombriga (Ascaris lumbricoides), são transmitidos por ovos presentes em mãos, água ou alimentos contaminados. A higiene é fundamental!"
        },
        {
            question: "Cozinhar bem os alimentos, especialmente carnes de boi e porco, é uma importante medida para prevenir a infecção por qual tipo de parasita?",
            options: ["Vírus da gripe", "Bactérias da pele", "Larvas de Taenia (solitária)", "Fungos de unha"],
            correctAnswer: "Larvas de Taenia (solitária)",
            explanation: "Correto! A Taenia (solitária) pode ser transmitida pela ingestão de carne crua ou mal cozida contendo suas larvas (cisticercos). O cozimento adequado mata esses parasitas."
        },
        {
            question: "Qual protozoário, transmitido pela picada do mosquito-palha (flebotomíneo), é causador da Leishmaniose?",
            options: ["Trypanosoma cruzi", "Leishmania spp.", "Toxoplasma gondii", "Giardia lamblia"],
            correctAnswer: "Leishmania spp.",
            explanation: "A Leishmania spp. é o agente etiológico da Leishmaniose. A doença pode se manifestar de forma cutânea ou visceral. O controle do vetor (mosquito-palha) e o tratamento de reservatórios são cruciais para a prevenção."
        },
        {
            question: "A ingestão de água ou alimentos contaminados com cistos de qual protozoário é uma causa comum de diarreia, especialmente em locais com saneamento básico deficiente?",
            options: ["Entamoeba histolytica", "Giardia lamblia", "Trichomonas vaginalis", "Cryptosporidium parvum"],
            correctAnswer: "Giardia lamblia",
            explanation: "A Giardia lamblia causa giardíase, uma infecção intestinal. A transmissão ocorre pela ingestão de cistos presentes em água ou alimentos contaminados. Saneamento básico e higiene pessoal são fundamentais para prevenção."
        },
        {
            question: "Qual é o principal modo de transmissão da Doença de Chagas, causada pelo parasita *Trypanosoma cruzi*?",
            options: ["Picada do mosquito Aedes aegypti", "Contato com fezes do inseto barbeiro", "Ingestão de carne de porco malcozida", "Contato com água contaminada por caramujos"],
            correctAnswer: "Contato com fezes do inseto barbeiro",
            explanation: "A principal forma de transmissão da Doença de Chagas é vetorial, pelo contato com as fezes contaminadas do inseto 'barbeiro' (triatomíneo) após a picada. Melhoria das habitações e controle do vetor são medidas preventivas."
        },
        {
            question: "A malária, uma doença febril aguda, é causada por protozoários do gênero *Plasmodium*. Qual o principal vetor de transmissão?",
            options: ["Mosquito Aedes aegypti", "Mosquito Culex", "Mosquito Anopheles", "Carrapato Estrela"],
            correctAnswer: "Mosquito Anopheles",
            explanation: "A malária é transmitida pela picada da fêmea infectada do mosquito Anopheles. A prevenção envolve o controle do mosquito, uso de mosquiteiros impregnados com inseticida e, em algumas áreas, quimioprofilaxia."
        },
        {
            question: "A esquistossomose mansônica, ou 'barriga d'água', é causada pelo *Schistosoma mansoni*. Qual o hospedeiro intermediário essencial no ciclo deste parasita?",
            options: ["Peixe", "Porco", "Caramujo (Biomphalaria)", "Bovino"],
            correctAnswer: "Caramujo (Biomphalaria)",
            explanation: "Os caramujos do gênero Biomphalaria são hospedeiros intermediários do Schistosoma mansoni. As larvas (cercárias) são liberadas na água e penetram na pele humana. Saneamento básico e evitar contato com águas contaminadas são medidas preventivas."
        },
        {
            question: "Qual parasita é o agente etiológico da toxoplasmose, doença que pode ser particularmente grave para gestantes e imunocomprometidos?",
            options: ["Sarcoptes scabiei", "Toxoplasma gondii", "Enterobius vermicularis", "Ancylostoma duodenale"],
            correctAnswer: "Toxoplasma gondii",
            explanation: "O Toxoplasma gondii causa a toxoplasmose. A infecção pode ocorrer pela ingestão de oocistos de fezes de gatos, carne crua/malcozida contendo cistos ou transplacentária. Gestantes devem ter cuidado especial com alimentos e contato com gatos."
        },
        {
            question: "A 'sarna' ou escabiose é uma dermatose pruriginosa causada por qual tipo de parasita?",
            options: ["Fungo", "Bactéria", "Vírus", "Ácaro"],
            correctAnswer: "Ácaro",
            explanation: "A escabiose é causada pelo ácaro Sarcoptes scabiei var. hominis. A fêmea escava túneis na pele para depositar ovos, causando coceira intensa, principalmente à noite. A transmissão ocorre por contato direto e prolongado com pessoa infestada."
        },
        {
            question: "O 'amarelão' é uma doença parasitária que pode causar anemia e desnutrição. Qual helminto é um dos seus principais causadores?",
            options: ["Necator americanus", "Trichuris trichiura", "Strongyloides stercoralis", "Fasciola hepatica"],
            correctAnswer: "Necator americanus",
            explanation: "O Necator americanus, junto com o Ancylostoma duodenale, são os ancilostomídeos causadores do 'amarelão'. As larvas penetram a pele, e os vermes adultos se fixam no intestino, causando perda de sangue. Saneamento e uso de calçados previnem."
        }
    ];


    // --- State Variables ---
    let currentQuestionIndex;
    let diagnosticosCorretos;
    let fichasRestantes;
    let shuffledQuestions;
    let answerChecked;
    let hintsRemaining; // Para controlar as dicas
    let hintUsedThisQuestion; // Para controlar se dica já foi usada na pergunta atual

    // --- Helper Functions ---
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function switchScreen(screenToShow, screenToHide) {
        if (screenToHide) {
            screenToHide.classList.add(SCREEN_FADE_OUT_CLASS);
            setTimeout(() => {
                screenToHide.classList.add(HIDDEN_CLASS);
                screenToHide.classList.remove(SCREEN_FADE_OUT_CLASS);
            }, ANIMATION_DELAY);
        }

        setTimeout(() => {
            screenToShow.classList.remove(HIDDEN_CLASS);
            screenToShow.classList.remove(SCREEN_FADE_OUT_CLASS);
            screenToShow.classList.add(SCREEN_FADE_IN_CLASS);
            setTimeout(() => {
                screenToShow.classList.remove(SCREEN_FADE_IN_CLASS);
            }, ANIMATION_DELAY);
        }, screenToHide ? ANIMATION_DELAY : 0);
    }
    
    function animateElementIn(element) {
        element.classList.remove(ELEMENT_FADE_IN_CLASS);
        void element.offsetWidth;
        element.classList.add(ELEMENT_FADE_IN_CLASS);
    }

    function updateHintDisplay() {
        hintsRemainingDisplay.textContent = hintsRemaining;
        startScreenHintsDisplay.textContent = `${MAX_HINTS_PER_GAME} dicas`; // Atualiza na tela inicial também (se necessário re-exibir)
        
        if (hintsRemaining <= 0 || answerChecked || hintUsedThisQuestion) {
            hintButton.disabled = true;
        } else {
            hintButton.disabled = false;
        }
    }


    // --- Game Logic Functions ---
    function startGame() {
        currentQuestionIndex = 0;
        diagnosticosCorretos = 0;
        fichasRestantes = INITIAL_CHANCES;
        hintsRemaining = MAX_HINTS_PER_GAME; // Reseta dicas
        hintUsedThisQuestion = false; // Reseta controle de dica por pergunta
        answerChecked = false;
        shuffledQuestions = shuffleArray(questions);

        switchScreen(gameScreen, startScreen.classList.contains(HIDDEN_CLASS) ? endScreen : startScreen);
        nextQuestionButton.classList.add(HIDDEN_CLASS);
        feedbackArea.classList.remove(ELEMENT_FADE_IN_CLASS);
        feedbackArea.style.opacity = 0;

        updateStatsDisplay();
        updateHintDisplay(); // Atualiza display de dicas
        displayQuestion();
    }

    function updateStatsDisplay() {
        diagnosticosCorretosDisplay.textContent = diagnosticosCorretos;
        fichasRestantesDisplay.textContent = fichasRestantes;
    }

    function displayQuestion() {
        answerChecked = false;
        hintUsedThisQuestion = false; // Permite usar dica na nova pergunta

        feedbackTextDisplay.textContent = '';
        feedbackTextDisplay.className = '';
        feedbackArea.style.opacity = 0;
        feedbackArea.classList.remove(ELEMENT_FADE_IN_CLASS);

        nextQuestionButton.classList.add(HIDDEN_CLASS);
        nextQuestionButton.disabled = true;
        
        updateHintDisplay(); // Atualiza estado do botão de dica

        if (currentQuestionIndex >= shuffledQuestions.length) {
            endGame(false); // Considera fim de jogo se não houver mais perguntas
            return;
        }

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        questionTitleDisplay.textContent = `Pergunta ${currentQuestionIndex + 1}`;
        
        questionTextDisplay.classList.remove(ELEMENT_FADE_IN_CLASS);
        questionTextDisplay.style.opacity = 0;
        setTimeout(() => {
            questionTextDisplay.textContent = currentQuestion.question;
            questionTextDisplay.style.opacity = 1;
            animateElementIn(questionTextDisplay);
        }, 100);

        optionsArea.innerHTML = ''; 
        currentQuestion.options.forEach((optionText, index) => {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.classList.add('option-button');
            button.style.opacity = 0;
            // Garante que botões não tenham classes de dica anteriores
            button.classList.remove(HINT_REMOVED_CLASS); 
            button.disabled = false;

            button.addEventListener('click', () => handleOptionClick(optionText, currentQuestion.correctAnswer, currentQuestion.explanation, button));
            optionsArea.appendChild(button);

            setTimeout(() => {
                button.style.opacity = 1;
                button.classList.add(OPTION_APPEAR_CLASS);
            }, 200 + (index * 100));
        });
    }

    function handleOptionClick(selectedOptionText, correctAnswer, explanation, clickedButton) {
        if (answerChecked) return;
        answerChecked = true;
        nextQuestionButton.disabled = false;
        hintButton.disabled = true; // Desabilita dica após responder

        const optionButtons = optionsArea.querySelectorAll('.option-button');
        optionButtons.forEach(btn => {
            btn.disabled = true; // Desabilita todas as opções
            btn.classList.remove(OPTION_APPEAR_CLASS);
        });

        clickedButton.classList.add(SELECTED_CLASS);
        let feedbackMessage = "";

        if (selectedOptionText === correctAnswer) {
            diagnosticosCorretos++;
            feedbackTextDisplay.classList.add('success');
            clickedButton.classList.add(CORRECT_CLASS);
            feedbackMessage = `Correto! ${explanation}`;
        } else {
            fichasRestantes--;
            feedbackTextDisplay.classList.add('error');
            clickedButton.classList.add(INCORRECT_CLASS);
            feedbackMessage = `Errado. A resposta correta era "${correctAnswer}". ${explanation}`;
            
            optionButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add(CORRECT_CLASS);
                }
            });
        }
        feedbackTextDisplay.textContent = feedbackMessage;
        feedbackArea.style.opacity = 1;
        animateElementIn(feedbackArea);
        
        updateStatsDisplay();
        checkGameEnd();
    }

    function handleHintClick() {
        if (hintsRemaining <= 0 || answerChecked || hintUsedThisQuestion) {
            return; // Não faz nada se não houver dicas, ou pergunta já respondida/com dica
        }

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const optionButtons = Array.from(optionsArea.querySelectorAll('.option-button:not(.hint-removed)')); // Pega apenas opções não removidas

        // Filtra as opções incorretas que ainda estão ativas (não são a correta e não foram removidas)
        const incorrectActiveOptions = optionButtons.filter(btn => btn.textContent !== currentQuestion.correctAnswer);

        if (incorrectActiveOptions.length > 0) { // Só remove se houver incorretas para remover
            // Escolhe uma opção incorreta aleatória para remover
            const randomIndex = Math.floor(Math.random() * incorrectActiveOptions.length);
            const optionToRemove = incorrectActiveOptions[randomIndex];
            
            optionToRemove.classList.add(HINT_REMOVED_CLASS);
            optionToRemove.disabled = true; // Desabilita visualmente e funcionalmente

            hintsRemaining--;
            hintUsedThisQuestion = true; // Marca que dica foi usada nesta pergunta
            updateHintDisplay(); // Atualiza o contador e o estado do botão
        }
    }


    function checkGameEnd() {
        if (diagnosticosCorretos >= TOTAL_DIAGNOSTICOS_TO_WIN) {
            setTimeout(() => endGame(true), ANIMATION_DELAY + 1000);
        } else if (fichasRestantes <= 0) {
            setTimeout(() => endGame(false), ANIMATION_DELAY + 1000);
        } else if (currentQuestionIndex >= shuffledQuestions.length - 1 && (diagnosticosCorretos < TOTAL_DIAGNOSTICOS_TO_WIN)) {
            // Se acabaram as perguntas e não ganhou (mas ainda tem fichas)
            setTimeout(() => endGame(false), ANIMATION_DELAY + 1000);
        }
         else {
            nextQuestionButton.classList.remove(HIDDEN_CLASS);
            animateElementIn(nextQuestionButton);
        }
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }

    function endGame(isWin) {
        switchScreen(endScreen, gameScreen);
        finalScoreDisplay.textContent = diagnosticosCorretos;

        if (isWin) {
            endTitleDisplay.textContent = "Missão Cumprida, Agente! 🥳";
            endMessageDisplay.textContent = `Parabéns! Você realizou ${diagnosticosCorretos} diagnósticos corretos e ajudou a proteger a saúde da comunidade. Seu conhecimento é valioso!`;
        } else {
            endTitleDisplay.textContent = "Fim da Investigação... 😥";
            if (fichasRestantes <=0) {
                 endMessageDisplay.textContent = `Suas fichas de investigação acabaram! Você realizou ${diagnosticosCorretos} diagnósticos corretos. Estude mais e tente novamente!`;
            } else if (currentQuestionIndex >= shuffledQuestions.length -1 ) {
                 endMessageDisplay.textContent = `Você respondeu todas as perguntas e realizou ${diagnosticosCorretos} diagnósticos corretos. Não foi o suficiente para a missão desta vez. Tente novamente!`;
            }
            else {
                 endMessageDisplay.textContent = `Você realizou ${diagnosticosCorretos} diagnósticos corretos. Infelizmente, não foi o suficiente desta vez. Estude mais e tente novamente para combater os parasitas!`;
            }
        }
        animateElementIn(endTitleDisplay);
        animateElementIn(endMessageDisplay);
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    nextQuestionButton.addEventListener('click', handleNextQuestion);
    hintButton.addEventListener('click', handleHintClick); // Listener para o botão de dica

    // --- Initial Setup ---
    gameScreen.classList.add(HIDDEN_CLASS);
    endScreen.classList.add(HIDDEN_CLASS);
    startScreen.classList.remove(HIDDEN_CLASS);
    startScreenHintsDisplay.textContent = `${MAX_HINTS_PER_GAME} dicas`; // Configura texto inicial de dicas
    
    startScreen.classList.add(SCREEN_FADE_IN_CLASS);
    setTimeout(() => startScreen.classList.remove(SCREEN_FADE_IN_CLASS), ANIMATION_DELAY);
});