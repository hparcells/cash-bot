const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "pickpocket";

exports.onLoad = api => {
    api.commands.add("pickpocket", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let args = msg.content.substring(12).split(" ");
            let recipientID = args[0].replace("<", "");
            recipientID = recipientID.replace("!", "");
            recipientID = recipientID.replace("@", "");
            recipientID = recipientID.replace(">", "");
            let win = Math.floor(Math.random() * 10) + 1;
            let account = accountDB[msg.author.username.toLowerCase()];
            let recipientAccount = accountDB[api.client.users.get(recipientID).username.toLowerCase()];

            // Checks if both users have an account.
            if(account !== undefined) {
                if(recipientAccount !== undefined) {
                    // Checks if recipient is the user.
                    if(msg.author.id !== api.client.users.get(recipientID).id) {
                        if(win === 10) {
                            let accountAfter = account.amount + (recipientAccount.amount / 10);
                            let recipientAfter = recipientAccount.amount - (recipientAccount / 10);
                            
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
                                msg.reply(`You successfully pickpocketed ${api.client.users.get(recipientID).username} and got 10% of their money.`);
                                
                                // Logs in console.
                                console.log(colors.green(`${msg.author.username} pickpocketed ${api.client.users.get(recipientID).username} and succeeded.`));
                            });
                        }else {
                            let accountAfter = account.amount - (account.amount / 10);
                            let recipientAfter = recipientAccount.amount + (account.amount / 10);
                            
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
                                msg.reply(`You failed to pickpocket ${api.client.users.get(recipientID).username} and they got 10% of your money.`);
                                
                                // Logs in console.
                                console.log(colors.green(`${msg.author.username} pickpocketed ${api.client.users.get(recipientID).username} and failed.`));
                            });
                        }
                    }else {
                        msg.reply("You can not pickpocket yourself.");
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
    });
};
