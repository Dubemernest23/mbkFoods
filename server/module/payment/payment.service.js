const paystackClient = require("./paystack.client");

async function initialize(payload) {
    return paystackClient.initializeTransaction({
        email: payload.email,
        amount: Number(payload.amount || 0) * 100,
        metadata: {
            orderId: payload.orderId
        },
        callback_url: payload.callbackUrl
    });
}

async function verify(reference) {
    return paystackClient.verifyTransaction(reference);
}

module.exports = {
    initialize,
    verify
};
