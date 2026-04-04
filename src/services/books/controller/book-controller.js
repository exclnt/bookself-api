// import books from "../books.js";
import { nanoid } from "nanoid";
import BookRepositories from "../repositories/book-repositories.js";

const BookRepositoriesInstance = new BookRepositories();

export const addBookHandler = async (newBook) => {
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
  // books.push(bookToAdd);

  const note = await BookRepositoriesInstance.createBook(bookToAdd);

  // const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (!note) {
    return null;
  }

  return await note.id;
};

export const getAllBooksHandler = async (
  src,
  reading = undefined,
  finished = undefined,
) => {
  // if (books.length === 0) {
  //   return [];
  // }

  if (src) {
    // let filteredBooks = books.filter((book) =>
    //   book.name.toLowerCase().includes(src.toLowerCase()),
    // );
    // return filteredBooks.map(({ id, name, publisher }) => ({
    //   id,
    //   name,
    //   publisher,
    // }));

    const books = await BookRepositoriesInstance.getBooksByName(src);
    return books;
  }

  if (reading !== undefined) {
    // let filteredBooks = books.filter(
    //   (book) => book.reading === Boolean(Number(reading)),
    // );
    // return filteredBooks.map(({ id, name, publisher }) => ({
    //   id,
    //   name,
    //   publisher,
    // }));
    const readingPrm = Boolean(Number(reading));
    const books =
      await BookRepositoriesInstance.getBooksByReadingStatus(readingPrm);
    return books;
  }

  if (finished !== undefined) {
    // let filteredBooks = books.filter(
    //   (book) => book.finished === Boolean(Number(finished)),
    // );
    // return filteredBooks.map(({ id, name, publisher }) => ({
    //   id,
    //   name,
    //   publisher,
    // }));
    const finishedPrm = Boolean(Number(finished));
    const books =
      await BookRepositoriesInstance.getBooksByFinishedStatus(finishedPrm);
    return books;
  }

  const books = await BookRepositoriesInstance.getAllBooks(
    src,
    reading,
    finished,
  );

  // return books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  return books;
};

export const getBookByIdHandler = async (bookId) => {
  // const book = books.find((book) => book.id === bookId);
  const book = await BookRepositoriesInstance.getBookById(bookId);
  if (book) {
    return book;
  }
  return null;
};

export const editBookByIdHandler = async (bookId, updatedBookData) => {
  // const bookIndex = books.findIndex((book) => book.id === bookId);
  const updateBook = await BookRepositoriesInstance.updateBookById(
    bookId,
    updatedBookData,
  );
  if (!updateBook) return null;
  return updateBook;
};

export const deleteBookByIdHandler = async (bookId) => {
  const deleteBook = await BookRepositoriesInstance.deleteBookById(bookId);
  if (!deleteBook) return null;
  // const bookIndex = books.findIndex((book) => book.id === bookId);
  // if (bookIndex === -1) return null;
  // books.splice(bookIndex, 1);
  return true;
};
