const colors = require("colors");

exports.id = "servers";

exports.onLoad = api => {
    api.commands.add("servers", (msg) => {
        msg.channel.send({embed: {
            title: "Servers",
            description: `I'm currently in **${api.client.guilds.size}** servers!`,
            thumbnail: {
                url: "https://png.icons8.com/color/1600/discord-new-logo.png"
            }
        }});

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the servers command.`));
    });
};
