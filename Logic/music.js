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
        this.songs = [];
        this.offset = 0;
    }

    getAllSongTitleWords(words) {
        return words.slice(1).join("+");
    }

    play(guild, song){
      this.serverQueue = this.queue.get(guild.id);
      console.log(this.serverQueue.playing);
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
          this.playing = false;
          })
          .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(this.serverQueue.volume / 5);
      this.serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }

    async getSongInfo(songTitle) {
      const songInfo = await ytdl.getInfo(await this.scrapeTheFirstVideoUrl(songTitle));
      return {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
      };
    }
    
    async execute(songTitle, singleSong) {
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
      const song = await this.getSongInfo(songTitle);
      if (!this.serverQueue) {
          const queueContract = {
              textChannel: this.msg.channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [],
              volume: 5,
              playing: true
          };
          
          this.queue.set(this.msg.guild.id, queueContract);
          queueContract.songs.push(song);
      
          try {
              var connection = await voiceChannel.join();
              queueContract.connection = connection;
              this.play(this.msg.guild, queueContract.songs[0]);
          } catch (err) {
              console.log(err);
              this.queue.delete(this.msg.guild.id);
              return this.msg.channel.send(err);
          }
      }else {
          this.serverQueue.songs.push(song);

          if (singleSong) {
            this.serverQueue.textChannel.send(`Added to queue: **${song.title}**`);
          }
        }
    }

    shuffler(array) {
      array.sort(() => Math.random() - 0.5);
    }

    shuffle() {
      if (!this.serverQueue) {
        this.msg.channel.send("Sorry, i can't find any queued songs!");
      }
      this.shuffler(this.serverQueue.songs);
      console.log(this.serverQueue.songs);
    }

    skip(serverQueue) {
        if (!this.msg.member.voice.channel)
          return this.msg.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
        if (!serverQueue)
          return this.msg.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
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
        let index = 0;
        let api_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=100&offset=${this.offset}`;
        axios.get(api_url, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + await this.getAuth(),
                "Content-type": "application/json",
            }
        }).then(response => {
            let playlist = response.data['items'];
            if (playlist.length > 0 && response.status == 200) {
              for (let i = 0; index < playlist.length; i++) {
                this.execute(playlist[i]['track']['artists'][0]['name'] + " - " + playlist[i]['track']['name']);
                index++;
              }
            }
            else {
                this.msg.channel.send(`Invalid Playlist`);
            }
          }).then(response => {
            if (index % 100 == 0) {
              this.offset += 100;
              this.getSongsFromSpotifyPlaylist(args);
            }
          })
          .catch(error => {
            console.log(error);
        });
    }

    async scrapeTheFirstVideoUrl(title) {
        const results = title[1].includes("youtube.com") ? title[1] : youtube.search(title).then((results) => {
          return results.videos[0].link;
        });
        console.log(await results);
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
          return await response.data.access_token;
        } catch (error) {
          console.log(error);
        }
      };
}