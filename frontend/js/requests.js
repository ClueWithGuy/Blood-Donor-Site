document.addEventListener("DOMContentLoaded", async () => {
    const requestList = document.querySelector("#request-list");

    // Wire up the "New request" button (same behavior as dashboard)
    const newRequestButton = document.querySelector("#dash-new-request");

    if (newRequestButton) {
        newRequestButton.addEventListener(
            "click",
            openRequestForm
        );
    }

    if (!requestList) {
        return;
    }

    // ----- ACCEPT BUTTON: event delegation on the list -----
    requestList.addEventListener(
        "click",
        acceptRequest
    );

    try {
        const requests = await API.getRequests();

        renderRequests(requests);

    } catch (error) {
        console.error("Requests error:", error);

        requestList.innerHTML = `
            <div class="request-empty">
                Failed to load blood requests.
            </div>
        `;
    }
});


async function loadRequests() {
    const requestList = document.querySelector("#request-list");

    if (!requestList) {
        return;
    }

    try {
        const requests = await API.getRequests();

        renderRequests(requests);

    } catch (error) {
        console.error("Requests error:", error);

        requestList.innerHTML = `
            <div class="request-empty">
                Failed to load blood requests.
            </div>
        `;
    }
}


function renderRequests(requests) {
    const requestList = document.querySelector(
        "#request-list"
    );

    if (!requests.length) {
        requestList.innerHTML = `
            <div class="request-empty">
                No open blood requests right now.
            </div>
        `;

        return;
    }

    requestList.innerHTML = requests.map(
        (bloodRequest) => {

            return `
                <article class="request-item">

                    <div class="request-item-top">

                        <div class="request-item-blood">
                            ${escapeHtml(
                                bloodRequest.blood_group
                            )}
                        </div>

                        <div class="request-item-info">

                            <strong>
                                ${escapeHtml(
                                    bloodRequest.patient_name
                                )}
                            </strong>

                            <span>
                                ${escapeHtml(
                                    bloodRequest.hospital
                                )}
                            </span>

                        </div>

                    </div>


                    <div class="request-item-meta">

                        <span class="request-item-urgency">
                            ${escapeHtml(
                                bloodRequest.urgency
                            )}
                        </span>

                        <span class="request-item-contact">
                            Contact:
                            ${escapeHtml(
                                bloodRequest.contact
                            )}
                        </span>

                        <button
                            class="accept-btn"
                            type="button"
                            data-request-id="${escapeHtml(
                                bloodRequest.id
                            )}"
                        >
                            Accept
                        </button>

                    </div>

                </article>
            `;
        }
    ).join("");
}


/* =====================================================
   ACCEPT BLOOD REQUEST
   Delegated handler — works even after list re-render
   ===================================================== */

async function acceptRequest(event) {

    const acceptBtn = event.target.closest(
        ".accept-btn"
    );

    if (!acceptBtn) {
        return;
    }

    const requestId = acceptBtn.dataset.requestId;

    if (!requestId) {
        return;
    }

    acceptBtn.disabled = true;
    acceptBtn.textContent = "Accepting...";

    try {
        // If you have an API helper, swap this fetch for:
        // await API.acceptRequest(requestId);
        const response = await fetch(
            `/api/requests/${requestId}/accept`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to accept request"
            );
        }

        acceptBtn.textContent = "Accepted ✓";
        acceptBtn.style.background = "#2e9e5b";

    } catch (error) {
        console.error(
            "Accept error:",
            error
        );

        acceptBtn.disabled = false;
        acceptBtn.textContent = "Try again";

        alert(error.message);
    }
}


/* =====================================================
   BLOOD REQUEST MODAL
   (same behavior as dashboard.js)
   ===================================================== */

function openRequestForm() {
    const modalRoot = document.querySelector(
        "#modal-root"
    );

    const modalScrim = document.querySelector(
        "#modal-scrim"
    );

    if (!modalRoot || !modalScrim) {
        return;
    }

    modalRoot.innerHTML = `
        <div class="modal-card">

            <div class="modal-head">

                <h3>New blood request</h3>

                <button
                    type="button"
                    class="icon-btn"
                    id="request-modal-close"
                    aria-label="Close"
                >
                    ×
                </button>

            </div>

            <form id="request-form">

                <label>
                    Patient name

                    <input
                        type="text"
                        placeholder="Patient Name"
                        id="request-patient"
                        required
                    >
                </label>

                <label>
                    Blood group

                    <select
                        id="request-blood"
                        required
                    >
                        <option value="">
                            Select blood group
                        </option>

                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>
                    </select>
                </label>

                <label>
                    Hospital

                    <input
                        type="text"
                        placeholder="Hospital Name"
                        id="request-hospital"
                        required
                    >
                </label>

                <label>
                    Contact

                    <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        id="request-contact"
                         pattern="01[0-9]{9}"
                         maxlength="11"
                        required
                    >
                </label>

                <label>
                    Urgency

                    <select id="request-urgency">

                        <option value="normal">
                            Normal
                        </option>

                        <option value="urgent">
                            Urgent
                        </option>

                    </select>
                </label>

                <button
                    type="submit"
                    class="btn-primary"
                >
                    Create request
                </button>

            </form>

        </div>
    `;

    modalScrim.classList.add(
        "is-open"
    );

    modalRoot.classList.add(
        "is-open"
    );

    document
        .querySelector("#request-modal-close")
        .addEventListener(
            "click",
            closeRequestModal
        );

    // Clicking the dark scrim behind the modal also closes it
    modalScrim.addEventListener(
        "click",
        closeRequestModal
    );

    document
        .querySelector("#request-form")
        .addEventListener(
            "submit",
            submitRequest
        );
}


async function submitRequest(event) {
    event.preventDefault();

    const schoolId =
        localStorage.getItem(
            "school_id"
        );

    // Not logged in — send them to login instead of
    // hitting the API with a null school id
    if (!schoolId) {
        window.location.href = "/login";

        return;
    }

    const data = {
        requester_school_id:
            schoolId,

        patient_name:
            document.querySelector(
                "#request-patient"
            ).value.trim(),

        blood_group:
            document.querySelector(
                "#request-blood"
            ).value,

        hospital:
            document.querySelector(
                "#request-hospital"
            ).value.trim(),

        contact:
            document.querySelector(
                "#request-contact"
            ).value.trim(),

        urgency:
            document.querySelector(
                "#request-urgency"
            ).value
    };

    try {
        await API.createRequest(data);

        closeRequestModal();

        // Refresh the list so the new request appears
        await loadRequests();

    } catch (error) {
        console.error(
            "Request error:",
            error
        );

        alert(error.message);
    }
}


function closeRequestModal() {
    const modalRoot = document.querySelector(
        "#modal-root"
    );

    const modalScrim = document.querySelector(
        "#modal-scrim"
    );

    if (modalRoot) {
        modalRoot.classList.remove(
            "is-open"
        );

        modalRoot.innerHTML = "";
    }

    if (modalScrim) {
        modalScrim.classList.remove(
            "is-open"
        );
    }
}


function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}