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

			// Logs in console.
			console.log(colors.green(`[Bot] ${msg.author.username} has publicised their account.`));
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":lock: Private",
				description: "You have privated your account.",
				thumbnail: {
					url: "https://images.emojiterra.com/twitter/512px/1f512.png"
				}
			}});

			// Logs in console.
			console.log(colors.green(`[Bot] ${msg.author.username} has privated their account.`));
		}

		// Write data to database.
		database.setBalance(msg.author, await database.getAmount(msg.author.id), await database.getLastClaimed(msg.author.id), !isPrivate);
	});
};
