document.addEventListener("DOMContentLoaded", () => {
    const splash = document.querySelector("#splash-screen");
    const onboarding = document.querySelector("#onboarding");
    const app = document.querySelector("#app");

    if (!splash || !onboarding || !app) {
        return;
    }

    // Show the application after the splash screen.
    setTimeout(() => {
        splash.classList.add("hidden");
        app.classList.remove("hidden");
    }, 800);
});
