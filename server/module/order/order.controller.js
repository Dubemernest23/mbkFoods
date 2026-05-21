const orderService = require("./order.service");

function createOrder(req, res) {
    const order = orderService.createDraftOrder({
        customer: req.user,
        items: req.body.items || [],
        deliveryAddress: req.body.deliveryAddress,
        note: req.body.note
    });

    return res.status(201).json({
        success: true,
        message: "Draft order created. Persist this to MySQL in the next backend pass.",
        data: order
    });
}

function getUserOrders(req, res) {
    return res.status(200).json({
        success: true,
        data: orderService.findByCustomer(req.user.id)
    });
}

function getOrderById(req, res) {
    const order = orderService.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: order });
}

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders
};
