const colors = require("colors");
const database = require("../database");

function getMatches(item1, item2, item3) {
    let matches = 0;

    if(item1 === item2 && item1 === item3) {
        matches = 3;
    }else if(item1 === item2 || item2 === item3 || item1 === item3) {
        matches = 2;
    }

    return matches;
}

exports.id = "slots";

exports.onLoad = api => {
    api.commands.add("slots", async (msg) => {
        let bet = Math.round(msg.content.substring(7));

        let symbols = [":banana:", ":tangerine:", ":cherries:", ":pear:", ":grapes:", ":flag_lv:", ":watermelon:", ":gem:", ":seven:"];

        let symbol1 = symbols[Math.floor(Math.random() * symbols.length)];
        let symbol2 = symbols[Math.floor(Math.random() * symbols.length)];
        let symbol3 = symbols[Math.floor(Math.random() * symbols.length)];

        if(await database.hasAccount(msg.author.id)) {
            // Checks if bet is valid.
            if(!isNaN(bet)) {
                if(bet > 0) {
                    // Checks if user account has enough money.
                    if(bet <= await database.getAmount(msg.author.id)) {
                        // Sends message.
                        let m = await msg.channel.send({embed: {
                            title: ":slot_machine: Slots",
                            description: `${msg.author.username} uses the slot machine.`,
                            fields: [{
                                name: "The Machine",
                                value: "? : ? : ?"
                            }],
                            thumbnail: {
                                url: "https://images.emojiterra.com/twitter/512px/1f3b0.png"
                            }
                        }});

                        let messageID = m.id;

                        let messages = await msg.channel.fetchMessages({
                            around: messageID,
                            limit: 1
                        });

                        const fetchedMsg = messages.first();

                        setTimeout(async () => {
                            fetchedMsg.edit({embed: {
                                title: ":slot_machine: Slots",
                                description: `${msg.author.username} uses the slot machine.`,
                                fields: [{
                                    name: "The Machine",
                                    value: `${symbol1} : ? : ?`
                                }],
                                thumbnail: {
                                    url: "https://images.emojiterra.com/twitter/512px/1f3b0.png"
                                }
                            }});

                            setTimeout(async () => {
                                fetchedMsg.edit({embed: {
                                    title: ":slot_machine: Slots",
                                    description: `${msg.author.username} uses the slot machine.`,
                                    fields: [{
                                        name: "The Machine",
                                        value: `${symbol1} : ${symbol2} : ?`
                                    }],
                                    thumbnail: {
                                        url: "https://images.emojiterra.com/twitter/512px/1f3b0.png"
                                    }
                                }});

                                setTimeout(async () => {
                                    let multiplier = 0;
                                    let theMatches = getMatches(symbol1, symbol2, symbol3);

                                    if(theMatches === 0) {
                                        // Edits message.
                                        fetchedMsg.edit({embed: {
                                            title: ":slot_machine: Slots",
                                            description: `${msg.author.username} used the slot machine and lost!`,
                                            fields: [{
                                                name: "The Machine",
                                                value: `${symbol1} : ${symbol2} : ${symbol3}`
                                            }, {
                                                name: "Number of Matching Symbols",
                                                value: getMatches(symbol1, symbol2, symbol3)
                                            }, {
                                                name: "Amount Lost",
                                                value: `${bet} Cash`
                                            }],
                                            thumbnail: {
                                                url: "https://images.emojiterra.com/twitter/512px/1f3b0.png"
                                            }
                                        }});

                                        let accountAfter = await database.getAmount(msg.author.id) - bet;

                                        // Writes data to database.
                                        database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));

                                        // Logs in console.
                                        console.log(colors.green(`[Bot] ${msg.author.username} used the slots command and lost.`));
                                    }else {
                                        // Sets multiplier.
                                        if(theMatches === 2) {
                                            multiplier = 5;
                                        }else if(theMatches === 3) {
                                            multiplier = 25;
                                        }

                                        let amountWon = bet * multiplier;

                                        fetchedMsg.edit({embed: {
                                            title: ":slot_machine: Slots",
                                            description: `${msg.author.username} used the slot machine and won!`,
                                            fields: [{
                                                name: "The Machine",
                                                value: `${symbol1} : ${symbol2} : ${symbol3}`
                                            }, {
                                                name: "Number of Matching Symbols",
                                                value: getMatches(symbol1, symbol2, symbol3)
                                            }, {
                                                name: "Amount Won",
                                                value: `${amountWon} Cash`
                                            }],
                                            thumbnail: {
                                                url: "https://images.emojiterra.com/twitter/512px/1f3b0.png"
                                            }
                                        }});

                                        let accountAfter = await database.getAmount(msg.author.id) + amountWon;

                                        // Writes data to database.
                                        database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));

                                        // Logs in console.
                                        console.log(colors.green(`[Bot] ${msg.author.username} used the slots command and won.`));
                                    }
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }else {
                        // Sends message.
                        msg.channel.send({embed: {
                            title: ":x: Slots",
                            description: "You do not have enough Cash for that action.",
                            thumbnail: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});

                        // Logs in console.
                        console.log(colors.red(`[Bot] ${msg.author.username} didn't have enough Cash to run the slots command.`));
                    }
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Slots",
                        description: "You cannot bet negative numbers nor zero.",
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});
    
                    // Logs in console.
                    console.log(colors.red(`[Bot] ${msg.author.username} gave a negative number or zero for the slots command.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Slots",
                    description: `${msg.content.substring(7)} is not a number.`,
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`[Bot] ${msg.author.username} gave an invalid number for the slots command.`));
            }
        }else {
            // Sends message.
            msg.channel.send({embed: {
                title: ":x: Slots",
                description: "You do not have an account, use `$new` to create a new account.",
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                }
            }});
    
            // Logs in console.
            console.log(colors.red(`[Bot] ${msg.author.username} didn't have an account to run the slots command.`));
        }
    });
};
