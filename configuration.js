function setGameMode(mode) {
    localStorage.setItem('gameMode', mode);
    document.getElementById('playerConfig').style.display = 'flex';
    let playerFields = document.getElementById('playerFields');
    playerFields.innerHTML = ` 
        <input type="text" id="player1" placeholder="Nom du joueur ${mode === 'bot' ? " " : " 1" }">
    `;
    if (mode === 'manette') {
        playerFields.innerHTML += `
            <input type="text" id="player2" placeholder="Nom du joueur 2">
        `;
    } else {
        localStorage.setItem('player2', 'Bot');
    }

    let buttons = document.querySelectorAll('.option-jeu');
    buttons.forEach(button => {
        button.classList.remove('selected'); 
    });

    if (mode === 'bot') {
        document.querySelector('.option-jeu:first-child').classList.add('selected');
    } else {
        document.querySelector('.option-jeu:last-child').classList.add('selected');
    }
}

function selectLevel(level) {
    localStorage.setItem('gameLevel', level);

    document.querySelectorAll('.levels img').forEach(img => img.classList.remove('selected'));
    document.querySelector(`.levels img:nth-child(${level})`).classList.add('selected');
}

function saveConfig() {
    let player1 = document.getElementById('player1').value;
    let player2 = document.getElementById('player2') ? document.getElementById('player2').value : 'Bot';

    localStorage.setItem('player1', player1);
    localStorage.setItem('player2', player2);

    if((player1 && player1 !== " ") && (player2 && player2 !== " ") && localStorage.getItem('gameLevel')){
        window.location.href = "game.html"
    }else {
        let erreurMessage = document.getElementById('erreur');
        erreurMessage.innerText = "Tous les champs doivent être remplis";
        erreurMessage.style.display = "block"; 
        setTimeout(() => {
            erreurMessage.style.display = "none"; 
        }, 1500);
    }

}