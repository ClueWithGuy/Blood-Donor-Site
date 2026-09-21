document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#login-form");
    const message = document.querySelector("#form-message");
    const button = document.querySelector("#login-button");


    if (!form) {
        console.error("Login form not found.");
        return;
    }


    function showMessage(text, type) {
        message.textContent = text;
        message.className = `form-message ${type}`;
    }


    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const schoolId = document
            .querySelector("#school-id")
            .value
            .trim();

        const password = document
            .querySelector("#password")
            .value;


        if (!schoolId || !password) {
            showMessage(
                "Please enter your school ID and password.",
                "error"
            );

            return;
        }


        button.disabled = true;
        button.textContent = "Signing in...";

        showMessage("", "");


        try {

            const result = await API.login(
                schoolId,
                password
            );


            showMessage(
                result.message || "Login successful.",
                "success"
            );


            /*
             * Store the logged-in donor information
             * so the dashboard can use it.
             */
            localStorage.setItem(
                "school_id",
                result.school_id
            );

            localStorage.setItem(
                "name",
                result.name
            );

            localStorage.setItem(
                "email",
                result.email
            );


            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);


        } catch (error) {

            showMessage(
                error.message || "Login failed.",
                "error"
            );

        } finally {

            button.disabled = false;
            button.textContent = "Sign In";

        }

    });

});
