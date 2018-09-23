const colors = require("colors");
const r = require("rethinkdb");
const rethink = require("../index");
const database = require("../database");

exports.id = "wallet";

exports.onLoad = api => {
    api.commands.add("wallet", (msg) => {
        if(await database.hasAccount(msg.author.id)) {
            r.table("accounts").get(msg.author.id).run(rethink.connection, function(err, result) {
                if(err) {
                    throw err;
                }
    
                // Sends message.
                msg.channel.send({embed: {
                    title: ":moneybag: Your Wallet",
                    fields: [{
                        name: "Cash",
                        value: `${result.amount} Cash`
                    }],
                    thumbnail: {
                        url: "http://www.stickpng.com/assets/images/580b585b2edbce24c47b2878.png"
                    }
                }});
            });

            // Logs in console.
            console.log(colors.green(`${msg.author.username} used the wallet command.`));
        }else {
            // Sends message.
            msg.reply("You do not have an account, use `$new` to create a new account.");

            // Logs in console.
            console.log(colors.red(`${msg.author.username} didn't have an account to run the wallet command.`));
        }
    });
};