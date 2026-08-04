// Explanation: the next line is part of program logic.
export function asyncHandler(fn) {
// Explanation: the next line is part of program logic.
  return (req, res, next) => {
// Explanation: the next line is part of program logic.
    Promise.resolve(fn(req, res, next)).catch(next);
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
}
