const colors = require("colors");
const database = require("../database");

function isEven(number) {
	return number % 2 === 0;
}

exports.id = "roulette";

exports.onLoad = api => {
	api.commands.add("roulette", async (msg) => {
		let args = msg.content.substring(10).split(" ");
		let color = args[0].toLowerCase();
		let bet = Math.round(args[1]);

		if(await database.hasAccount(msg.author.id)) {
			// Checks if color is valid.
			if(color === "red" || color === "black" || color === "green") {
				// Checks if bet is valid.
				if(!isNaN(bet)) {
					if(bet > 0) {
						// Checks if user has enough Cash.
						if(bet <= await database.getAmount(msg.author.id)) {
							let number = Math.floor(Math.random() * 36);

							let winningColor = undefined;

							let m = await // Sends message.
							msg.channel.send({embed: {
								title: ":question: Roulette",
								description: `${msg.author.username} spins the roulette wheel.`,
								thumbnail: {
									url: "http://pngimg.com/uploads/roulette/roulette_PNG12.png"
								}
							}});

							let messageID = m.id;

							if((number >= 1 && number <= 10) || (number >= 19 && number <= 28)) {
								if(isEven(number)) {
									winningColor = "black";
								}else {
									winningColor = "red";
								}
							}else if((number >= 11 && number <= 18) || (number >= 29 && number <= 36)) {
								if(isEven(number)) {
									winningColor = "red";
								}else {
									winningColor = "black";
								}
							}else if(number === 0) {
								winningColor = "green";
							}

							let messages = await msg.channel.fetchMessages({
								around: messageID,
								limit: 1
							});

							const fetchedMsg = messages.first();

							setTimeout(async () => {
								if(color === winningColor) {
									if(winningColor === "green") {
										fetchedMsg.edit({embed: {
											title: ":x: Roulette",
											description: `${msg.author.username} won and got **${bet * 5} Cash**. `,
											fields: [{
												name: "Color Landed On",
												value: winningColor
											}, {
												name: "Number Landed On",
												value: number
											}],
											thumbnail: {
												url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
											}
										}});
    
										let accountAfter = await database.getAmount(msg.author.id) + (bet * 5);
    
										database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));
    
										// Logs in console.
										console.log(colors.green(`[Bot] ${msg.author.username} used the roulette command and won.`));
									}else {
										fetchedMsg.edit({embed: {
											title: ":white_check_mark: Roulette",
											description: `${msg.author.username} won and got **${bet * 2} Cash**. `,
											fields: [{
												name: "Color Landed On",
												value: winningColor
											}, {
												name: "Number Landed On",
												value: number
											}],
											thumbnail: {
												url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
											}
										}});
    
										let accountAfter = await database.getAmount(msg.author.id) + (bet * 2);
    
										database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));
                                        
										// Logs in console.
										console.log(colors.green(`[Bot] ${msg.author.username} used the roulette command and won.`));
									}
								}else {
									fetchedMsg.edit({embed: {
										title: ":x: Roulette",
										description: `${msg.author.username} lost and lost **${bet * 2} Cash**. `,
										fields: [{
											name: "Color Landed On",
											value: winningColor
										}, {
											name: "Number Landed On",
											value: number
										}],
										thumbnail: {
											url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
										}
									}});
    
									let accountAfter = await database.getAmount(msg.author.id) - (bet * 2);
    
									database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));
    
									// Logs in console.
									console.log(colors.green(`[Bot] ${msg.author.username} used the roulette command and lost.`));
								}
							}, 3000);
						}else {
							// Sends message.
							msg.channel.send({embed: {
								title: ":x: Roulette",
								description: "You do not have enough Cash for that action.",
								thumbnail: {
									url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
								}
							}});

							// Logs in console.
							console.log(colors.red(`[Bot] ${msg.author.username} didn't have enough Cash to run the roulette command.`));
						}
					}else {
						// Sends message.
						msg.channel.send({embed: {
							title: ":x: Roulette",
							description: "You cannot bet negative numbers nor zero.",
							thumbnail: {
								url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
							}
						}});

						// Logs in console.
						console.log(colors.red(`[Bot] ${msg.author.username} gave a negative number or zero for the roulette command.`));
					}
				}else {
					// Sends message.
					msg.channel.send({embed: {
						title: ":x: Roulette",
						description: `${args[1]} is an invalid number.`,
						thumbnail: {
							url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
						}
					}});

					// Logs in console.
					console.log(colors.red(`[Bot] ${msg.author.username} gave an invalid number for the roulette command.`));
				}
			}else {
				// Sends message.
				msg.channel.send({embed: {
					title: ":x: Roulette",
					description: `${args[0]} is not a color. Please use \`red\`, \`black\` or \`green\``,
					thumbnail: {
						url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
					}
				}});

				// Logs in console.
				console.log(colors.red(`[Bot] ${msg.author.username} gave a invalid color for the roulette command.`));
			}
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Roulette",
				description: "You do not have an account, use `$new` to create a new account.",
				thumbnail: {
					url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
				}
			}});

			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} didn't have an account to run the roulette command.`));
		}
	});
};
