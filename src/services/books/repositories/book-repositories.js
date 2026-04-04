import { nanoid } from "nanoid";
import { Pool } from "pg";

class BookRepositories {
  constructor() {
    this.pool = new Pool();
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
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const query = {
      text: `INSERT INTO books (id, name, year, author, summary, publisher, page_count, read_page, finished, reading, inserted_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
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
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllBooks() {
    const result = await this.pool.query("SELECT id,name,publisher FROM books");
    return result.rows;
  }
  async getBooksByName(name) {
    const query = {
      text: "SELECT id,name,publisher FROM books WHERE LOWER(name) LIKE LOWER($1)",
      values: [`%${name}%`],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getBooksByReadingStatus(reading) {
    const query = {
      text: "SELECT id,name,publisher FROM books WHERE reading = $1",
      values: [reading],
    };

    const result = await this.pool.query(query);
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
      text: "SELECT * FROM books WHERE id = $1",
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
}

export default BookRepositories;
