const colors = require("colors");
const database = require("../database");

exports.id = "stats";

exports.onLoad = api => {
	api.commands.add("stats", async (msg) => {
		if(database.isOwner(msg.author.id)) {
			msg.channel.send({embed: {
				title: "Stats",
				description: "Statistics of Cash Bot",
				fields: [{
					name: "Servers",
					value: api.client.guilds.size
				}, {
					name: "Users",
					value: api.client.users.size
				}, {
					name: "Channels",
					value: api.client.channels.size
				}, {
					name: "Memory Usage",
					value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
				}]
			}});
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Stats",
				description: "You do not have permission to run this command.",
				thumbnail: {
					url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
				}
			}});
            
			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} did not have permission to run the stats command.`));
		}
	});
};
