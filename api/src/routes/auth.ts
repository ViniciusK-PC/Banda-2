import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, AdminInvite } from '../models';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Dados incompletos' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

router.post('/register-admin-master', async (req: any, res: any) => {
  try {
    const { name, email, password, masterKey } = req.body;

    if (!name || !email || !password || !masterKey) {
      return res.status(400).json({ message: 'Dados incompletos' });
    }

    const expectedKey = process.env.ADMIN_MASTER_KEY || 'banda_super_secret_master_key_2026';
    if (masterKey !== expectedKey) {
      return res.status(403).json({ message: 'Chave Mestra inválida' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    res.status(201).json({
      message: 'Administrador criado com sucesso',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

router.post('/generate-invite', async (req: any, res: any) => {
  try {
    const { masterKey } = req.body;

    if (!masterKey) {
      return res.status(400).json({ message: 'Chave Mestra é obrigatória' });
    }

    const expectedKey = process.env.ADMIN_MASTER_KEY || 'banda_super_secret_master_key_2026';
    if (masterKey !== expectedKey) {
      return res.status(403).json({ message: 'Chave Mestra inválida' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await AdminInvite.create({
      token,
      expiresAt,
      used: false
    });

    res.status(201).json({ token });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

router.get('/verify-invite/:token', async (req: any, res: any) => {
  try {
    const { token } = req.params;
    const invite = await AdminInvite.findOne({ token });

    if (!invite) {
      return res.json({ valid: false, message: 'Link de convite inválido.' });
    }

    if (invite.used) {
      return res.json({ valid: false, message: 'Este link de convite já foi utilizado.' });
    }

    if (new Date() > invite.expiresAt) {
      return res.json({ valid: false, message: 'Este link de convite expirou.' });
    }

    res.json({ valid: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

router.post('/register-admin-with-invite', async (req: any, res: any) => {
  try {
    const { token, name, email, password } = req.body;

    if (!token || !name || !email || !password) {
      return res.status(400).json({ message: 'Dados incompletos' });
    }

    const invite = await AdminInvite.findOne({ token });

    if (!invite || invite.used || new Date() > invite.expiresAt) {
      return res.status(400).json({ message: 'Link de convite inválido ou expirado.' });
    }

    invite.used = true;
    await invite.save();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    res.status(201).json({
      message: 'Administrador criado com sucesso',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: (user as any).avatarUrl || '',
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

// PUT /api/auth/profile - Update user profile details (Protected)
router.put('/profile', authenticateToken, async (req: any, res: any) => {
  try {
    const { name, email, password, avatarUrl } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso por outro usuário' });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    if (avatarUrl !== undefined) {
      (user as any).avatarUrl = avatarUrl;
    }

    await user.save();

    res.json({
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: (user as any).avatarUrl || '',
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

export default router;
