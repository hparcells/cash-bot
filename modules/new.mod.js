const colors = require("colors");
const database = require("../database");

exports.id = "new";

exports.onLoad = api => {
	api.commands.add("new", async (msg) => {
		// Checks if account already exists.
		if(!await database.hasAccount(msg.author.id)) {
			// Create new account.
			database.setBalance(msg.author, 10, Date.now() - 86400000, false);

			// Send message.
			msg.channel.send({embed: {
				title: ":white_check_mark: New Account",
				description: "You have successfully created your new account. You have been given **10 Cash** to start with.",
				thumbnail: {
					url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
				}
			}});

			// Logs in console.
			console.log(colors.green(`[Bot] ${msg.author.username} created a new account.`));
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: New Account",
				description: "You already have an account.",
				thumbnail: {
					url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
				}
			}});

			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} couldn't create a new account because they already have an account.`));
		}
	});
};
