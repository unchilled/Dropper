/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./config.js";

import PogObject from "PogData";
const pogObject = new PogObject("Dropper", {
  stats: {
    wins: 0,
    losses: 0,
    quits: 0,
    fails: 0,
    times: [],
    htimes: [],
    mapData: [
      {
        name: 'Balloons',
        fails: 0,
        times: []
      },
      {
        name: 'Distance',
        fails: 0,
        times: []
      },
      {
        name: 'Drainage',
        fails: 0,
        times: []
      },
      {
        name: 'Lily',
        fails: 0,
        times: []
      },
      {
        name: 'Mushroom',
        fails: 0,
        times: []
      },
      {
        name: 'Space',
        fails: 0,
        times: []
      },
      {
        name: 'Time',
        fails: 0,
        times: []
      },
      {
        name: 'Toilet',
        fails: 0,
        times: []
      },
      {
        name: 'Upside Down',
        fails: 0,
        times: []
      },
      {
        name: 'Well',
        fails: 0,
        times: []
      },
      {
        name: 'Castle',
        fails: 0,
        times: []
      },
      {
        name: 'City',
        fails: 0,
        times: []
      },
      {
        name: 'Floating Islands',
        fails: 0,
        times: []
      },
      {
        name: 'Mineshaft',
        fails: 0,
        times: []
      },
      {
        name: 'Ravine',
        fails: 0,
        times: []
      },
      {
        name: 'Sewer',
        fails: 0,
        times: []
      },
      {
        name: 'Western',
        fails: 0,
        times: []
      },
      {
        name: 'Factory',
        fails: 0,
        times: []
      },
      {
        name: 'Gears',
        fails: 0,
        times: []
      },
      {
        name: 'Illusion',
        fails: 0,
        times: []
      },
      {
        name: 'Ocean',
        fails: 0,
        times: []
      },
      {
        name: 'Sandworm',
        fails: 0,
        times: []
      }
    ]
  },
  games: [],
});

Number.prototype.zeroPad = function() {
  return ('0'+this).slice(-2);
};

function convertms(millis) {
  minutes = Math.floor((millis / 1000) / 60);
  seconds = Math.floor((millis / 1000) % 60);
  milliseconds = millis % 1000;
  return minutes.zeroPad() + ":" + seconds.zeroPad() + "." + ('0'+milliseconds).slice(-3);;
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeuniqueid(length) {
  id = makeid(length)
  if(pogObject.games.find(game => game.id === id)) {
    return makeuniqueid(length);
  }
  return id;
}

register('chat', (msgo) => {
  try{
    message = ChatLib.getChatMessage(msgo);
    nfmessage = ChatLib.removeFormatting(message);
    if(nfmessage.startsWith('Selected Maps')){
      msgo.setCanceled(true);
      mapnames = nfmessage.split(" ");
      mapnames.shift();
      mapnames.shift();
      mapnames = mapnames.join(' ').split(', ')
      mapfails = new Array(5).fill(0);
      maptimes = new Array(5).fill(0);
      currentmap = 0;
      playersfinished = 0;
      place = 0;
      totalfails = 100;
      starttimes = new Array(5).fill(0);
      endtimes = new Array(5).fill(0);
      totaltime = 0;
      totaltimemanual = Array(2).fill(0);
      gameEnded = false;
    gameStarted = false;
      gameid = makeuniqueid(7);
      hreport = [];
      ChatLib.chat("§a&lSelected Maps:")
      ChatLib.chat("&b1. §a" + mapnames[0])
      ChatLib.chat("&b2. §a" + mapnames[1])
      ChatLib.chat("&b3. §e" + mapnames[2])
      ChatLib.chat("&b4. §e" + mapnames[3])
      ChatLib.chat("&b5. §c" + mapnames[4])

      actionbar = register('actionBar', (actionbar) => {
        try{
          amsg = ChatLib.getChatMessage(actionbar);
          anfmsg = ChatLib.removeFormatting(amsg);
          if(anfmsg.startsWith('Current ')){
            actionbar.setCanceled(true)
          }
        } catch (e) {
          ChatLib.simulateChat("§c§lDropper Addon Error: §c" + e)
          ChatLib.simulateChat("§c&lPlease report this to §bunchilled#0001 §con Discord.")
        }
      })
      ticker = register('tick', () => {
        try{
          ogtotalfails = totalfails;
          try{
            failline = ChatLib.removeFormatting(Scoreboard.getLinesByScore(3)[0].toString().slice(13, 100))
            totalfails = parseInt(failline.replace(/\D/g,''));
            if(totalfails > ogtotalfails){
              mapfails.splice(currentmap - 1, 1, mapfails[currentmap - 1] + 1);
            }
          } catch(e) {
            console.log(e)
          }          
          if(ogtotalfails < totalfails && Settings.sillyMessages){
            ChatLib.chat("§6[ADDONDEV§0++§6] unchilled§f: §lL")
          }
          if(gameStarted && !gameEnded){
            ChatLib.actionBar("§fTime: §a" + convertms(Date.now().valueOf() - starttimes[0]) + " §7- §fMap Time: §e" + convertms(Date.now().valueOf() - starttimes[currentmap - 1]) + " §7- §fFails: §c" + mapfails[currentmap - 1]);
          }
        } catch (e) {
          ChatLib.simulateChat("§c§lDropper Addon Error: §c" + e)
          ChatLib.simulateChat("§c&lPlease report this to §bunchilled#0001 §con Discord.")
        }
      })
      gamechat = register('chat', (gmsgo) => {
        try{
          gmessage = ChatLib.getChatMessage(gmsgo, true);
          gnfmessage = ChatLib.removeFormatting(gmessage);
          if(gnfmessage == 'DROP!' && currentmap == 0){
            currentmap = 1;
            starttimes.splice(0, 1, Date.now().valueOf());
            totaltimemanual.splice(0, 1, Date.now().valueOf());
            if(Settings.sillyMessages){
              setTimeout(() => {
                ChatLib.chat("§6[ADDONDEV§0++§6] unchilled§f: §lDon't mess up ;)")
              }, 1)
            }
          gameStarted = true;
          }
          if(gnfmessage.match(/(?:\[[\d+]*\] )?(.*) finished all maps in (\d*:\d*):(\d*)/g) && !gnfmessage.startsWith("You ")){
            matches = gnfmessage.match(/(?:\[[\d+]*\] )?(.*) finished all maps in (\d*:\d*):(\d*)/g)
            player = gnfmessage.split(" ")[0];
            if(matches[0].includes("[")){
              player = gmessage.split(" ")[0] + " " + gmessage.split(" ")[1];
            }
            ChatLib.chat("§7" + player + "§7 finished the dropper in §a" + (convertms(Date.now().valueOf() - totaltimemanual[0])));
            gmsgo.setCanceled(true);
            playersfinished++;
          }
          if(gnfmessage.startsWith('You finished Map ')){
            currentmap = currentmap + 1;
            endtimes.splice(currentmap - 2, 1, Date.now().valueOf());
            starttimes.splice(currentmap - 1, 1, Date.now().valueOf());
            ChatLib.chat("§7You finished §a" + mapnames[currentmap - 2] + "§7 in §a" + (convertms(endtimes[currentmap - 2] - starttimes[currentmap - 2])));
            gmsgo.setCanceled(true);
          }
          if(gnfmessage.startsWith('You finished all maps in ')){
            playersfinished++
            place = playersfinished;
            gmsgo.setCanceled(true);
            totaltimemanual.splice(1, 1, Date.now().valueOf());
            endtimes.splice(4, 1, Date.now().valueOf());
            starttimes.forEach((time, index) =>{
              totaltime = totaltime + (endtimes[index] - time);
              if(index == 4){
                hreport = gnfmessage.split('in ')[1].slice(0, -1).split(':');
                htime = parseInt(hreport[0], 10) * 60 * 1000 + parseInt(hreport[1], 10) * 1000 + parseInt(hreport[2], 10);
                htimestring = "+" + convertms(htime - totaltime);
                if(htime < totaltime){
                  htimestring = "-" + convertms(totaltime - htime);
                }
                ChatLib.chat("§a&lDROPPER FINISHED!")
                if(Settings.actualTime){
                  ChatLib.chat("§eFinal Time: §b" + convertms(totaltime))
                }
                if(Settings.hypixelTime){
                  ChatLib.chat("§eHypixel Time (off by " + htimestring + "): §9" + convertms(htime))
                }
                ChatLib.chat("§eTotal Fails: §c" + totalfails)
                ChatLib.chat("§ePlace: §9#" + place)
                ChatLib.chat("§eGame ID: §6" + gameid)
                ChatLib.chat("§6Maps:")
                ChatLib.chat("§b1. §a" + mapnames[0] + " §7- §e" + convertms(endtimes[0] - starttimes[0]) + " §7- §c" + mapfails[0])
                ChatLib.chat("§b2. §a" + mapnames[1] + " §7- §e" + convertms(endtimes[1] - starttimes[1]) + " §7- §c" + mapfails[1])
                ChatLib.chat("§b3. §e" + mapnames[2] + " §7- §e" + convertms(endtimes[2] - starttimes[2]) + " §7- §c" + mapfails[2])
                ChatLib.chat("§b4. §e" + mapnames[3] + " §7- §e" + convertms(endtimes[3] - starttimes[3]) + " §7- §c" + mapfails[3])
                ChatLib.chat("§b5. §c" + mapnames[4] + " §7- §e" + convertms(endtimes[4] - starttimes[4]) + " §7- §c" + mapfails[4])
                if(Settings.sillyMessages){
                  ChatLib.chat("§6[ADDONDEV§0++§6] unchilled§f: §l§6GG")
                }
                gameEnded = true
                if(Settings.autoGG){
                  ChatLib.say("/ac gg")
                }
              } 
            })
          }
        } catch (e) {
          ChatLib.simulateChat("§c§lDropper Addon Error: §c" + e)
          ChatLib.simulateChat("§c&lPlease report this to §bunchilled#0001 §con Discord.")
        }
        
      })
      unload = register('worldLoad', () => {
        try{
          if(!gameEnded) {
            ChatLib.chat('§cGame leave detected. Keep in mind stats will still be saved when you leave the game.')
            pogObject.stats.losses = (pogObject.stats.losses + 1)
          } else {
            totaltime = 0;
            htime = parseInt(hreport[0], 10) * 60 * 1000 + parseInt(hreport[1], 10) * 1000 + parseInt(hreport[2], 10);
            starttimes.forEach((time, index) =>{
              totaltime = totaltime + (endtimes[index] - time);
              console.log(totaltime)
              if(index == 4) {
                pogObject.games.push(
                  {
                    id: gameid,
                    time: totaltime,
                    htime: htime,
                    fails: totalfails,
                    place: place,
                    started: starttimes[0],
                    maps: [ mapnames[0], mapnames[1], mapnames[2], mapnames[3], mapnames[4] ],
                    times: [ endtimes[0] - starttimes[0], endtimes[1] - starttimes[1], endtimes[2] - starttimes[2], endtimes[3] - starttimes[3], endtimes[4] - starttimes[4] ],
                    mapfails: [ mapfails[0], mapfails[1], mapfails[2], mapfails[3], mapfails[4] ]
                  }
                )
                pogObject.stats.times.push(totaltime)
                pogObject.stats.htimes.push(htime)
                pogObject.stats.mapData.find(map => map.name == mapnames[0]).times.push(endtimes[0] - starttimes[0])
                pogObject.stats.mapData.find(map => map.name == mapnames[1]).times.push(endtimes[1] - starttimes[1])
                pogObject.stats.mapData.find(map => map.name == mapnames[2]).times.push(endtimes[2] - starttimes[2])
                pogObject.stats.mapData.find(map => map.name == mapnames[3]).times.push(endtimes[3] - starttimes[3])
                pogObject.stats.mapData.find(map => map.name == mapnames[4]).times.push(endtimes[4] - starttimes[4])
                pogObject.stats.mapData.find(map => map.name == mapnames[0]).fails = pogObject.stats.mapData.find(map => map.name == mapnames[0]).fails + mapfails[0]
                pogObject.stats.mapData.find(map => map.name == mapnames[1]).fails = pogObject.stats.mapData.find(map => map.name == mapnames[1]).fails + mapfails[1]
                pogObject.stats.mapData.find(map => map.name == mapnames[2]).fails = pogObject.stats.mapData.find(map => map.name == mapnames[2]).fails + mapfails[2]
                pogObject.stats.mapData.find(map => map.name == mapnames[3]).fails = pogObject.stats.mapData.find(map => map.name == mapnames[3]).fails + mapfails[3]
                pogObject.stats.mapData.find(map => map.name == mapnames[4]).fails = pogObject.stats.mapData.find(map => map.name == mapnames[4]).fails + mapfails[4]
              }
            })
          }
          if(place == 1){
            pogObject.stats.wins = (pogObject.stats.wins + 1)
          } else {
            pogObject.stats.losses = (pogObject.stats.losses + 1)
          }
          pogObject.stats.fails = (pogObject.stats.fails + totalfails)
          pogObject.save();
        } catch (e) {
          ChatLib.simulateChat("§c§lDropper Addon Error: §c" + e)
          ChatLib.simulateChat("§c&lPlease report this to §bunchilled#0001 §con Discord.")
        }
        unregister();
      })
      function unregister() {
        try{
          gamechat.unregister();
          actionbar.unregister();
          unload.unregister();
          ticker.unregister();
        } catch (e) {
          ChatLib.simulateChat("§c§lDropper Addon Error: §c" + e)
          ChatLib.simulateChat("§c&lPlease report this to §bunchilled#0001 §con Discord.")
        }
      }
    }
  } catch (e) {
    ChatLib.simulateChat("§c§lDropper Addon Error: §c" + e)
    ChatLib.simulateChat("§c&lPlease report this to §bunchilled#0001 §con Discord.")
  }
})
register("command", () => Settings.openGUI()).setName("dropsettings").setAliases(["droppersettings", "dropset"]);
register("command", () => ChatLib.say("/play prototype_dropper")).setName("drop").setAliases(["dropper"]);
register("command", (args) => {
  game = pogObject.games.find(game => game.id == args)
  if(game != undefined && game != null) {
    htimestring = "+" + convertms(game.htime - game.time);
    ChatLib.chat("§a&lDropper Game Info:")
    ChatLib.chat("§eGame ID: §6" + game.id)
    if(Settings.actualTime){
      ChatLib.chat("§eFinal Time: §b" + convertms(game.time))
    }
    if(Settings.hypixelTime){
      ChatLib.chat("§eHypixel Time (off by " + htimestring + "): §9" + convertms(game.htime))
    }
    ChatLib.chat("§eTotal Fails: §c" + game.fails)
    ChatLib.chat("§ePlace: §9#" + game.place)
    ChatLib.chat("§6Maps:")
    ChatLib.chat("§b1. §a" + game.maps[0] + " §7- §e" + convertms(game.times[0]) + " §7- §c" + game.mapfails[0])
    ChatLib.chat("§b2. §a" + game.maps[1] + " §7- §e" + convertms(game.times[1]) + " §7- §c" + game.mapfails[1])
    ChatLib.chat("§b3. §e" + game.maps[2] + " §7- §e" + convertms(game.times[2]) + " §7- §c" + game.mapfails[2])
    ChatLib.chat("§b4. §e" + game.maps[3] + " §7- §e" + convertms(game.times[3]) + " §7- §c" + game.mapfails[3])
    ChatLib.chat("§b5. §c" + game.maps[4] + " §7- §e" + convertms(game.times[4]) + " §7- §c" + game.mapfails[4])
  } else {
    ChatLib.chat("§cThis game does not exist.")
  }
}).setName("dropgame").setAliases(["droppergame"]);
register("command", (args) => {
  player = pogObject
  if(player != undefined && player != null && player.stats.times.length > 0) {
    ChatLib.chat("§a&lDropper Stats:")
    ChatLib.chat("§eWins: §b" + player.stats.wins)
    ChatLib.chat("§eLosses: §4" + player.stats.losses)
    ChatLib.chat("§eFails: §c" + player.stats.fails)
    ChatLib.chat("§eWin/Loss Ratio: §b" + (player.stats.wins / player.stats.losses).toFixed(2))
    ChatLib.chat("§ePass/Fail Ratio: §b" + ((player.stats.times.length * 5) / player.stats.fails).toFixed(2))
    if(Settings.actualTime) {
      ChatLib.chat("§eAverage Time: §9" + convertms(player.stats.times.reduce((a, b) => a + b, 0) / player.stats.times.length))
      ChatLib.chat("§eBest Time: §a" + convertms(Math.min(...player.stats.times)))
    }
    if(Settings.hypixelTime) {
      ChatLib.chat("§eAverage Hypixel Time: §9" + convertms(player.stats.htimes.reduce((a, b) => a + b, 0) / player.stats.htimes.length))
      ChatLib.chat("§eBest Hypixel Time: §a" + convertms(Math.min(...player.stats.htimes)))
    }
    ChatLib.chat("§eAverage Fails: §c" + (player.stats.fails / player.stats.times.length).toFixed(2))
    ChatLib.chat("§eRun §b/dropmaps§e to see individual map stats.")
  } else {
    ChatLib.chat("§cYou have not played any games yet.")
  }
}).setName("dropstats").setAliases(["dropperstats"]);
register("command", (args) => {
  gamesPlayed = false;
  pogObject.stats.mapData.forEach(map => {
    if(map.times.length > 0){
      gamesPlayed = true;
      ChatLib.chat("§7")
      ChatLib.chat("§b" + map.name + "§7: §e" + map.times.length + " Games §7- §c" + map.fails + " Fails &7- §eAverage Time: §b" + convertms(Math.round(map.times.reduce((a, b) => a + b, 0) / map.times.length)) + " §7- §eAverage Fails: §c" + (map.fails / map.times.length).toFixed(2) + " §7- §eBest Time: §a" + convertms(Math.min(...map.times)) + " §7- §eWorst Time: §4" + convertms(Math.max(...map.times)))
    }
  })
  if(!gamesPlayed){
    ChatLib.chat("§cYou have not played any games yet.")
  }
}).setName("dropmaps").setAliases(["droppermaps"]);
register("command", (args) => {
  games = pogObject.games
  if (games.length == 0){
    ChatLib.chat("§cYou have not played any games yet.")
  } else {
    ChatLib.chat("§b")
    ChatLib.chat("§a§lRecent Dropper Games:")
    games.sort((a, b) => (a.started < b.started) ? 1 : -1)
    games.forEach((game, index) => {
      if(index < 5){
        var clickableMessage = new Message(
          new TextComponent("§b" + game.id + " §7- §e" + convertms(game.time) + " §7- §c" + game.fails).setClick("run_command", "/dropgame " + game.id).setHoverValue("§aClick to see more info.")
        );
        ChatLib.chat(clickableMessage)
      }
    })
    ChatLib.chat("§7Click a game to see more info.")
    ChatLib.chat("§b")
  }
  
}).setName("droprecent").setAliases(["dropperrecent"]);