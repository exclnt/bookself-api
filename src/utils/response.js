// const response = (res, statusCode, message, data) => {
//   const resBody = {
//     // code: statusCode,
//     status: statusCode < 400 ? "success" : "fail",
//     message,
//   };

//   // hanya tambahkan data kalau ada isinya
//   if (data !== null && data !== undefined) {
//     resBody.data = data;
//   }

//   return res.status(statusCode).json(resBody);
// };

// export default response;

const response = (res, statusCode, message, data) => {
  const resBody = {
    status: statusCode < 400 ? "success" : "fail",
  };

  // hanya tambahkan message kalau ada isinya (tidak null/undefined)
  if (message !== null && message !== undefined) {
    resBody.message = message;
  }

  // hanya tambahkan data kalau ada isinya (tidak null/undefined)
  if (data !== null && data !== undefined) {
    resBody.data = data;
  }

  return res.status(statusCode).json(resBody);
};

export default response;
