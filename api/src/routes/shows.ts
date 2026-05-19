import { Router } from 'express';
import { Show } from '../models';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// GET all shows (sorted by date ascending/descending)
router.get('/', async (req: any, res: any) => {
  try {
    const shows = await Show.find().sort({ date: 1 });
    res.json(shows);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar shows', error: error.message });
  }
});

// POST create show (protected, admin only)
router.post('/', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { date, venue, city, state, country, ticketLink, status } = req.body;

    if (!date || !venue || !city || !state) {
      return res.status(400).json({ message: 'Campos obrigatórios: date, venue, city, state' });
    }

    const show = await Show.create({
      date,
      venue,
      city,
      state,
      country: country || 'Brasil',
      ticketLink,
      status: status || 'CONFIRMADO'
    });

    res.status(201).json({ message: 'Show cadastrado com sucesso', show });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao criar show', error: error.message });
  }
});

// PUT update show (protected, admin only)
router.put('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { date, venue, city, state, country, ticketLink, status } = req.body;

    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show não encontrado' });
    }

    if (date) show.date = date;
    if (venue) show.venue = venue;
    if (city) show.city = city;
    if (state) show.state = state;
    if (country) show.country = country;
    if (ticketLink !== undefined) show.ticketLink = ticketLink;
    if (status) show.status = status;

    await show.save();

    res.json({ message: 'Show atualizado com sucesso', show });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao atualizar show', error: error.message });
  }
});

// DELETE show (protected, admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show não encontrado' });
    }
    res.json({ message: 'Show excluído com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao excluir show', error: error.message });
  }
});

export default router;
