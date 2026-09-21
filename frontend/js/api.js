const API = {
    async request(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        let data = {};

        try {
            data = await response.json();
        } catch {
            // Response had no JSON body.
        }

        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong"
            );
        }

        return data;
    },


    register(user) {
        return this.request("/api/register", {
            method: "POST",
            body: JSON.stringify(user)
        });
    },


    login(schoolId, password) {
        return this.request("/api/login", {
            method: "POST",
            body: JSON.stringify({
                school_id: schoolId,
                password: password
            })
        });
    },


    getDonors(bloodGroup = "") {
        const url = bloodGroup
            ? `/api/donors?blood_group=${encodeURIComponent(bloodGroup)}`
            : "/api/donors";

        return this.request(url);
    },


    getDonor(schoolId) {
        return this.request(
            `/api/donors/${encodeURIComponent(schoolId)}`
        );
    },


    getDashboard(schoolId) {
        return this.request(
            `/api/dashboard/${encodeURIComponent(schoolId)}`
        );
    },


    getRequests() {
        return this.request(
            "/api/requests"
        );
    },


    createRequest(data) {
        return this.request(
            "/api/requests",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    getDonations(schoolId) {
        return this.request(
            `/api/donors/${encodeURIComponent(schoolId)}/donations`
        );
    },


    createDonation(schoolId, data = {}) {
        return this.request(
            `/api/donors/${encodeURIComponent(schoolId)}/donations`,
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    updateDonor(schoolId, data) {
        return this.request(
            `/api/donors/${encodeURIComponent(schoolId)}`,
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    },


    updateAvailability(schoolId, isActive) {
        return this.request(
            `/api/donors/${encodeURIComponent(schoolId)}/availability`,
            {
                method: "PUT",
                body: JSON.stringify({
                    is_active: isActive
                })
            }
        );
    },


    getMessages(schoolId) {
        return this.request(
            `/api/messages?school_id=${encodeURIComponent(schoolId)}`
        );
    },


    sendMessage(data) {
        return this.request(
            "/api/messages",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    markMessageRead(messageId) {
        return this.request(
            `/api/messages/${encodeURIComponent(messageId)}/read`,
            {
                method: "PUT"
            }
        );
    }
};
