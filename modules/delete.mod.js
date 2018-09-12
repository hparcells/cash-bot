const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "delete";

exports.onLoad = api => {
    api.commands.add("delete", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let account = accountDB[msg.author.username.toLowerCase()];

            if(account !== undefined) {
                delete accountDB[msg.author.username.toLowerCase()];
                
                // Writes data to JSON.
                fsn.writeJSON("./accounts.json", accountDB, {
                    replacer: null,
                    spaces: 4
                }).then(() => {
                    msg.reply(`You successfully deleted your account.`);
                    
                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} deleted their account.`));
                }).catch((err) => {
                    if(err) {
                        msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``);
                    }
                });
            }else {
                msg.reply("You do not have an account to delete.");
            }
        });

    })
};
