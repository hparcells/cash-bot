const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "slots";

exports.onLoad = api => {
    api.commands.add("slots", (msg) => {
        let bet = parseFloat(Number(msg.content.substring(7)).toFixed(2));

        let symbols = [":banana:", ":tangerine:", ":cherries:", ":pear:", ":grapes:", ":flag_lv:", ":watermelon:", ":gem:", ":seven:"];

        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.id];
            
            let symbol1 = symbols[Math.floor(Math.random() * symbols.length)];
            let symbol2 = symbols[Math.floor(Math.random() * symbols.length)];
            let symbol3 = symbols[Math.floor(Math.random() * symbols.length)];            

            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if bet is valid.
                if(bet > 0) {
                    // Checks if user account has enough money.
                    if(bet <= account.amount) {
                        // Sends message.
                        msg.channel.send({embed: {
                            title: ":slot_machine: Slots",
                            description: `${msg.author.username} uses the slot machine.`,
                            fields: [{
                                name: "The Machine",
                                value: `? : ? : ?`
                            }],
                            thumbnail: {
                                url: "https://images.emojiterra.com/twitter/512px/1f3b0.png"
                            }
                        }}).then((m) => {
                            let messageID = m.id;

                            // Edits message.
                            setTimeout(() => {
                                msg.channel.fetchMessages({
                                    around: messageID,
                                    limit: 1
                                }).then(messages => {
                                    const fetchedMsg = messages.first();

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
                                    }}).then(() => {
                                        // Edits message.
                                        setTimeout(() => {
                                            msg.channel.fetchMessages({
                                                around: messageID,
                                                limit: 1
                                            }).then(messages => {
                                                const fetchedMsg = messages.first();
                
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
                                                }}).then(() => {
                                                    // Edits message.
                                                    setTimeout(() => {
                                                        msg.channel.fetchMessages({
                                                            around: messageID,
                                                            limit: 1
                                                        }).then(messages => {
                                                            const fetchedMsg = messages.first();

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

                                                                let accountAfter = account.amount - bet;

                                                                // Set JSON information.
                                                                accountDB[msg.author.id] = {
                                                                    owner: msg.author.username,
                                                                    amount: accountAfter,
                                                                    lastClaimed: account.lastClaimed,
                                                                    private: account.private
                                                                };

                                                                // Writes data to JSON.
                                                                fsn.writeJSON("./accounts.json", accountDB, {
                                                                    replacer: null,
                                                                    spaces: 4
                                                                });

                                                                // Logs in console.
                                                                console.log(colors.green(`${msg.author.username} used the slots command and lost.`));
                                                            }else {
                                                                // Sets multiplier.
                                                                if(theMatches === 2) {
                                                                    multiplier = 3;
                                                                }else if(theMatches === 3) {
                                                                    multiplier = 5;
                                                                }

                                                                let amountWon = bet * multiplier;

                                                                // Edits message.
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

                                                                let accountAfter = account.amount + amountWon;

                                                                // Set JSON information.
                                                                accountDB[msg.author.id] = {
                                                                    owner: msg.author.username,
                                                                    amount: accountAfter,
                                                                    lastClaimed: account.lastClaimed,
                                                                    private: account.private
                                                                };

                                                                // Writes data to JSON.
                                                                fsn.writeJSON("./accounts.json", accountDB, {
                                                                    replacer: null,
                                                                    spaces: 4
                                                                });

                                                                // Logs in console.
                                                                console.log(colors.green(`${msg.author.username} used the slots command and won.`));
                                                            }
                                                        });
                                                    }, 1000);
                                                });
                                            });
                                        }, 1000);
                                    });
                                });
                            }, 1000);
                        });
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
                        console.log(colors.red(`${msg.author.username} didn't have enough Cash to run the slots command.`));
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
                    console.log(colors.red(`${msg.author.username} gave a negative number or zero for the slots command.`));
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
            console.log(colors.red(`${msg.author.username} didn't have an account to run the slots command.`));
            }
        });
    });
};

function getMatches(item1, item2, item3) {
    let matches = 0;

    if(item1 === item2 && item1 === item3) {
        matches = 3;
    }else if(item1 === item2 || item2 === item3 || item1 === item3) {
        matches = 2;
    }

    return matches;
}