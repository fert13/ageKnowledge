let numPvP;
const setNumPvP = (num) => {
    numPvP = num;
    window.numPvP = numPvP; 
    const script = document.createElement('script');
    script.src = './script.js'; 
    script.type = 'text/javascript';
    script.async = true;

    document.body.appendChild(script);
};


window.onload = function() {
    var modal = document.getElementById("welcomeModal");
    var closeModal = document.getElementById("closeModal");

    modal.style.display = "block";

    closeModal.onclick = function() {
        localStorage.setItem('rappel', true);
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

