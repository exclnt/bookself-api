import express from "express";
import {
  addBookHandler,
  deleteBookByIdHandler,
  editBookByIdHandler,
  getAllBooksHandler,
  getBookByIdHandler,
} from "./controller.js";

const router = express.Router();

router.post("/books", (_, res) => {
  const newBook = _.body;

  if (!newBook.name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
  }

  if (newBook.readPage > newBook.pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const addedBook = addBookHandler(newBook);
  if (addedBook) {
    return res.status(201).json({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: { bookId: addedBook },
    });
  }

  return res.status(500).json({
    status: "fail",
    message: "Gagal menambahkan buku",
  });
});

router.get("/books", (_, res) => {
  const { reading = undefined, finished = undefined, name = "" } = _.query;
  const books = getAllBooksHandler(name, reading, finished);

  return res.json({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: { books },
  });
});

router.get("/books/:bookId", (_, res) => {
  const { bookId } = _.params;
  const book = getBookByIdHandler(bookId);
  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
  }
  return res.json({ status: "success", data: { book } });
});

router.put("/books/:bookId", (_, res) => {
  const { bookId } = _.params;
  const updatedBookData = _.body;

  if (!updatedBookData.name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  }

  if (updatedBookData.readPage > updatedBookData.pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const updatedBook = editBookByIdHandler(bookId, updatedBookData);
  if (!updatedBook) {
    return res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
});

router.delete("/books/:bookId", (_, res) => {
  const { bookId } = _.params;
  const isDeleted = deleteBookByIdHandler(bookId);
  if (!isDeleted) {
    return res.status(404).json({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Buku berhasil dihapus",
  });
});

export default router;
