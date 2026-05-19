import mongoose, { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
});

export const User = model('User', UserSchema);

const ShowSchema = new Schema({
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: 'Brasil' },
  ticketLink: { type: String },
  status: { type: String, enum: ['CONFIRMADO', 'CANCELADO', 'ENCERRADO'], default: 'CONFIRMADO' },
});

export const Show = model('Show', ShowSchema);

const MediaSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['IMAGE', 'VIDEO'], required: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Media = model('Media', MediaSchema);

const SettingsSchema = new Schema({
  heroSubtitle: { type: String, default: 'Uma voz que emociona. Composições que contam histórias. Música que toca a alma e transforma momentos em memórias inesquecíveis.' },
  heroBadge: { type: String, default: 'Novo Single Disponível' },
  
  bioText1: { type: String, default: 'Mariana Maciel é um dos nomes mais promissores da música contemporânea. Com uma voz marcante e composições profundas, ela tem conquistado público e crítica por onde passa.' },
  bioText2: { type: String, default: 'Nascida em um ambiente musical, começou a compor ainda na adolescência. Sua música é uma fusão sofisticada de ritmos brasileiros com arranjos modernos, criando uma sonoridade única e envolvente.' },
  
  stat1Value: { type: String, default: '10+' },
  stat1Label: { type: String, default: 'Anos de Carreira' },
  stat2Value: { type: String, default: '500+' },
  stat2Label: { type: String, default: 'Shows Realizados' },
  stat3Value: { type: String, default: '50k' },
  stat3Label: { type: String, default: 'Seguidores' },

  card1Title: { type: String, default: 'Prêmio Revelação' },
  card1Sub: { type: String, default: '2018' },
  card2Title: { type: String, default: '3 Álbuns' },
  card2Sub: { type: String, default: 'Lançados' },
  card3Title: { type: String, default: 'Turnê Nacional' },
  card3Sub: { type: String, default: '2024' },

  contactEmail: { type: String, default: 'contato@marianamaciel.com' },
  contactPhone: { type: String, default: '+55 (21) 99999-9999' },
  contactAddress: { type: String, default: 'Rio de Janeiro, RJ' },
  instagramUrl: { type: String, default: 'https://instagram.com' },
  youtubeUrl: { type: String, default: 'https://youtube.com' },
  spotifyUrl: { type: String, default: 'https://spotify.com' },
});

export const Settings = model('Settings', SettingsSchema);

const TrackSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const AlbumSchema = new Schema({
  title: { type: String, required: true },
  year: { type: String, required: true },
  coverUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  spotifyUrl: { type: String, default: '' },
  appleMusicUrl: { type: String, default: '' },
  deezerUrl: { type: String, default: '' },
  youtubeMusicUrl: { type: String, default: '' },
  tracks: [TrackSchema],
});

export const Album = model('Album', AlbumSchema);

const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Message = model('Message', MessageSchema);

