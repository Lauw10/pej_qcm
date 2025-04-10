const questions = [
   {
        question: "Quel signe ECG est pathognomonique d'un infarctus STEMI ?",
        answers: [
            { text: "Ondes U prominentes", correct: false },
            { text: "Sus-décalage du segment ST", correct: true },
            { text: "Aplatissement de l'onde T", correct: false },
            { text: "Onde Q profonde", correct: false }
        ]
    },
    {
        question: "Quel germe cause le plus souvent les pneumonies communautaires ?",
        answers: [
            { text: "Streptococcus pneumoniae", correct: true },
            { text: "Legionella pneumophila", correct: false },
            { text: "Mycoplasma pneumoniae", correct: false },
            { text: "Klebsiella pneumoniae", correct: false }
        ]
    },
    {
        question: "Quel est le mécanisme d'action des bêta-bloquants ?",
        answers: [
            { text: "Inhibition de l'enzyme de conversion", correct: false },
            { text: "Activation des récepteurs muscariniques", correct: false },
            { text: "Inhibition des canaux calciques", correct: false },
            { text: "Blocage des récepteurs bêta-adrénergiques", correct: true }
        ]
    },
    {
        question: "Quelle complication est la plus redoutée dans l'asthme aigu grave ?",
        answers: [
            { text: "Emphysème sous-cutané", correct: false },
            { text: "Pneumothorax", correct: false },
            { text: "Arrêt respiratoire", correct: true },
            { text: "Bronchectasies", correct: false }
        ]
    },
   {
        question: "Quelle lésion est caractéristique de la tuberculose ?",
        answers: [
            { text: "Nécrose caséeuse", correct: true },
            { text: "Nécrose fibrinoïde", correct: false },
            { text: "Nécrose coagulée", correct: false },
            { text: "Nécrose liquéfiée", correct: false }
        ]
    }
];

// Éléments du DOM
const bestScoreDisplay = document.getElementById('best-score-value');
const resetBestScoreBtn = document.getElementById('reset-best-score-btn');

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const resultsScreen = document.getElementById('results-screen');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreTextElement = document.getElementById('score-text');

// Variables d'état
let currentQuestionIndex = 0;
let score = 0;
let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;

// Initialiser l'affichage du meilleur score au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    bestScoreDisplay.textContent = ((bestScore / questions.length) * 100).toFixed(1);
});

// Événements
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', restartQuiz);

// Fonctions
function startQuiz() {
    // Mettre à jour l'affichage du meilleur score
    bestScoreDisplay.textContent = bestScore;
    
    startScreen.classList.add('hide');
    quizContainer.classList.remove('hide');
    currentQuestionIndex = 0;
    score = 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showResults();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn', 'answer-btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    
    selectedButton.classList.add('selected');
    
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        
        if (button === selectedButton) {
            if (correct) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        }
    });
    
    if (correct) {
        score++;
    }
    
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        setTimeout(() => {
            showResults();
        }, 1000);
    }
}

function showResults() {
    const bestScorePercentage = ((bestScore / questions.length) * 100).toFixed(1);
    quizContainer.classList.add('hide');
    resultsScreen.classList.remove('hide');
    
    const percentage = (score / questions.length) * 100;
    let comment = "";
    
    if (percentage === 100) {
        comment = "Excellent! Vous êtes un génie!";
    } else if (percentage >= 80) {
        comment = "Très bien! Vous avez bien maitrisé cette leçon.";
    } else if (percentage >= 65) {
        comment = "Bien! Vous êtes sur la bonne voie.";
    } else if (percentage >= 60) {
        comment = "Pas mal! Vous pouvez encore vous améliorer.";
    } else {
        comment = "Dommage! Peut-être devriez-vous réviser un peu.";
    }
    
    // Vérifie et met à jour le meilleur score
    let newRecord = false;
    if (score >= bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreDisplay.textContent = bestScore
        newRecord = true;
    }
    
    // Affiche les résultats
    scoreTextElement.innerHTML = `
    <p>Votre score: <strong>${percentage.toFixed(1)}/100</strong></p>
    <p>Meilleur score: <strong>${((bestScore / questions.length) * 100).toFixed(1)}/100</strong></p>
    <p>${comment} ${newRecord ? "🏆 Nouveau record!" : ""}</p>
`;
}

function restartQuiz() {
    resultsScreen.classList.add('hide');
    startQuiz();
}

resetBestScoreBtn.addEventListener('click', resetBestScore);

function resetBestScore() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser votre meilleur score ?")) {
        bestScore = 0;
        localStorage.setItem('bestScore', bestScore);
        bestScoreDisplay.textContent = ((bestScore / questions.length) * 100).toFixed(1);
        alert("Meilleur score réinitialisé !");
    }
}
