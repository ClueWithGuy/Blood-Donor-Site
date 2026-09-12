const findDonorBtn = document.getElementById("findDonorBtn");
const bloodGroupSelect = document.getElementById("bloodGroup");
const donorResults = document.getElementById("donorResults");
const message = document.getElementById("message");


findDonorBtn.addEventListener("click", async function () {

    const bloodGroup = bloodGroupSelect.value;

    // Clear previous results
    donorResults.innerHTML = "";
    message.textContent = "";


    // Make sure a blood group was selected
    if (!bloodGroup) {
        message.textContent = "Please select a blood group.";
        return;
    }


    message.textContent = "Searching for donors...";


    try {

        const response = await fetch(
            `/api/donors?blood_group=${encodeURIComponent(bloodGroup)}`
        );


        const donors = await response.json();


        if (!response.ok) {
            message.textContent = "Something went wrong.";
            return;
        }


        // No donors found
        if (donors.length === 0) {
            message.textContent =
                `No available ${bloodGroup} donors found.`;
            return;
        }


        message.textContent =
            `${donors.length} donor(s) found.`;


        // Display donors
        donors.forEach(function (donor) {

            const donorCard = document.createElement("div");

            donorCard.classList.add("donor-card");


            donorCard.innerHTML = `
                <h3>${donor.name}</h3>

                <p>
                    <strong>Blood Group:</strong>
                    ${donor.blood_group}
                </p>

                <p>
                    <strong>Student ID:</strong>
                    ${donor.school_id}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${donor.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${donor.cellphone}
                </p>
            `;


            donorResults.appendChild(donorCard);

        });

    } catch (error) {

        console.error(error);

        message.textContent =
            "Could not connect to the server.";

    }

});
