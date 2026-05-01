// import books from "../books.js";
import { nanoid } from "nanoid";
import BookRepositoriesInstance from "../repositories/book-repositories.js";
import AuthorizationError from "../../../exceptions/authorization-error.js";
import NotFoundError from "../../../exceptions/not-found-error.js";

// const BookRepositoriesInstance = new BookRepositories();

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
    owner,
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
    owner,
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
  owner,
) => {
  let readingPrm = undefined;
  let lowName = undefined;
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

    lowName = src.toLowerCase();
    // return books;
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
    readingPrm = Boolean(Number(reading));
    // const books =
    //   await BookRepositoriesInstance.getBooksByReadingStatus(readingPrm);
    // return books;
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

  const books = await BookRepositoriesInstance.getBooks({
    lowName,
    readingPrm,
    owner,
  });

  // return books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  return books;
};

export const getBookByIdHandler = async (bookId, owner, next) => {
  const book = await BookRepositoriesInstance.getBookById(bookId);
  console.log(book);
  if (!book) {
    return next(new NotFoundError("Buku tidak ditemukan"));
  }

  // 2. baru cek ownership
  const isOwner = await BookRepositoriesInstance.verifyBookAccess(
    bookId,
    owner,
  );

  if (!isOwner) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }

  // 3. kalau lolos semua
  return book;
};

export const editBookByIdHandler = async (
  bookId,
  updatedBookData,
  owner,
  next,
) => {
  // const bookIndex = books.findIndex((book) => book.id === bookId);

  const isOwner = await BookRepositoriesInstance.verifyBookAccess(
    bookId,
    owner,
  );

  const updateBook = await BookRepositoriesInstance.updateBookById(
    bookId,
    updatedBookData,
  );
  if (!updateBook)
    return next(
      new NotFoundError("Gagal memperbarui buku. Id tidak ditemukan"),
    );
  if (!isOwner) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }
  return updateBook;
};

export const deleteBookByIdHandler = async (bookId, owner, next) => {
  const isOwner = await BookRepositoriesInstance.verifyBookOwner(bookId, owner);

  const deleteBook = await BookRepositoriesInstance.deleteBookById(bookId);

  if (!deleteBook)
    return next(new NotFoundError("Buku gagal dihapus. Id tidak ditemukan"));
  if (!isOwner) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }
  // const bookIndex = books.findIndex((book) => book.id === bookId);
  // if (bookIndex === -1) rbeturn null;
  // books.splice(bookIndex, 1);
  return true;
};
