const orders = [];

function createDraftOrder(payload) {
    const order = {
        id: orders.length + 1,
        customerId: payload.customer.id,
        items: payload.items,
        deliveryAddress: payload.deliveryAddress,
        note: payload.note,
        status: "pending_payment",
        createdAt: new Date().toISOString()
    };

    orders.push(order);
    return order;
}

function findByCustomer(customerId) {
    return orders.filter((order) => order.customerId === customerId);
}

function findById(id) {
    return orders.find((order) => order.id === Number(id));
}

module.exports = {
    createDraftOrder,
    findByCustomer,
    findById
};
