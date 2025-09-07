export default function errorHandler(err, _req, res, _next) {
  // Mongo duplicate key
  if (err && err.code === 11000) {
    const dupField = Object.keys(err.keyValue || {})[0] || 'value';
    return res.status(400).json({ field: dupField, msg: `${dupField} already exists` });
  }

  // Mongoose validation error
  if (err?.name === 'ValidationError') {
    const firstKey = Object.keys(err.errors)[0];
    const message = err.errors[firstKey]?.message || 'Invalid input';
    return res.status(400).json({ field: firstKey, msg: message });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Server error' });
}
