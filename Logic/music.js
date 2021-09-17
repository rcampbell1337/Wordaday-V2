const ytdl = require('ytdl-core');
const axios = require("axios");
const youtube = require('scrape-youtube').default;
const qs = require('qs');

module.exports = class MusicPlayer 
{
    constructor(msg, serverQueue, queue) {
        this.msg = msg;
        this.serverQueue = serverQueue;
        this.queue = queue;
    }

    getAllSongTitleWords(words) {
        return words.slice(1).join("+");
    }

    play(guild, song){
        this.serverQueue = this.queue.get(guild.id);
        if (!song) {
            this.serverQueue.voiceChannel.leave();
            this.queue.delete(guild.id);
            return;
        }
        const dispatcher = this.serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
            this.serverQueue.songs.shift();
            this.play(guild, this.serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(this.serverQueue.volume / 5);
        this.serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
    
    async execute(song_title) {
        const voiceChannel = this.msg.member.voice.channel;
        if (!voiceChannel)
            return this.msg.channel.send(
            "You need to be in a voice channel to play music!"
            );
        const permissions = voiceChannel.permissionsFor(this.msg.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return this.msg.channel.send(
            "I need the permissions to join and speak in your voice channel!"
            );
        }
        const songInfo = await ytdl.getInfo(await this.scrapeTheFirstVideoUrl(song_title));
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
        if (!this.serverQueue || this.serverQueue.songs.length == 0) {
            const queueContruct = {
                textChannel: this.msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            
            this.queue.set(this.msg.guild.id, queueContruct);

            queueContruct.songs.push(song);
        
            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.play(this.msg.guild, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                this.queue.delete(this.msg.guild.id);
                return this.msg.channel.send(err);
            }
        }else {
            this.serverQueue.songs.push(song);
        }
    }

    skip(serverQueue) {
        if (!this.msg.member.voice.channel)
          return this.msg.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
        if (!serverQueue)
          return this.msg.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
        console.log(serverQueue.songs.length);
      }
      
    stop(serverQueue) {
        if (!this.msg.member.voice.channel)
          return this.msg.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
          
        if (!serverQueue)
          return this.msg.channel.send("There is no song that I could stop!");
          
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
      }

    async getSongsFromSpotifyPlaylist(args) {
        if (!args[1].includes("https://open.spotify.com/playlist/") && !args[1].includes("?")) {
            this.msg.channel.send("You must use a valid spotify playlist url!");
            return;
        }
        let playlist_id = args[1].split("/")[4].split("?")[0];
        let api_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
        axios.get(api_url, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + await this.getAuth(),
                "Content-type": "application/json",
            }
        }).then(response => {
            let playlist = response.data['items'];
            if (playlist.length > 0 && response.status == 200) {
                this.execute(playlist[1]['track']['name']);
                for (let i = 0; i < playlist.length; i++) {
                    this.execute(playlist[i]['track']['artists'][0]['name'] + " - " + playlist[i]['track']['name']);
                    console.log(playlist[i]['track']['artists'][0]['name'] + " - " + playlist[i]['track']['name']);
                }
            }
            else {
                this.msg.channel.send(`Invalid Playlist`);
            }
          })
          .catch(error => {
            console.log(error);
        });
    }

    async scrapeTheFirstVideoUrl(title) {
        const results = youtube.search(title).then((results) => {
            return results.videos[0].link;
        });
        return await results;
    }

    async getAuth() {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_SECRET;
        
        const headers = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: clientId,
            password: clientSecret,
          },
        };
        const data = {
          grant_type: 'client_credentials',
        };
      
        try {
          const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            qs.stringify(data),
            headers
          );
          console.log(response.data.access_token);
          return await response.data.access_token;
        } catch (error) {
          console.log(error);
        }
      };
}