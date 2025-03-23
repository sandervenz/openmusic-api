exports.up = (pgm) => {
    pgm.createTable('collaborations', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      playlist_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"playlists"',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"users"',
        onDelete: 'CASCADE',
      },
    });
  
    // Hindari duplikasi user dalam satu playlist
    pgm.addConstraint('collaborations', 'unique_playlist_user', 'UNIQUE(playlist_id, user_id)');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('collaborations');
  };
  