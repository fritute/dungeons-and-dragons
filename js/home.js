'use strict'

const images = [
  {
    "id": 1,
    "src": "./src/img/image2.png",
    "alt": "Imagem 1"
  },
  {
    "id": 2,
    "src": "./src/img/image3.png",
    "alt": "Imagem 2"
  },
  {
    "id": 3,
    "src": "./src/img/image4.png",
    "alt": "Imagem 3"
  },
  {
    "id": 4,
    "src": "./src/img/image5.png",
    "alt": "Imagem 4"
  }
]

let currentImageIndex = 0;
document.addEventListener('DOMContentLoaded', () => {
  const imgElement = document.getElementById('central-image');
  if (imgElement) {
    imgElement.src = images[currentImageIndex].src;
    imgElement.alt = images[currentImageIndex].alt;
  }
});
function changeImage() {
  const imgElement = document.getElementById('central-image')
  if (imgElement) {
    currentImageIndex = (currentImageIndex + 1) % images.length
    imgElement.src = images[currentImageIndex].src
    imgElement.alt = images[currentImageIndex].alt
  }
}

setInterval(changeImage, 3000)