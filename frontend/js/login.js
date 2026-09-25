document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#login-form");
    const message = document.querySelector("#form-message");
    const button = document.querySelector("#login-button");

    const passwordInput = document.querySelector("#password");
    const toggleButton = document.querySelector("#toggle-password");
    const iconEye = toggleButton
        ? toggleButton.querySelector(".icon-eye")
        : null;
    const iconEyeOff = toggleButton
        ? toggleButton.querySelector(".icon-eye-off")
        : null;


    if (!form) {
        console.error("Login form not found.");
        return;
    }


    function showMessage(text, type) {
        message.textContent = text;
        message.className = `form-message ${type}`;
    }


    /*
     * Show/Hide password button.
     * Purely a display toggle on the existing #password input —
     * doesn't touch what gets read/sent on submit.
     */
    if (toggleButton && passwordInput) {

        toggleButton.addEventListener("click", () => {

            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";

            toggleButton.setAttribute(
                "aria-pressed",
                isHidden ? "true" : "false"
            );

            toggleButton.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );

            if (iconEye && iconEyeOff) {
                iconEye.hidden = isHidden;
                iconEyeOff.hidden = !isHidden;
            }

        });
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
                "Please enter your student ID and password.",
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
                result.message || "Login successful. Redirecting…",
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
                error.message ||
                    "We couldn't sign you in. Check your ID and password and try again.",
                "error"
            );

        } finally {

            button.disabled = false;
            button.textContent = "Sign In";

        }

    });

});