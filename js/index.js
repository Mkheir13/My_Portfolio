Node.prototype.nextNode = function() {
    var cur = this;
    while (cur = cur.nextSibling) {
        if (cur.nodeType === 1 && !cur.classList.contains('fakeContent')) {
            return cur;
        }
    }
    return null;
};

Node.prototype.firstNode = function() {
    var cur = this.firstChild;
    if (cur.nodeType === 1) {
        return cur;
    }
    else {
        return cur.nextNode();
    }
};

Element.prototype.typeAndDelete = function(options) {
    options = options || {};

    var contentList = this,
        curContent = contentList.getElementsByClassName('active')[0] || contentList.firstNode();

    // default options
    var selectTimePerWord = options.selectTimePerWord || 100,
        typeTimePerWord = options.typeTimePerWord || 150,
        delayAfterSelect = options.delayAfterSelect || 500,
        delayAfterDelete = options.delayAfterDelete || 1000,
        delayBetweenWords = options.delayBetweenWords || 3000;

    // create fake content
    var fakeContent = contentList.getElementsByClassName('fakeContent')[0];
    if (!fakeContent) {
        fakeContent = document.createElement('span');
        fakeContent.classList.add('fakeContent');
        fakeContent.classList.add('selecting');
        contentList.appendChild(fakeContent);
    }

    // selecting handler
    var selecting = function() {
        // initial fake content with the same text
        fakeContent.innerHTML = curContent.innerHTML;

        // start selecting
        var selectingAnimation = setInterval(function() {
            fakeContent.innerHTML = fakeContent.innerHTML.substring(0, fakeContent.innerHTML.length - 1);
            if (fakeContent.innerHTML.length <= 0) {
                clearInterval(selectingAnimation);

                deleting();
            }
        }, selectTimePerWord);
    };

    // deleting handler
    var deleting = function() {
        // delay, delete, and switch to the next content
        setTimeout(function() {
            fakeContent.classList.remove('selecting');
            fakeContent.classList.add('typing');
            curContent.classList.remove('active');

            curContent = curContent.nextNode() ? curContent.nextNode() : contentList.firstNode();
            curContent.classList.add('typing');
            curContent.classList.add('active');
        }, delayAfterSelect);

        // delay and start typing
        setTimeout(function() {
            typing();
        }, delayAfterDelete);
    };

    // typing handler
    var typing = function() {
        // delete fake content
        fakeContent.innerHTML = "";

        // start typing
        var typingAnimation = setInterval(function() {
            fakeContent.innerHTML = curContent.innerHTML.substring(0, fakeContent.innerHTML.length + 1);

            // stop typing
            if (fakeContent.innerHTML.length >= curContent.innerHTML.length) {
                fakeContent.classList.remove('typing');
                clearInterval(typingAnimation);

                // delay between words
                setTimeout(function() {
                    curContent.classList.remove('typing');
                    fakeContent.classList.add('selecting');
                    selecting();
                }, delayBetweenWords);
            }
        }, typeTimePerWord);
    };

    return selecting();
};

document.getElementById('content').typeAndDelete({
    delayAfterDelete: 500
});

//function that show text when the button is clicked and hide it when the button is clicked again
function showText() {
    var x = document.getElementById("content");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
const container = document.querySelector(".container");
const containerCarrousel = container.querySelector(".container-carrousel");
const carrousel = container.querySelector(".carrousel");
const carrouselItems = carrousel.querySelectorAll(".carrousel-item");

let isMouseDown = false;
let currentMousePos = 0;
let lastMousePos = 0;
let lastMoveTo = 0;
let moveTo = 0;

const createCarrousel = () => {
    const carrouselProps = onResize();
    const length = carrouselItems.length;
    const degress = 360 / length;
    const gap = 10; //
    const tz = distanceZ(carrouselProps.w, length, gap)

    const fov = calculateFov(carrouselProps);
    const height = calculateHeight(tz);

    container.style.width = tz * 2 + gap * length + "px";
    container.style.height = height + "px";

    carrouselItems.forEach((item, i) => {
        const degressByItem = degress * i + "deg";
        item.style.setProperty("--rotatey", degressByItem);
        item.style.setProperty("--tz", tz + "px");
    });
};

// Funcion que da suavidad a la animacion
const lerp = (a, b, n) => {
    return n * (a - b) + b;
};

// https://3dtransforms.desandro.com/carousel
const distanceZ = (widthElement, length, gap) => {
    return (widthElement / 2) / Math.tan(Math.PI / length) + gap; // Distancia Z de los items
}

// Calcula el alto del contenedor usando el campo de vision y la distancia de la perspectiva
const calculateHeight = z => {
    const t = Math.atan(90 * Math.PI / 180 / 2);
    const height = t * 2 * z;

    return height;
};

// Calcula el campo de vision del carrousel
const calculateFov = carrouselProps => {
    const perspective = window
        .getComputedStyle(containerCarrousel)
        .perspective.split("px")[0];

    const length =
        Math.sqrt(carrouselProps.w * carrouselProps.w) +
        Math.sqrt(carrouselProps.h * carrouselProps.h);
    const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
    return fov;
};

// Obtiene la posicion X y evalua si la posicion es derecha o izquierda
const getPosX = x => {
    currentMousePos = x;

    moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;

    lastMousePos = currentMousePos;
};

const update = () => {
    lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
    carrousel.style.setProperty("--rotatey", lastMoveTo + "deg");

    requestAnimationFrame(update);
};

const onResize = () => {
    // Obtiene la propiedades del tamaño de carrousel
    const boundingCarrousel = containerCarrousel.getBoundingClientRect();

    const carrouselProps = {
        w: boundingCarrousel.width,
        h: boundingCarrousel.height
    };

    return carrouselProps;
};

const initEvents = () => {
    // Eventos del mouse
    carrousel.addEventListener("mousedown", () => {
        isMouseDown = true;
        carrousel.style.cursor = "grabbing";
    });
    carrousel.addEventListener("mouseup", () => {
        isMouseDown = false;
        carrousel.style.cursor = "grab";
    });
    container.addEventListener("mouseleave", () => (isMouseDown = false));

    carrousel.addEventListener(
        "mousemove",
        e => isMouseDown && getPosX(e.clientX)
    );

    // Eventos del touch
    carrousel.addEventListener("touchstart", () => {
        isMouseDown = true;
        carrousel.style.cursor = "grabbing";
    });
    carrousel.addEventListener("touchend", () => {
        isMouseDown = false;
        carrousel.style.cursor = "grab";
    });
    container.addEventListener(
        "touchmove",
        e => isMouseDown && getPosX(e.touches[0].clientX)
    );

    window.addEventListener("resize", createCarrousel);

    update();
    createCarrousel();
};

initEvents();




