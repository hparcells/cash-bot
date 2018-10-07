const colors = require("colors");
const database = require("../database");

exports.id = "removemoney";

exports.onLoad = api => {
	api.commands.add("removemoney", async (msg) => {
		let args = msg.content.substring(13).split(" ");

		let recipientID = args[0].replace("<", "");
		recipientID = recipientID.replace("!", "");
		recipientID = recipientID.replace("@", "");
		recipientID = recipientID.replace(">", "");

		let payment = Math.round(args[1]);

		if(database.isOwner(msg.author.id)) {
			if(await database.hasAccount(recipientID)) {
				let recipientAfter = await database.getAmount(recipientID) - payment;

				// Write data to database.
				database.setBalance(api.client.users.get(recipientID), recipientAfter, await database.getLastClaimed(recipientID), await database.getPrivateStatus(recipientID));

				// Sends message.
				msg.channel.send({embed: {
					title: ":white_check_mark: Remove Money",
					description: `You removed **${payment} Cash** from ${api.client.users.get(recipientID).username}!`,
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/2705.png"
					}
				}});

				// Logs in console.
				console.log(colors.green(`[Bot] ${msg.author.username} removed ${payment} Cash from ${api.client.users.get(recipientID).username}!`));
			}else {
				// Sends message.
				msg.channel.send({embed: {
					title: ":x: Remove Money",
					description: `${api.client.users.get(recipientID).username} does not have an account.`,
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/274c.png"
					}
				}});
                
				// Logs in console.
				console.log(colors.green(`[Bot] ${api.client.users.get(recipientID).username} did not have an account to remove money.`));
			}
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Remove Money",
				description: "You do not have permission to run this command",
				thumbnail: {
					url: "https://images.emojiterra.com/twitter/512px/274c.png"
				}
			}});
            
			// Logs in console.
			console.log(colors.green(`[Bot] ${msg.author.username} did not have permission to run the removemoney command.`));
		}
	});
};
