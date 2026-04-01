import books from "../books.js";
import { nanoid } from "nanoid";

export const addBookHandler = (newBook) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = newBook;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const bookToAdd = {
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
  };
  books.push(bookToAdd);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    return id;
  }

  return null;
};

export const getAllBooksHandler = (src, reading, finished) => {
  if (books.length === 0) {
    return [];
  }

  if (src) {
    let filteredBooks = books.filter((book) =>
      book.name.toLowerCase().includes(src.toLowerCase()),
    );
    return filteredBooks.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));
  }

  if (reading !== undefined) {
    let filteredBooks = books.filter(
      (book) => book.reading === Boolean(Number(reading)),
    );
    return filteredBooks.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));
  }

  if (finished !== undefined) {
    let filteredBooks = books.filter(
      (book) => book.finished === Boolean(Number(finished)),
    );
    return filteredBooks.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));
  }

  return books.map(({ id, name, publisher }) => ({ id, name, publisher }));
};

export const getBookByIdHandler = (bookId) => {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    return book;
  }
  return null;
};

export const editBookByIdHandler = (bookId, updatedBookData) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) return null;
  books[bookIndex] = { ...books[bookIndex], ...updatedBookData };
  return books[bookIndex];
};

export const deleteBookByIdHandler = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) return null;
  books.splice(bookIndex, 1);
  return true;
};
