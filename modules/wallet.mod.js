const colors = require("colors");
const database = require("../database");

exports.id = "wallet";

exports.onLoad = api => {
	api.commands.add("wallet", async (msg) => {
		if(await database.hasAccount(msg.author.id)) {
			// Gets time until next daily.
			let timeLeft = (await database.getLastClaimed(msg.author.id) + 86400000) - parseInt(Date.now());
			let seconds = parseInt((timeLeft / 1000) % 60);
			let minutes = parseInt((timeLeft / (1000 * 60)) % 60);
			let hours = parseInt((timeLeft / (1000 * 60 * 60)) % 24);

			let stringTimeLeft = undefined;
			if(Math.sign(timeLeft) === 1) {
				stringTimeLeft = `${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
			}else {
				stringTimeLeft = "Ready to Claim!";
			}

			// Sends message.
			msg.channel.send({embed: {
				title: ":moneybag: Your Wallet",
				fields: [{
					name: "Cash",
					value: `${await database.getAmount(msg.author.id)} Cash`
				}, {
					name: "Time Until Next Daily",
					value: stringTimeLeft
				}],
				thumbnail: {
					url: "http://www.stickpng.com/assets/images/580b585b2edbce24c47b2878.png"
				}
			}});

			// Logs in console.
			console.log(colors.green(`[Bot] ${msg.author.username} used the wallet command.`));
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Your Wallet",
				description: "You do not have an account, use `$new` to create a new account.",
				thumbnail: {
					url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
				}
			}});

			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} didn't have an account to run the wallet command.`));
		}
	});
};
