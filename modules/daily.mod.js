const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "daily";

exports.onLoad = api => {
    api.commands.add("daily", (msg) => {        
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.id];

            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if the time is right to claim.
                if(account.lastClaimed + 86400000 <= Date.now() || account.lastClaimed === undefined) {
                    // Get cash.
                    msg.channel.send({embed: {
                        title: ":alarm_clock: Your Daily Cash",
                        description: "You claimed your daily **20 Cash**. You can get your next daily cash in 24 hours.",
                        thumbnail: {
                            url: "https://images.emojiterra.com/twitter/512px/23f0.png"
                        }
                    }});

                    let amount = parseFloat(Number(account.amount + 20).toFixed(2));
                    accountDB[msg.author.id] = {
                        owner: msg.author.username,
                        amount: amount,
                        lastClaimed: Date.now(),
                        private: account.private
                    };

                    // Writes data to JSON.
                    fsn.writeJSON("./accounts.json", accountDB, {
                        replacer: null,
                        spaces: 4
                    });

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} used the daily command and got their daily cash.`));
                }else {
                    let timeLeft = (account.lastClaimed + 86400000) - parseInt(Date.now());
                    let seconds = parseInt((timeLeft / 1000) % 60);
                    let minutes = parseInt((timeLeft / (1000 * 60)) % 60);
                    let hours = parseInt((timeLeft / (1000 * 60 * 60)) % 24);

                    msg.channel.send({embed: {
                        title: ":hourglass: Your Daily Cash",
                        description: `You can not claim your daily cash. Please wait **${hours} hours, ${minutes} minutes, and ${seconds} seconds**, and then try again.`,
                        thumbnail: {
                            url: "https://images.emojiterra.com/twitter/512px/231b.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} used the daily command and didn't get their daily cash.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Fifty Fifty",
                    description: "You do not have an account, use `$new` to create a new account.",
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to run the daily command.`));
            }
        });
    });
};
