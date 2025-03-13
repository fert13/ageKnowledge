function setGameMode(mode) {
    localStorage.setItem('gameMode', mode);
    document.getElementById('playerConfig').style.display = 'flex';
    let playerFields = document.getElementById('playerFields');
    playerFields.innerHTML = ` 
        <input type="text" id="player1" placeholder="Nom Joueur 1">
    `;
    if (mode === 'manette') {
        playerFields.innerHTML += `
            <input type="text" id="player2" placeholder="Nom Joueur 2">
        `;
    } else {
        localStorage.setItem('player2', 'Bot');
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
        window.location.href = "animation.html"
    }else {
        return 
    }

}