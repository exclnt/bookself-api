import { Pool } from "pg";
import { nanoid } from "nanoid";

class CollaborationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addCollaboration(bookId, userId) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO collaborations(id, book_id, user_id) VALUES($1, $2, $3) RETURNING id",
      values: [id, bookId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0].id;
  }

  async deleteCollaboration(bookId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE book_id = $1 AND user_id = $2 RETURNING id",
      values: [bookId, userId],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async verifyCollaborator(bookId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE book_id = $1 AND user_id = $2",
      values: [bookId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows.length > 0;
  }
}

export default new CollaborationRepositories();
