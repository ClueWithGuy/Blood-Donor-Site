document.addEventListener("DOMContentLoaded", () => {
    const donorGrid = document.querySelector("#donor-grid");
    const searchInput = document.querySelector("#donor-search-input");
    const bloodFilter = document.querySelector("#filter-blood-group");
    const departmentFilter = document.querySelector("#filter-department");
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
        const department = departmentFilter?.value || "";
        const location = locationFilter?.value.trim().toLowerCase() || "";

        const filtered = donors.filter((donor) => {

	    if (!donor.is_active) {
		return false;
	    }

            const matchesSearch =
                !search ||
                donor.name.toLowerCase().includes(search) ||
                donor.school_id.toLowerCase().includes(search) ||
                donor.email.toLowerCase().includes(search);

            const matchesBlood =
                !bloodGroup ||
                donor.blood_group === bloodGroup;

            /*
             * Backend field name assumed as "department".
             * Update this line if the backend uses a different key
             * (e.g. donor.dept, donor.faculty).
             */
            const matchesDepartment =
                !department ||
                donor.department === department;

            /*
             * The current backend does NOT provide donor location.
             * Therefore this filter is intentionally not applied yet.
             */
            const matchesLocation = !location;

            return (
                matchesSearch &&
                matchesBlood &&
                matchesDepartment &&
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
                    <strong>Student ID: </strong>
                    ${escapeHtml(donor.school_id)}
                </p>

                
                <p>
                <strong>Address:</strong>
                ${escapeHtml(donor.address)}
                </p>
                <p>
                <strong>Department:</strong>
                ${escapeHtml(donor.department)}
                </p>
                <p>
                <strong>Gender:</strong>
                ${escapeHtml(donor.gender)}
                </p>
                
                <p>
                    <strong>Cellphone:</strong>
                    ${escapeHtml(donor.cellphone)}
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
    departmentFilter?.addEventListener("change", renderDonors);
    locationFilter?.addEventListener("input", renderDonors);

    resetButton?.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        if (bloodFilter) {
            bloodFilter.value = "";
        }

        if (departmentFilter) {
            departmentFilter.value = "";
        }

        if (locationFilter) {
            locationFilter.value = "";
        }

        renderDonors();
    });

    loadDonors();
});
