const colors = require("colors");
const database = require("../database");

exports.id = "pay";

exports.onLoad = api => {
    api.commands.add("pay", async (msg) => {
        let args = msg.content.substring(5).split(" ");
        let recipientID = args[0].replace("<", "");
        recipientID = recipientID.replace("!", "");
        recipientID = recipientID.replace("@", "");
        recipientID = recipientID.replace(">", "");

        let payment = Math.round(args[1]);

        // Checks if both users have an account.
        if(await database.hasAccount(msg.author.id)) {
            if(!isNaN(recipientID)) {
                if(await database.hasAccount(recipientID)) {
                    // Checks if the recipient is private.
                    if(!await database.getPrivateStatus(recipientID)) {
                        // Checks if recipient is the user.
                        if(msg.author.id !== api.client.users.get(recipientID).id) {
                            // Checks if payment is valid.
                            if(!isNaN(payment)) {
                                // Checks if payment is more than 0;
                                if(payment > 0) {
                                    // Checks if user has enough money.
                                    if(payment <= await database.getAmount(msg.author.id)) {
                                        // Give money.
                                        let accountAfter = await database.getAmount(msg.author.id) - payment;
                                        let recipientAfter = await database.getAmount(recipientID) + payment;

                                        
                                        // // Write to database.
                                        database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));
                                        database.setBalance(api.client.users.get(recipientID), recipientAfter, await database.getLastClaimed(recipientID), await database.getPrivateStatus(recipientID));

                                        // Send message.
                                        msg.channel.send({embed: {
                                            title: ":white_check_mark: Pay",
                                            description: `You successfully paid ${api.client.users.get(recipientID).username} **${args[1]} Cash**.`,
                                            thumbnail: {
                                                url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
                                            }
                                        }});

                                        // Logs in console.
                                        console.log(colors.green(`[Bot] ${msg.author.username} paid ${api.client.users.get(recipientID).username} ${args[1]} Cash.`));
                                    }else {
                                        // Sends message.
                                        msg.channel.send({embed: {
                                            title: ":x: Pay",
                                            description: "You do not have enough Cash for that action.",
                                            thumbnail: {
                                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                            }
                                        }});
    
                                        // Logs in console.
                                        console.log(colors.red(`[Bot] ${msg.author.username} didn't have enough Cash to run the pay command.`));
                                    }
                                }else {
                                    // Sends message.
                                    msg.channel.send({embed: {
                                        title: ":x: Pay",
                                        description: "You cannot pay negative numbers nor zero.",
                                        thumbnail: {
                                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                        }
                                    }});
    
                                    // Logs in console.
                                    console.log(colors.red(`[Bot] ${msg.author.username} gave a negative number or zero for the pay command.`));
                                }
                            }else {
                                // Sends message.
                                msg.channel.send({embed: {
                                    title: ":x: Pay",
                                    description: `${args[1]} is not a valid number.`,
                                    thumbnail: {
                                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                    }
                                }});
    
                                // Logs in console.
                                console.log(colors.red(`[Bot] ${msg.author.username} gave an invalid number for the pay command.`));
                            }
                        }else {
                            // Sends message.
                            msg.channel.send({embed: {
                                title: ":x: Pay",
                                description: "You cannot pay yourself.",
                                thumbnail: {
                                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                }
                            }});

                            // Logs in console.
                            console.log(colors.red(`[Bot] ${msg.author.username} tried to pay themself.`));
                        }
                    }else {
                        // Sends message.
                        msg.channel.send({embed: {
                            title: ":x: Pay",
                            description: `${api.client.users.get(recipientID).username}'s account is privated.`,
                            thumbnail: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});

                        // Logs in console.
                        console.log(colors.red(`${api.client.users.get(recipientID).username} didn't recieve a payment from ${msg.author.username} because their account was privated.`));
                    }
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Pay",
                        description: `${api.client.users.get(recipientID).username} does not have an account.`,
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});
    
                    // Logs in console.
                    console.log(colors.red(`${api.client.users.get(recipientID).username} didn't have an account to recieve a payment from ${msg.author.username}.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Pay",
                    description: `${args[0]} is not valid, try using a mention.`,
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${api.client.users.get(recipientID).username} gave an invalid user for the pay command.`));
            }
        }else {
            // Sends message.
            msg.channel.send({embed: {
                title: ":x: Pay",
                description: "You do not have an account, use `$new` to create a new account.",
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                }
            }});

            // Logs in console.
            console.log(colors.red(`[Bot] ${msg.author.username} didn't have an account to run the pay command.`));
        }
    });
};
