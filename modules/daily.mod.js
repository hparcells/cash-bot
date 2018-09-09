const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "daily";

let canClaim = true;

exports.onLoad = api => {
    api.commands.add("daily", (msg) => {        
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];

            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if the time is right to claim.
                if(canClaim) {
                    canClaim = false;

                    // Get cash.
                    msg.reply("You claimed your daily 20 cash. You can get your next daily cash in 24 hours.");
                    let amount = account.amount + 20;
                    accountDB[msg.author.username.toLowerCase()] = {
                        "owner": msg.author.id,
                        "amount": amount
                    }

                    // Writes data to JSON.
                    fsn.writeJSON("./accounts.json", accountDB, {
                        replacer: null,
                        spaces: 4
                    });

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} used the daily command and got their daily cash.`));

                    setTimeout(() => canClaim = true, 86400000);
                }else {
                    msg.reply(`You can not claim your daily cash. Please wait.`);

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} used the daily command and didn't get their daily cash.`));
                }
            }else {
                msg.reply("You do not have an account, use `$new` to create a new account.");
            }
        });
    })
};
