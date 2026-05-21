const paymentService = require("./payment.service");

async function initializePayment(req, res, next) {
    try {
        const payment = await paymentService.initialize({
            email: req.user.email,
            amount: req.body.amount,
            orderId: req.body.orderId,
            callbackUrl: req.body.callbackUrl
        });

        return res.status(200).json({ success: true, data: payment });
    } catch (error) {
        return next(error);
    }
}

async function verifyPayment(req, res, next) {
    try {
        const payment = await paymentService.verify(req.params.reference);

        return res.status(200).json({ success: true, data: payment });
    } catch (error) {
        return next(error);
    }
}

function webhook(req, res) {
    return res.status(200).json({
        success: true,
        message: "Paystack webhook received. Signature verification still needs to be implemented."
    });
}

module.exports = {
    initializePayment,
    verifyPayment,
    webhook
};
