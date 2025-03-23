exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
      id: { type: 'VARCHAR(50)', primaryKey: true },
      playlist_id: { type: 'VARCHAR(50)', notNull: true },
      song_id: { type: 'VARCHAR(50)', notNull: true },
    });
  
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs_playlist_id_playlists_id', {
      foreignKeys: {
        columns: 'playlist_id',
        references: 'playlists(id)',
        onDelete: 'CASCADE',
      },
    });
  
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs_song_id_songs_id', {
      foreignKeys: {
        columns: 'song_id',
        references: 'songs(id)',
        onDelete: 'CASCADE',
      },
    });
  
    pgm.addConstraint('playlist_songs', 'unique_playlist_song', {
      unique: ['playlist_id', 'song_id'],
    });
  };

exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
};