const staticAKG = "v1"
const assets = [
  "/",
  "index.html",
  "configuration.html",
  "game.html",
  "introduction.html",
  "style.css",
  "script.js",
  "configuration.js",
  "introduction.js",
  "loading.js",
  "Assets/sfx/dice_roll.wav",
  "Assets/sfx/pieceMove.wav",
  "Assets/sfx/win.wav",
  "Assets/dameOpacité.png",
  "Assets/72X72.png",
  "Assets/dé.png",
  "Assets/Dice_1.png",
  "Assets/Dice_2.png",
  "Assets/Dice_3.png",
  "Assets/Dice_4.png",
  "Assets/Dice_5.png",
  "Assets/Dice_6.png",
  "Assets/image-carte2.png",
  "Assets/image1.png",
  "Assets/image2.png",
  "Assets/imageblue.png",
  "Assets/imagegreen.png",
  "Assets/interrogatePonctuation.png",
  "Assets/logo.png",
  "Assets/point-d-interrogation-or.png",
  "Assets/rollDice.gif"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticAKG).then(cache => {
      cache.addAll(assets)
    })
  )
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })