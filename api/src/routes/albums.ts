import { Router } from 'express';
import { Album } from '../models';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// GET all albums (public)
router.get('/', async (req: any, res: any) => {
  try {
    const albums = await Album.find().sort({ order: 1, year: -1 });
    res.json(albums);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar álbuns', error: error.message });
  }
});

// POST create album (admin only)
router.post('/', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { title, year, coverUrl, order, spotifyUrl, appleMusicUrl, deezerUrl, youtubeMusicUrl, tracks } = req.body;

    if (!title || !year) {
      return res.status(400).json({ message: 'Título e ano são obrigatórios' });
    }

    const album = await Album.create({
      title,
      year,
      coverUrl: coverUrl || '',
      order: order || 0,
      spotifyUrl: spotifyUrl || '',
      appleMusicUrl: appleMusicUrl || '',
      deezerUrl: deezerUrl || '',
      youtubeMusicUrl: youtubeMusicUrl || '',
      tracks: tracks || [],
    });

    res.status(201).json({ message: 'Álbum criado com sucesso', album });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao criar álbum', error: error.message });
  }
});

// PUT update album (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { title, year, coverUrl, order, spotifyUrl, appleMusicUrl, deezerUrl, youtubeMusicUrl, tracks } = req.body;

    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { title, year, coverUrl, order, spotifyUrl, appleMusicUrl, deezerUrl, youtubeMusicUrl, tracks },
      { new: true, runValidators: true }
    );

    if (!album) return res.status(404).json({ message: 'Álbum não encontrado' });

    res.json({ message: 'Álbum atualizado com sucesso', album });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao atualizar álbum', error: error.message });
  }
});

// DELETE album (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: 'Álbum não encontrado' });
    res.json({ message: 'Álbum excluído com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao excluir álbum', error: error.message });
  }
});

export default router;
