const colors = require("colors");

exports.id = "invite";

exports.onLoad = api => {
	api.commands.add("invite", (msg) => {
		msg.channel.send({embed: {
			title: ":envelope_with_arrow: Invite",
			fields: [{
				name: "Bot Invite",
				value: "https://discordapp.com/oauth2/authorize?client_id=487411926008201246&permissions=36825152&scope=bot"
			}, {
				name: "Support Server Invite",
				value: "https://discord.gg/fDePjsc"
			}],
			thumbnail: {
				url: "https://images.emojiterra.com/twitter/512px/1f4e9.png"
			}
		}});
        
		// Logs in console.
		console.log(colors.green(`[Bot] ${msg.author.username} used the invite command.`));
	});
};