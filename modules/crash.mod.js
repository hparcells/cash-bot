const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "crash";

exports.onLoad = api => {
    api.commands.add("crash", (msg) => {
        // let bet = parseInt(msg.content.substring(7));
        // let crashAt = undefined;
        // let currentValue = 1.00;
        
        // msg.channel.send({embed: {
        //     color: 0xFFFFFF,
        //     title: "Crash",
        //     fields: [{
        //         name: ":moneybag: Your Bet",
        //         value: `${bet}`,
        //     }, {
        //         name: "Status",
        //         value: `${currentValue}`,
        //     }]
        // }}).then(async (m) => {
        //     messageID = m.id;
            
        //     if(Math.floor(Math.random() * 10) + 1 <= 5) {
        //         crashAt = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
        //     }else if(Math.floor(Math.random() * 10) + 1 > 5 && Math.floor(Math.random() * 10) + 1 <= 8) {
        //         crashAt = Math.floor(Math.random() * (500 - 301 + 1)) + 301;
        //     }else if(Math.floor(Math.random() * 10) + 1 > 8 && Math.floor(Math.random() * 10) + 1 <= 9) {
        //         crashAt = Math.floor(Math.random() * (700 - 501 + 1)) + 501;
        //     }else if(Math.floor(Math.random() * 10) + 1 > 9 && Math.floor(Math.random() * 10) + 1 <= 10) {
        //         crashAt = Math.floor(Math.random() * (10000 - 701 + 1)) + 701;
        //     }
        //     crashAt /= 100;

        //     function crash() {
        //         currentValue += 0.01;
                
        //         msg.channel.fetchMessages({
        //             around: messageID,
        //             limit: 1
        //         }).then(messages => {
        //             const fetchedMsg = messages.first();
                    
        //             setTimeout(crash, 500);

        //             if(!(currentValue === crashAt)) {
        //                 fetchedMsg.edit({embed: {
        //                     color: 0xFFFFFF,
        //                     fields: [{
        //                         name: ":moneybag: Your Bet",
        //                         value: `${bet}`,
        //                     }, {
        //                         name: "Status",
        //                         value: `${currentValue.toFixed(2)}`,
        //                     }]
        //                 }});
        //             }else {
        //                 fetchedMsg.edit({embed: {
        //                     color: 0xFFFFFF,
        //                     fields: [{
        //                         name: ":moneybag: Your Bet",
        //                         value: `${bet}`,
        //                     }, {
        //                         name: "Status",
        //                         value: `:x: Crashed At ${currentValue.toFixed(2)}`,
        //                     }]
        //                 }});
        //             }
                    
        //         });

        //     }

        //     while(currentValue <= crashAt) {           
        //         await crash();
        //     }


        // });

        // // Logs in console.
        // console.log(colors.green(`${msg.author.username} used the crash command.`));

        // // crashAt = undefined;
        // // currentValue = 1.00;
    });
};
