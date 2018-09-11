const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "wallet";

exports.onLoad = api => {
    api.commands.add("wallet", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];

            if(account !== undefined) {
                msg.channel.send({embed: {
                    "title": ":moneybag: Your Wallet",
                    "description": `${account.amount} Cash`
                }});

                // Logs in console.
                console.log(colors.green(`${msg.author.username} used the wallet command.`));
            }else {
                msg.reply("You do not have an account, use `$new` to create a new account.");

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to run the wallet command.`));
            }
        });
    });
};
