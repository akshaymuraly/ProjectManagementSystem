module.exports = (err, req, res, next) => {
  console.log(err?.message);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Unhandled error!", status: false });
};
