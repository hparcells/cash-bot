const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "fiftyfifty";

exports.onLoad = api => {
    api.commands.add("fiftyfifty", (msg) => {
        let args = msg.content.substring(12).split(" ");
        let bet = parseInt(args[1]);

        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];
            
            // Checks if user account exists.
            if(account !== undefined) {
                // Checks if bet is negative.
                if(bet > 0) {
                    // Checks if user has enough money.
                    if(bet <= account.amount) {
                        /* 
                            1 = Win
                            2 = Lose
                        */
                        let win = Math.floor(Math.random() * 2) + 1;
                        
                        if(win === 1) {
                            let accountAfter = account.amount + bet;
                            
                            // Set JSON information.
                            accountDB[msg.author.username.toLowerCase()] = {
                                "owner": msg.author.id,
                                "amount": accountAfter,
                                "lastClaimed": account.lastClaimed
                            }
    
                            // Writes data to JSON.
                            fsn.writeJSON("./accounts.json", accountDB, {
                                replacer: null,
                                spaces: 4
                            }).then(() => {
                                // Send message.
                                msg.reply(`You won the 50/50 and got **${bet} Cash**`);
    
                                // Logs in console.
                                console.log(colors.green(`${msg.author.username} used the fiftyfifty command and won.`));
                            });
                        }else {
                            let accountAfter = account.amount - bet;
    
                            // Set JSON information.
                            accountDB[msg.author.username.toLowerCase()] = {
                                "owner": msg.author.id,
                                "amount": accountAfter,
                                "lastClaimed": account.lastClaimed
                            }
    
                            // Writes data to JSON.
                            fsn.writeJSON("./accounts.json", accountDB, {
                                replacer: null,
                                spaces: 4
                            }).then(() => {
                                // Send message.
                                msg.reply(`You lost the 50/50 and lost **${bet} Cash**`);
    
                                // Logs in console.
                                console.log(colors.green(`${msg.author.username} used the fiftyfifty command and lost.`));
                            });
                        }
                    }else {
                        msg.reply("You do not have enough Cash for that action.");

                        // Logs in console.
                        console.log(colors.red(`${msg.author.username} didn't have enough Cash to run the fiftyfifty command.`));
                    }
                }else {
                    msg.reply("You cannot bet negative numbers nor zero.");

                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} gave a negative number or zero for the fiftyfifty command.`));
                }
            }else {
                msg.reply("You do not have an account, use `$new` to create a new account.");

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to run the fiftyfifty command.`));
            }
        });
    })
};
