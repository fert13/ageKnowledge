document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".introduction-image");
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove("active"); 
        currentIndex = (currentIndex + 1) % images.length; 
        images[currentIndex].classList.add("active"); 
    }

    setInterval(showNextImage, 3000); 
});


document.getElementById("playButton").addEventListener("click", function () {
    const box1 = document.querySelector(".box");
    const box2 = document.querySelector(".box2");

    box1.style.display = "none";
    box2.classList.add("active");
});

document.getElementById("configuration").addEventListener("click", function () {
    window.location.href = "configuration";
});








