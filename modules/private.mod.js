const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "private";

exports.onLoad = api => {
    api.commands.add("private", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.id];

            if(account.private) {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":unlock: Private",
                    description: "You have publicised your account.",
                    thumbnail: {
                        url: "https://images.emojiterra.com/twitter/v11/512px/1f513.png"
                    }
                }});

                // Set JSON information.
                accountDB[msg.author.id] = {
                    owner: msg.author.username,
                    amount: account.amount,
                    lastClaimed: account.lastClaimed,
                    private: false
                };

                // Logs in console.
                console.log(colors.green(`${msg.author.username} has publicised their account.`));
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":lock: Private",
                    description: "You have privated your account.",
                    thumbnail: {
                        url: "https://png2.kisspng.com/20180511/rrw/kisspng-emoji-padlock-troy-email-5af611386fc727.2510723615260757044579.png"
                    }
                }});

                // Set JSON information.
                accountDB[msg.author.id] = {
                    owner: msg.author.username,
                    amount: account.amount,
                    lastClaimed: account.lastClaimed,
                    private: true
                };

                // Logs in console.
                console.log(colors.green(`${msg.author.username} has privated their account.`));
            }

            // Writes data to JSON.
            fsn.writeJSON("./accounts.json", accountDB, {
                replacer: null,
                spaces: 4
            });
        });
    });
};
