const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "daily";

exports.onLoad = api => {
    api.commands.add("daily", (msg) => {        
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];

            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if the time is right to claim.
                if(account.lastClaim + 86400000 === Date.now() || account.lastClaim === undefined) {
                    // Get cash.
                    msg.reply("You claimed your daily **20 Cash**. You can get your next daily cash in 24 hours.");
                    let amount = account.amount + 20;
                    accountDB[msg.author.username.toLowerCase()] = {
                        "owner": msg.author.id,
                        "amount": amount,
                        "lastClaim": parseInt(Date.now())
                    }

                    // Writes data to JSON.
                    fsn.writeJSON("./accounts.json", accountDB, {
                        replacer: null,
                        spaces: 4
                    });

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} used the daily command and got their daily cash.`));
                }else {
                    let timeLeft = (account.lastClaim + 86400000) - parseInt(Date.now());
                    let seconds = parseInt((timeLeft / 1000) % 60);
                    let minutes = parseInt((timeLeft / (1000 * 60)) % 60);
                    let hours = parseInt((timeLeft / (1000 * 60 * 60)) % 24);

                    msg.reply(`You can not claim your daily cash. Please wait ${hours} hours, ${minutes} minutes, and ${seconds} seconds, and then try again.`);

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} used the daily command and didn't get their daily cash.`));
                }
            }else {
                msg.reply("You do not have an account, use `$new` to create a new account.");
            }
        });
    })
};
