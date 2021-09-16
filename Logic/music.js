const ytdl = require('ytdl-core');


module.exports = class MusicPlayer 
{
    constructor(msg) {
        this.msg = msg;
        this.queue = new Map();
    }

    getAllSongTitleWords(words) {
        return words.slice(1).join(" ");
    }
    
    execute(song_title, serverQueue) {
        const play = (guild, song) => {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                this.queue.delete(guild.id);
                return;
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
                })
                .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
        }
        let title = this.getAllSongTitleWords(song_title);
        let msg = this.msg;
        let queue = this.queue;
        const method = async () => {

            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel)
                return msg.channel.send(
                "You need to be in a voice channel to play music!"
                );
            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return msg.channel.send(
                "I need the permissions to join and speak in your voice channel!"
                );
            }
            const songInfo = await ytdl.getInfo("Ys9sIqv42lo");
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                  };
              
                queue.set(msg.guild.id, queueContruct);
            
                queueContruct.songs.push(song);
            
                try {
                    var connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    play(msg.guild, queueContruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(msg.guild.id);
                    return msg.channel.send(err);
                }
            }else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                return msg.channel.send(`${song.title} has been added to the queue!`);
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on("finish", () => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
        }
        method();
    }
}