const form = document.getElementById("registerForm");
const message = document.getElementById("message");
const registerBtn = document.getElementById("registerBtn");


form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Disable button while registering
    registerBtn.disabled = true;
    registerBtn.innerHTML = "<span>Registering...</span>";

    message.textContent = "";
    message.className = "message";


    const donorData = {
        school_id: document.getElementById("school_id").value.trim(),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        cellphone: document.getElementById("cellphone").value.trim(),
        blood_group: document.getElementById("blood_group").value
    };


    try {

        const response = await fetch("/api/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(donorData)
        });


        const result = await response.json();


        if (response.ok) {

            message.textContent =
                result.message || "Registration successful!";

            message.className = "message success";

            form.reset();


        } else {

            message.textContent =
                result.error || "Registration failed.";

            message.className = "message error";

        }


    } catch (error) {

        console.error("Registration error:", error);

        message.textContent =
            "Could not connect to the server.";

        message.className = "message error";


    } finally {

        registerBtn.disabled = false;

        registerBtn.innerHTML = `
            <span>Register as Donor</span>
            <span class="arrow">→</span>
        `;

    }

});
