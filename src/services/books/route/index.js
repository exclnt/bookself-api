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
import authenticateToken from "../../../middlewares/auth.js";

const router = express.Router();

router.post(
  "/books",
  authenticateToken,
  validate(bookPayloadShema),
  async (_, res, next) => {
    const newBook = _.body;
    const { id: owner } = _.user;

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

    const addedBook = await addBookHandler({ ...newBook, owner });

    if (addedBook) {
      return response(res, 201, "Buku berhasil ditambahkan", {
        bookId: addedBook,
      });
    }

    return response(res, 500, "Gagal menambahkan buku", null);
  },
);

router.get(
  "/books",
  authenticateToken,
  validateQuery(bookQuerySchema),
  async (_, res) => {
    const { reading = undefined, finished = undefined, name = "" } = _.query;
    const { id: owner } = _.user;
    console.log(`owner : ${owner}`);
    const books = await getAllBooksHandler(name, reading, finished, owner);

    return response(res, 200, "Buku berhasil ditemukan", { books });
  },
);

router.get("/books/:bookId", authenticateToken, async (_, res, next) => {
  const { bookId } = _.params;
  const { id: owner } = _.user;

  const book = await getBookByIdHandler(bookId, owner, next);

  if (!book) return;
  return response(res, 200, "Buku berhasil ditemukan", { book });
});

router.put("/books/:bookId", authenticateToken, async (_, res, next) => {
  const { bookId } = _.params;
  const updatedBookData = _.body;
  const { id: owner } = _.user;

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

  const updatedBook = await editBookByIdHandler(
    bookId,
    updatedBookData,
    owner,
    next,
  );
  if (!updatedBook) {
    return;
  }

  return response(res, 200, "Buku berhasil diperbarui", null);
});

router.delete("/books/:bookId", authenticateToken, async (_, res, next) => {
  const { bookId } = _.params;
  const { id: owner } = _.user;

  const isDeleted = await deleteBookByIdHandler(bookId, owner, next);
  if (!isDeleted) {
    return;
  }

  return response(res, 200, "Buku berhasil dihapus", null);
});

export default router;
