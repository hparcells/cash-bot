const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "wallet";

exports.onLoad = api => {
    api.commands.add("wallet", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.id];

            let timeLeft = (account.lastClaimed + 86400000) - parseInt(Date.now());
            let seconds = parseInt((timeLeft / 1000) % 60);
            let minutes = parseInt((timeLeft / (1000 * 60)) % 60);
            let hours = parseInt((timeLeft / (1000 * 60 * 60)) % 24);

            let stringTimeLeft = undefined;
            if(Math.sign(timeLeft) === 1) {
                stringTimeLeft = `${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
            }else {
                stringTimeLeft = "Ready to Claim!";
            }

            if(account !== undefined) {
                msg.channel.send({embed: {
                    title: ":moneybag: Your Wallet",
                    fields: [{
                        name: "Cash",
                        value: `${account.amount} Cash`
                    }, {
                        name: "Time Until Next Daily",
                        value: stringTimeLeft
                    }],
                    thumbnail: {
                        url: "http://www.stickpng.com/assets/images/580b585b2edbce24c47b2878.png"
                    }
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
