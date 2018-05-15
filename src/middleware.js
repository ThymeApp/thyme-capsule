function catchError(errCode = 500, next) {
  return async (req, res) => {
    try {
      res.json(await next(req.body));
    } catch (e) {
      res.status(errCode).json({ message: e.message });
    }
  };
}

export default catchError;
