const MediaDatabaseBase = require("./media_database_base");

module.exports = class AlbumDatabase extends MediaDatabaseBase {

    constructor() {
        super(process.env.album_access, process.env.album_secret);
        this.table_name = "cache_albums";
        this.type = "album";
    }
}