const colors = require("colors");
const r = require("rethinkdb");
const rethinkdb = require("../index");
const database = require("../database");

exports.id = "flip";

exports.onLoad = api => {
    api.commands.add("flip", async (msg) => {
        let args = msg.content.substring(6).split(" ");
        let side = args[0].toLowerCase();
        let bet = Math.round(args[1]);

        // Checks if user account exists.
        if(database.hasAccount(msg.author.id)) {
            // Checks if side is valid.
            if(side === "heads" || side === "tails") {
                // Checks if bet is NaN.
                if(!isNaN(bet)) {
                    // Checks if bet is greater than 0;
                    if(bet > 0) {
                        // Checks if user has enough money.
                        if(bet <= await database.getAmount(msg.author.id)) {
                            let number = Math.floor(Math.random() * 2) + 1;
                            let winningSide = undefined;
                            if(number === 1) {
                                winningSide = "heads";
                            }else {
                                winningSide = "tails";
                            }

                            // Send message.
                            let m = await msg.channel.send({embed: {
                                title: ":question: Flip",
                                description: `${msg.author.username} flips a coin.`,
                                thumbnail: {
                                    url: "http://numismatics.org/pocketchange/wp-content/uploads/sites/3/Penny-obverse.png"
                                }
                            }});

                            let messageID = m.id;

                            // Get message sent.
                            let messages = await msg.channel.fetchMessages({
                                around: messageID,
                                limit: 1
                            });
                            const fetchedMsg = messages.first();
                            
                            setTimeout(async () => {
                                if(winningSide === side) {
                                    // Edit the message.
                                    fetchedMsg.edit({embed: {
                                        title: ":white_check_mark: Flip",
                                        description: `${msg.author.username} flipped a coin and won.`,
                                        fields: [{
                                            name: "Side Landed On",
                                            value: winningSide
                                        }, {
                                            name: "Amount Won",
                                            value: `${bet} Cash`
                                        }],
                                        thumbnail: {
                                            url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
                                        }
                                    }});

                                    let accountAfter = await database.getAmount(msg.author.id) + bet;

                                    // Write to database.
                                    database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));

                                    // Logs in console.
                                    console.log(colors.green(`${msg.author.username} flipped a coin and won.`));
                                }else {
                                    // Edit the message.
                                    fetchedMsg.edit({embed: {
                                        title: ":x: Flip",
                                        description: `${msg.author.username} flipped a coin and lost.`,
                                        fields: [{
                                            name: "Side Landed On",
                                            value: winningSide
                                        }, {
                                            name: "Amount Lost",
                                            value: `${bet} Cash`
                                        }],
                                        thumbnail: {
                                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                        }
                                    }});

                                    let accountAfter = await database.getAmount(msg.author.id) - bet;

                                    // Write to database.
                                    database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));

                                    // Logs in console.
                                    console.log(colors.green(`${msg.author.username} flipped a coin and lost.`));
                                }
                            }, 1000);
                        }else {
                            // Sends message.
                            msg.channel.send({embed: {
                                title: ":x: Flip",
                                description: "You do not have enough Cash for that action.",
                                thumbnail: {
                                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                }
                            }});

                            // Logs in console.
                            console.log(colors.red(`${msg.author.username} didn't have enough Cash to run the flip command.`));
                        }
                    }else {
                        // Sends message.
                        msg.channel.send({embed: {
                            title: ":x: Flip",
                            description: "You cannot bet negative numbers nor zero.",
                            thumbnail: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});

                        // Logs in console.
                        console.log(colors.red(`${msg.author.username} gave a negative number or zero for the flip command.`));
                    }
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Flip",
                        description: `${args[1]} is an invalid number.`,
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});
    
                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} gave a invalid number for the flip command.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Flip",
                    description: `${args[0]} is not a side. Please use \`heads\` or \`tails\`.`,
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} gave a invalid side for the flip command.`));
            }
        }else {
            // Sends message.
            msg.channel.send({embed: {
                title: ":x: Flip",
                description: "You do not have an account, use `$new` to create a new account.",
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                }
            }});

            // Logs in console.
            console.log(colors.red(`${msg.author.username} didn't have an account to run the flip command.`));
        }
    });
};
