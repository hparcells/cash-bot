const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "flip";

exports.onLoad = api => {
    api.commands.add("flip", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.id];
            let args = msg.content.substring(6).split(" ");
            let side = args[0].toLowerCase();
            let bet = parseFloat(Number(args[1]).toFixed(2));

            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if side is valid.
                if(side === "heads" || side === "tails") {
                    // Checks if bet is valid.
                    if(bet > 0) {
                        // Checks if user has enough Cash.
                        if(bet <= account.amount) {
                            let number = Math.floor(Math.random() * 2) + 1;
                            let winningSide = undefined;

                            if(number === 1) {
                                winningSide = "heads";
                            }else {
                                winningSide = "tails";
                            }

                            msg.channel.send({embed: {
                                title: ":question: Flip",
                                description: `${msg.author.username} flips a coin.`,
                                thumbnail: {
                                    url: "https://banner2.kisspng.com/20180411/tse/kisspng-united-states-penny-lincoln-cent-coin-nickel-coin-stack-5acde8de7ea9a5.5191343215234439345188.jpg"
                                }
                            }}).then((m) => {
                                let messageID = m.id;

                                setTimeout(() => {
                                    if(winningSide === side) {
                                        msg.channel.fetchMessages({
                                            around: messageID,
                                            limit: 1
                                        }).then(messages => {
                                            const fetchedMsg = messages.first();

                                            fetchedMsg.edit({embed: {
                                                title: ":white_check_mark:  Flip",
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
                                        });

                                        let accountAfter = account.amount + bet;

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
                        description: `${args[0]} is not a side. Please use \`heads\` or \`tails\`.`,
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} gave a invalid color for the flip command.`));
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
                console.log(colors.red(`${msg.author.username} didn't have an account to run the Flip command.`));
            }
        });

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the ping command.`));
    });
};
