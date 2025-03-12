const stackContainer = document.querySelector('.stack-container');
const cardNodes = document.querySelectorAll('.card-container');
const consoleNodes = document.querySelectorAll('.writing');
const perspecNodes = document.querySelectorAll('.perspec');
const perspec = document.querySelector('.perspec');
const card = document.querySelector('.card');

let counter = stackContainer.children.length;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

card.addEventListener('animationend', function () {
    perspecNodes.forEach(function (elem, index) {
        elem.classList.add('explode');
    });
});

perspec.addEventListener('animationend', function (e) {
    if (e.animationName === 'explode') {
        cardNodes.forEach(function (elem, index) {

            elem.classList.add('pokeup');

            elem.addEventListener('click', function () {
                let updown = [800, -800]
                let randomY = updown[Math.floor(Math.random() * updown.length)];
                let randomX = Math.floor(Math.random() * 1000) - 1000;
                elem.style.transform = `translate(${randomX}px, ${randomY}px) rotate(-540deg)`
                elem.style.transition = "transform 1s ease, opacity 2s";
                elem.style.opacity = "0";
                counter--;
                if (counter === 0) {
                    stackContainer.style.width = "0";
                    stackContainer.style.height = "0";
                }
            });
        });
    }

});