const colors = require("colors");

exports.id = "ping";

exports.onLoad = api => {
    api.commands.add("ping", (msg) => {
        // Sends message.
        msg.channel.send({embed: {
            title: ":ping_pong: Pong!",
            description: `${Math.round(api.client.ping)} ms`,
            thumbnail: {
                url: "https://png2.kisspng.com/20180226/gcw/kisspng-table-tennis-racket-emoji-ball-red-table-tennis-racket-cartoon-5a93e20ba70605.1839325515196410996841.png"
            }
        }});

        // Logs in console.
        console.log(colors.green(`[Bot] ${msg.author.username} used the ping command.`));
    });
};