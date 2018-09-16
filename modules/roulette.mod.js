const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "roulette";

exports.onLoad = api => {
    api.commands.add("roulette", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.id];
            let args = msg.content.substring(10).split(" ");
            let color = args[0].toLowerCase();
            let bet = parseFloat(Number(args[1]).toFixed(2));

            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if color is valid.
                if(color === "red" || color === "black" || color === "green") {
                    // Checks if bet is valid.
                    if(bet > 0) {
                        // Checks if user has enough Cash.
                        if(bet <= account.amount) {
                            let number = Math.floor(Math.random() * 36);

                            let winningColor = undefined;

                            // Sends message.
                            msg.channel.send({embed: {
                                title: ":question: Roulette",
                                description: `${msg.author.username} spins the roulette wheel.`,
                                thumbnail: {
                                    url: "http://pngimg.com/uploads/roulette/roulette_PNG12.png"
                                }
                            }}).then((m) => {
                                let messageID = m.id;

                                if((number >= 1 && number <= 10) || (number >= 19 && number <= 28)) {
                                    if(isEven(number)) {
                                        winningColor = "black"
                                    }else {
                                        winningColor = "red";
                                    }
                                }else if((number >= 11 && number <= 18) || (number >= 29 && number <= 36)) {
                                    if(isEven(number)) {
                                        winningColor = "red";
                                    }else {
                                        winningColor = "black"
                                    }
                                }else if(number === 0) {
                                    winningColor = "green"
                                }

                                if(color === winningColor) {
                                    if(winningColor === "green") {
                                        setTimeout(() => {
                                            msg.channel.fetchMessages({
                                                around: messageID,
                                                limit: 1
                                            }).then(messages => {
                                                const fetchedMsg = messages.first();
        
                                                fetchedMsg.edit({embed: {
                                                    title: ":x: Roulette",
                                                    description: `${msg.author.username} won and got **${bet * 5} Cash**. `,
                                                    fields: [{
                                                        name: "Color Landed On",
                                                        value: winningColor
                                                    }, {
                                                        name: "Number Landed On",
                                                        value: number
                                                    }],
                                                    thumbnail: {
                                                        url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
                                                    }
                                                }});
                                            });
    
                                            let accountAfter = account.amount + (bet * 5);
    
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
                                            console.log(colors.green(`${msg.author.username} used the roulette command and won.`));
                                        }, 3000);
                                    }else {
                                        setTimeout(() => {
                                            msg.channel.fetchMessages({
                                                around: messageID,
                                                limit: 1
                                            }).then(messages => {
                                                const fetchedMsg = messages.first();
    
                                                fetchedMsg.edit({embed: {
                                                    title: ":white_check_mark: Roulette",
                                                    description: `${msg.author.username} won and got **${bet * 2} Cash**. `,
                                                    fields: [{
                                                        name: "Color Landed On",
                                                        value: winningColor
                                                    }, {
                                                        name: "Number Landed On",
                                                        value: number
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
                                        }, 3000);
    
                                        // Logs in console.
                                        console.log(colors.green(`${msg.author.username} used the roulette command and won.`));
                                    }
                                }else {
                                    setTimeout(() => {
                                        msg.channel.fetchMessages({
                                            around: messageID,
                                            limit: 1
                                        }).then(messages => {
                                            const fetchedMsg = messages.first();

                                            fetchedMsg.edit({embed: {
                                                title: ":x: Roulette",
                                                description: `${msg.author.username} lost and lost **${bet * 2} Cash**. `,
                                                fields: [{
                                                    name: "Color Landed On",
                                                    value: winningColor
                                                }, {
                                                    name: "Number Landed On",
                                                    value: number
                                                }],
                                                thumbnail: {
                                                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                                }
                                            }});
                                        });

                                        let accountAfter = account.amount - (bet * 2);

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
                                        console.log(colors.green(`${msg.author.username} used the roulette command and lost.`));
                                    }, 3000);
                                }
                            });
                        }else {
                            // Sends message.
                            msg.channel.send({embed: {
                                title: ":x: Roulette",
                                description: "You do not have enough Cash for that action.",
                                thumbnail: {
                                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                }
                            }});

                            // Logs in console.
                            console.log(colors.red(`${msg.author.username} didn't have enough Cash to run the roulette command.`));
                        }
                    }else {
                        // Sends message.
                        msg.channel.send({embed: {
                            title: ":x: Roulette",
                            description: "You cannot bet negative numbers nor zero.",
                            thumbnail: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});

                        // Logs in console.
                        console.log(colors.red(`${msg.author.username} gave a negative number or zero for the roulette command.`));
                    }
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Roulette",
                        description: `${args[0]} is not a color. Please use \`red\`, \`black\` or \`green\``,
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} gave a invalid color for the roulette command.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Roulette",
                    description: "You do not have an account, use `$new` to create a new account.",
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to run the roulette command.`));
            }
        });
    });
};

function isEven(n) {
    return n % 2 == 0;
}