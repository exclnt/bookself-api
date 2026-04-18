import { nanoid } from "nanoid";
import { Pool } from "pg";
import collaborationRepositories from "../../collaborations/repositories/collaboration-repositories.js";

class BookRepositories {
  constructor() {
    this.pool = new Pool();
    this.collaborationRepositories = collaborationRepositories;
  }

  async createBook({
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    owner,
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const query = {
      text: `INSERT INTO books (id, name, year, author, summary, publisher, page_count, read_page, finished, reading, inserted_at, updated_at, owner)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      values: [
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
        owner,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyBookOwner(id, owner) {
    const query = {
      text: "SELECT * FROM books WHERE id = $1",
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      return null;
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      return null;
    }
    return result.rows[0];
  }

  async getBooks({ name, reading, owner }) {
    let baseQuery = `
      SELECT books.id, books.name, books.publisher
      FROM books
      LEFT JOIN collaborations ON collaborations.book_id = books.id
      WHERE (books.owner = $1 OR collaborations.user_id = $1)
    `;

    console.log(`owner di getrepo ${owner}`);

    // const lowerName = name.toLowerCase();

    const values = [owner];
    let index = 2;

    if (name) {
      baseQuery += ` AND LOWER(name) LIKE LOWER($${index})`;
      values.push(`%${name}%`);
      index++;
    }

    if (reading !== undefined) {
      baseQuery += ` AND reading = $${index}`;
      values.push(reading);
      // index++;
    }

    const result = await this.pool.query({
      text: baseQuery,
      values,
    });

    return result.rows;
  }

  async getBooksByFinishedStatus(finished) {
    const query = {
      text: "SELECT id,name,publisher FROM books WHERE finished = $1",
      values: [finished],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getBookById(id) {
    const query = {
      text: "SELECT books.*,users.username FROM books  LEFT JOIN users ON users.id = books.owner WHERE books.id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async updateBookById(
    id,
    { name, year, author, summary, publisher, pageCount, readPage, reading },
  ) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    const query = {
      text: `UPDATE books
             SET name = $1, year = $2, author = $3, summary = $4, publisher = $5, page_count = $6, read_page = $7, finished = $8, reading = $9, updated_at = $10
             WHERE id = $11`,
      values: [
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
        id,
      ],
    };

    const result = await this.pool.query(query);
    return result.rowCount > 0;
  }

  async deleteBookById(id) {
    const query = {
      text: "DELETE FROM books WHERE id = $1",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rowCount > 0;
  }

  async verifyBookAccess(bookId, userId) {
    const ownerResult = await this.verifyBookOwner(bookId, userId);

    if (ownerResult) {
      return ownerResult;
    }

    const result = await this.collaborationRepositories.verifyCollaborator(
      bookId,
      userId,
    );

    return result;
  }
}

export default new BookRepositories();
