const colors = require("colors");
const database = require("../database");

exports.id = "daily";

exports.onLoad = api => {
    api.commands.add("daily", async (msg) => {        
        // Checks if account already exists.
        if(await database.hasAccount(msg.author.id)) {
            // Checks if the time is right to claim.
            if(await database.getLastClaimed(msg.author.id) + 86400000 <= Date.now()) {
                // Send message
                msg.channel.send({embed: {
                    title: ":alarm_clock: Your Daily Cash",
                    description: "You claimed your daily **20 Cash**. You can get your next daily cash in 24 hours.",
                    thumbnail: {
                        url: "https://images.emojiterra.com/twitter/512px/23f0.png"
                    }
                }});

                let amount = await database.getLastClaimed(msg.author.id) + 20;

                // Writes to database.
                database.setBalance(msg.author, amount, Date.now(), await database.getPrivateStatus(msg.author.id));

                // Logs in console.
                console.log(colors.green(`${msg.author.username} used the daily command and got their daily cash.`));
            }else {
                let timeLeft = (await database.getLastClaimed(msg.author.id) + 86400000) - Date.now();
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
                console.log(colors.red(`${msg.author.username} used the daily command and didn't get their daily cash.`));
            }
        }else {
            // Sends message.
            msg.channel.send({embed: {
                title: ":x: Your Daily Cash",
                description: "You do not have an account, use `$new` to create a new account.",
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                }
            }});

            // Logs in console.
            console.log(colors.red(`${msg.author.username} didn't have an account to run the daily command.`));
        }
    });
};
