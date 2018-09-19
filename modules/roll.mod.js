const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "roll";

exports.onLoad = api => {
    api.commands.add("roll", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.id];
            let args = msg.content.substring(6).split(" ");

            let guess = parseInt(args[0].toLowerCase());
            let bet = parseFloat(Number(args[1]).toFixed(2));

            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if guess is valid.
                if(!(guess > 6)) {
                    if(!(guess < 1)) {
                        // Checks if bet is valid.
                        if(bet > 0) {
                            // Checks if user has enough Cash.
                            if(bet <= account.amount) {
                                let winningNumber = Math.floor(Math.random() * 6) + 1;

                                msg.channel.send({embed: {
                                    title: ":question: Roll",
                                    description: `${msg.author.username} rolls a die.`,
                                    thumbnail: {
                                        url: "https://images.emojiterra.com/twitter/v11/512px/1f3b2.png"
                                    }
                                }}).then((m) => {
                                    let messageID = m.id;

                                    setTimeout(() => {
                                        if(winningNumber === guess) {
                                            msg.channel.fetchMessages({
                                                around: messageID,
                                                limit: 1
                                            }).then(messages => {
                                                const fetchedMsg = messages.first();

                                                fetchedMsg.edit({embed: {
                                                    title: ":white_check_mark: Roll",
                                                    description: `${msg.author.username} rolled a die and won.`,
                                                    fields: [{
                                                        name: "Number Landed On",
                                                        value: winningNumber
                                                    }, {
                                                        name: "Amount Won",
                                                        value: `${bet * 2} Cash`
                                                    }],
                                                    thumbnail: {
                                                        url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
                                                    }
                                                }});
                                            });

                                            let accountAfter = account.amount + (bet * 2);

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
                                        }else {
                                            msg.channel.fetchMessages({
                                                around: messageID,
                                                limit: 1
                                            }).then(messages => {
                                                const fetchedMsg = messages.first();

                                                fetchedMsg.edit({embed: {
                                                    title: ":x: Roll",
                                                    description: `${msg.author.username} rolled a die and lost.`,
                                                    fields: [{
                                                        name: "Number Landed On",
                                                        value: winningNumber
                                                    }, {
                                                        name: "Amount Lost",
                                                        value: `${bet} Cash`
                                                    }],
                                                    thumbnail: {
                                                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                                    }
                                                }});
                                            });

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
                                        }
                                    }, 1000);
                                });
                            }else {
                                // Sends message.
                                msg.channel.send({embed: {
                                    title: ":x: Roll",
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
                                title: ":x: Roll",
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
                            title: ":x: Roll",
                            description: `${guess} is below 1.`,
                            thumbnail: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});

                        // Logs in console.
                        console.log(colors.red(`${msg.author.username} gave a invalid number for the roll command.`));
                    }
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Roll",
                        description: `${guess} is above 6.`,
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} gave a invalid number for the roll command.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Roll",
                    description: "You do not have an account, use `$new` to create a new account.",
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to run the roll command.`));
            }
        });

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the ping command.`));
    });
};
