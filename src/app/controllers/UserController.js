import User from '../models/User';

class UserController {
  async store(req, res) {
    const { email } = req.body;
    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { userId } = req;
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(401).json({ error: 'Email already taken' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}
export default new UserController();
