document.addEventListener("DOMContentLoaded", () => {

    /*
     * The old homepage depended on the onboarding screen.
     * That dependency is gone now, so the application can
     * load normally.
     */

    showApplication();

    setupMobileMenu();
    setupAuthUI();
    setupProfileButton();
    setupRequestButtons();

    loadHomeData();

    setupMobileTabNavigation();
});


/* =========================================================
   APPLICATION / SPLASH
   ========================================================= */

function showApplication() {

    const splash = document.querySelector("#splash-screen");
    const app = document.querySelector("#app");

    if (!app) {
        return;
    }

    setTimeout(() => {

        if (splash) {
            splash.classList.add("hidden");
        }

        app.classList.remove("hidden");

    }, 800);
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const burger = document.querySelector("#nav-burger");
    const drawer = document.querySelector("#mobile-drawer");

    if (!burger || !drawer) {
        return;
    }

    burger.addEventListener("click", () => {

        drawer.classList.toggle("is-open");

    });


    drawer.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            drawer.classList.remove("is-open");

        });

    });

}


/* =========================================================
   AUTH UI
   ========================================================= */

function setupAuthUI() {

    const schoolId = localStorage.getItem("school_id");
    const name = localStorage.getItem("name");

    const signIn = document.querySelector("#nav-signin");
    const register = document.querySelector("#nav-register");

    const profile = document.querySelector("#profile-chip");
    const profileInitial = document.querySelector("#profile-initial");

    const mobileAuth = document.querySelector("#mobile-auth-links");


    /*
     * Not logged in.
     */

    if (!schoolId) {
        return;
    }


    /*
     * Desktop navigation.
     */

    if (signIn) {
        signIn.classList.add("hidden");
    }

    if (register) {
        register.classList.add("hidden");
    }

    if (profile) {
        profile.classList.remove("hidden");
    }


    if (profileInitial) {

        const value = name || schoolId || "D";

        profileInitial.textContent =
            value.charAt(0).toUpperCase();

    }


    /*
     * Mobile navigation.
     */

    if (mobileAuth) {

        mobileAuth.innerHTML = `
            <a
                class="btn-primary"
                href="/dashboard"
            >
                Open dashboard
            </a>
        `;

    }

}


/* =========================================================
   PROFILE
   ========================================================= */

function setupProfileButton() {

    const profile = document.querySelector("#profile-chip");

    if (!profile) {
        return;
    }

    profile.addEventListener("click", () => {

        window.location.href = "/dashboard";

    });

}


/* =========================================================
   REQUEST BUTTONS
   ========================================================= */

function setupRequestButtons() {

    const heroButton =
        document.querySelector("#hero-request-btn");

    const bentoButton =
        document.querySelector("#bento-request");


    if (heroButton) {

        heroButton.addEventListener(
            "click",
            openRequestModal
        );

    }


    if (bentoButton) {

        bentoButton.addEventListener(
            "click",
            openRequestModal
        );

    }

}


/* =========================================================
   REQUEST MODAL
   ========================================================= */

function openRequestModal() {

    const schoolId =
        localStorage.getItem("school_id");


    /*
     * Requests require a logged-in user because the
     * backend needs requester_school_id.
     */

    if (!schoolId) {

        window.location.href = "/login";

        return;
    }


    const root =
        document.querySelector("#modal-root");

    const scrim =
        document.querySelector("#modal-scrim");


    if (!root || !scrim) {
        return;
    }


    root.innerHTML = `

        <div class="modal-card">

            <div class="modal-head">

                <div>

                    <h2>
                        Request blood
                    </h2>

                    <p>
                        Create a blood request for someone
                        who needs it.
                    </p>

                </div>


                <button
                    class="modal-close"
                    id="request-modal-close"
                    type="button"
                    aria-label="Close"
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                    >
                        <path d="M18 6L6 18"/>
                        <path d="M6 6l12 12"/>
                    </svg>

                </button>

            </div>


            <form id="home-request-form">


                <div class="form-field">

                    <label for="request-patient">
                        Patient name
                    </label>

                    <input
                        id="request-patient"
                        name="patient_name"
                        type="text"
                        required
                    >

                </div>


                <div class="form-row">


                    <div class="form-field">

                        <label for="request-blood">
                            Blood group
                        </label>

                        <select
                            id="request-blood"
                            name="blood_group"
                            required
                        >

                            <option value="">
                                Select
                            </option>

                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>

                        </select>

                    </div>


                    <div class="form-field">

                        <label for="request-urgency">
                            Urgency
                        </label>

                        <select
                            id="request-urgency"
                            name="urgency"
                        >

                            <option value="normal">
                                Normal
                            </option>

                            <option value="urgent">
                                Urgent
                            </option>

                            <option value="emergency">
                                Emergency
                            </option>

                        </select>

                    </div>


                </div>


                <div class="form-field">

                    <label for="request-hospital">
                        Hospital
                    </label>

                    <input
                        id="request-hospital"
                        name="hospital"
                        type="text"
                        required
                    >

                </div>


                <div class="form-field">

                    <label for="request-contact">
                        Contact number
                    </label>

                    <input
                        id="request-contact"
                        name="contact"
                        type="text"
                        required
                    >

                </div>


                <p
                    class="form-error"
                    id="request-form-error"
                ></p>


                <button
                    class="btn-primary btn-block"
                    id="request-submit"
                    type="submit"
                >
                    Submit request
                </button>


            </form>

        </div>
    `;


    scrim.classList.add("is-open");


    const closeButton =
        document.querySelector("#request-modal-close");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    scrim.addEventListener(
        "click",
        closeModal,
        { once: true }
    );


    const form =
        document.querySelector("#home-request-form");

    if (form) {

        form.addEventListener(
            "submit",
            submitRequest
        );

    }

}


/* =========================================================
   SUBMIT REQUEST
   ========================================================= */

async function submitRequest(event) {

    event.preventDefault();


    const form = event.currentTarget;

    const submitButton =
        document.querySelector("#request-submit");

    const errorBox =
        document.querySelector("#request-form-error");

    const schoolId =
        localStorage.getItem("school_id");


    if (!schoolId) {

        window.location.href = "/login";

        return;
    }


    const formData =
        new FormData(form);


    const data = {

        requester_school_id: schoolId,

        patient_name:
            formData.get("patient_name").trim(),

        blood_group:
            formData.get("blood_group"),

        hospital:
            formData.get("hospital").trim(),

        contact:
            formData.get("contact").trim(),

        urgency:
            formData.get("urgency")

    };


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";

    }


    if (errorBox) {

        errorBox.textContent = "";

        errorBox.style.display = "none";

    }


    try {

        await API.createRequest(data);


        closeModal();


        showToast(
            "Blood request created successfully.",
            "success"
        );


        /*
         * Refresh homepage statistics and
         * current requests.
         */

        loadHomeData();


    } catch (error) {

        console.error(
            "Create request error:",
            error
        );


        if (errorBox) {

            errorBox.textContent =
                error.message ||
                "Could not create request.";

            errorBox.style.display = "block";

        }


        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "Submit request";

        }

    }

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    const root =
        document.querySelector("#modal-root");

    const scrim =
        document.querySelector("#modal-scrim");


    if (root) {
        root.innerHTML = "";
    }


    if (scrim) {
        scrim.classList.remove("is-open");
    }

}


/* =========================================================
   HOMEPAGE DATA
   ========================================================= */

async function loadHomeData() {

    try {

        const [
            donors,
            requests
        ] = await Promise.all([

            API.getDonors(),

            API.getRequests()

        ]);


        /*
         * /api/donors currently returns active donors only.
         * Therefore this number is "available donors", not
         * every donor record including inactive ones.
         */

        const availableDonors =
            Array.isArray(donors)
                ? donors.length
                : 0;


        const openRequests =
            Array.isArray(requests)
                ? requests.filter((request) => {

                    return (
                        !request.status ||
                        request.status === "open"
                    );

                })
                : [];


        const bloodGroups =
            new Set(

                (Array.isArray(donors)
                    ? donors
                    : []
                )

                .map((donor) => donor.blood_group)

                .filter(Boolean)

            ).size;


        /*
         * Update hero.
         */

        setText(
            "#hero-donor-count",
            availableDonors
        );

        setText(
            "#hero-request-count",
            openRequests.length
        );

        setText(
            "#hero-group-count",
            bloodGroups
        );


        /*
         * Update about section.
         */

        setText(
            "#about-donor-count",
            availableDonors
        );

        setText(
            "#about-request-count",
            openRequests.length
        );

        setText(
            "#about-group-count",
            bloodGroups
        );


        /*
         * Render current requests.
         */

        renderHomeRequests(openRequests);


    } catch (error) {

        console.error(
            "Homepage data error:",
            error
        );


        setText(
            "#hero-donor-count",
            "—"
        );

        setText(
            "#hero-request-count",
            "—"
        );

        setText(
            "#hero-group-count",
            "—"
        );


        setText(
            "#about-donor-count",
            "—"
        );

        setText(
            "#about-request-count",
            "—"
        );

        setText(
            "#about-group-count",
            "—"
        );


        const requestList =
            document.querySelector(
                "#home-request-list"
            );


        if (requestList) {

            requestList.innerHTML = `

                <div class="empty-state">

                    Could not load blood requests.

                </div>

            `;

        }

    }

}


/* =========================================================
   RENDER REQUESTS
   ========================================================= */

function renderHomeRequests(requests) {

    const requestList =
        document.querySelector(
            "#home-request-list"
        );


    if (!requestList) {
        return;
    }


    if (!requests.length) {

        requestList.innerHTML = `

            <div class="empty-state">

                No open blood requests right now.

            </div>

        `;

        return;
    }


    /*
     * Only show a few requests on the homepage.
     * The full list remains available at /requests.
     */

    const visibleRequests =
        requests.slice(0, 4);


    requestList.innerHTML =
        visibleRequests
            .map(createRequestCard)
            .join("");

}


/* =========================================================
   REQUEST CARD
   ========================================================= */

function createRequestCard(request) {

    const bloodGroup =
        escapeHtml(request.blood_group || "?");

    const patientName =
        escapeHtml(request.patient_name || "Patient");

    const hospital =
        escapeHtml(request.hospital || "Hospital");

    const contact =
        escapeHtml(request.contact || "Not provided");

    const urgency =
        request.urgency || "normal";


    let pillClass = "pill--open";


    if (
        urgency === "urgent" ||
        urgency === "emergency"
    ) {
        pillClass = "pill--urgent";
    }


    const cardClass =
        urgency === "urgent" ||
        urgency === "emergency"
            ? "request-card is-urgent"
            : "request-card";


    return `

        <article class="${cardClass}">


            <div class="request-badge">

                ${bloodGroup}

            </div>


            <div class="request-info">

                <h4>
                    ${patientName}
                </h4>

                <p>
                    ${hospital}
                </p>

            </div>


            <div class="request-meta">

                <span class="pill ${pillClass}">
                    ${escapeHtml(urgency)}
                </span>

                <span>
                    Contact:
                    ${contact}
                </span>

            </div>


        </article>

    `;

}


/* =========================================================
   MOBILE TAB BAR NAVIGATION
   ========================================================= */

function setupMobileTabNavigation() {

    /*
     * enhance.js creates the mobile tab bar.
     * It runs before DOMContentLoaded, so the tabs exist
     * by the time this function runs.
     */

    const tabs =
        document.querySelectorAll(
            ".liquid-tab[data-nav]"
        );


    tabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            const destination =
                tab.dataset.nav;


            switch (destination) {

                case "home":

                    window.location.href = "/";

                    break;


                case "dashboard":

                    if (
                        localStorage.getItem("school_id")
                    ) {

                        window.location.href =
                            "/dashboard";

                    } else {

                        window.location.href =
                            "/login";

                    }

                    break;


                case "donors":

                    window.location.href =
                        "/find_donor";

                    break;


                case "requests":

                    window.location.href =
                        "/requests";

                    break;

            }

        });

    });

}


/* =========================================================
   SMALL HELPERS
   ========================================================= */

function setText(selector, value) {

    const element =
        document.querySelector(selector);


    if (element) {

        element.textContent = value;

    }

}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


function showToast(message, type = "") {

    const stack =
        document.querySelector("#toast-stack");


    if (!stack) {
        return;
    }


    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type ? `toast--${type}` : ""}`;


    toast.textContent =
        message;


    stack.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3500);

}
