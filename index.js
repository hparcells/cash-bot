const BotCore = require("reputation-core");
const colors = require("colors");
const fs = require("fs");

require("dotenv").config();

let config = Object.assign({
	modulePath: "modules",
    token: process.env.TOKEN
}, JSON.parse(fs.readFileSync("config.json")));
let bot = new BotCore(config);

// Invite: https://discordapp.com/oauth2/authorize?client_id=487411926008201246&permissions=36825152&scope=bot

bot.on("ready", () => {
    console.log(colors.green(`Logged in as ${bot.client.user.tag}.`));
    console.log(colors.green(`In ${bot.client.guilds.size} Guilds.`));

    // Activities  
    const activitiesList = [
        "Depositing Money", 
        "Withdrawing Money",
        "Betting", 
        "Counting Money",
        `in ${bot.client.guilds.size} Guilds`
    ];

    setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1);
        bot.client.user.setActivity(activitiesList[index]);
    }, 10000);

    //Joined Guild
    bot.client.on("guildCreate", (guild) => {   
        console.log(colors.green(`Joined New Guild, ${guild.name}`));
    });

    //Left Guild
    bot.client.on("guildDelete", (guild) => {
        console.log(colors.green(`Left Guild, ${guild.name}`));
    });

    // React
    bot.client.on("message", message => {
        let emoji = Math.floor(Math.random() * 3) + 1;
        let random = Math.floor(Math.random() * 10) + 1;

        if(message.author.id !== 487411926008201246) {
            if(random === 1) {
                switch(emoji) {
                    case 1: message.react("💰"); break;
                    case 2: message.react("🤑"); break;
                    case 3: message.react("💸"); break;
                }
            }
        }
    });
});