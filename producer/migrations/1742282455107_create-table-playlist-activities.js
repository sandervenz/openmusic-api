exports.up = (pgm) => {
    pgm.createTable('playlist_activities', {
      id: { type: 'VARCHAR(50)', primaryKey: true },
      playlist_id: { type: 'VARCHAR(50)', notNull: true },
      song_id: { type: 'VARCHAR(50)', notNull: true },
      user_id: { type: 'VARCHAR(50)', notNull: true },
      action: { type: 'TEXT', notNull: true },
      time: { type: 'TIMESTAMP', default: pgm.func('current_timestamp'), notNull: true },
    });
  
    pgm.addConstraint('playlist_activities', 'fk_playlist_activities_playlist_id_playlists_id', {
      foreignKeys: {
        columns: 'playlist_id',
        references: 'playlists(id)',
        onDelete: 'CASCADE',
      },
    });
  
    pgm.addConstraint('playlist_activities', 'fk_playlist_activities_song_id_songs_id', {
      foreignKeys: {
        columns: 'song_id',
        references: 'songs(id)',
        onDelete: 'CASCADE',
      },
    });
  
    pgm.addConstraint('playlist_activities', 'fk_playlist_activities_user_id_users_id', {
      foreignKeys: {
        columns: 'user_id',
        references: 'users(id)',
        onDelete: 'CASCADE',
      },
    });
  };

exports.down = (pgm) => {
    pgm.dropTable('playlist_activities');
};