import express from "express";
import {
  addBookHandler,
  deleteBookByIdHandler,
  editBookByIdHandler,
  getAllBooksHandler,
  getBookByIdHandler,
} from "../controller/book-controller.js";
import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import NotFoundError from "../../../exceptions/not-found-error.js";
import validate from "../../../middlewares/validate.js";
import { bookPayloadShema, bookQuerySchema } from "../../../validator/chema.js";
import validateQuery from "../../../middlewares/validateQuery.js";

const router = express.Router();

router.post("/books", validate(bookPayloadShema), (_, res, next) => {
  const newBook = _.body;

  if (!newBook.name) {
    return next(
      new InvariantError("Gagal menambahkan buku. Mohon isi nama buku"),
    );
  }

  if (newBook.readPage > newBook.pageCount) {
    return next(
      new InvariantError(
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      ),
    );
  }

  const addedBook = addBookHandler(newBook);
  if (addedBook) {
    return response(res, 201, "Buku berhasil ditambahkan", {
      bookId: addedBook,
    });
  }

  return response(res, 500, "Gagal menambahkan buku", null);
});

router.get("/books", validateQuery(bookQuerySchema), (_, res) => {
  const { reading = undefined, finished = undefined, name = "" } = _.query;
  const books = getAllBooksHandler(name, reading, finished);

  return response(res, 200, "Buku berhasil ditemukan", { books });
});

router.get("/books/:bookId", (_, res, next) => {
  const { bookId } = _.params;
  const book = getBookByIdHandler(bookId);
  if (!book) {
    return next(new NotFoundError("Buku tidak ditemukan"));
  }
  return response(res, 200, "Buku berhasil ditemukan", { book });
});

router.put("/books/:bookId", (_, res, next) => {
  const { bookId } = _.params;
  const updatedBookData = _.body;

  if (!updatedBookData.name) {
    return next(
      new InvariantError("Gagal memperbarui buku. Mohon isi nama buku"),
    );
  }

  if (updatedBookData.readPage > updatedBookData.pageCount) {
    return next(
      new InvariantError(
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      ),
    );
  }

  const updatedBook = editBookByIdHandler(bookId, updatedBookData);
  if (!updatedBook) {
    return next(
      new NotFoundError("Gagal memperbarui buku. Id tidak ditemukan"),
    );
  }

  return response(res, 200, "Buku berhasil diperbarui", null);
});

router.delete("/books/:bookId", (_, res, next) => {
  const { bookId } = _.params;
  const isDeleted = deleteBookByIdHandler(bookId);
  if (!isDeleted) {
    return next(new NotFoundError("Buku gagal dihapus. Id tidak ditemukan"));
  }

  return response(res, 200, "Buku berhasil dihapus", null);
});

export default router;
