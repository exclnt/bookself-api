/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("books", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
    author: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    summary: {
      type: "TEXT",
      notNull: true,
    },
    publisher: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    page_count: {
      type: "INT",
      notNull: true,
    },
    read_page: {
      type: "INT",
      notNull: true,
    },
    finished: {
      type: "BOOLEAN",
      notNull: true,
    },
    reading: {
      type: "BOOLEAN",
      notNull: true,
    },
    inserted_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("books");
};
