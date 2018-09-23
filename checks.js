const r = require("rethinkdb");
const database = require("./index");

module.exports = {
    async hasAccount(id) {
        console.log(typeof await r.table("accounts").getAll(id).count().eq(1).run(database.connection))
        return await r.table("accounts").getAll(id).count().eq(1).run(database.connection);
    }
}
