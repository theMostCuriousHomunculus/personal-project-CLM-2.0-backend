export default async function (req, res) {
  // this route is protected (i.e. has gone through middleware) so the user account has already been attached to req
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json({ message: 'Successfully logged out on all devices!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};