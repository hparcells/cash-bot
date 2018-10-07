const colors = require("colors");
const database = require("../database");

exports.id = "roll";

exports.onLoad = api => {
	api.commands.add("roll", async (msg) => {
		let args = msg.content.substring(6).split(" ");
		let guess = Math.round(args[0]);
		let bet = Math.round(args[1]);

		// Checks if user account exists.
		if(await database.hasAccount(msg.author.id)) {
			// Checks if guess is valid.
			if(!isNaN(guess)) {
				if(guess >= 1 && guess <= 6) {
					// Checks if bet is valid.
					if(!isNaN(bet)) {
						if(bet > 0) {
							// Checks if user has enough Cash.
							if(bet <= await database.getAmount(msg.author.id)) {
								let winningNumber = Math.floor(Math.random() * 6) + 1;

								let m = await msg.channel.send({embed: {
									title: ":question: Roll",
									description: `${msg.author.username} rolls a die.`,
									thumbnail: {
										url: "https://images.emojiterra.com/twitter/v11/512px/1f3b2.png"
									}
								}});

								let messageID = m.id;
                                
								let messages = await msg.channel.fetchMessages({
									around: messageID,
									limit: 1
								});

								const fetchedMsg = messages.first();

								setTimeout(async () => {
									if(winningNumber === guess) {
										fetchedMsg.edit({embed: {
											title: ":white_check_mark: Roll",
											description: `${msg.author.username} rolled a die and won.`,
											fields: [{
												name: "Number Landed On",
												value: winningNumber
											}, {
												name: "Amount Won",
												value: `${bet * 2} Cash`
											}],
											thumbnail: {
												url: "https://images.emojiterra.com/twitter/512px/2705.png"
											}
										}});

										let accountAfter = await database.getAmount(msg.author.id) + (bet * 2);
                                        
										// Write data to database.
										database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));
                                    
										// Logs in console.
										console.log(colors.green(`[Bot] ${msg.author.username} used the roll command and lost.`));
									}else {
										fetchedMsg.edit({embed: {
											title: ":x: Roll",
											description: `${msg.author.username} rolled a die and lost.`,
											fields: [{
												name: "Number Landed On",
												value: winningNumber
											}, {
												name: "Amount Lost",
												value: `${bet} Cash`
											}],
											thumbnail: {
												url: "https://images.emojiterra.com/twitter/512px/274c.png"
											}
										}});

										let accountAfter = await database.getAmount(msg.author.id) - bet;

										// Write data to database.
										database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));

										// Logs in console.
										console.log(colors.green(`[Bot] ${msg.author.username} used the roll command and lost.`));
									}
								}, 1000);
							}else {
								// Sends message.
								msg.channel.send({embed: {
									title: ":x: Roll",
									description: "You do not have enough Cash for that action.",
									thumbnail: {
										url: "https://images.emojiterra.com/twitter/512px/274c.png"
									}
								}});

								// Logs in console.
								console.log(colors.red(`[Bot] ${msg.author.username} didn't have enough Cash to run the flip command.`));
							}
						}else {
							// Sends message.
							msg.channel.send({embed: {
								title: ":x: Roll",
								description: "You cannot bet negative numbers nor zero.",
								thumbnail: {
									url: "https://images.emojiterra.com/twitter/512px/274c.png"
								}
							}});

							// Logs in console.
							console.log(colors.red(`[Bot] ${msg.author.username} gave a negative number or zero for the flip command.`));
						}
					}else {
						// Sends message.
						msg.channel.send({embed: {
							title: ":x: Roll",
							description: `${args[1]} is not a valid number.`,
							thumbnail: {
								url: "https://images.emojiterra.com/twitter/512px/274c.png"
							}
						}});
    
						// Logs in console.
						console.log(colors.red(`[Bot] ${msg.author.username} gave a invalid number for the roll command.`));
					}
				}else {
					// Sends message.
					msg.channel.send({embed: {
						title: ":x: Roll",
						description: `${guess} is not a valid number. Please try again with a number between 1 and 6.`,
						thumbnail: {
							url: "https://images.emojiterra.com/twitter/512px/274c.png"
						}
					}});

					// Logs in console.
					console.log(colors.red(`[Bot] ${msg.author.username} gave a invalid number for the roll command.`));
				}
			}else {
				// Sends message.
				msg.channel.send({embed: {
					title: ":x: Roll",
					description: `${args[0]} is not a number.`,
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/274c.png"
					}
				}});

				// Logs in console.
				console.log(colors.red(`[Bot] ${msg.author.username} gave a invalid number for the roll command.`));
			}
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Roll",
				description: "You do not have an account, use `$new` to create a new account.",
				thumbnail: {
					url: "https://images.emojiterra.com/twitter/512px/274c.png"
				}
			}});

			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} didn't have an account to run the roll command.`));
		}
	});
};
