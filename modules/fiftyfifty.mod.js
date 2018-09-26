const colors = require("colors");
const database = require("../database");

exports.id = "fiftyfifty";

exports.onLoad = api => {
    api.commands.add("fiftyfifty", async (msg) => {
        let bet = Math.round(msg.content.substring(12));

        // Checks if account already exists.
        if(await database.hasAccount(msg.author.id)) {
            // Checks if bet is NaN.
            if(!isNaN(bet)) {
                // Checks if bet is greater than 0;
                if(bet > 0) {
                    // Checks if user has enough money.
                    if(bet <= await database.getAmount(msg.author.id)) {
                        /* 
                        1 = Win
                        2 = Lose
                        */
                        let win = Math.floor(Math.random() * 2) + 1;

                        if(win === 1) {
                            let amount = await database.getAmount(msg.author.id) + bet;

                            // Writes to database.
                            database.setBalance(msg.author, amount, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));

                            // Send message.
                            msg.channel.send({embed: {
                                title: ":white_check_mark: Fifty Fifty",
                                description: `You won the 50/50 and got **${bet} Cash**`,
                                thumbnail: {
                                    url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
                                }
                            }});

                            // Logs in console.
                            console.log(colors.green(`${msg.author.username} used the fiftyfifty command and won.`));
                        }else {
                            let amount = await database.getAmount(msg.author.id) - bet;

                            // Writes to database.
                            database.setBalance(msg.author, amount, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));

                            // Send message.
                            msg.channel.send({embed: {
                                title: ":x: Fifty Fifty",
                                description: `You lost the 50/50 and lost **${bet} Cash**`,
                                thumbnail: {
                                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                }
                            }});

                            // Logs in console.
                            console.log(colors.green(`${msg.author.username} used the fiftyfifty command and lost.`));
                        }

                    }else {
                        // Sends message.
                        msg.channel.send({embed: {
                            title: ":x: Fifty Fifty",
                            description: "You do not have enough Cash for that action.",
                            thumbnail: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});

                        // Logs in console.
                        console.log(colors.red(`${msg.author.username} didn't have enough Cash to run the fiftyfifty command.`));
                    }
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Fifty Fifty",
                        description: "You cannot bet negative numbers nor zero.",
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} gave a negative number or zero for the fiftyfifty command.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Fifty Fifty",
                    description: `${msg.content.substring(12)} is not a number.`,
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't give a valid number for the fiftyfifty command.`));
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
            console.log(colors.red(`${msg.author.username} didn't have an account to run the fiftyfifty command.`));
        }
    });
};
