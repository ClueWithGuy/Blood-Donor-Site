document.addEventListener("DOMContentLoaded", () => {
    const donorGrid = document.querySelector("#donor-grid");
    const searchInput = document.querySelector("#donor-search-input");
    const bloodFilter = document.querySelector("#filter-blood-group");
    const locationFilter = document.querySelector("#filter-location");
    const resetButton = document.querySelector("#filter-reset");
    const donorCount = document.querySelector("#donor-count");

    if (!donorGrid) {
        return;
    }

    let donors = [];

    async function loadDonors() {
        try {
            donorGrid.innerHTML = "<p>Loading donors...</p>";

            donors = await API.getDonors();

            renderDonors();
        } catch (error) {
            donorGrid.innerHTML = `
                <p>Could not load donors: ${error.message}</p>
            `;
        }
    }

    function renderDonors() {
        const search = searchInput?.value.trim().toLowerCase() || "";
        const bloodGroup = bloodFilter?.value || "";
        const location = locationFilter?.value.trim().toLowerCase() || "";

        const filtered = donors.filter((donor) => {
            const matchesSearch =
                !search ||
                donor.name.toLowerCase().includes(search) ||
                donor.school_id.toLowerCase().includes(search) ||
                donor.email.toLowerCase().includes(search);

            const matchesBlood =
                !bloodGroup ||
                donor.blood_group === bloodGroup;

            /*
             * The current backend does NOT provide donor location.
             * Therefore this filter is intentionally not applied yet.
             */
            const matchesLocation = !location;

            return (
                matchesSearch &&
                matchesBlood &&
                matchesLocation
            );
        });

        if (donorCount) {
            donorCount.textContent = `${filtered.length} donors`;
        }

        if (filtered.length === 0) {
            donorGrid.innerHTML = `
                <p>No donors found.</p>
            `;
            return;
        }

        donorGrid.innerHTML = filtered
            .map(createDonorCard)
            .join("");
    }

    function createDonorCard(donor) {
        return `
            <article class="donor-card">
                <h3>${escapeHtml(donor.name)}</h3>

                <p>
                    <strong>Blood:</strong>
                    ${escapeHtml(donor.blood_group)}
                </p>

                <p>
                    <strong>School ID:</strong>
                    ${escapeHtml(donor.school_id)}
                </p>

                <p>
                    <strong>Cellphone:</strong>
                    ${escapeHtml(donor.cellphone)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHtml(donor.email)}
                </p>
            </article>
        `;
    }

    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value ?? "";
        return div.innerHTML;
    }

    searchInput?.addEventListener("input", renderDonors);
    bloodFilter?.addEventListener("change", renderDonors);
    locationFilter?.addEventListener("input", renderDonors);

    resetButton?.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        if (bloodFilter) {
            bloodFilter.value = "";
        }

        if (locationFilter) {
            locationFilter.value = "";
        }

        renderDonors();
    });

    loadDonors();
});
