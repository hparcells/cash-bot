const colors = require("colors");
const database = require("../database");

exports.id = "private";

exports.onLoad = api => {
    api.commands.add("private", async (msg) => {
        let isPrivate = await database.getPrivateStatus(msg.author.id);

        if(isPrivate) {
            // Sends message.
            msg.channel.send({embed: {
                title: ":unlock: Private",
                description: "You have publicised your account.",
                thumbnail: {
                    url: "https://images.emojiterra.com/twitter/v11/512px/1f513.png"
                }
            }});
        }else {
            // Sends message.
            msg.channel.send({embed: {
                title: ":lock: Private",
                description: "You have privated your account.",
                thumbnail: {
                    url: "https://png2.kisspng.com/20180511/rrw/kisspng-emoji-padlock-troy-email-5af611386fc727.2510723615260757044579.png"
                }
            }});
        }

        // Write data to database.
        database.setBalance(msg.author, await database.getAmount(msg.author.id), await database.getLastClaimed(msg.author.id), !isPrivate);
    });
};
