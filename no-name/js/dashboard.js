/* =========================================
   CONFIGURATION
========================================= */

const API_BASE = "http://127.0.0.1:5000";


/* =========================================
   STATE
========================================= */

let currentDonor = null;


/* =========================================
   DOM ELEMENTS
========================================= */

const welcomeName =
    document.getElementById("welcomeName");

const navUserName =
    document.getElementById("navUserName");

const bloodGroup =
    document.getElementById("bloodGroup");

const schoolId =
    document.getElementById("schoolId");

const availabilityText =
    document.getElementById("availabilityText");

const profileName =
    document.getElementById("profileName");

const profileSchoolId =
    document.getElementById("profileSchoolId");

const profileEmail =
    document.getElementById("profileEmail");

const profilePhone =
    document.getElementById("profilePhone");

const profileBloodGroup =
    document.getElementById("profileBloodGroup");

const availabilityToggle =
    document.getElementById("availabilityToggle");

const bloodSearch =
    document.getElementById("bloodSearch");

const searchBtn =
    document.getElementById("searchBtn");

const donorResults =
    document.getElementById("donorResults");

const resultCount =
    document.getElementById("resultCount");

const logoutBtn =
    document.getElementById("logoutBtn");

const editProfileBtn =
    document.getElementById("editProfileBtn");

const editModal =
    document.getElementById("editModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const editForm =
    document.getElementById("editForm");

const editName =
    document.getElementById("editName");

const editEmail =
    document.getElementById("editEmail");

const editPhone =
    document.getElementById("editPhone");

const editBloodGroup =
    document.getElementById("editBloodGroup");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================
   GET LOGGED-IN USER
========================================= */

/*
    The login page should save the school_id
    after successful login.

    Example:

    localStorage.setItem(
        "school_id",
        data.school_id
    );
*/

function getLoggedInSchoolId() {

    return localStorage.getItem("school_id");

}


/* =========================================
   INITIALIZE DASHBOARD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loggedInSchoolId =
        getLoggedInSchoolId();

    if (!loggedInSchoolId) {

        /*
            User is not logged in.
            Send them back to login page.
        */

        window.location.href = "login.html";

        return;
    }

    loadCurrentDonor();

});


/* =========================================
   LOAD CURRENT DONOR
========================================= */

async function loadCurrentDonor() {

    const id = getLoggedInSchoolId();

    try {

        const response = await fetch(
            `${API_BASE}/api/donors/${encodeURIComponent(id)}`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Unable to load donor."
            );

        }

        currentDonor = data;

        displayDonor(data);

    }

    catch (error) {

        console.error(error);

        showToast(
            error.message || "Failed to load profile.",
            "error"
        );

    }

}


/* =========================================
   DISPLAY DONOR
========================================= */

function displayDonor(donor) {

    welcomeName.textContent =
        donor.name || "Donor";

    navUserName.textContent =
        donor.name || "Donor";

    bloodGroup.textContent =
        donor.blood_group || "--";

    schoolId.textContent =
        donor.school_id || "--";

    profileName.textContent =
        donor.name || "--";

    profileSchoolId.textContent =
        donor.school_id || "--";

    profileEmail.textContent =
        donor.email || "--";

    profilePhone.textContent =
        donor.cellphone || "--";

    profileBloodGroup.textContent =
        donor.blood_group || "--";


    availabilityToggle.checked =
        donor.is_active === true;

    updateAvailabilityText(
        donor.is_active === true
    );

}


/* =========================================
   AVAILABILITY TEXT
========================================= */

function updateAvailabilityText(isActive) {

    if (isActive) {

        availabilityText.textContent =
            "Available";

        availabilityText.style.color =
            "#16a34a";

    } else {

        availabilityText.textContent =
            "Unavailable";

        availabilityText.style.color =
            "#dc2626";

    }

}


/* =========================================
   CHANGE AVAILABILITY
========================================= */

availabilityToggle.addEventListener(
    "change",
    async () => {

        if (!currentDonor) {
            return;
        }

        const newStatus =
            availabilityToggle.checked;

        try {

            const response = await fetch(
                `${API_BASE}/api/donors/${encodeURIComponent(
                    currentDonor.school_id
                )}/availability`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        is_active: newStatus
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Could not update availability."
                );

            }


            currentDonor.is_active =
                newStatus;


            updateAvailabilityText(
                newStatus
            );


            showToast(
                newStatus
                    ? "You are now available to donate."
                    : "You are now unavailable.",
                "success"
            );


            /*
                Refresh donor search so the
                availability change is reflected.
            */

            searchDonors();

        }

        catch (error) {

            console.error(error);

            /*
                Revert toggle if API fails.
            */

            availabilityToggle.checked =
                !newStatus;


            showToast(
                error.message ||
                "Failed to update availability.",
                "error"
            );

        }

    }
);


/* =========================================
   SEARCH DONORS
========================================= */

searchBtn.addEventListener(
    "click",
    searchDonors
);


bloodSearch.addEventListener(
    "change",
    searchDonors
);


async function searchDonors() {

    const selectedBloodGroup =
        bloodSearch.value;


    let url =
        `${API_BASE}/api/donors`;


    if (selectedBloodGroup) {

        url +=
            `?blood_group=${encodeURIComponent(
                selectedBloodGroup
            )}`;

    }


    donorResults.innerHTML = `
        <div class="empty-state">
            <div>⏳</div>
            <p>Searching donors...</p>
        </div>
    `;


    try {

        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to search donors."
            );

        }


        /*
            Your Flask backend might return
            either:

            [
                {...},
                {...}
            ]

            or:

            {
                "donors": [...]
            }

            This handles both.
        */

        const donors =
            Array.isArray(data)
                ? data
                : data.donors || [];


        displayDonors(donors);

    }

    catch (error) {

        console.error(error);

        donorResults.innerHTML = `
            <div class="empty-state">
                <div>⚠️</div>
                <p>
                    ${escapeHtml(
                        error.message ||
                        "Failed to search donors."
                    )}
                </p>
            </div>
        `;

        resultCount.textContent =
            "0 donors";

    }

}


/* =========================================
   DISPLAY DONORS
========================================= */

function displayDonors(donors) {

    resultCount.textContent =
        `${donors.length} ${
            donors.length === 1
                ? "donor"
                : "donors"
        }`;


    if (!donors.length) {

        donorResults.innerHTML = `
            <div class="empty-state">

                <div>🩸</div>

                <p>
                    No available donors found.
                </p>

            </div>
        `;

        return;
    }


    donorResults.innerHTML =
        donors.map(donor => {

            const name =
                donor.name || "Unknown Donor";

            const initials =
                getInitials(name);


            return `
                <div class="donor-item">

                    <div class="donor-info">

                        <div class="donor-avatar">
                            ${escapeHtml(initials)}
                        </div>

                        <div>

                            <div class="donor-name">
                                ${escapeHtml(name)}
                            </div>

                            <div class="donor-id">
                                ID:
                                ${escapeHtml(
                                    donor.school_id || "--"
                                )}
                            </div>

                        </div>

                    </div>


                    <div class="donor-blood">
                        ${escapeHtml(
                            donor.blood_group || "--"
                        )}
                    </div>

                </div>
            `;

        }).join("");

}


/* =========================================
   EDIT PROFILE
========================================= */

editProfileBtn.addEventListener(
    "click",
    openEditModal
);


function openEditModal() {

    if (!currentDonor) {
        return;
    }


    editName.value =
        currentDonor.name || "";

    editEmail.value =
        currentDonor.email || "";

    editPhone.value =
        currentDonor.cellphone || "";

    editBloodGroup.value =
        currentDonor.blood_group || "A+";


    editModal.classList.remove(
        "hidden"
    );

}


/* =========================================
   CLOSE MODAL
========================================= */

closeModalBtn.addEventListener(
    "click",
    closeEditModal
);


cancelEditBtn.addEventListener(
    "click",
    closeEditModal
);


editModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


function closeEditModal() {

    editModal.classList.add(
        "hidden"
    );

}


/* =========================================
   UPDATE PROFILE
========================================= */

editForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentDonor) {
            return;
        }


        const updatedData = {

            name:
                editName.value.trim(),

            email:
                editEmail.value.trim(),

            cellphone:
                editPhone.value.trim(),

            blood_group:
                editBloodGroup.value

        };


        try {

            const response =
                await fetch(
                    `${API_BASE}/api/donors/${encodeURIComponent(
                        currentDonor.school_id
                    )}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedData
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update profile."
                );

            }


            /*
                Some Flask implementations return
                the updated donor directly while
                others return only a message.

                Update our local object manually.
            */

            currentDonor.name =
                updatedData.name;

            currentDonor.email =
                updatedData.email;

            currentDonor.cellphone =
                updatedData.cellphone;

            currentDonor.blood_group =
                updatedData.blood_group;


            displayDonor(
                currentDonor
            );


            closeEditModal();


            showToast(
                "Profile updated successfully.",
                "success"
            );


            /*
                Refresh donor list because
                blood group may have changed.
            */

            searchDonors();

        }

        catch (error) {

            console.error(error);

            showToast(
                error.message ||
                "Failed to update profile.",
                "error"
            );

        }

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener(
    "click",
    () => {

        /*
            Remove login information.
        */

        localStorage.removeItem(
            "school_id"
        );


        /*
            If you later add a token,
            remove it here too.

            localStorage.removeItem("token");
        */


        window.location.href =
            "login.html";

    }
);


/* =========================================
   TOAST
========================================= */

function showToast(
    message,
    type = "success"
) {

    toastMessage.textContent =
        message;

    toast.className =
        `toast show ${type}`;


    setTimeout(() => {

        toast.className =
            "toast";

    }, 3000);

}


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0).toUpperCase()
        )
        .join("");

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
