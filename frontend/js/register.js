document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#register-form");
    const message = document.querySelector("#form-message");
    const button = document.querySelector("#register-button");


    if (!form) {
        console.error("Registration form not found.");
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

        const bloodGroup = document
            .querySelector("#blood-group")
            .value;

        const password = document
            .querySelector("#password")
            .value;


        if (
            !schoolId ||
            !name ||
            !email ||
            !cellphone ||
            !bloodGroup ||
            !password
        ) {
            showMessage(
                "Please fill in all fields.",
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
                blood_group: bloodGroup
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
                error.message || "Registration failed.",
                "error"
            );

        } finally {

            button.disabled = false;
            button.textContent = "Create Account";

        }

    });

});
