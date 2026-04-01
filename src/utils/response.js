const response = (res, statusCode, message, data) => {
  const resBody = {
    code: statusCode,
    status: statusCode < 400 ? "success" : "fail",
    message,
  };

  // hanya tambahkan data kalau ada isinya
  if (data !== null && data !== undefined) {
    resBody.data = data;
  }

  return res.status(statusCode).json(resBody);
};

export default response;
