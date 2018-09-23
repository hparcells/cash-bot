const BotCore = require("reputation-core");
const colors = require("colors");
const fs = require("fs");
const r = require("rethinkdb");

require("dotenv").config();

let connection = undefined;

r.connect({host: process.env.HOST, port: 28015, db: "cash_bot"}, function(err, conn) {
    if(err) {
        throw err;
    }

    connection = conn;

    console.log(colors.green("[Database] Connected"));
}).then(() => {
    module.exports = connection;

    console.log(colors.green("[Bot] Loading Modules"));

    let config = Object.assign({
        modulePath: "modules",
        token: process.env.TOKEN
    }, JSON.parse(fs.readFileSync("config.json")));
    let bot = new BotCore(config);

    console.log(colors.green("[Bot] Loaded Modules"));
    
    bot.on("ready", () => {
        console.log(colors.green(`[Bot] Logged in as ${bot.client.user.tag}.`));
        console.log(colors.green(`[Bot] In ${bot.client.guilds.size} Guilds.`));
    
        // Activities  
        let activitiesList = [
            "Depositing Money", 
            "Withdrawing Money",
            "Betting", 
            "Counting Money",
            `in ${bot.client.guilds.size} Guilds`,
            "$help"
        ];
    
        setInterval(() => {
            const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1);
            bot.client.user.setActivity(activitiesList[index]);
        }, 10000);
    
        //Joined Guild
        bot.client.on("guildCreate", (guild) => {   
            console.log(colors.green(`[Bot] Joined New Guild, ${guild.name}`));
    
            activitiesList = [
                "Depositing Money", 
                "Withdrawing Money",
                "Betting", 
                "Counting Money",
                `in ${bot.client.guilds.size} Guilds`,
                "$help"
            ];
        });
    
        //Left Guild
        bot.client.on("guildDelete", (guild) => {
            console.log(colors.green(`[Bot] Left Guild, ${guild.name}`));
    
            activitiesList = [
                "Depositing Money", 
                "Withdrawing Money",
                "Betting", 
                "Counting Money",
                `in ${bot.client.guilds.size} Guilds`,
                "$help"
            ];
        });
    });    
});

// const Sentry = require('@sentry/node');
// Sentry.init({ dsn: "https://a9cce6dd3f334f73ad11dd8a6c76cacf@sentry.io/1283691" });

