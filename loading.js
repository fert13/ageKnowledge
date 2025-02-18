
document.addEventListener("DOMContentLoaded", function() {
    let textElement = document.getElementById("typingText");
    let text = textElement.innerText;
    textElement.innerText = "";
    
    let index = 0;
    function typeLetter() {
        if (index < text.length) {
            textElement.innerHTML += text[index];
            index++;
            setTimeout(typeLetter, 100); 
        }
    }
    typeLetter()
});


document.getElementById("playButton").addEventListener("click", function () {
    const box = document.querySelector(".box");
    const box2 = document.querySelector(".box2");

    // Ajoute la classe active pour faire tourner box et afficher box2
    box.classList.add("active");
    box.remove()
    if(box.remove()){
        box2.classList.add("active")
    }
});