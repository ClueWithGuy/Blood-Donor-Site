const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const schoolId = document.getElementById("school_id").value;
    const password = document.getElementById("password").value;


    message.textContent = "";
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";


    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                school_id: schoolId,
                password: password
            })

        });


        const data = await response.json();


        if (!response.ok) {

            message.textContent =
                data.error || "Login failed.";

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";

            return;
        }


        // Save logged-in donor information
        localStorage.setItem(
            "donor",
            JSON.stringify(data)
        );


        message.textContent =
            "Login successful! Redirecting...";


        // Go to dashboard
        setTimeout(function () {

            window.location.href = "/dashboard";

        }, 500);


    } catch (error) {

        console.error(error);

        message.textContent =
            "Could not connect to the server.";

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }

});
