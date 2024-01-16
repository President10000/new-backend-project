//

function asyncHandler(requestHandler) {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
}

// try catch function to handle async errors

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);

//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message || "Internal Server Error",
//     });
//   }
// };

export { asyncHandler };
