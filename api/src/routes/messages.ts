import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Message, User } from '../models';
import { authenticateToken, isAdmin } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_banda_api';

const router = Router();

// POST /api/messages - Send a message (Public)
router.post('/', async (req: any, res: any) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: 'Mensagem enviada com sucesso!',
      data: newMessage,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao enviar mensagem', error: error.message });
  }
});

// GET /api/messages - List all messages (Protected, Admin only)
router.get('/', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar mensagens', error: error.message });
  }
});

// PATCH /api/messages/:id/read - Mark message as read/unread (Protected, Admin only)
router.patch('/:id/read', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    if (typeof read !== 'boolean') {
      return res.status(400).json({ message: 'Status "read" deve ser um booleano' });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { read },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }

    res.json({
      message: 'Status de leitura atualizado com sucesso',
      updatedMessage,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao atualizar mensagem', error: error.message });
  }
});

// DELETE /api/messages/:id - Delete a message (Protected, Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Mensagem não encontrada' });
    }

    res.json({ message: 'Mensagem excluída com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao excluir mensagem', error: error.message });
  }
});

// GET /api/messages/my-tickets - List tickets created by the logged-in user (Protected, any authenticated user)
router.get('/my-tickets', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const messages = await Message.find({ email: user.email }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar chamados', error: error.message });
  }
});

// GET /api/messages/:id - Get single ticket details with replies (Protected, requires ownership or admin)
router.get('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    const loggedInUser = await User.findById(req.user.id);
    if (!loggedInUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verify ownership: must be owner or admin
    if (loggedInUser.role?.toUpperCase() !== 'ADMIN' && message.email !== loggedInUser.email) {
      return res.status(403).json({ message: 'Acesso negado. Este chamado pertence a outra conta.' });
    }

    res.json(message);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar ticket', error: error.message });
  }
});

// POST /api/messages/:id/replies - Add a reply (Protected, requires ownership or admin)
router.post('/:id/replies', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { message: replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({ message: 'Conteúdo da resposta é obrigatório' });
    }

    const ticket = await Message.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    const loggedInUser = await User.findById(req.user.id);
    if (!loggedInUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verify ownership: must be owner or admin
    if (loggedInUser.role?.toUpperCase() !== 'ADMIN' && ticket.email !== loggedInUser.email) {
      return res.status(403).json({ message: 'Acesso negado. Este chamado pertence a outra conta.' });
    }

    const sender = loggedInUser.role?.toUpperCase() === 'ADMIN' ? 'admin' : 'user';

    // Add reply
    ticket.replies.push({
      sender,
      message: replyMessage.trim(),
      createdAt: new Date(),
    });

    // Mark as read if admin replied, otherwise mark unread (waiting for admin attention)
    ticket.read = (sender === 'admin');

    await ticket.save();

    res.status(201).json({
      message: 'Resposta adicionada com sucesso!',
      reply: ticket.replies[ticket.replies.length - 1],
      ticket,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao enviar resposta', error: error.message });
  }
});

export default router;
