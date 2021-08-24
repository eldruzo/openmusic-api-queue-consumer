const { Pool } = require('pg');
 
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistData(playlistId) {
    const result = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username as owner 
      FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner 
      WHERE playlists.id = $1`,
      values: [playlistId],
    });

    const songs = await this.getPlaylistSongs(playlistId);

    const playlistData = {
      ...result.rows[0],
      songs,
    }

    return playlistData;
  }

  async getPlaylistSongs(playlistId) {
    const result = await this._pool.query({
      text: `SELECT songs.* FROM playlistsongs 
      LEFT JOIN songs on songs.id = playlistsongs.song_id 
      WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    });

    return result.rows;
  }
}

module.exports = PlaylistsService;