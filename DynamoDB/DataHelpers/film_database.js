const MediaDatabaseBase = require("./media_database_base");

module.exports = class FilmDatabase extends MediaDatabaseBase {

    constructor() {
        super(process.env.album_access, process.env.album_secret);
        this.table_name = "cache_films";
        this.type = "film";
    }
}