import { Account } from '../../models/account-model.js';

export default async function (req, res) {
  try {
    const matchingUsers = await Account.find(
      { $text: { $search: req.query.name } },
      { score: { $meta: 'textScore' } }
    )
    .select('avatar name')
    .sort({ score: { $meta: 'textScore' } });

    res.status(200).json(matchingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};