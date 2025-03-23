exports.up = (pgm) => {
    pgm.createTable('playlists', {
      id: { type: 'VARCHAR(50)', primaryKey: true },
      name: { type: 'TEXT', notNull: true },
      owner: { type: 'VARCHAR(50)', notNull: true },
    });
  
    pgm.addConstraint('playlists', 'fk_playlists_owner_users_id', {
      foreignKeys: {
        columns: 'owner',
        references: 'users(id)',
        onDelete: 'CASCADE',
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('playlists');
  };
  