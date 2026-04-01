## Kriteria 1: Aplikasi menggunakan port 9000

Aplikasi yang Anda buat harus menggunakan port 9000. Jika komputer yang Anda gunakan untuk membuat submission tidak bisa memakai port 9000, buatlah submission dengan port lain, lalu ketika submission hendak dikirimkan silakan ganti portnya ke 9000.

## Kriteria 2: Aplikasi dijalankan dengan perintah npm run start

Aplikasi yang Anda buat harus memiliki runner script start. Cara membuatnya, Anda tambahkan properti start ke dalam properti scripts pada package.json seperti berikut:

```json
{
  "name": "submission",
  ...
  "scripts": {
    "start": "node src/server.js"
  }
}
```

Pastikan aplikasi tidak dijalankan dengan menggunakan nodemon. Jika Anda ingin menggunakan nodemon dalam proses development, masukkan nodemon kedalam runner script lain, contohnya:

```json
{
  "name": "submission",
  ...
  "scripts": {
    "start": "node src/server.js",
    "start-dev": "nodemon src/server.js"
  }
}
```

## Kriteria 3: API dapat menyimpan buku

API yang Anda buat harus dapat menyimpan buku melalui route:

- **Method**: POST
- **URL**: /books

**Body Request:**

```json
{
  "name": "string",
  "year": "number",
  "author": "string",
  "summary": "string",
  "publisher": "string",
  "pageCount": "number",
  "readPage": "number",
  "reading": "boolean"
}
```

Objek buku yang disimpan pada server harus memiliki struktur seperti contoh di bawah ini:

```json
{
  "id": "Qbax5Oy7L8WKf74l",
  "name": "Buku A",
  "year": 2010,
  "author": "John Doe",
  "summary": "Lorem ipsum dolor sit amet",
  "publisher": "Dicoding Indonesia",
  "pageCount": 100,
  "readPage": 25,
  "finished": false,
  "reading": false,
  "insertedAt": "2021-03-04T09:11:44.598Z",
  "updatedAt": "2021-03-04T09:11:44.598Z"
}
```

Properti yang diolah dan didapatkan di sisi server:

- **id**: nilai id haruslah unik. Untuk membuat nilai unik, Anda bisa memanfaatkan nanoid. Untuk Anda yang menggunakan CommonJS untuk sistem modularisasi, pastikan memasang nanoid versi 3 melalui perintah: `npm install nanoid@3`.
- **finished**: merupakan properti boolean yang menjelaskan apakah buku telah selesai dibaca atau belum. Nilai finished didapatkan dari observasi `pageCount === readPage`.
- **insertedAt**: merupakan properti yang menampung tanggal dimasukkannya buku. Anda bisa gunakan `new Date().toISOString()` untuk menghasilkan nilainya.
- **updatedAt**: merupakan properti yang menampung tanggal diperbarui buku. Ketika buku baru dimasukkan, berikan nilai properti ini sama dengan insertedAt.

Server harus merespons gagal bila:

1. Client tidak melampirkan properti `name` pada request body. Maka server akan merespons dengan:
   - **Status Code**: 400
   - **Response Body**:

```json
{
  "status": "fail",
  "message": "Gagal menambahkan buku. Mohon isi nama buku"
}
```

2. Client melampirkan nilai properti `readPage` yang lebih besar dari nilai properti `pageCount`. Maka server akan merespons dengan:
   - **Status Code**: 400
   - **Response Body**:

```json
{
  "status": "fail",
  "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
}
```

Bila buku berhasil dimasukkan, server harus mengembalikan respons dengan:

- **Status Code**: 201
- **Response Body**:

```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan",
  "data": {
    "bookId": "1L7ZtDUFeGs7VlEt"
  }
}
```

## Kriteria 4: API dapat menampilkan seluruh buku

API yang Anda buat harus dapat menampilkan seluruh buku yang disimpan melalui route:

- **Method**: GET
- **URL**: /books

Server harus mengembalikan respons dengan:

- **Status Code**: 200
- **Response Body**:

```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "Qbax5Oy7L8WKf74l",
        "name": "Buku A",
        "publisher": "Dicoding Indonesia"
      },
      {
        "id": "1L7ZtDUFeGs7VlEt",
        "name": "Buku B",
        "publisher": "Dicoding Indonesia"
      },
      {
        "id": "K8DZbfI-t3LrY7lD",
        "name": "Buku C",
        "publisher": "Dicoding Indonesia"
      }
    ]
  }
}
```

Jika belum terdapat buku yang dimasukkan, server bisa merespons dengan array books kosong:

```json
{
  "status": "success",
  "data": {
    "books": []
  }
}
```

## Kriteria 5: API dapat menampilkan detail buku

API yang Anda buat harus dapat menampilkan detail buku berdasarkan id melalui route:

- **Method**: GET
- **URL**: /books/{bookId}

**Jika buku dengan id yang dilampirkan oleh client tidak ditemukan:**

- **Status Code**: 404
- **Response Body**:

```json
{
  "status": "fail",
  "message": "Buku tidak ditemukan"
}
```

**Jika buku dengan id yang dilampirkan ditemukan:**

- **Status Code**: 200
- **Response Body**:

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "aWZBUW3JN_VBE-9I",
      "name": "Buku A Revisi",
      "year": 2011,
      "author": "Jane Doe",
      "summary": "Lorem Dolor sit Amet",
      "publisher": "Dicoding",
      "pageCount": 200,
      "readPage": 26,
      "finished": false,
      "reading": false,
      "insertedAt": "2021-03-05T06:14:28.930Z",
      "updatedAt": "2021-03-05T06:14:30.718Z"
    }
  }
}
```

## Kriteria 6: API dapat mengubah data buku

API yang Anda buat harus dapat mengubah data buku berdasarkan id melalui route:

- **Method**: PUT
- **URL**: /books/{bookId}

**Body Request:**

```json
{
  "name": "string",
  "year": "number",
  "author": "string",
  "summary": "string",
  "publisher": "string",
  "pageCount": "number",
  "readPage": "number",
  "reading": "boolean"
}
```

Server harus merespons gagal bila:

1. Client tidak melampirkan properti `name` pada request body. Maka server akan merespons dengan:
   - **Status Code**: 400
   - **Response Body**:

```json
{
  "status": "fail",
  "message": "Gagal memperbarui buku. Mohon isi nama buku"
}
```

2. Client melampirkan nilai properti `readPage` yang lebih besar dari nilai properti `pageCount`. Maka server akan merespons dengan:
   - **Status Code**: 400
   - **Response Body**:

```json
{
  "status": "fail",
  "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
}
```

3. Id yang dilampirkan oleh client tidak ditemukan oleh server. Maka server akan merespons dengan:
   - **Status Code**: 404
   - **Response Body**:

```json
{
  "status": "fail",
  "message": "Gagal memperbarui buku. Id tidak ditemukan"
}
```

Bila buku berhasil diperbarui, server harus mengembalikan respons dengan:

- **Status Code**: 200
- **Response Body**:

```json
{
  "status": "success",
  "message": "Buku berhasil diperbarui"
}
```

## Kriteria 7: API dapat menghapus buku

API yang Anda buat harus dapat menghapus buku berdasarkan id melalui route berikut:

- **Method**: DELETE
- **URL**: /books/{bookId}

**Jika id yang dilampirkan tidak dimiliki oleh buku manapun:**

- **Status Code**: 404
- **Response Body**:

```json
{
  "status": "fail",
  "message": "Buku gagal dihapus. Id tidak ditemukan"
}
```

**Jika id dimiliki oleh salah satu buku:**

Buku tersebut harus dihapus dan server mengembalikan respons berikut:

- **Status Code**: 200
- **Response Body**:

```json
{
  "status": "success",
  "message": "Buku berhasil dihapus"
}
```


