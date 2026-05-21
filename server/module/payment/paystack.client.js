const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey() {
    if (!process.env.PAYSTACK_SECRET_KEY) {
        const error = new Error("PAYSTACK_SECRET_KEY is not configured");
        error.statusCode = 500;
        throw error;
    }

    return process.env.PAYSTACK_SECRET_KEY;
}

async function request(path, options = {}) {
    const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${getSecretKey()}`,
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });
    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Paystack request failed");
        error.statusCode = response.status;
        throw error;
    }

    return data;
}

function initializeTransaction(payload) {
    return request("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

function verifyTransaction(reference) {
    return request(`/transaction/verify/${reference}`);
}

module.exports = {
    initializeTransaction,
    verifyTransaction
};
