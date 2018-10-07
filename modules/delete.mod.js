const colors = require("colors");
const database = require("../database");

exports.id = "delete";

exports.onLoad = api => {
	api.commands.add("delete", async (msg) => {
		if(await database.hasAccount(msg.author.id)) {
			if(await database.getAmount(msg.author.id) >= 50) {
				// Writes to database.
				database.deleteAccount(msg.author.id);

				// Sends message.
				msg.channel.send({embed: {
					title: ":x: Delete Account",
					description: "You successfully deleted your account.",
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/274c.png"
					}
				}});
                
				// Logs in console.
				console.log(colors.green(`[Bot] ${msg.author.username} deleted their account.`));
			}else {
				// Sends message.
				msg.channel.send({embed: {
					title: ":x: Delete Account",
					description: "You do not have enough Cash to delete your account.",
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/274c.png"
					}
				}});

				// Logs in console.
				console.log(colors.red(`[Bot] ${msg.author.username} didn't have enough Cash to delete their account.`));
			}
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Delete Account",
				description: "You do not have an account to delete.",
				thumbnail: {
					url: "https://images.emojiterra.com/twitter/512px/274c.png"
				}
			}});

			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} didn't have an account to delete.`));
		}
	});
};