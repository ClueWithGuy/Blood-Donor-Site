document.addEventListener("DOMContentLoaded", () => {
    const schoolId = localStorage.getItem("school_id");
    if (!schoolId) {
        window.location.href = "/login";
        return;
    }

    const historyList = document.querySelector(
        "#history-list"
    );

    if (historyList) {
        historyList.addEventListener(
            "click",
            (event) => {
                const deleteButton =
                    event.target.closest(
                        "[data-donation-id]"
                    );

                if (!deleteButton) {
                    return;
                }

                deleteDonation(
                    deleteButton.dataset.donationId
                );
            }
        );
    }

    const deleteLogsButton = document.querySelector(
	"#delete-donation-logs-btn"
    );
    if (deleteLogsButton) {
	deleteLogsButton.addEventListener(
	    "click",
	    deleteDonationLogs
	);
    }
    
    const newRequestButton = document.querySelector(
        "#dash-new-request"
    );
    if (newRequestButton) {
        newRequestButton.addEventListener(
            "click",
            openRequestForm
        );
    }
    
    
    const inboxButton = document.querySelector(
        "#inbox-btn"
    );
    if (inboxButton) {
        inboxButton.addEventListener(
            "click",
            openInbox
        );
    }
    
    const chatClose = document.querySelector(
        "#chat-close"
    );
    if (chatClose) {
        chatClose.addEventListener(
            "click",
            closeInbox
        );
    }
    
    const chatScrim = document.querySelector(
        "#chat-scrim"
    );
    if (chatScrim) {
        chatScrim.addEventListener(
            "click",
            closeInbox
        );
    }
    loadDashboard(schoolId);
});


async function loadDashboard(schoolId) {
    try {
        const data = await API.getDashboard(schoolId);
        renderDonor(data.donor);
        renderStats(data.stats);
        renderDonations(data.donations);
        renderRequests(data.open_requests);
        setupAvailability(data.donor);
    } catch (error) {
        console.error(
            "Dashboard error:",
            error
        );
    }
}


function renderDonor(donor) {
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


function renderStats(stats) {
    const openRequests = document.querySelector(
        "#kpi-open-requests"
    );
    const availableDonors = document.querySelector(
        "#kpi-available-donors"
    );
    const unreadMessages = document.querySelector(
        "#kpi-unread-messages"
    );
    if (openRequests) {
        openRequests.textContent =
            stats.open_requests;
    }
    if (availableDonors) {
        availableDonors.textContent =
            stats.available_donors;
    }
    if (unreadMessages) {
        unreadMessages.textContent =
            stats.unread_messages;
    }
}


function renderBadges(badges) {
    const badgeRow = document.querySelector(
        "#badge-row"
    );
    if (!badgeRow) {
        return;
    }
    badgeRow.innerHTML = "";
    const badgeData = [
        {
            key: "first_pint",
            label: "First Pint"
        },
        {
            key: "regular",
            label: "Regular"
        },
        {
            key: "recruiter",
            label: "Recruiter"
        }
    ];
    badgeData.forEach(badge => {
        const element = document.createElement(
            "div"
        );
        element.className =
            badges[badge.key]
                ? "badge unlocked"
                : "badge locked";
        element.textContent = badge.label;
        badgeRow.appendChild(element);
    });
}


function renderDonations(donations) {
    const historyList = document.querySelector(
        "#history-list"
    );
    if (!historyList) {
        return;
    }
    historyList.innerHTML = "";
    if (!donations || donations.length === 0) {
        historyList.innerHTML = `
            <li class="empty-state">
                No donations logged yet.
            </li>
        `;
        return;
    }
    donations.forEach(donation => {
	const date = new Date(
	    donation.donation_date
	);
	const item = document.createElement(
            "li"
	);

	item.innerHTML = `
        <div>
            <strong>
                ${escapeHtml(
                    date.toLocaleDateString()
                )}
            </strong>
            ${
                donation.notes
                    ? `<p>${escapeHtml(
                        donation.notes
                    )}</p>`
                    : ""
            }
        </div>

        <button
            type="button"
            class="btn-text"
            data-donation-id="${donation.id}"
        >
            Delete
        </button>
       `;
	historyList.appendChild(item);
    });
}


async function deleteDonation(donationId) {
    const schoolId =
        localStorage.getItem("school_id");

    if (!schoolId) {
        window.location.href = "/login";
        return;
    }

    const confirmed = confirm(
        "Delete this donation log?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await API.deleteDonation(
            schoolId,
            donationId
        );

        await loadDashboard(
            schoolId
        );
    } catch (error) {
        console.error(
            "Delete donation error:",
            error
        );

        alert(error.message);
    }
}


async function deleteDonationLogs() {
    const schoolId =
        localStorage.getItem("school_id");

    if (!schoolId) {
        window.location.href = "/login";
        return;
    }

    const confirmed = confirm(
        "Delete all donation logs?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const donations =
            await API.getDonations(schoolId);

        for (const donation of donations) {
            await API.deleteDonation(
                schoolId,
                donation.id
            );
        }

        await loadDashboard(
            schoolId
        );
    } catch (error) {
        console.error(
            "Delete donation logs error:",
            error
        );

        alert(error.message);
    }
}


function renderRequests(requests) {
    const requestList = document.querySelector(
        "#dash-request-list"
    );
    if (!requestList) {
        return;
    }
    requestList.innerHTML = "";
    if (!requests || requests.length === 0) {
        requestList.innerHTML = `
            <div class="empty-state">
                No active blood requests.
            </div>
        `;
        return;
    }
    requests.slice(0, 5).forEach(
        bloodRequest => {
            const item = document.createElement(
                "div"
            );
            item.className = "request-item";
            item.innerHTML = `
                <div>
                    <strong>
                        ${escapeHtml(
                            bloodRequest.patient_name
                        )}
                    </strong>
                    <span>
                        ${escapeHtml(
                            bloodRequest.blood_group
                        )}
                    </span>
                </div>
                <small>
                    ${escapeHtml(
                        bloodRequest.hospital
                    )}
                </small>
            `;
            requestList.appendChild(item);
        }
    );
}


function setupAvailability(donor) {
    const toggle = document.querySelector(
        "#availability-toggle"
    );
    if (!toggle) {
        return;
    }
    let isActive = donor.is_active;
    function updateToggleUI() {
        toggle.classList.toggle(
            "is-on",
            isActive
        );
        toggle.setAttribute(
            "aria-checked",
            isActive ? "true" : "false"
        );
    }
    updateToggleUI();
    toggle.onclick = async () => {
        const newStatus = !isActive;
        toggle.disabled = true;
        try {
            await API.updateAvailability(
                donor.school_id,
                newStatus
            );
            isActive = newStatus;
            updateToggleUI();
        } catch (error) {
            console.error(
                "Availability error:",
                error
            );
            alert(error.message);
        } finally {
            toggle.disabled = false;
        }
    };
}

/* =====================================================
   BLOOD REQUEST MODAL
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
                    Gender
                    <select
                        id="request-gender"
                        required
                    >
                        <option value="">
                            Select gender
                        </option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
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
        .querySelector(
            "#request-modal-close"
        )
        .addEventListener(
            "click",
            closeRequestModal
        );
    document
        .querySelector(
            "#request-form"
        )
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
	
	gender:
	    document.querySelector(
                "#request-gender"
	    ).value,
	
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
        await loadDashboard(
            schoolId
        );
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



/* =====================================================
   INBOX / MESSAGES
   ===================================================== */

let allMessages = [];
let selectedConversation = null;
async function openInbox() {
    const panel = document.querySelector(
        "#chat-panel"
    );

    const scrim = document.querySelector(
        "#chat-scrim"
    );

    if (!panel || !scrim) {
        return;
    }

    panel.classList.add("is-open");
    scrim.classList.add("is-open");

    await loadMessages();

    // Automatically open the first conversation
    // if there is at least one message.
    if (allMessages.length > 0) {
        const schoolId =
            localStorage.getItem("school_id");

        const firstMessage = allMessages[0];

        const otherSchoolId =
            firstMessage.sender_school_id === schoolId
                ? firstMessage.receiver_school_id
                : firstMessage.sender_school_id;

        await openConversation(otherSchoolId);
    }
}


function closeInbox() {
    const panel = document.querySelector(
        "#chat-panel"
    );
    const scrim = document.querySelector(
        "#chat-scrim"
    );
    if (panel) {
        panel.classList.remove(
            "is-open"
        );
    }
    if (scrim) {
        scrim.classList.remove(
            "is-open"
        );
    }
}


async function loadMessages() {
    const schoolId =
        localStorage.getItem(
            "school_id"
        );
    if (!schoolId) {
        return;
    }
    try {
        const data =
            await API.getMessages(
                schoolId
            );
        allMessages =
            data.messages || [];
        renderMessageThreads(
            schoolId
        );
        updateInboxDot(
            data.unread_count
        );
    } catch (error) {
        console.error(
            "Messages error:",
            error
        );
        const threadList =
            document.querySelector(
                "#chat-thread-list"
            );
        if (threadList) {
            threadList.innerHTML = `
                <div class="chat-empty">
                    Failed to load messages.
                </div>
            `;
        }
    }
}


function renderMessageThreads(
    schoolId
) {
    const threadList =
        document.querySelector(
            "#chat-thread-list"
        );
    if (!threadList) {
        return;
    }
    const conversations =
        new Map();
    allMessages.forEach(message => {
        const otherPerson =
            message.sender_school_id === schoolId
                ? message.receiver_school_id
                : message.sender_school_id;
        if (!conversations.has(otherPerson)) {
            conversations.set(
                otherPerson,
                message
            );
        } else {
            const existing =
                conversations.get(
                    otherPerson
                );
            if (
                new Date(
                    message.created_at
                ) >
                new Date(
                    existing.created_at
                )
            ) {
                conversations.set(
                    otherPerson,
                    message
                );
            }
        }
    });
    threadList.innerHTML = "";
    if (conversations.size === 0) {
        threadList.innerHTML = `
            <div class="chat-empty">
                No messages yet.
            </div>
        `;
        return;
    }
    conversations.forEach(
        (message, otherSchoolId) => {
            const item =
                document.createElement(
                    "button"
                );
            item.type = "button";
            item.className =
                "chat-thread";
            item.innerHTML = `
                <strong>
                    ${escapeHtml(
                        otherSchoolId
                    )}
                </strong>
                <span>
                    ${escapeHtml(
                        message.message
                    )}
                </span>
            `;
            item.addEventListener(
                "click",
                () => {
                    openConversation(
                        otherSchoolId
                    );
                }
            );
            threadList.appendChild(
                item
            );
        }
    );
}


async function openConversation(
    otherSchoolId
) {
    selectedConversation =
        otherSchoolId;
    const schoolId =
        localStorage.getItem(
            "school_id"
        );
    const conversation =
        document.querySelector(
            "#chat-conversation"
        );
    if (!conversation) {
        return;
    }
    const messages =
        allMessages.filter(
            message =>
                (
                    message.sender_school_id ===
                    schoolId &&
                    message.receiver_school_id ===
                    otherSchoolId
                ) ||
                (
                    message.sender_school_id ===
                    otherSchoolId &&
                    message.receiver_school_id ===
                    schoolId
                )
        );

    conversation.innerHTML = `
    <div class="chat-conv-head">
        <strong>
            ${escapeHtml(
                otherSchoolId
            )}
        </strong>

        <button
            type="button"
            class="btn-text"
            id="delete-conversation-btn"
        >
            Delete conversation
        </button>
    </div>

    <div
        class="chat-messages"
        id="chat-messages"
    ></div>

    <form
        class="chat-compose"
        id="chat-compose"
    >
        <input
            type="text"
            id="chat-message-input"
            placeholder="Type a message..."
            autocomplete="off"
            required
        >

        <button
            type="submit"
            class="btn-primary"
        >
            Send
        </button>
    </form>
   `;

    document
        .querySelector("#delete-conversation-btn")
        .addEventListener(
	    "click",
            deleteConversation
	);

    const messageContainer =
        document.querySelector(
            "#chat-messages"
        );
    messages
        .sort(
            (a, b) =>
                new Date(
                    a.created_at
                ) -
                new Date(
                    b.created_at
                )
        )
        .forEach(message => {
            const bubble =
                document.createElement(
                    "div"
                );
            bubble.className =
                message.sender_school_id ===
                schoolId
                    ? "chat-message own"
                    : "chat-message";
            bubble.innerHTML = `
                <div class="chat-message-text">
                    ${escapeHtml(
                        message.message
                    )}
                </div>
                <small>
                    ${escapeHtml(
                        new Date(
                            message.created_at
                        ).toLocaleString()
                    )}
                </small>
            `;
            messageContainer.appendChild(
                bubble
            );
        });
    messages
        .filter(
            message =>
                message.receiver_school_id ===
                schoolId &&
                !message.is_read
        )
        .forEach(
            async message => {
                try {
                    await API.markMessageRead(
                        message.id
                    );
                    message.is_read = true;
                } catch (error) {
                    console.error(
                        "Read status error:",
                        error
                    );
                }
            }
        );
    document
        .querySelector(
            "#chat-compose"
        )
        .addEventListener(
            "submit",
            sendChatMessage
        );
}


async function sendChatMessage(event) {
    event.preventDefault();
    const schoolId =
        localStorage.getItem(
            "school_id"
        );
    const input =
        document.querySelector(
            "#chat-message-input"
        );
    const message =
        input.value.trim();
    if (!message || !selectedConversation) {
        return;
    }
    try {
        input.disabled = true;
        await API.sendMessage({
            sender_school_id:
                schoolId,
            receiver_school_id:
                selectedConversation,
            message: message
        });
        input.value = "";
        await loadMessages();
        await openConversation(
            selectedConversation
        );
    } catch (error) {
        console.error(
            "Send message error:",
            error
        );
        alert(error.message);
    } finally {
        input.disabled = false;
        input.focus();
    }
}


async function deleteConversation() {
    const schoolId =
        localStorage.getItem("school_id");

    if (!schoolId || !selectedConversation) {
        return;
    }

    const confirmed = confirm(
        "Delete this entire conversation?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await API.deleteConversation(
            schoolId,
            selectedConversation
        );

        selectedConversation = null;

        await loadMessages();

        const conversation =
            document.querySelector(
                "#chat-conversation"
            );

        if (conversation) {
            conversation.innerHTML = `
                <div class="chat-empty">
                    Select a conversation to start messaging.
                </div>
            `;
        }
    } catch (error) {
        console.error(
            "Delete conversation error:",
            error
        );

        alert(error.message);
    }
}


function updateInboxDot(
    unreadCount
) {
    const dot =
        document.querySelector(
            "#inbox-dot"
        );
    if (!dot) {
        return;
    }
    dot.hidden =
        !unreadCount ||
        unreadCount <= 0;
}
/* =====================================================
   UTILITY
   ===================================================== */
function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

