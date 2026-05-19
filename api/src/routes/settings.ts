import { Router } from 'express';
import { Settings } from '../models';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// GET settings (public) - self healing: if no settings document exists, it creates one with default values
router.get('/', async (req: any, res: any) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar configurações', error: error.message });
  }
});

// PUT update settings (protected, admin only)
router.put('/', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const {
      heroSubtitle, heroBadge,
      bioText1, bioText2,
      stat1Value, stat1Label,
      stat2Value, stat2Label,
      stat3Value, stat3Label,
      card1Title, card1Sub,
      card2Title, card2Sub,
      card3Title, card3Sub,
      contactEmail, contactPhone, contactAddress,
      instagramUrl, youtubeUrl, spotifyUrl
    } = req.body;

    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroBadge !== undefined) settings.heroBadge = heroBadge;
    
    if (bioText1 !== undefined) settings.bioText1 = bioText1;
    if (bioText2 !== undefined) settings.bioText2 = bioText2;
    
    if (stat1Value !== undefined) settings.stat1Value = stat1Value;
    if (stat1Label !== undefined) settings.stat1Label = stat1Label;
    if (stat2Value !== undefined) settings.stat2Value = stat2Value;
    if (stat2Label !== undefined) settings.stat2Label = stat2Label;
    if (stat3Value !== undefined) settings.stat3Value = stat3Value;
    if (stat3Label !== undefined) settings.stat3Label = stat3Label;

    if (card1Title !== undefined) settings.card1Title = card1Title;
    if (card1Sub !== undefined) settings.card1Sub = card1Sub;
    if (card2Title !== undefined) settings.card2Title = card2Title;
    if (card2Sub !== undefined) settings.card2Sub = card2Sub;
    if (card3Title !== undefined) settings.card3Title = card3Title;
    if (card3Sub !== undefined) settings.card3Sub = card3Sub;

    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (contactAddress !== undefined) settings.contactAddress = contactAddress;

    if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
    if (youtubeUrl !== undefined) settings.youtubeUrl = youtubeUrl;
    if (spotifyUrl !== undefined) settings.spotifyUrl = spotifyUrl;

    await settings.save();
    res.json({ message: 'Configurações atualizadas com sucesso', settings });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao atualizar configurações', error: error.message });
  }
});

export default router;
