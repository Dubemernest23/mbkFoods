const users = [];

function findById(id) {
    return users.find((user) => user.id === Number(id));
}

module.exports = {
    findById
};
