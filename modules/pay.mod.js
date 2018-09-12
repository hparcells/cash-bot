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

        let amount = parseFloat(Number(args[1]).toFixed(2));

        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];
            let recipientAccount = accountDB[api.client.users.get(recipientID).username.toLowerCase()];

            // Checks if both users have an account.
            if(account !== undefined) {
                if(recipientAccount !== undefined) {
                    // Checks if recipient is the user.
                    if(msg.author.id !== api.client.users.get(recipientID).id) {
                        // Checks if payment is positive.
                        if(amount > 0 && amount !== undefined) {
                            // Checks if user has enough money.
                            if(amount <= account.amount) {
                                let accountAfter = account.amount - amount;
                                let recipientAfter = recipientAccount.amount + amount;
    
                                // Set JSON information.
                                accountDB[msg.author.username.toLowerCase()] = {
                                    "owner": msg.author.id,
                                    "amount": accountAfter
                                }
    
                                accountDB[api.client.users.get(recipientID).username.toLowerCase()] = {
                                    "owner": recipientID,
                                    "amount": recipientAfter
                                }
    
                                // Writes data to JSON.
                                fsn.writeJSON("./accounts.json", accountDB, {
                                    replacer: null,
                                    spaces: 4
                                }).then(() => {
                                    msg.reply(`You successfully paid ${api.client.users.get(recipientID)} **${args[1]} Cash**.`);
    
                                    // Logs in console.
                                    console.log(colors.green(`${msg.author.username} paid ${api.client.users.get(recipientID).username} ${args[1]} Cash.`));
                                });
                            }else {
                                msg.reply("You do not have enough Cash for that action.");

                                // Logs in console.
                                console.log(colors.red(`${msg.author.username} didn't have enough Cash to run the pay command.`));
                            }
                        }else {
                            msg.reply("You cannot pay negative numbers nor zero.");
                        }
                    }else {
                        msg.reply("You can not pay yourself.")
                    }
                }else {
                    msg.reply(`${api.client.users.get(recipientID).username} does not have an account.`);

                    // Logs in console.
                    console.log(colors.red(`${api.client.users.get(recipientID).username} didn't have an account to recieve a payment from ${msg.author.username}.`));
                }
            }else {
                msg.reply("You do not have an account, use `$new` to create a new account.");

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to run the pay command.`));
            }
        });
    })
};
