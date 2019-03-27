// Helper function for getting nested values from object.
// Return values if path exist or null.
const getObjectValue = (p, o) =>
  p.reduce((xs, x) => (xs && xs[x] != null) ? xs[x] : undefined, o);

export default getObjectValue;