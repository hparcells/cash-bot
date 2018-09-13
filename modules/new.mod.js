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
                    "amount": parseFloat(Number(10).toFixed(2)),
                    "lastClaimed": Date.now() - 86400000
                };

                // Writes data to JSON.
                fsn.writeJSON("./accounts.json", accountDB, {
                    replacer: null,
                    spaces: 4
                }).then(() => {
                    // Send message.
                    msg.channel.send({embed: {
                        "title": ":white_check_mark: New Account",
                        "description": "You have successfully created your new account. You have been given **10 Cash** to start with.",
                        "thumbnail": {
                            "url": "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} created a new account.`));
                }).catch((err) => {
                    if(err) {
                        msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``);   
                    }
                });
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    "title": ":x: New Account",
                    "description": "You already have an account.",
                    "thumbnail": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} couldn't create a new account because they already have an account.`));
            }
        });
    });
};
