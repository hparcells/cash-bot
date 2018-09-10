const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "fiftyfifty";

exports.onLoad = api => {
    api.commands.add("fiftyfifty", (msg) => {
        let args = msg.content.substring(12).split(" ");
        let bet = parseInt(args[0]);

        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];
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
                    console.log(colors.green(`${msg.author.username} used the 5050 command and won.`));
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
                    console.log(colors.green(`${msg.author.username} used the 5050 command and lost.`));
                });
            }
        });
    })
};
