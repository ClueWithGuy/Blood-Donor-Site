/* =========================================================
   BLOODLINK HOMEPAGE
   index.js
   ========================================================= */


/* ================= MOBILE MENU ================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    // Close mobile menu after clicking a link
    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });

    });
}


/* ================= CURRENT YEAR ================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* ================= FIND DONOR ================= */

const searchDonorBtn = document.getElementById("searchDonorBtn");
const bloodGroupSelect = document.getElementById("bloodGroup");

const donorResults = document.getElementById("donorResults");
const donorList = document.getElementById("donorList");
const resultCount = document.getElementById("resultCount");


if (searchDonorBtn) {

    searchDonorBtn.addEventListener("click", searchDonors);

}


/*
    Search donors using the Flask API.

    Examples:

    GET /api/donors
    GET /api/donors?blood_group=O+
*/

async function searchDonors() {

    const bloodGroup = bloodGroupSelect.value;

    searchDonorBtn.disabled = true;
    searchDonorBtn.innerHTML = "Searching...";

    try {

        let url = "/api/donors";

        if (bloodGroup) {

            url += `?blood_group=${encodeURIComponent(bloodGroup)}`;

        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch donors.");
        }

        const data = await response.json();

        /*
            Depending on your Flask implementation,
            the API may return either:

            [
                {...},
                {...}
            ]

            OR

            {
                "donors": [...]
            }
        */

        let donors = [];

        if (Array.isArray(data)) {
            donors = data;
        } else if (Array.isArray(data.donors)) {
            donors = data.donors;
        } else {
            donors = [];
        }

        displayDonors(donors);

    } catch (error) {

        console.error("Donor search error:", error);

        showSearchError();

    } finally {

        searchDonorBtn.disabled = false;
        searchDonorBtn.innerHTML = "Search Donors →";

    }
}


/* ================= DISPLAY DONORS ================= */

function displayDonors(donors) {

    donorResults.classList.remove("hidden");

    donorList.innerHTML = "";

    resultCount.textContent =
        `${donors.length} donor${donors.length === 1 ? "" : "s"} found`;


    if (donors.length === 0) {

        donorList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🩸</div>

                <h3>No donors found</h3>

                <p>
                    There are currently no active donors for
                    the selected blood group.
                </p>
            </div>
        `;

        return;
    }


    donors.forEach(donor => {

        const card = createDonorCard(donor);

        donorList.appendChild(card);

    });

    donorResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ================= CREATE DONOR CARD ================= */

function createDonorCard(donor) {

    const card = document.createElement("div");

    card.className = "donor-card";


    const name = donor.name || "Unknown Donor";

    const bloodGroup = donor.blood_group || "N/A";

    const schoolId = donor.school_id || "";

    /*
        Use the first letter of the donor's name
        as the avatar.
    */

    const initial = name.charAt(0).toUpperCase();


    card.innerHTML = `
        <div class="donor-avatar">
            ${escapeHtml(initial)}
        </div>

        <div class="donor-info">
            <h4>${escapeHtml(name)}</h4>

            <p>
                ${escapeHtml(schoolId)}
            </p>
        </div>

        <div class="blood-badge">
            ${escapeHtml(bloodGroup)}
        </div>
    `;


    return card;
}


/* ================= SEARCH ERROR ================= */

function showSearchError() {

    donorResults.classList.remove("hidden");

    resultCount.textContent = "";

    donorList.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">⚠️</div>

            <h3>Unable to search donors</h3>

            <p>
                Please make sure the Flask backend is running
                and try again.
            </p>
        </div>
    `;

}


/* ================= HTML ESCAPE ================= */

/*
    Prevent donor information returned by the API
    from being inserted into the page as raw HTML.
*/

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ================= KEYBOARD SEARCH ================= */

if (bloodGroupSelect) {

    bloodGroupSelect.addEventListener("change", () => {

        // Optional convenience:
        // selecting a blood group does not automatically
        // search. User can press the search button.

        searchDonorBtn.focus();

    });

}


/* ================= ADDITIONAL RESULT STYLES ================= */

/*
    These styles are added dynamically so that the main
    stylesheet stays focused on the homepage layout.
*/

const resultStyles = document.createElement("style");

resultStyles.textContent = `

    .no-results {
        grid-column: 1 / -1;

        padding: 45px 25px;

        text-align: center;

        border: 1px solid #e5e7eb;
        border-radius: 15px;

        background: white;
    }

    .no-results-icon {
        font-size: 2.2rem;

        margin-bottom: 10px;
    }

    .no-results h3 {
        color: #111827;

        font-size: 1.1rem;
    }

    .no-results p {
        max-width: 420px;

        margin: 7px auto 0;

        color: #6b7280;

        font-size: 0.85rem;
    }

    .search-row button:disabled {
        opacity: 0.65;

        cursor: not-allowed;

        transform: none;
    }

`;

document.head.appendChild(resultStyles);
