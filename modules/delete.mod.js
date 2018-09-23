const colors = require("colors");
const database = require("../database");
const r = require("rethinkdb");
const rethink = require("../index");

exports.id = "delete";

exports.onLoad = api => {
    api.commands.add("delete", (msg) => {
        r.table("accounts").get(msg.author.id).run(rethink.connection, async function(err, result) {
            if(err) {
                throw err;
            }

            if(await database.hasAccount(msg.author.id)) {
                if(result.amount >= 50) {
                    database.deleteAccount(msg.author.id);

                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Delete Account",
                        description: "You successfully deleted your account.",
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});
                    
                    // Logs in console.
                    console.log(colors.green(`${msg.author.username} deleted their account.`));
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Delete Account",
                        description: "You do not have enough Cash to delete your account.",
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.red(`${msg.author.username} didn't have enough Cash to delete their account.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Delete Account",
                    description: "You do not have an acconut to delete.",
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});
    
                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to delete.`));
            }
        });
    });
};