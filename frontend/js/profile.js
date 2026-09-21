document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.querySelector(
        '[data-nav-modal="edit-profile"]'
    );

    if (!editButton) {
        return;
    }

    editButton.addEventListener("click", openProfileEditor);
});


async function openProfileEditor() {
    const schoolId = localStorage.getItem("school_id");

    if (!schoolId) {
        window.location.href = "/login";
        return;
    }

    let donor;

    try {
        donor = await API.getDonor(schoolId);
    } catch (error) {
        alert(error.message);
        return;
    }

    const modalRoot = document.querySelector("#modal-root");
    const modalScrim = document.querySelector("#modal-scrim");

    if (!modalRoot || !modalScrim) {
        return;
    }

    modalRoot.innerHTML = `
        <div class="modal-card">
            <div class="modal-head">
                <h3>Edit profile</h3>

                <button
                    type="button"
                    class="icon-btn"
                    id="profile-modal-close"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            <form id="profile-form">

                <label>
                    School ID
                    <input
                        type="text"
                        value="${escapeHtml(donor.school_id)}"
                        disabled
                    >
                </label>

                <label>
                    Name
                    <input
                        type="text"
                        id="profile-name"
                        value="${escapeHtml(donor.name)}"
                        required
                    >
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        id="profile-email"
                        value="${escapeHtml(donor.email)}"
                        required
                    >
                </label>

                <label>
                    Cellphone
                    <input
                        type="text"
                        id="profile-cellphone"
                        value="${escapeHtml(donor.cellphone)}"
                        required
                    >
                </label>

                <label>
                    Blood group
                    <select id="profile-blood-group" required>
                        ${bloodGroupOptions(donor.blood_group)}
                    </select>
                </label>

                <button
                    type="submit"
                    class="btn-primary"
                >
                    Save changes
                </button>
            </form>
        </div>
    `;

    modalScrim.classList.add("is-open");
    modalRoot.classList.add("is-open");

    document
        .querySelector("#profile-modal-close")
        .addEventListener("click", closeProfileModal);

    modalScrim.addEventListener(
        "click",
        closeProfileModal,
        { once: true }
    );

    document
        .querySelector("#profile-form")
        .addEventListener(
            "submit",
            (event) => saveProfile(event, donor.school_id)
        );
}


async function saveProfile(event, schoolId) {
    event.preventDefault();

    const form = event.target;

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    const name = document
        .querySelector("#profile-name")
        .value
        .trim();

    const email = document
        .querySelector("#profile-email")
        .value
        .trim();

    const cellphone = document
        .querySelector("#profile-cellphone")
        .value
        .trim();

    const bloodGroup = document
        .querySelector("#profile-blood-group")
        .value;

    if (!name || !email || !cellphone || !bloodGroup) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        submitButton.disabled = true;

        const result = await API.updateDonor(
            schoolId,
            {
                name,
                email,
                cellphone,
                blood_group: bloodGroup
            }
        );

        alert(result.message);

        const donor = await API.getDonor(schoolId);

        updateDashboardProfile(donor);

        /*
         * Keep the login information synchronized
         * with the updated profile.
         */
        localStorage.setItem("name", donor.name);
        localStorage.setItem("email", donor.email);

        closeProfileModal();

    } catch (error) {
        alert(error.message);
    } finally {
        submitButton.disabled = false;
    }
}


function updateDashboardProfile(donor) {
    const dashName = document.querySelector("#dash-name");
    const dashMeta = document.querySelector("#dash-meta");
    const dashAvatar = document.querySelector("#dash-avatar");

    if (dashName) {
        dashName.textContent = donor.name;
    }

    if (dashMeta) {
        dashMeta.textContent =
            `${donor.school_id} • ${donor.blood_group}`;
    }

    if (dashAvatar) {
        dashAvatar.textContent =
            donor.name.charAt(0).toUpperCase();
    }
}


function closeProfileModal() {
    const modalRoot = document.querySelector("#modal-root");
    const modalScrim = document.querySelector("#modal-scrim");

    if (modalRoot) {
        modalRoot.classList.remove("is-open");
        modalRoot.innerHTML = "";
    }

    if (modalScrim) {
        modalScrim.classList.remove("is-open");
    }
}


function bloodGroupOptions(selected) {
    const groups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ];

    return groups
        .map((group) => `
            <option
                value="${group}"
                ${group === selected ? "selected" : ""}
            >
                ${group}
            </option>
        `)
        .join("");
}


function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}
