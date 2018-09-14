const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "delete";

exports.onLoad = api => {
    api.commands.add("delete", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];

            if(account !== undefined) {
                if(account.amount >= 50) {
                    delete accountDB[msg.author.username.toLowerCase()];
                
                    // Writes data to JSON.
                    fsn.writeJSON("./accounts.json", accountDB, {
                        replacer: null,
                        spaces: 4
                    }).then(() => {
                        // Sends message.
                        msg.channel.send({embed: {
                            "title": ":x: Delete Account",
                            "description": "You successfully deleted your account.",
                            "thumbnail": {
                                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});
                        
                        // Logs in console.
                        console.log(colors.green(`${msg.author.username} deleted their account.`));
                    }).catch((err) => {
                        if(err) {
                            msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``);
                        }
                    });
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        "title": ":x: Delete Account",
                        "description": "You do not have enough Cash to delete your account.",
                        "thumbnail": {
                            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} didn't have enough Cash to delete their account.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    "title": ":x: Delete Account",
                    "description": "You do not have an acconut to delete.",
                    "thumbnail": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to delete.`));
            }
        });
    });
};
