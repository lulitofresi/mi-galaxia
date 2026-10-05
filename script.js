/* =========================================
   PANTALLA DE ENTRADA
========================================= */

const welcomeScreen =
    document.getElementById("welcomeScreen");

const enterButton =
    document.getElementById("enterButton");

let universeEntered = false;


/* =========================================
   ELEMENTOS
========================================= */

const galaxy =
    document.getElementById("galaxy");

const scene =
    document.getElementById("scene");

const stars =
    document.querySelectorAll(".star");

const constellation =
    document.getElementById("constellation");

const constellationLines =
    document.querySelectorAll(
        ".constellation line"
    );

const secretStar =
    document.getElementById("secretStar");

const progressNumber =
    document.getElementById(
        "progressNumber"
    );

const zoomOverlay =
    document.getElementById(
        "zoomOverlay"
    );

const zoomStar =
    document.getElementById(
        "zoomStar"
    );

const messageOverlay =
    document.getElementById(
        "messageOverlay"
    );

const messageTitle =
    document.getElementById(
        "messageTitle"
    );

const messageText =
    document.getElementById(
        "messageText"
    );

const closeButton =
    document.getElementById(
        "closeButton"
    );


/* =========================================
   MÚSICA
========================================= */

const backgroundMusic =
    document.getElementById(
        "backgroundMusic"
    );

const musicButton =
    document.getElementById(
        "musicButton"
    );

const musicText =
    document.getElementById(
        "musicText"
    );

let musicStarted = false;
let musicPlaying = false;
let fadeInterval = null;

backgroundMusic.volume = 0;


/* =========================================
   INICIAR MÚSICA
========================================= */

function startMusic() {

    if (musicStarted) {
        return;
    }

    musicStarted = true;

    backgroundMusic.volume = 0;

    const playPromise =
        backgroundMusic.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                musicPlaying = true;

                musicButton.classList.add(
                    "playing"
                );

                musicText.textContent =
                    "Música";

                fadeInMusic();

            })
            .catch(() => {

                musicStarted = false;
                musicPlaying = false;

                console.log(
                    "No se pudo reproducir la música."
                );

            });
    }
}


/* =========================================
   FADE IN
========================================= */

function fadeInMusic() {

    clearInterval(fadeInterval);

    let volume =
        backgroundMusic.volume;

    fadeInterval =
        setInterval(() => {

            volume += 0.015;

            if (volume >= 0.35) {

                volume = 0.35;

                clearInterval(
                    fadeInterval
                );
            }

            backgroundMusic.volume =
                volume;

        }, 100);
}


/* =========================================
   FADE OUT
========================================= */

function fadeOutMusic() {

    clearInterval(fadeInterval);

    let volume =
        backgroundMusic.volume;

    fadeInterval =
        setInterval(() => {

            volume -= 0.02;

            if (volume <= 0) {

                volume = 0;

                clearInterval(
                    fadeInterval
                );

                backgroundMusic.pause();
            }

            backgroundMusic.volume =
                volume;

        }, 60);
}


/* =========================================
   ENTRAR AL UNIVERSO
========================================= */

function enterUniverse() {

    if (universeEntered) {
        return;
    }

    universeEntered = true;

    enterButton.disabled = true;

    const buttonText =
        enterButton.querySelector(
            "span"
        );

    if (buttonText) {
        buttonText.textContent =
            "ABRIENDO...";
    }

    /*
        La música comienza aquí porque
        el usuario acaba de pulsar el botón.
    */

    startMusic();

    /*
        La pantalla de entrada
        desaparece lentamente.
    */

    welcomeScreen.classList.add(
        "hidden"
    );

    /*
        Después de la animación,
        eliminamos la pantalla del DOM.
    */

    setTimeout(() => {

        welcomeScreen.remove();

    }, 1600);
}


enterButton.addEventListener(
    "click",
    enterUniverse
);


/* =========================================
   BOTÓN DE MÚSICA
========================================= */

musicButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (
            backgroundMusic.paused
        ) {

            backgroundMusic
                .play()
                .then(() => {

                    musicStarted = true;
                    musicPlaying = true;

                    musicButton.classList.add(
                        "playing"
                    );

                    musicText.textContent =
                        "Música";

                    fadeInMusic();

                })
                .catch(() => {

                    console.log(
                        "No se pudo reproducir la música."
                    );

                });

        } else {

            musicPlaying = false;

            musicButton.classList.remove(
                "playing"
            );

            fadeOutMusic();
        }
    }
);


/* =========================================
   ESTADO
========================================= */

let discoveredStars =
    new Set();

let rotation = 0;
let dragging = false;
let lastX = 0;
let velocity = 0;
let zooming = false;


/* =========================================
   ROTACIÓN
========================================= */

const rotationSensitivity = 0.35;

function updateRotation() {

    scene.style.transform =
        `rotate(${rotation}deg)`;
}


/* =========================================
   CONSTELACIÓN
========================================= */

function revealConstellation(index) {

    if (index <= 0) {
        return;
    }

    const line =
        constellationLines[index - 1];

    if (!line) {
        return;
    }

    setTimeout(() => {

        line.classList.add(
            "visible"
        );

    }, 250);
}


/* =========================================
   CORAZÓN COMPLETO
========================================= */

function completeConstellation() {

    constellation.classList.add(
        "complete"
    );
}


/* =========================================
   PROGRESO
========================================= */

function updateProgress() {

    progressNumber.textContent =
        discoveredStars.size;
}


/* =========================================
   MOSTRAR MENSAJE
========================================= */

function showMessage(star) {

    messageTitle.textContent =
        star.dataset.title;

    messageText.textContent =
        star.dataset.message;

    messageOverlay.classList.add(
        "active"
    );
}


/* =========================================
   ZOOM HACIA ESTRELLA
========================================= */

function zoomToStar(star) {

    if (zooming) {
        return;
    }

    zooming = true;

    galaxy.classList.add(
        "zooming"
    );

    zoomOverlay.classList.remove(
        "active"
    );

    void zoomOverlay.offsetWidth;

    const rect =
        star.getBoundingClientRect();

    zoomStar.style.left =
        `${rect.left + rect.width / 2}px`;

    zoomStar.style.top =
        `${rect.top + rect.height / 2}px`;

    zoomOverlay.classList.add(
        "active"
    );

    setTimeout(() => {

        showMessage(star);

    }, 900);

    setTimeout(() => {

        zoomOverlay.classList.remove(
            "active"
        );

        galaxy.classList.remove(
            "zooming"
        );

        zooming = false;

    }, 1450);
}


/* =========================================
   CLIC EN LAS 6 ESTRELLAS
========================================= */

stars.forEach((star) => {

    star.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            if (zooming) {
                return;
            }

            const id =
                star.dataset.id;

            /*
                Si es la primera vez que
                encontramos esta estrella,
                la marcamos como descubierta.
            */

            if (
                !discoveredStars.has(id)
            ) {

                discoveredStars.add(id);

                star.classList.add(
                    "discovered"
                );

                updateProgress();

                revealConstellation(
                    discoveredStars.size
                );
            }


            /*
                Cuando las 6 estrellas
                han sido descubiertas...
            */

            if (
                discoveredStars.size ===
                stars.length
            ) {

                setTimeout(() => {

                    completeConstellation();

                }, 900);


                setTimeout(() => {

                    secretStar.classList.add(
                        "unlocked"
                    );

                }, 1800);
            }


            /*
                Hacemos zoom hacia
                la estrella seleccionada.
            */

            zoomToStar(star);
        }
    );

});


/* =========================================
   ESTRELLA SECRETA
========================================= */

secretStar.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (zooming) {
            return;
        }

        zooming = true;

        galaxy.classList.add(
            "zooming"
        );

        zoomOverlay.classList.remove(
            "active"
        );

        void zoomOverlay.offsetWidth;

        const rect =
            secretStar.getBoundingClientRect();

        zoomStar.style.left =
            `${rect.left + rect.width / 2}px`;

        zoomStar.style.top =
            `${rect.top + rect.height / 2}px`;

        zoomOverlay.classList.add(
            "active"
        );

        setTimeout(() => {

            messageTitle.textContent =
                secretStar.dataset.title;

            messageText.textContent =
                secretStar.dataset.message;

            messageOverlay.classList.add(
                "active"
            );

        }, 900);

        setTimeout(() => {

            zoomOverlay.classList.remove(
                "active"
            );

            galaxy.classList.remove(
                "zooming"
            );

            zooming = false;

        }, 1450);
    }
);


/* =========================================
   CERRAR MENSAJE
========================================= */

function closeMessage() {

    messageOverlay.classList.remove(
        "active"
    );
}


closeButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        closeMessage();
    }
);


messageOverlay.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            messageOverlay
        ) {

            closeMessage();
        }
    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeMessage();
        }
    }
);


/* =========================================
   ROTACIÓN CON MOUSE / DEDO
========================================= */

galaxy.addEventListener(
    "pointerdown",
    (event) => {

        /*
            No comenzar el giro cuando
            hacemos clic en una estrella
            o en el botón de música.
        */

        if (
            event.target.closest(
                ".star"
            ) ||
            event.target.closest(
                ".secret-star"
            ) ||
            event.target.closest(
                ".music-button"
            )
        ) {

            return;
        }


        if (
            messageOverlay.classList.contains(
                "active"
            )
        ) {

            return;
        }


        dragging = true;

        lastX =
            event.clientX;

        velocity = 0;

        galaxy.classList.add(
            "dragging"
        );


        try {

            galaxy.setPointerCapture(
                event.pointerId
            );

        } catch (error) {
        }
    }
);


galaxy.addEventListener(
    "pointermove",
    (event) => {

        if (!dragging) {
            return;
        }

        const currentX =
            event.clientX;

        const difference =
            currentX - lastX;

        rotation +=
            difference *
            rotationSensitivity;

        velocity =
            difference *
            rotationSensitivity;

        lastX =
            currentX;

        updateRotation();
    }
);


/* =========================================
   TERMINAR GIRO
========================================= */

function stopDragging(event) {

    if (!dragging) {
        return;
    }

    dragging = false;

    galaxy.classList.remove(
        "dragging"
    );


    try {

        galaxy.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {
    }
}


galaxy.addEventListener(
    "pointerup",
    stopDragging
);


galaxy.addEventListener(
    "pointercancel",
    stopDragging
);


/* =========================================
   INERCIA
========================================= */

function inertia() {

    if (
        !dragging &&
        Math.abs(velocity) > 0.01
    ) {

        rotation += velocity;

        velocity *= 0.94;

        updateRotation();
    }

    requestAnimationFrame(
        inertia
    );
}

inertia();


/* =========================================
   EVITAR GIRO DESDE ESTRELLAS
========================================= */

stars.forEach((star) => {

    star.addEventListener(
        "pointerdown",
        (event) => {

            event.stopPropagation();
        }
    );

});


secretStar.addEventListener(
    "pointerdown",
    (event) => {

        event.stopPropagation();
    }
);


/* =========================================
   TECLA R — REINICIAR ROTACIÓN
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key.toLowerCase() === "r" &&
            !messageOverlay.classList.contains(
                "active"
            )
        ) {

            rotation = 0;

            velocity = 0;

            updateRotation();
        }
    }
);


/* =========================================
   INICIO
========================================= */

updateRotation();

updateProgress();