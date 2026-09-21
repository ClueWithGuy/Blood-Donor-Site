const searchForm = document.getElementById("searchForm");
const bloodGroup = document.getElementById("blood_group");
const donorList = document.getElementById("donorList");
const donorCount = document.getElementById("donorCount");
const message = document.getElementById("message");
const searchBtn = document.getElementById("searchBtn");


searchForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const selectedBloodGroup = bloodGroup.value;

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    message.textContent = "";
    message.className = "message";

    donorList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🔎</div>
            <h3>Searching for donors...</h3>
            <p>Please wait a moment.</p>
        </div>
    `;

    try {

        let url = "/api/donors";

        if (selectedBloodGroup) {
            url += `?blood_group=${encodeURIComponent(selectedBloodGroup)}`;
        }


        const response = await fetch(url);

        const result = await response.json();


        if (!response.ok) {
            throw new Error(
                result.error || "Could not find donors."
            );
        }


        // Support either an array response
        // or { donors: [...] }
        const donors = Array.isArray(result)
            ? result
            : (result.donors || []);


        displayDonors(donors);


    } catch (error) {

        console.error("Donor search error:", error);

        donorCount.textContent = "0 donors";

        donorList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Something went wrong</h3>
                <p>
                    ${escapeHtml(error.message)}
                </p>
            </div>
        `;

    } finally {

        searchBtn.disabled = false;
        searchBtn.textContent = "🔎 Search Donors";

    }

});


function displayDonors(donors) {

    donorCount.textContent =
        `${donors.length} donor${donors.length === 1 ? "" : "s"}`;


    if (donors.length === 0) {

        donorList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🩸
                </div>

                <h3>No Donors Found</h3>

                <p>
                    No available donors were found for
                    this blood group.
                </p>

            </div>
        `;

        return;
    }


    donorList.innerHTML = donors.map(function (donor) {

        return `
            <div class="donor-card">

                <div class="donor-top">

                    <div class="donor-avatar">
                        👤
                    </div>

                    <div class="blood-group">
                        ${escapeHtml(donor.blood_group)}
                    </div>

                </div>


                <h3 class="donor-name">
                    ${escapeHtml(donor.name)}
                </h3>


                <div class="donor-info">

                    <div>
                        🎓
                        <span>
                            ${escapeHtml(donor.school_id)}
                        </span>
                    </div>

                    <div>
                        📱
                        <span>
                            ${escapeHtml(donor.cellphone)}
                        </span>
                    </div>

                    <div>
                        ✉️
                        <span>
                            ${escapeHtml(donor.email)}
                        </span>
                    </div>

                </div>


                <div class="availability">
                    Available to donate
                </div>

            </div>
        `;

    }).join("");

}


/*
 * Prevent donor information from being
 * interpreted as HTML.
 */
function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
