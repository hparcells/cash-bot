const colors = require("colors");
const database = require("../database");

exports.id = "pickpocket";

exports.onLoad = api => {
	api.commands.add("pickpocket", async (msg) => {
		let args = msg.content.substring(12).split(" ");
		let recipientID = args[0].replace("<", "");
		recipientID = recipientID.replace("!", "");
		recipientID = recipientID.replace("@", "");
		recipientID = recipientID.replace(">", "");
        
		let win = Math.floor(Math.random() * 10) + 1;

		// Checks if both users have an account.
		if(await database.hasAccount(msg.author.id)) {
			if(!isNaN(recipientID)) {
				if(await database.hasAccount(recipientID)) {
					// Checks if the recipient is private.
					if(!await database.getPrivateStatus(recipientID)) {
						// Checks if recipient is the user.
						if(msg.author.id !== api.client.users.get(recipientID).id) {
							// Checks if both users have enough money.
							if(Math.round(await database.getAmount(msg.author.id) / 10) !== 0) {
								if(Math.round(await database.getAmount(recipientID) / 10) !== 0) {
									if(win === 10) {
										let accountAfter = Math.round(await database.getAmount(msg.author.id) + (await database.getAmount(recipientID) / 10));
										let recipientAfter = Math.round(await database.getAmount(recipientID) - (await database.getAmount(recipientID) / 10));

										// Write data to JSON.
										database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));
										database.setBalance(api.client.users.get(recipientID), recipientAfter, await database.getLastClaimed(recipientID), await database.getPrivateStatus(recipientID));

										// Send message.
										msg.channel.send({embed: {
											title: ":white_check_mark: Pickpocket",
											description: `You successfully pickpocketed ${api.client.users.get(recipientID).username} and got 10% of their money.`,
											thumbnail: {
												url: "https://images.emojiterra.com/twitter/512px/2705.png"
											}
										}});
        
										// Logs in console.
										console.log(colors.green(`[Bot] ${msg.author.username} pickpocketed ${api.client.users.get(recipientID).username} and succeeded.`));
									}else {
										let accountAfter = Math.round(await database.getAmount(msg.author.id) - (await database.getAmount(msg.author.id) / 10));
										let recipientAfter = Math.round(await database.getAmount(recipientID) + (await database.getAmount(msg.author.id) / 10));

										// Write data to JSON.
										database.setBalance(msg.author, accountAfter, await database.getLastClaimed(msg.author.id), await database.getPrivateStatus(msg.author.id));
										database.setBalance(api.client.users.get(recipientID), recipientAfter, await database.getLastClaimed(recipientID), await database.getPrivateStatus(recipientID));

										// Send message.
										msg.channel.send({embed: {
											title: ":x: Pickpocket",
											description: `You failed to pickpocket ${api.client.users.get(recipientID).username} and they got 10% of your money.`,
											thumbnail: {
												url: "https://images.emojiterra.com/twitter/512px/274c.png"
											}
										}});
                                        
										// Logs in console.
										console.log(colors.green(`[Bot] ${msg.author.username} pickpocketed ${api.client.users.get(recipientID).username} and failed.`));
									}
								}else {
									// Sends message.
									msg.channel.send({embed: {
										title: ":x: Pickpocket",
										description: `${api.client.users.get(recipientID).username} has nothing to pickpocket from.`,
										thumbnail: {
											url: "https://images.emojiterra.com/twitter/512px/274c.png"
										}
									}});

									// Logs in console.
									console.log(colors.red(`${api.client.users.get(recipientID).username} didn't have enough Cash to get pickpocketed from ${msg.author.username} command.`));
								}
							}else {
								// Sends message.
								msg.channel.send({embed: {
									title: ":x: Pickpocket",
									description: "You do not have enough Cash for that action.",
									thumbnail: {
										url: "https://images.emojiterra.com/twitter/512px/274c.png"
									}
								}});

								// Logs in console.
								console.log(colors.red(`[Bot] ${msg.author.username} didn't have enough Cash to run the fiftyfifty command.`));
							}
						}else {
							// Sends message.
							msg.channel.send({embed: {
								title: ":x: Pickpocket",
								description: "You cannot pickpocket yourself.",
								thumbnail: {
									url: "https://images.emojiterra.com/twitter/512px/274c.png"
								}
							}});

							// Logs in console.
							console.log(colors.red(`[Bot] ${msg.author.username} tried to pickpocket themself.`));
						}
					}else {
						// Sends message.
						msg.channel.send({embed: {
							title: ":x: Pickpocket",
							description: `${api.client.users.get(recipientID).username}'s account is privated.`,
							thumbnail: {
								url: "https://images.emojiterra.com/twitter/512px/274c.png"
							}
						}});

						// Logs in console.
						console.log(colors.red(`[Bot] ${msg.author.username} couldn't pickpocket ${api.client.users.get(recipientID).username} because their account is privated.`));
					}
				}else {
					// Sends message.
					msg.channel.send({embed: {
						title: ":x: Pickpocket",
						description: `${api.client.users.get(recipientID).username} does not have an account.`,
						thumbnail: {
							url: "https://images.emojiterra.com/twitter/512px/274c.png"
						}
					}});

					// Logs in console.
					console.log(colors.red(`${api.client.users.get(recipientID).username} didn't have an account to recieve a payment from ${msg.author.username}.`));
				}
			}else {
				// Sends message.
				msg.channel.send({embed: {
					title: ":x: Pay",
					description: `${args[0]} is not valid, try using a mention.`,
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/274c.png"
					}
				}});

				// Logs in console.
				console.log(colors.red(`${api.client.users.get(recipientID).username} gave an invalid user for the pay command.`));
			}
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Pickpocket",
				description: "You do not have an account, use `$new` to create a new account.",
				thumbnail: {
					url: "https://images.emojiterra.com/twitter/512px/274c.png"
				}
			}});

			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} didn't have an account to run the pay command.`));
		}
	});
};
