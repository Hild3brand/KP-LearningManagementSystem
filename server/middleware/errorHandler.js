export const errorHandler = (err, req, res, next) => {
  console.error("Terjadi Error di Server:", err.message);

  res.status(500).json({
    error: "Internal Server Error", // Diubah agar lebih umum untuk semua fitur
    message: err.message
  });
};