const colors = require("colors");
const database = require("../database");

exports.id = "forcedelete";

exports.onLoad = api => {
    api.commands.add("forcedelete", (msg) => {
        let args = msg.content.substring(13).split(" ");
        let recipientID = args[0];

        if(database.isOwner(msg.author.id)) {
            database.deleteAccount(recipientID);

            console.log(recipientID)

            // Sends message.
            msg.channel.send({embed: {
                title: ":x: Force Delete",
                description: `You successfully deleted ${api.client.users.get(recipientID).username}'s account!`,
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                }
            }});
            
            // Logs in console.
            console.log(colors.green(`[Bot] ${msg.author.username} deleted ${api.client.users.get(recipientID).username}'s account!`));
        }else {
            // Sends message.
            msg.channel.send({embed: {
                title: ":x: Force Delete",
                description: "You do not have permission to run this command",
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                }
            }});
            
            // Logs in console.
            console.log(colors.green(`[Bot] ${msg.author.username} did not have permission to run the forcedelete command.`));
        }
    });
};
