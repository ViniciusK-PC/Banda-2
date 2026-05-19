import { Router } from 'express';
import { Message } from '../models';
import { authenticateToken, isAdmin } from '../middleware/auth';

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

export default router;
