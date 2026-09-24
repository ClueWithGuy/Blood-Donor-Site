document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#register-form");
    const message = document.querySelector("#form-message");
    const button = document.querySelector("#register-button");
    const clearButton = document.querySelector("#clear-form");

    const passwordInput = document.querySelector("#password");
    const toggleButton = document.querySelector("#toggle-password");
    const iconEye = toggleButton
        ? toggleButton.querySelector(".icon-eye")
        : null;
    const iconEyeOff = toggleButton
        ? toggleButton.querySelector(".icon-eye-off")
        : null;


    if (!form) {
        console.error("Registration form not found.");
        return;
    }


    function showMessage(text, type) {
        message.textContent = text;
        message.className = `form-message ${type}`;
    }


    /*
     * Show/Hide password button — same pattern as login.js.
     * Purely a display toggle, doesn't touch what gets submitted.
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


    /*
     * Clear Form button — resets every field, the message box, and the
     * password visibility state back to hidden.
     */
    if (clearButton) {

        clearButton.addEventListener("click", () => {

            form.reset();
            showMessage("", "");

            if (passwordInput && passwordInput.type === "text") {
                passwordInput.type = "password";
                if (toggleButton) {
                    toggleButton.setAttribute("aria-pressed", "false");
                    toggleButton.setAttribute("aria-label", "Show password");
                }
                if (iconEye && iconEyeOff) {
                    iconEye.hidden = false;
                    iconEyeOff.hidden = true;
                }
            }

            document.querySelector("#school-id").focus();
        });
    }


    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const schoolId = document
            .querySelector("#school-id")
            .value
            .trim();

        const name = document
            .querySelector("#name")
            .value
            .trim();

        const email = document
            .querySelector("#email")
            .value
            .trim();

        const cellphone = document
            .querySelector("#cellphone")
            .value
            .trim();

        const whatsapp = document
            .querySelector("#whatsapp")
            .value
            .trim();

        const bloodGroup = document
            .querySelector("#blood-group")
            .value;

        const gender = document
            .querySelector("#gender")
            .value;

        const dateOfBirth = document
            .querySelector("#date-of-birth")
            .value;

        const department = document
            .querySelector("#department")
            .value;

        const batch = document
            .querySelector("#batch")
            .value
            .trim();

        const presentAddress = document
            .querySelector("#present-address")
            .value
            .trim();

        const password = document
            .querySelector("#password")
            .value;


        // WhatsApp is optional — every other field here is required.
        if (
            !schoolId ||
            !name ||
            !email ||
            !cellphone ||
            !bloodGroup ||
            !gender ||
            !dateOfBirth ||
            !department ||
            !batch ||
            !presentAddress ||
            !password
        ) {
            showMessage(
                "Please fill in all required fields.",
                "error"
            );

            return;
        }


        // Stronger password check: at least 8 characters, one letter, one number.
        const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if (!strongPassword.test(password)) {
            showMessage(
                "Password must be at least 8 characters and include a letter and a number.",
                "error"
            );

            return;
        }


        button.disabled = true;
        button.textContent = "Creating account...";

        showMessage("", "");


        try {

            const result = await API.register({
                school_id: schoolId,
                name: name,
                email: email,
                password: password,
                cellphone: cellphone,
                blood_group: bloodGroup,

                // Newer fields — confirm these key names match the backend's
                // expected fields before relying on them being saved.
                whatsapp: whatsapp || null,
                gender: gender,
                date_of_birth: dateOfBirth,
                department: department,
                batch: batch,
                present_address: presentAddress
            });


            showMessage(
                result.message || "Account created successfully.",
                "success"
            );


            form.reset();


            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);


        } catch (error) {

            showMessage(
                error.message ||
                    "We couldn't create your account. Please check your details and try again.",
                "error"
            );

        } finally {

            button.disabled = false;
            button.textContent = "Create Account";

        }

    });

});