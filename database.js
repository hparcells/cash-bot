const r = require("rethinkdb");
const rethink = require("./index");

module.exports = {
    async hasAccount(id) {
        return await r.table("accounts").getAll(id).count().eq(1).run(rethink.connection);
    },

    setBalance(author, amount) {
        r.table("accounts").insert(
            {
                id: author.id,
                username: author.username,
                amount: amount
            },
            {conflict: "update"}
        ).run(rethink.connection, function(err) {
            if(err) {
                throw err;
            }
        });
    },

    deleteAccount(userID) {
        r.table("accounts").get(userID).delete().run(rethink.connection);
    }
}
