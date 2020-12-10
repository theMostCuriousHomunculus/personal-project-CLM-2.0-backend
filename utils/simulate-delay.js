export default function (req, res, next) {
  return setTimeout(next, 600000);
}