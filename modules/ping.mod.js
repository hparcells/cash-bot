const colors = require("colors");

exports.id = "ping";

exports.onLoad = api => {
    api.commands.add("ping", (msg) => {
        msg.channel.send({embed: {
            "title": ":ping_pong: Pong!",
            "description": `${Math.round(api.client.ping)} ms`
        }});

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the ping command.`));
    })
};
