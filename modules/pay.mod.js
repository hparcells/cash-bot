const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "pay";

exports.onLoad = api => {
    api.commands.add("pay", (msg) => {
        let args = msg.content.substring(5).split(" ");
        let recipientID = args[0].replace("<", "");
        recipientID = recipientID.replace("!", "");
        recipientID = recipientID.replace("@", "");
        recipientID = recipientID.replace(">", "");

        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];
            let recipientAccount = accountDB[api.client.users.get(recipientID).username.toLowerCase()];

            // Checks if both users have an account.
            if(account !== undefined) {
                if(recipientAccount !== undefined) {
                    // Gives cash.
                    let accountAfter = account.amount - parseInt(args[1]);
                    let recipientAfter = recipientAccount.amount + parseInt(args[1]);

                    // Set JSON information.
                    accountDB[msg.author.username.toLowerCase()] = {
                        "owner": msg.author.id,
                        "amount": accountAfter
                    }

                    accountDB[api.client.users.get(recipientID).username.toLowerCase()] = {
                        "owner": msg.author.id,
                        "amount": recipientAfter
                    }

                    // Writes data to JSON.
                    fsn.writeJSON("./accounts.json", accountDB, {
                        replacer: null,
                        spaces: 4
                    }).then(() => {
                        // Logs in console.
                        console.log(colors.green(`${msg.author.username} paid ${api.client.users.get(recipientID).username} ${args[1]} Cash.`));
                    });
                }else {
                    msg.reply(`${api.client.users.get(recipientID).username} does not have an account.`);
                }
            }else {
                msg.reply("You do not have an account, use `$new` to create a new account.");
            }
        });
    })
};
