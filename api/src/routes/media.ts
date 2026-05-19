import { Router } from 'express';
import { Media } from '../models';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// GET all media (sorted by createdAt descending)
router.get('/', async (req: any, res: any) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar mídias', error: error.message });
  }
});

// POST create media (protected, admin only)
router.post('/', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { title, type, url, thumbnail } = req.body;

    if (!title || !type || !url) {
      return res.status(400).json({ message: 'Campos obrigatórios: title, type, url' });
    }

    if (type !== 'IMAGE' && type !== 'VIDEO') {
      return res.status(400).json({ message: 'Tipo inválido: deve ser IMAGE ou VIDEO' });
    }

    const media = await Media.create({
      title,
      type,
      url,
      thumbnail: type === 'VIDEO' ? (thumbnail || 'https://images.unsplash.com/photo-1540039155732-6761b33fa439?q=80&w=600&auto=format&fit=crop') : undefined
    });

    res.status(201).json({ message: 'Mídia cadastrada com sucesso', media });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao criar mídia', error: error.message });
  }
});

// PUT update media (protected, admin only)
router.put('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { title, type, url, thumbnail } = req.body;

    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Mídia não encontrada' });
    }

    if (title) media.title = title;
    if (type) {
      if (type !== 'IMAGE' && type !== 'VIDEO') {
        return res.status(400).json({ message: 'Tipo inválido: deve ser IMAGE ou VIDEO' });
      }
      media.type = type;
    }
    if (url) media.url = url;
    if (thumbnail !== undefined) media.thumbnail = thumbnail;

    await media.save();

    res.json({ message: 'Mídia atualizada com sucesso', media });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao atualizar mídia', error: error.message });
  }
});

// DELETE media (protected, admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Mídia não encontrada' });
    }
    res.json({ message: 'Mídia excluída com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao excluir mídia', error: error.message });
  }
});

export default router;
