document.addEventListener("DOMContentLoaded", async () => {
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
});


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

                    </div>

                </article>
            `;
        }
    ).join("");
}


function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}
