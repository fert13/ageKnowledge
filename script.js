//Import Audios
const diceRollAudio = new Audio('./Assets/sfx/dice_roll.wav')
const movePieceAudio = new Audio('./Assets/sfx/pieceMove.wav')

//Importing All Boards
const blue_Board = document.getElementById("blue-Board");
const green_Board = document.getElementById("green-Board");
const red_Board = document.getElementById("red-Board");
const yellow_Board = document.getElementById("yellow-Board");


//DOMs
const rollDiceButton = document.getElementById('rollDiceButton');
const rollDice = document.getElementById('rollDice');
const bonusText = document.getElementById('sidebarHeader');


//Initial Variables;
let playerTurns = [];// This will hold the players team color
let currentPlayerTurnIndex = 0;
let prevPlayerTurnIndex;
let currentPlayerTurnStatus = true; //True means the user has not yet played and false means played
let teamHasBonus = false; //Bonus when killed, reached Home
let currentIndex = 0;
let randomBonus = 0;
let diceResult;
let numPvP = 2;
let symbols = ['♠', '♥', '♦', '♣'];
let numbers = ['4', '5', '6', '7', '8', '9'];
let pathArray = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13', 'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8', 'y9', 'y10', 'y11', 'y12', 'y13', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13'];
let homePathEntries = {
    blue: ['bh1', 'bh2', 'bh3', 'bh4', 'bh5', 'home'],
    yellow: ['yh1', 'yh2', 'yh3', 'yh4', 'yh5', 'home'],
    red: ['rh1', 'rh2', 'rh3', 'rh4', 'rh5', 'home'],
    green: ['gh1', 'gh2', 'gh3', 'gh4', 'gh5', 'home'],
};

let safePaths = [
    'r1', 'r9', 'b1', 'b9', 'y1', 'y9', 'g1', 'g9',
    ...homePathEntries.blue,
    ...homePathEntries.red,
    ...homePathEntries.yellow,
    ...homePathEntries.green
];

let bonusPaths = ['r9', 'b9','y9','g9'];
let homePathArray = [
    ...homePathEntries.blue,
    ...homePathEntries.red,
    ...homePathEntries.yellow,
    ...homePathEntries.green
]


class Player_Piece {

    constructor(team, position, score, homePathEntry, playerId, gameEntry) {
        this.team = team;
        this.position = position;
        this.score = score;
        this.homePathEntry = homePathEntry;
        this.id = playerId;
        this.gameEntry = gameEntry;
        this.status = 0; 
        this.initialPosition = position;
    }
    unlockPiece() {
        this.status = 1; 
        this.position = this.gameEntry;
        let element = document.querySelector(`[piece_id="${this.id}"]`);
        let toAppendDiv = document.getElementById(this.gameEntry);
        movePieceAudio.play();
        toAppendDiv.appendChild(element);
    }

    updatePosition(position) {
        this.position = position;
    }

    movePiece(array) {
        let filteredArray = array;

        if (array.includes(this.homePathEntry)) {
            let indexOfHomePathEntry = array.findIndex(obj => obj === this.homePathEntry);
            let newSlicedArray = array.slice(0, indexOfHomePathEntry);
            if (newSlicedArray.length < diceResult) {
                let remainingLength = diceResult - newSlicedArray.length;
                let secondPart = homePathEntries[this.team].slice(0, remainingLength);
                newSlicedArray = newSlicedArray.concat(secondPart);
            }
            filteredArray = newSlicedArray;
        }


        if (filteredArray.includes('home')) {
            teamHasBonus = true;
        }

        moveElementSequentially(this.id, filteredArray);
        this.score += filteredArray.length;
    }

    sentMeToBoard() {
        this.score = 0;
        this.position = this.initialPosition;
        this.status = 0;
        let element = document.querySelector(`[piece_id="${this.id}"]`);
        let toAppendDiv = document.getElementById(this.initialPosition);
        toAppendDiv.appendChild(element);
    }
}
let playerPieces = [];
let boardDetails = [
    { boardColor: 'blue', board: blue_Board, homeEntry: 'y13', gameEntry: 'b1', hasAnswer: localStorage.getItem('blueAnswer'), player: localStorage.getItem('player1') },
    { boardColor: 'green', board: green_Board, homeEntry: 'r13', gameEntry: 'g1', hasAnswer: localStorage.getItem('greenAnswer'), player: localStorage.getItem('player2') },
    { boardColor: 'red', board: red_Board, homeEntry: 'b13', gameEntry: 'r1', hasAnswer: localStorage.getItem('redAnswer'), player:localStorage.getItem('player3') },
    { boardColor: 'yellow', board: yellow_Board, homeEntry: 'g13', gameEntry: 'y1', hasAnswer: localStorage.getItem('yellowAnswer'), player:localStorage.getItem('player4') }
];

for (let i = 0; i < numPvP; i++) {
    let boardColor = boardDetails[i].boardColor;
    let homeEntry = boardDetails[i].homeEntry;
    let gameEntry = boardDetails[i].gameEntry;

    const parentDiv = document.createElement('div');
    for (let i = 0; i < 2; i++) {

        const span = document.createElement('span');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', boardColor === 'blue' ? 'fa-chess-pawn' : boardColor === 'green' ? 'fa-chess-rook' :boardColor === 'red' ? 'fa-chess-knight' : 'fa-chess-king' ,  'piece', `${boardColor}-piece`);

        icon.addEventListener('click', (e) => {
            if(localStorage.getItem('gameMode') === 'manette'){
                turnForUserAll(e)
            }{
                turnForUser(e)
            }

        });

        if (boardColor === 'blue') {
            icon.setAttribute('myPieceNum', i + 1);
        }

        let pieceID = `${boardColor}${i}`;
        let position = `${i}_${boardColor}`;

        const player = new Player_Piece(boardColor, position, 0, homeEntry, pieceID, gameEntry);
        span.setAttribute('id', position);
        icon.setAttribute('piece_id', pieceID);
        playerPieces.push(player);
        span.append(icon);
        parentDiv.append(span);
    }
    boardDetails[i].board.append(parentDiv);
}

if (numPvP === 2) {
    playerTurns = ['blue', 'green'];
} else if (numPvP === 3) {
    playerTurns = ['blue', 'red', 'green'];
} else if (numPvP === 4) {
    playerTurns = ['blue', 'red', 'green', 'yellow']
}

//Si le premier joueur n'existe pas, donc il n'y a pas eu de configuration d'ou retour 
// à la page de configuration
if(!localStorage.getItem('player1')){
    window.location = 'configuration'
}


//Affichage des noms des joueurs en compétition

if(localStorage.getItem('gameMode')==='manette'){
    document.getElementById('joueurs-name').innerHTML=`<p>${localStorage.getItem('player1')} vs ${localStorage.getItem('player2')}`
} else {
    document.getElementById('joueurs-name').innerHTML=`<p>${localStorage.getItem('player1')} vs Bot` 
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Les questions difficiles 
const difficultQuestions = [
    {
      question: "Qui a inventé la machine à vapeur ?",
      options: ["Thomas Edison", "James Watt", "Henry Ford"],
      answer: "James Watt",
    },
    {
      question: "Quelle invention est attribuée à Eli Whitney ?",
      options: ["Le coton gin", "La machine à vapeur", "Le télégraphe électrique"],
      answer: "Le coton gin",
    },
    {
      question: "Qui est l'inventeur de l'ampoule électrique ?",
      options: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell"],
      answer: "Thomas Edison",
    },
    {
      question: "Qui est l'inventeur du télégraphe électrique ?",
      options: ["Georges Stephenson", "James Hargreaves", "Samuel Morse"],
      answer: "Samuel Morse",
    },
    {
      question: "Qui a élaboré le processus Bessemer ?",
      options: ["Andrew Carnegie", "Henry Bessemer", "Robert Fulton"],
      answer: "Henry Bessemer",
    },
    {
      question: "Qui a amélioré le processus Bessemer ?",
      options: ["Robert Mushet", "Robert Fulton", "Henry Bessemer"],
      answer: "Henry Bessemer",
    },
    {
      question: "Quel a été le titre de la réunion où Bessemer a décrit pour la première fois le processus Bessemer ?",
      options: ["La fabrication du fer malléable et de l'acier sans combustible", "La réunion de Wonka", "La vulcanisation du caoutchouc"],
      answer: "La fabrication du fer malléable et de l'acier sans combustible",
    },
    {
      question: "Quelle a été la contribution de Georges Stephenson lors de la Révolution industrielle ?",
      options: ["Il a développé le téléphone", "Il a inventé la locomotive à vapeur", "Il a inventé le moteur à combustion"],
      answer: "Il a inventé la locomotive à vapeur",
    },
    {
      question: "Qui a inventé la machine à filer (Spinning Jenny) ?",
      options: ["Richard Arkwright", "James Hargreaves", "Eli Whitney"],
      answer: "James Hargreaves",
    },
    {
      question: "Pourquoi la Spinning Jenny a-t-elle été remplacée par le water frame ?",
      options: ["Parce que le fil produit par la Jenny n'était pas assez solide", "Parce que la nouvelle machine était plus rapide", "Parce que la Spinning Jenny était trop vieille"],
      answer: "Parce que le fil produit par la Jenny n'était pas assez solide",
    },
    {
      question: "Quel processus d'industrialisation Henry Ford a-t-il créé ?",
      options: ["La chaîne de montage", "La machine à vapeur", "Les locomotives à vapeur"],
      answer: "La chaîne de montage",
    },
    {
      question: "Qui est le pionnier de l'industrie de l'acier aux États-Unis ?",
      options: ["Eli Whitney", "Andrew Carnegie", "Henry Bessemer"],
      answer: "Andrew Carnegie",
    },
    {
      question: "Quelle invention est attribuée à Samuel Morse ?",
      options: ["Le téléphone", "L'ampoule électrique", "Le télégraphe"],
      answer: "Le télégraphe",
    },
    {
      question: "Quelles ont été les principales contributions des frères Wright lors de la révolution industrielle ?",
      options: ["L'invention du téléphone", "L'invention de la première voiture", "Le premier avion motorisé"],
      answer: "Le premier avion motorisé",
    },
    {
      question: "Quels sont les noms complets des frères Wright ?",
      options: ["Orville Wright et Wilbur Wright", "Johnson Wright et Jon Wright", "Patrick Wright et Ian Wright"],
      answer: "Orville Wright et Wilbur Wright",
    },
    {
      question: "Comment l'invention du téléphone a-t-elle été révolutionnaire ?",
      options: ["Communiquer par texte à distance", "Parler à distance en temps réel", "Automatiser la production de masse"],
      answer: "Parler à distance en temps réel",
    },
    {
      question: "Quelle a été l'innovation apportée par Robert Fulton ?",
      options: ["L'invention du téléphone", "L'invention de la locomotive à vapeur", "L'invention de la dynamite"],
      answer: "L'invention de la locomotive à vapeur",
    },
    {
      question: "Pourquoi la machine à vapeur de James Watt a-t-elle été considérée comme une amélioration par rapport à la précédente ?",
      options: ["Moins de consommation d'énergie", "Plus grande", "Fonctionnement sans charbon"],
      answer: "Moins de consommation d'énergie",
    },
    {
      question: "Qui a développé la vulcanisation du caoutchouc ?",
      options: ["Richard Arkwright", "Charles Goodyear", "Henry Ford"],
      answer: "Charles Goodyear",
    },
    {
      question: "Quelles ont été les principales contributions de Nikola Tesla ?",
      options: ["L'invention du courant alternatif (AC)", "L'invention du courant continu (DC)", "L'invention de l'ampoule électrique"],
      answer: "L'invention du courant alternatif (AC)",
    }
  ];
  
// Les questions faciles
const easyQuestions = [
    {
        question: "Comment Andrew Carnegie a-t-il influencé l'industrie américaine ?",
        options: ["En développant l'industrie de l'acier", "En inventant les machines à vapeur", "En construisant la première usine automobile"],
        answer: "En développant l'industrie de l'acier",
      },
      {
        question: "Quelle innovation a été introduite par George Stephenson ?",
        options: ["Le bateau à vapeur", "La locomotive à vapeur", "La machine à filer"],
        answer: "La locomotive à vapeur",
      },
      {
        question: "Qui a inventé la dynamite ?",
        options: ["Thomas Edison", "Alfred Nobel", "Alexander Graham Bell"],
        answer: "Alfred Nobel",
      },
      {
        question: "Quelles ont été les principales différences entre Nikola Tesla et Thomas Edison lors de la révolution industrielle ?",
        options: ["Edison soutenait le courant alternatif et Tesla soutenait le courant continu", "Tesla soutenait le courant alternatif et Edison soutenait le courant continu", "Edison a inventé l'ampoule électrique et Tesla a inventé la machine à vapeur"],
        answer: "Tesla soutenait le courant alternatif et Edison soutenait le courant continu",
      },
      {
        question: "Quand la révolution industrielle a-t-elle commencé ?",
        options: ["1760", "1780", "1740"],
        answer: "1760",
      },
      {
        question: "Où la première révolution industrielle a-t-elle commencé ?",
        options: ["États-Unis", "Allemagne", "Royaume-Uni"],
        answer: "Royaume-Uni",
      },
      {
        question: "Quel est l'équivalent électrique d'un cheval-vapeur ?",
        options: ["746W", "846A", "1450MWh"],
        answer: "746W",
      },
      {
        question: "Qu'est-ce que la révolution industrielle ?",
        options: ["Une transition de la société féodale vers une société avancée", "Une transition d'une société agraire et artisanale vers une société industrielle et commerciale", "Une transition d'un régime autoritaire à un régime démocratique"],
        answer: "Une transition d'une société agraire et artisanale vers une société industrielle et commerciale",
      },
      {
        question: "Quelle région du monde a été la première affectée par la révolution industrielle ?",
        options: ["Europe occidentale et Amérique du Nord", "Europe occidentale et Europe de l'Est", "Amérique du Nord et Extrême-Orient"],
        answer: "Europe occidentale et Amérique du Nord",
      },
      {
        question: "Quand la deuxième révolution industrielle a-t-elle commencé ?",
        options: ["1817", "1870", "1860"],
        answer: "1860",
      },
      {
        question: "Où la deuxième révolution industrielle a-t-elle commencé ?",
        options: ["États-Unis", "Royaume-Uni", "France"],
        answer: "États-Unis",
      },
      {
        question: "Quelle industrie a été la première à être transformée par la révolution industrielle ?",
        options: ["Industrie alimentaire", "Industrie textile", "Industrie du charbon"],
        answer: "Industrie textile",
      },
      {
        question: "Quel a été l'impact principal de la révolution industrielle sur la société ?",
        options: ["Augmentation du niveau de vie", "Augmentation du taux de natalité", "Meilleure couverture sociale"],
        answer: "Augmentation du niveau de vie",
      }
];

// Gestion de l'affichage des cartes en fonction type de niveau choisi
if(localStorage.getItem('gameLevel') === '2'){
    questions = difficultQuestions;
} else {
    questions = easyQuestions;
}

// Gestion de la notification
const showNotification =(message,type) => {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notificationIcon');
    const text = document.getElementById('notificationText');
    notification.classList.remove('success', 'error', 'info', 'warning');
    notification.classList.add(type);
    text.textContent = message;
    switch(type) {
        case 'success':
            icon.innerHTML = '<i class="fa fa-check-circle"></i>';
            break;
        case 'error':
            icon.innerHTML = '<i class="fa fa-times-circle"></i>';
            break;
        case 'info':
            icon.innerHTML = '<i class="fa fa-info-circle"></i>';
            break;
        case 'warning':
            icon.innerHTML = '<i class="fa fa-exclamation-circle"></i>';
            break;
    }
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}


document.getElementById('closeNotification').addEventListener('click', () => {
    const notificationClose = document.getElementById('notification');
    notificationClose.classList.remove('show');
});


// Gestion de l'affichage des questions
function loadQuestion () {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const messageElement = document.getElementById("message");
    questionElement.textContent = questions[currentIndex].question;
    optionsElement.innerHTML = ""; 
    messageElement.textContent = "";

    const currentPlayerColor = playerTurns[currentPlayerTurnIndex]

    questions[currentIndex].options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => teamAnswer(option,currentPlayerColor);
        optionsElement.appendChild(button);
    });

}


const setPlayerTurn = (playerTurnIndex, isActive) => {
    if (playerTurnIndex == null || playerTurnIndex === undefined) {
        return;
    }

    let currentTeamTurn = playerTurns[playerTurnIndex];
    let boardDetailObject = boardDetails.find(obj => obj.boardColor === currentTeamTurn);

    if (isActive) {
        boardDetailObject.board.classList.add('active');

        const utterance = new SpeechSynthesisUtterance(`C'est au tour de ${boardDetailObject.player} de jouer.`);
        utterance.lang = 'fr-FR';
        speechSynthesis.speak(utterance);

        showNotification(`Tour du joueur ${boardDetailObject.player} de répondre à une question !`, "info");
    } else {
        boardDetailObject.board.classList.remove('active');
    }
    loadQuestion()
};

setPlayerTurn(0, true);


// Gestion de la réponse à une question
const teamAnswer = (selectedOption, teamColor) => {
    let team = boardDetails.find(team => team.boardColor === teamColor);
    if (team) {
        if(questions[currentIndex].options.includes(selectedOption) && selectedOption === questions[currentIndex].answer) {
            localStorage.setItem(`${team.boardColor}Answer`, true);
            showNotification("Bonne réponse ", "success");
            rollDiceButton.disabled = false;
            setTimeout(() => {
                let reponse = new SpeechSynthesisUtterance("Bonne réponse, lancer le dé !")
                reponse.lang = 'fr-FR';
                speechSynthesis.speak(reponse);
                showNotification("Lancer le dé ", "success");
            }, 1000);
            if(teamColor !== 'blue' && localStorage.getItem('gameMode') === 'bot'){
                setTimeout(() => {
                    rollDiceButtonForBot()
                }, 1000);
            }
        }else {
            rollDiceButton.disabled = true;
            localStorage.setItem(`${team.boardColor}Answer`, false);
            showNotification(`Mauvaise réponse ${localStorage.getItem('player2') === 'Bot' && teamColor !=='blue' ? "du Bot" : " "}`, "error");
            setTimeout(() => {
                nextTeamTurn()
            }, 2000);
        }
    } 
}

// Gestion de la réponse à unne question par un bot
function botAnswer(teamColor) {
    const currentQuestion = questions[currentIndex];
    const randomOption = currentQuestion.options[Math.floor(Math.random() * currentQuestion.options.length)];
    teamAnswer(randomOption, teamColor);
}


// Gestion du tour 
const nextTeamTurn = async () => {
    prevPlayerTurnIndex = currentPlayerTurnIndex;

    if (currentPlayerTurnIndex === (playerTurns.length - 1)) {
        currentPlayerTurnIndex = 0;
    } else {
        currentPlayerTurnIndex += 1;
    }

    setPlayerTurn(prevPlayerTurnIndex, false);
    setPlayerTurn(currentPlayerTurnIndex, true)
    await delay(500);
    currentIndex = (currentIndex + 1) % questions.length;
    rollDiceButton.disabled = true
    loadQuestion()

    if (playerTurns[currentPlayerTurnIndex] !== 'blue' && localStorage.getItem('gameMode') ==='bot' ) {
        setTimeout(()=>{
            botAnswer(playerTurns[currentPlayerTurnIndex]);
        }, 1000)
    } 
}

// Gestion de l'empilement des cartes 
function getRandomCard() {
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    return `${number} ${symbol}`;
}

// Gestion de l'affichage des 16 cartes symboles
function cardBelotteCreate() {
    const card = document.createElement("div");
    card.classList.add("belotte-card");
    card.textContent = getRandomCard();
    document.querySelector(".right-zone").appendChild(card);
    addShuffleEffect();
}

// Gestion effets sur les cartes
function addShuffleEffect() {
    const cards = document.querySelectorAll(".belotte-card");
    cards.forEach(card => {
        card.classList.add("shuffle");
        setTimeout(() => card.classList.remove("shuffle"), 500);
    });
}

function moveCard(card) {
    const leftZone = document.querySelector("#card-container");
    const rightZone = document.querySelector(".right-zone");

    const clone = card.cloneNode(true);
    document.getElementById('card-container').appendChild(clone);
    clone.classList.add("moving");

    setTimeout(() => {
        leftZone.removeChild(clone);
    }, 1000);

    setTimeout(() => {
        rightZone.removeChild(card);
    }, 1200);
}

// Ajout des 16 Cartes symboles empillés
for (let i = 0; i < 15; i++) {
    cardBelotteCreate();
}


// Création de cartes en fonction des symboles
function createCard(value, symbol) {
    console.log("valeur:", value, "symbol", symbol)
    const symbols = { 1: "A", 11: "J", 12: "Q", 13: "K" };
    const cardValue = symbols[value] || value;

    const card = document.createElement("div");
    card.classList.add("symbolCard");

    const topLeft = document.createElement("div");
    topLeft.classList.add("corner", "top-left");
    topLeft.innerHTML = `${cardValue} <br> ${symbol}`;

    const center = document.createElement("div");
    center.classList.add("center");
    center.innerHTML = symbol;

    const bottomRight = document.createElement("div");
    bottomRight.classList.add("corner", "bottom-right");
    bottomRight.innerHTML = `${cardValue} <br> ${symbol}`;

    card.appendChild(topLeft);
    card.appendChild(center);
    card.appendChild(bottomRight);

    const container = document.getElementById("card-container");
    container.appendChild(card);
}

// Gestion de l'affichage des carte bonus
// const showDangerBonusCard = (bonus, piece) => {
//     const symbols = {
//         'r9': '☠',
//         'y9': '♦', 
//         'g9': '♥',
//         'b9': '♣'  
//     };

//     console.log("dss", symbols[piece])

//     if (symbols[piece] && bonus >= 5 && bonus <= 10) {
//         addShuffleEffect()
         
//         setTimeout(()=>{
//             moveCard(document.querySelector('.belotte-card:first-child'));
//             setTimeout(()=> { createCard(bonus, symbols[piece])}, 1500)
//             document.getElementById('card').style.display = 'none';
//             document.getElementById('card-container').style.display = 'flex';

//         }, 2000 )
//     }
// };

const showDangerBonusCard = (bonus, piece) => {
    const symbols = {
        'r9': '☠',
        'y9': '♦', 
        'g9': '♥',
        'b9': '♣'  
    };


    if (symbols[piece] && bonus) {
        addShuffleEffect();
        setTimeout(() => {
            moveCard(document.querySelector('.belotte-card:first-child'));

            setTimeout(() => { 
                bonusText.innerText = `+ ${bonus}`;
                bonusText.classList.add('bonus');
                createCard(bonus, symbols[piece]);
                document.getElementById('card').style.display = 'none';
                document.getElementById('card-container').style.display = 'flex';

                setTimeout(() => {
                    document.getElementById("sidebarHeader").remove();
                    document.getElementById("card-container").remove();
                    document.getElementById('card').style.display = 'flex';
                    nextTeamTurn();
                }, 5000);

            }, 1500);
        }, 2000);
    }
};


const giveArrayForMovingPath = (piece) => {
    let totalSteps = diceResult;
    const currentPlayer = boardDetails.find(team => team.boardColor === playerTurns[currentPlayerTurnIndex]);
    const specialActions = {
        'r9': () => { 
            if (currentPlayer.hasAnswer === 'true') {
                totalSteps = Math.floor(Math.random() * 5) + 5; 
                showDangerBonusCard(totalSteps, piece.position);
            } else {
                totalSteps = -4;
            }
        },
        'y9': () => { 
            if (currentPlayer.hasAnswer) {
                totalSteps = Math.floor(Math.random() * 5) + 5; 
                showDangerBonusCard(totalSteps + 1, piece.position);
            } else {
                totalSteps = 0;
            } 
        },
        'g9': () => {if (currentPlayer.hasAnswer) {
            totalSteps = Math.floor(Math.random() * 5) + 5; 
            showDangerBonusCard(totalSteps + 1, piece.position);
        } else {
            totalSteps = 0
        }
        },
        'b9': () => { 
            if (currentPlayer.hasAnswer) {
                totalSteps += Math.floor(Math.random() * 5) + 5; 
                showDangerBonusCard(totalSteps, piece.position);
            } else {
                totalSteps =-1
            }
        }
    };

    if (specialActions[piece.position]) {
        specialActions[piece.position]();
    }

    return calculateMovingPath(piece, totalSteps);
};

// Fonction pour calculer le déplacement
const calculateMovingPath = (piece, steps) => {
    let movingArray = [];
    let indexOfPath;

    if (!pathArray.includes(piece.position)) {
        let homePathArrayForPiece = homePathEntries[piece.team];
        indexOfPath = homePathArrayForPiece.findIndex(elem => elem === piece.position);

        for (let i = 0; i < Math.abs(steps); i++) {
            if (steps > 0 && indexOfPath + 1 < homePathArrayForPiece.length) {
                indexOfPath++;
            } else if (steps < 0 && indexOfPath > 0) {
                indexOfPath--;
            } else {
                break;
            }
            movingArray.push(homePathArrayForPiece[indexOfPath]);
        }
    } else {
        indexOfPath = pathArray.findIndex(elem => elem === piece.position);

        for (let i = 0; i < Math.abs(steps); i++) {
            if (steps > 0) {
                indexOfPath = (indexOfPath + 1) % pathArray.length;
            } else {
                indexOfPath = (indexOfPath - 1 + pathArray.length) % pathArray.length;
            }
            movingArray.push(pathArray[indexOfPath]);
        }
    }

    return steps > 0 ? movingArray : movingArray.reverse();
};



const moveElementSequentially = (elementId, array) => {
    const elementToMove = document.querySelector(`[piece_id="${elementId}"]`);
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
    let piece = playerPieces.find(obj => obj.id === elementId);
    let toBreak = false;

    //Function to move the element to the next target
    function moveToNextTarget(index) {
        if (index >= array.length) return;

        const currentTarget = document.getElementById(array[index]) || false;

        // Play the audio if duration is less than 185ms
        if (movePieceAudio.duration < 0.185) {
            movePieceAudio.currentTime = 0; // Reset the audio
            movePieceAudio.play();
        }

        if (array[index] === 'home') {
            let indexOfPiece = playerPieces.findIndex(obj => obj.id === piece.id);
            playerPieces.splice(indexOfPiece, 1);
            elementToMove.remove();
            toBreak = true;
            let totalPiecesOfThisTeam = playerPieces.filter((obj) => obj.team === currentTeamTurn)
            if (totalPiecesOfThisTeam.length === 0) {
                declareWinner(currentTeamTurn);
                return;
            }
            currentPlayerTurnStatus = true;
            return;
        }

        piece.updatePosition(array[index]);

        //Append the element to the current target
        currentTarget.appendChild(elementToMove);

        setTimeout(() => {
            moveToNextTarget(index + 1);
        }, 170);
    }

    !toBreak && moveToNextTarget(0);
}

// Lancement du dé par le Bot
const rollMyDice = async (hasBonus) => {
    currentPlayerTurnStatus = true;
    await delay(700);
    if (diceResult === 6 || hasBonus || teamHasBonus) {
        rollDiceButtonForBot();
    } else {
        nextTeamTurn();
        if (playerTurns[currentPlayerTurnIndex] !== 'blue') rollDiceButtonForBot();
    }
}

// Déplacement du dé 
const moveMyPiece = async (piece) => {
    let array = giveArrayForMovingPath(piece);

    if (array.length < diceResult) {
        await delay(500);
        currentPlayerTurnStatus = true;
        nextTeamTurn();
        return false;
    }

    piece.movePiece(array);
    await delay(array.length * 185);
    rollMyDice();
    return true; //Return true if move was performed;
}

const giveEnemiesBehindMe = (piece) => {
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
    let indexOfPath = pathArray.findIndex(elem => elem === piece.position);
    if (!indexOfPath) {
        return 0;
    }
    let lastSixPath = [];

    for (let i = 6; i > 0; i--) {
        let index = (indexOfPath - i + pathArray.length) % pathArray.length;
        lastSixPath.push(pathArray[index]);
    }

    let opponentsOnPath = playerPieces.filter(obj => lastSixPath.includes(obj.position) && obj.team !== currentTeamTurn);

    return opponentsOnPath.length;
}


const turnForBot = async () => {
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
    let totalUnlockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 1);
    let totalPiecesOfThisTeam = playerPieces.filter(obj => obj.team === currentTeamTurn).length;
    let isMoving = false;

    if (totalUnlockedPieces.length === 0 && diceResult !== 6) {
        rollMyDice();
        return
    }

    currentPlayerTurnStatus = true;
    let piece_team = playerPieces.filter(obj => obj.team === currentTeamTurn);

    //Condition when the bot has 0 pieces unlocked!
    if (totalUnlockedPieces.length === 0 && diceResult === 6) {
        piece_team[0].unlockPiece();
        rollMyDice();
        return
    }

    //logic for kill detection
    let opponentPieces = playerPieces.filter(obj => obj.team !== currentTeamTurn && obj.status === 1);
    let bonusReached = false;

    for (let i = 0; i < totalUnlockedPieces.length; i++) {
        if (bonusReached) {
            break;
        }

        let array = giveArrayForMovingPath(totalUnlockedPieces[i]);
        let cut = opponentPieces.find(obj => obj.position === array[array.length - 1] && !safePaths.includes(obj.position));
        let homeBonusReached = array[array.length - 1] === 'home'; //If the last path is home
        if (cut) {
            totalUnlockedPieces[i].movePiece(array);
            await delay(array.length * 185);
            cut.sentMeToBoard();
            bonusReached = true;
            rollMyDice(true);
            return
        }
        if (homeBonusReached) {
            totalUnlockedPieces[i].movePiece(array);
            await delay(array.length * 185);
            bonusReached = true;
            rollMyDice(true);
        }
    }

    if (bonusReached) {
        return;
    }



    let lockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 0);

    const attemptMove = async (piece) => {
        if (!await moveMyPiece(piece)) {
            return false;
        }
        isMoving = true;
        return true;
    }

    //Condition when the bot has 1 unlocked piece
    if (totalUnlockedPieces.length === 1) {
        if (totalUnlockedPieces.length <= 3 && diceResult === 6) {
            lockedPieces[0].unlockPiece();
            rollMyDice();
            return
        }
        let piece = totalUnlockedPieces.find(obj => obj.status === 1);
        if (!await attemptMove(piece));
    }


    //Condition when the bot has 2 pieces unlocked
    if (totalUnlockedPieces.length === 2) {
        if (totalUnlockedPieces.length <= 3 && diceResult === 6 && totalPiecesOfThisTeam >= 3) {
            lockedPieces[0].unlockPiece();
            rollDiceButtonForBot();
            return;
        }

        let pieceSafe = totalUnlockedPieces.filter(obj => safePaths.includes(obj.position));
        let pieceUnSafe = totalUnlockedPieces.filter(obj => !safePaths.includes(obj.position));

        if (pieceSafe.length === 0) {
            let scoreOfFirstPiece = pieceUnSafe[0].score;
            let scoreOfSecondPiece = pieceUnSafe[1].score;

            if (scoreOfSecondPiece > scoreOfFirstPiece) {
                if (!await attemptMove(pieceUnSafe[1])) return; // Move the element with higher score
            } else {
                if (!await attemptMove(pieceUnSafe[0])) return; // Move the element with higher score
            }
        }

        if (pieceSafe.length === 1) {
            if (!await attemptMove(pieceUnSafe[0])) return;
        }

        if (pieceSafe.length === 2 && pieceSafe[0].position === pieceSafe[1].position) {
            if (!await attemptMove(pieceSafe[0])) return;
        }

        if (pieceSafe.length === 2) {
            let scoreOfFirstPiece = pieceSafe[0].score;
            let opponentsBeforeFirstPiece = giveEnemiesBehindMe(pieceSafe[0]);

            let scoreOfSecondPiece = pieceSafe[1].score;
            let opponentsBeforeSecondPiece = giveEnemiesBehindMe(pieceSafe[1]);

            if (opponentsBeforeFirstPiece > opponentsBeforeSecondPiece) {
                if (!await attemptMove(pieceSafe[1])) return;
            } else if (opponentsBeforeSecondPiece > opponentsBeforeFirstPiece) {
                if (!await attemptMove(pieceSafe[0])) return;
            } else if (opponentsBeforeFirstPiece === opponentsBeforeSecondPiece) {
                if (scoreOfSecondPiece > scoreOfFirstPiece) {
                    if (!await attemptMove(pieceSafe[1])) return;
                } else {
                    if (!await attemptMove(pieceSafe[0])) return;
                }
            }
        }
    }

    //Condition when the bot has 3 pieces unlocked
    if (totalUnlockedPieces.length === 3) {
        let pieceSafe = totalUnlockedPieces.filter(obj => safePaths.includes(obj.position));
        let pieceUnSafe = totalUnlockedPieces.filter(obj => !safePaths.includes(obj.position));

        if (pieceSafe.length === 0) {
            let scoreOfFirstPiece = pieceUnSafe[0].score;
            let scoreOfSecondPiece = pieceUnSafe[1].score;
            let scoreOfThirdPiece = pieceUnSafe[2].score;

            let greatestScore = Math.max(scoreOfFirstPiece, scoreOfSecondPiece, scoreOfThirdPiece);
            let movingPiece = pieceUnSafe.find(obj => obj.score === greatestScore);
            if (!await attemptMove(movingPiece)) return;
        }

        if (pieceSafe.length === 1) { //1 piece is safe and other 2 are unsafe
            let scoreOfFirstPiece = pieceUnSafe[0].score;
            let scoreOfSecondPiece = pieceUnSafe[1].score;

            if (scoreOfSecondPiece > scoreOfFirstPiece) {
                if (!await attemptMove(pieceUnSafe[1])) return; // Move the element with higher score
            } else {
                if (!await attemptMove(pieceUnSafe[0])) return; // Move the element with higher score
            }
        }

        if (pieceSafe.length === 3 && pieceSafe[0].position === pieceSafe[1].position === pieceSafe[2].position) {
            if (!await attemptMove(pieceSafe[0])) return;
        }

        if (pieceSafe.length === 2) {
            if (!await attemptMove(pieceUnSafe[0])) return;
        }

        if (pieceSafe.length === 3) {
            let opponentsBeforeFirstPiece = giveEnemiesBehindMe(pieceSafe[0]);
            let opponentsBeforeSecondPiece = giveEnemiesBehindMe(pieceSafe[1]);
            let opponentsBeforeThirdPiece = giveEnemiesBehindMe(pieceSafe[2]);

            if (opponentsBeforeFirstPiece < opponentsBeforeSecondPiece && opponentsBeforeFirstPiece < opponentsBeforeThirdPiece) {
                if (!await attemptMove(pieceSafe[0])) return;
            } else if (opponentsBeforeSecondPiece < opponentsBeforeFirstPiece && opponentsBeforeSecondPiece < opponentsBeforeThirdPiece) {
                if (!await attemptMove(pieceSafe[1])) return;
            } else if (opponentsBeforeThirdPiece < opponentsBeforeFirstPiece && opponentsBeforeThirdPiece < opponentsBeforeSecondPiece) {
                if (!await attemptMove(pieceSafe[2])) return;
            } else {
                let piecesAtHomePath = piece_team.filter((obj) => obj.status === 1 && homePathArray.includes(obj.position));
                let piecesNotAtHomePath = piece_team.filter((obj) => obj.status === 1 && !homePathArray.includes(obj.position));

                piecesNotAtHomePath.sort((a, b) => a.score - b.score);

                if (piecesNotAtHomePath.length > 0) {
                    if (!await attemptMove(piecesNotAtHomePath[0])) return;
                } else {
                    for (let i = 0; i < piecesAtHomePath; i++) {
                        let movingPathArray = giveArrayForMovingPath(piecesAtHomePath[i]);
                        if (movingPathArray.length === diceResult) {
                            isMoving = true;
                            moveMyPiece(piecesAtHomePath[i]);
                            break;
                        }
                    }
                }
            }
        }
    }
    if (!isMoving) {
        nextTeamTurn();
    }
}

const turnForUserAll = async (e) => {
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];


    //If user has any unlocked pieces
    let totalUnlockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 1).length;

    let piece = playerPieces.find((obj => obj.id === e.target.getAttribute('piece_id') && obj.team === currentTeamTurn));
    let opponentPieces = playerPieces.filter(obj => obj.team !== currentTeamTurn && obj.status === 1);
    let array = giveArrayForMovingPath(piece);

    let cut = opponentPieces.find(obj => obj.position === array[array.length - 1] && !safePaths.includes(obj.position));


    if (cut) {
        piece.movePiece(array);
        await delay(array.length * 185);
        cut.sentMeToBoard();
        currentPlayerTurnStatus = true;
        return
    }



    if (array.length < diceResult) {
        await delay(500);
        currentPlayerTurnStatus = true;
        nextTeamTurn();
        return;
    }
    if (diceResult === 6) {
        currentPlayerTurnStatus = true;
        if (piece.status === 0) {
            piece.unlockPiece();
            return
        }
        piece.movePiece(array);
    } else {
        if (piece.status === 0) {
            return
        }
        currentPlayerTurnStatus = true;
        piece.movePiece(array);
        await delay(array.length * 185);
        if (!teamHasBonus) {
            nextTeamTurn();
        }
    }
}

// Déplacement des pions des joueurs actifs
const turnForUser = async (e) => {

    let isUserTurn = playerTurns[currentPlayerTurnIndex] = 'blue' ;
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

    //Return user if user has used it chance or the current turn is not for user
    if (!isUserTurn || currentPlayerTurnStatus) {
        return
    }

    //If user has any unlocked pieces
    let totalUnlockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 1).length;

    let piece = playerPieces.find((obj => obj.id === e.target.getAttribute('piece_id') && obj.team === currentTeamTurn));
    let opponentPieces = playerPieces.filter(obj => obj.team !== currentTeamTurn && obj.status === 1);
    let array = giveArrayForMovingPath(piece);

    let cut = opponentPieces.find(obj => obj.position === array[array.length - 1] && !safePaths.includes(obj.position));


    if (cut) {
        piece.movePiece(array);
        await delay(array.length * 185);
        cut.sentMeToBoard();
        currentPlayerTurnStatus = true;
        return
    }



    if (array.length < diceResult) {
        await delay(500);
        currentPlayerTurnStatus = true;
        nextTeamTurn();
        return;
    }
    if (diceResult === 6) {
        currentPlayerTurnStatus = true;
        if (piece.status === 0) {
            piece.unlockPiece();
            return
        }
        piece.movePiece(array);
    } else {
        if (piece.status === 0) {
            return
        }
        currentPlayerTurnStatus = true;
        piece.movePiece(array);
        await delay(array.length * 185);
        if (!teamHasBonus) {
            nextTeamTurn();
        }
    }
}


const rollDiceGif = new Image();
rollDiceGif.src = `./Assets/rollDice.gif`;

rollDiceButton.addEventListener('click', async () => {
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

    if (!currentPlayerTurnStatus) return; 

    rollDiceButton.disabled = true;
    rollDice.src = rollDiceGif.src;
    diceResult =  (Math.floor(Math.random() * 6) + 1);
    diceRollAudio.play()
    currentPlayerTurnStatus = false; 
    teamHasBonus = false;

    setTimeout(async () => {
        rollDice.src = `./Assets/Dice_${diceResult}.png`;

        await delay(700);
        rollDiceButton.disabled = false;

        let totalUnlockedPieces = playerPieces.filter(obj => obj.team === currentTeamTurn && obj.status === 1);

        if ((totalUnlockedPieces.length === 0 && diceResult !== 6 && !teamHasBonus)) {
            await delay(500);
            currentPlayerTurnStatus = true;
            nextTeamTurn();
        }

    }, 600);
})

// Lancement du dé par le joueur bot
const rollDiceButtonForBot = () => {
    if (!currentPlayerTurnStatus) return; 
    rollDice.src = rollDiceGif.src;
    diceResult = Math.floor(Math.random() * 6) + 1;
    currentPlayerTurnStatus = false; 
    teamHasBonus = false;
    diceRollAudio.play();

    setTimeout(async () => {
        rollDice.src = `./Assets/Dice_${diceResult}.png`;
        await delay(700);
        rollDiceButton.disabled = false;
        turnForBot();

    }, 600);
}


document.addEventListener('keydown', (e) => {
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

    if (currentTeamTurn !== 'blue') {
        return
    }

    if (e.key === '1') {
        let piece = document.querySelector(`[myPieceNum="1"]`);
        piece?.click()
    }
    if (e.key === '2') {
        let piece = document.querySelector(`[myPieceNum="2"]`);
        piece?.click()
    }
    if (e.key === '3') {
        let piece = document.querySelector(`[myPieceNum="3"]`);
        piece?.click()
    }
    if (e.key === '4') {
        let piece = document.querySelector(`[myPieceNum="4"]`);
        piece?.click()
    }

    if (e.code === 'Space') {
        rollDiceButton.click();
    }
});

// document.getElementById('hamburgerMenu').addEventListener("click", () => {
//     const settingsSidebar = document.getElementById("settingsSidebar");
//     const closeSidebarBtn = document.getElementById("closeSidebar");
//     const settingsContent = document.getElementById("settingsContent");

//     // Fonction pour récupérer les données du localStorage
//     const loadSettings = () => {
//         settingsContent.innerHTML = ""; // Vider le contenu actuel
//         for (let i = 0; i < localStorage.length; i++) {
//             const key = localStorage.key(i);
//             const value = localStorage.getItem(key);
//             const settingItem = document.createElement("p");
//             settingItem.textContent = `${key}: ${value}`;
//             settingsContent.appendChild(settingItem);
//         }
//     };

//     // Ouvrir la sidebar
//         settingsSidebar.style.display = "flex";
//         loadSettings(); 


//     // Fermer la sidebar
//     closeSidebarBtn.addEventListener("click", () => {
//         settingsSidebar.style.display = "none";
//     });
// });

document.getElementById('hamburgerMenu').addEventListener("click", () => {
    const settingsSidebar = document.getElementById("settingsSidebar");
    const closeSidebarBtn = document.getElementById("closeSidebar");
    const settingsContent = document.getElementById("settingsContent");

    const loadSettings = () => {
        settingsContent.innerHTML = ""; 
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);

            const settingItem = document.createElement("div");
            settingItem.classList.add("setting-item");

            const settingKey = document.createElement("p");
            settingKey.classList.add("setting-key");
            settingKey.textContent = key;

            const settingValue = document.createElement("p");
            settingValue.classList.add("setting-value");
            settingValue.textContent = value;

            if(key ==="gameMode" || key === "gameLevel" || key === "player1" || key === "player2") {
                settingItem.appendChild(settingKey);
                settingItem.appendChild(settingValue);
                settingsContent.appendChild(settingItem);

                if(key ==="gameMode") {
                    settingKey.textContent = "Mode du jeu"
                }

                if(key ==="gameLevel") {
                    settingKey.textContent = "Niveau"
                }

                if(key ==="player1") {
                    settingKey.textContent = "Joueur 1"
                }

                if(key ==="player2") {
                    settingKey.textContent = "Joueur 2"
                }
    
            }
        }
    };
    settingsSidebar.classList.add("open");
    loadSettings();
    closeSidebarBtn.addEventListener("click", () => {
        settingsSidebar.classList.remove("open");
    });
});

document.getElementById("suspendGameBtn").addEventListener("click", () => {
    

    const suspendModal = document.getElementById("suspendModal");
    const confirmSuspend = document.getElementById("confirmSuspend");
    const cancelSuspend = document.getElementById("cancelSuspend");

    suspendModal.style.display = "flex";

    confirmSuspend.addEventListener("click", () => {
        suspendModal.style.display = "none";
        setTimeout(()=> window.location = "index", 1500);
    });

    cancelSuspend.addEventListener("click", () => {
        suspendModal.style.display = "none";
    });
});


const declareWinner = (team) => {
    let parentDiv = document.createElement('div');
    let childDiv = document.createElement('div');
    let h1 = document.createElement('h1');
    let button = document.createElement('button');

    parentDiv.setAttribute('id', 'declaredWinner');

    h1.textContent = `${team} Won The Game!`;

    button.textContent = 'Play Again';
    button.addEventListener('click', () => {
        location.reload();
    })
    childDiv.append(h1);
    childDiv.append(button);
    parentDiv.append(childDiv);
    document.body.append(parentDiv);


    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}


var count = 200;
var defaults = {
    origin: { y: 0.7 }
};

function fire(particleRatio, opts) {
    confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
    });
}