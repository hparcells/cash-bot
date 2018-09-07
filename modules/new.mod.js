const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "new";

exports.onLoad = api => {
    api.commands.add("new", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];

            // Checks if user is able to create a new account.
            if(account === undefined) {
                // Creates new account.
                accountDB[msg.author.username.toLowerCase()] = {
                    "owner": msg.author.id,
                    "amount": 10
                }

                // Writes Data to JSON.
                fsn.writeJSON("./accounts.json", accountDB, {
                    replacer: null,
                    spaces: 4
                }).then(() => {
                    // Sends a message to the user.
                    msg.reply("You have successfully created your new account. You have been given **10 Betcoins** to start with.");

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} created a new account.`));
                }).catch((err) => {
                    if(err) {
                        msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``);   
                    }
                });
            }else {
                msg.reply("You already have an account.");

                // Logs in console.
                console.log(colors.red(`${msg.author.username} couldn't create a new account.`));
            }
        });
    })
};
