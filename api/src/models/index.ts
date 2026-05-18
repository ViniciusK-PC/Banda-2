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
