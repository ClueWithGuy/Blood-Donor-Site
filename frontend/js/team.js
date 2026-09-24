
const cards =
    document.querySelectorAll(".card");

const swipeArea =
    document.getElementById("swipeArea");

const dotsContainer =
    document.getElementById("dots");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
const SWIPE_THRESHOLD = 70;
cards.forEach((card, index) => {

    const dot =
        document.createElement("div");

    dot.classList.add("dot");

    if (index === 0) {

        dot.classList.add("active");

    }
    dot.addEventListener(
        "click",
        () => {

            currentIndex = index;

            updateCards();

        }
    );

    dotsContainer.appendChild(dot);

});


const dots =
    document.querySelectorAll(".dot");
function updateCards() {

    cards.forEach((card, index) => {

        card.classList.remove(
            "active",
            "prev-card",
            "next-card",
            "hidden-left",
            "hidden-right"
        );

        const total =
            cards.length;

        const nextIndex =
            (currentIndex + 1) % total;

        const prevIndex =
            (currentIndex - 1 + total) % total;

        if (index === currentIndex) {

            card.classList.add("active");

        }

        else if (index === prevIndex) {

            card.classList.add("prev-card");

        }

        else if (index === nextIndex) {

            card.classList.add("next-card");

        }

        else {

            const distance =
                (index - currentIndex + total)
                % total;


            if (distance <= total / 2) {

                card.classList.add(
                    "hidden-right"
                );

            }

            else {

                card.classList.add(
                    "hidden-left"
                );

            }

        }

    });

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentIndex
        );

    });

}

function nextMember() {

    currentIndex =
        (currentIndex + 1)
        % cards.length;

    updateCards();

}

function previousMember() {

    currentIndex =
        (currentIndex - 1 + cards.length)
        % cards.length;

    updateCards();

}

swipeArea.addEventListener(
    "touchstart",
    function(event) {

        if (event.touches.length !== 1) {

            return;

        }

        startX =
            event.touches[0].clientX;

        currentX =
            startX;

        isDragging = true;

        swipeArea.classList.add(
            "dragging"
        );

    },
    {
        passive: true
    }
);

swipeArea.addEventListener(
    "touchmove",
    function(event) {

        if (!isDragging) {

            return;

        }

        currentX =
            event.touches[0].clientX;


        const difference =
            currentX - startX;


        moveActiveCard(difference);

    },
    {
        passive: true
    }
);

swipeArea.addEventListener(
    "touchend",
    function() {

        if (!isDragging) {

            return;

        }


        const difference =
            currentX - startX;


        finishSwipe(difference);

    }
);

swipeArea.addEventListener(
    "mousedown",
    function(event) {

        if (event.button !== 0) {

            return;

        }
        startX =
            event.clientX;

        currentX =
            startX;

        isDragging = true;

        swipeArea.classList.add(
            "dragging"
        );
        event.preventDefault();

    }
);


/* =========================================
   MOUSE MOVE
========================================= */

window.addEventListener(
    "mousemove",
    function(event) {

        if (!isDragging) {

            return;

        }
        currentX =
            event.clientX;


        const difference =
            currentX - startX;


        moveActiveCard(difference);

    }
);

window.addEventListener(
    "mouseup",
    function() {

        if (!isDragging) {

            return;

        }
        const difference =
            currentX - startX;


        finishSwipe(difference);

    }
);

function moveActiveCard(difference) {

    const activeCard =
        document.querySelector(
            ".card.active"
        );

    if (!activeCard) {

        return;

    }

    const limited =
        Math.max(
            -220,
            Math.min(
                220,
                difference
            )
        );
    const rotation =
        limited * 0.025;

    const scale =
        1 -
        Math.min(
            Math.abs(limited) / 2500,
            0.08
        );

    activeCard.style.transition =
        "none";

    activeCard.style.transform =
`
        translate(
            calc(
                -50% +
                ${limited}px
            ),
            -50%
        )

        rotate(
            ${rotation}deg
        )

        scale(
            ${scale}
        )
        `;


    activeCard.style.opacity =

        String(
            1 -
            Math.min(
                Math.abs(limited) / 450,
                0.25
            )
        );

}
/* =========================================
   IMAGE ZOOM / MODAL LOGIC
========================================= */

// Create Modal Element dynamically
const modal = document.createElement("div");
modal.classList.add("image-modal");

const modalImg = document.createElement("img");
modalImg.alt = "Zoomed Profile";

modal.appendChild(modalImg);
document.body.appendChild(modal);

// Function to open modal
function openModal(imageSrc) {
    modalImg.src = imageSrc;
    modal.classList.add("active");
}

// Function to close modal
function closeModal() {
    if (modal.classList.contains("active")) {
        modal.classList.remove("active");
    }
}

// Attach click listener to profile images
document.querySelectorAll(".profile-image img").forEach((img) => {
    img.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents immediate close trigger
        openModal(img.src);
    });
});

// Close when clicking anywhere on screen
modal.addEventListener("click", closeModal);

// Close on pressing ANY key
document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("active")) {
        closeModal();
    }
});
function finishSwipe(difference) {

    isDragging = false;

    swipeArea.classList.remove(
        "dragging"
    );

    const activeCard =
        document.querySelector(
            ".card.active"
        );

    if (activeCard) {

        activeCard.style.transition = "";

        activeCard.style.transform = "";

        activeCard.style.opacity = "";

    }

    if (
        difference <
        -SWIPE_THRESHOLD
    ) {

        nextMember();

    }

    else if (
        difference >
        SWIPE_THRESHOLD
    ) {

        previousMember();

    }

    else {

        updateCards();

    }


    startX = 0;

    currentX = 0;

}

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousMember();

        }

        else if (
            event.key ===
            "ArrowRight"
        ) {

            nextMember();

        }

    }
);

updateCards();