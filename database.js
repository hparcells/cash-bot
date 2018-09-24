const r = require("rethinkdb");
const rethink = require("./index");

module.exports = {
    async hasAccount(id) {
        return await r.table("accounts").getAll(id).count().eq(1).run(rethink.connection);
    },

    setBalance(author, amount, lastClaimed, private) {
        r.table("accounts").insert(
            {
                id: author.id,
                username: author.username,
                amount: amount,
                lastClaimed: lastClaimed,
                private: private
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
    },

    async getAmount(userID) {
        return await r.table("accounts").get(userID).getField("amount").run(rethink.connection);
    },  
    
    async getLastClaimed(userID) {
        return await r.table("accounts").get(userID).getField("lastClaimed").run(rethink.connection);
    },

    async getPrivateStatus(userID) {
        return await r.table("accounts").get(userID).getField("private").run(rethink.connection);
    },

    async getTimeUntilNextDaily(userID) {
        let lastClaimed = await module.exports.getLastClaimed(userID);
        let nextClaimTime = lastClaimed + 86400000;

        return nextClaimTime - parseInt(Date.now());
    }
}
