/**
 * API Client for Mariana Maciel Band Website
 * Gracefully handles both local development and AWS EC2 production routing.
 */

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    // Production AWS EC2 reverse proxied through Nginx /express-api/
    return `${window.location.origin}/express-api`;
  }
  // Server-side: use env variable or local default
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

// Helper to get stored auth token
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('banda_token');
  }
  return null;
};

// Helper for authenticated headers
const getHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const activeToken = token || getAuthToken();
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
};

// --- AUTH TYPES & ENDPOINTS ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export const apiAuth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${getBaseUrl()}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao registrar usuário');
    }
    return data;
  },
};

// --- SHOW TYPES & ENDPOINTS ---

export interface Show {
  _id: string;
  date: string; // ISO String from Mongoose
  venue: string;
  city: string;
  state: string;
  country?: string;
  ticketLink?: string;
  status: 'CONFIRMADO' | 'CANCELADO' | 'ENCERRADO';
}

export const apiShows = {
  getAll: async (): Promise<Show[]> => {
    const res = await fetch(`${getBaseUrl()}/api/shows`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Erro ao buscar a agenda de shows');
    }
    return res.json();
  },

  create: async (showData: Omit<Show, '_id'>): Promise<{ message: string; show: Show }> => {
    const res = await fetch(`${getBaseUrl()}/api/shows`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(showData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar show');
    }
    return data;
  },

  update: async (id: string, showData: Partial<Show>): Promise<{ message: string; show: Show }> => {
    const res = await fetch(`${getBaseUrl()}/api/shows/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(showData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar show');
    }
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${getBaseUrl()}/api/shows/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao excluir show');
    }
    return data;
  },
};

// --- MEDIA TYPES & ENDPOINTS ---

export interface Media {
  _id: string;
  title: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail?: string;
  createdAt?: string;
}

export const apiMedia = {
  getAll: async (): Promise<Media[]> => {
    const res = await fetch(`${getBaseUrl()}/api/media`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Erro ao buscar as mídias');
    }
    return res.json();
  },

  create: async (mediaData: Omit<Media, '_id' | 'createdAt'>): Promise<{ message: string; media: Media }> => {
    const res = await fetch(`${getBaseUrl()}/api/media`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(mediaData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar mídia');
    }
    return data;
  },

  update: async (id: string, mediaData: Partial<Media>): Promise<{ message: string; media: Media }> => {
    const res = await fetch(`${getBaseUrl()}/api/media/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(mediaData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar mídia');
    }
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${getBaseUrl()}/api/media/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao excluir mídia');
    }
    return data;
  },
};

// --- UPLOAD SERVICE & HELPER ---

export const apiUpload = {
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const headers = getHeaders();
    const authHeader: HeadersInit = {};
    if (headers['Authorization']) {
      authHeader['Authorization'] = headers['Authorization'];
    }

    const res = await fetch(`${getBaseUrl()}/api/upload`, {
      method: 'POST',
      headers: authHeader,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao realizar upload');
    }
    return data;
  }
};

export const resolveMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${getBaseUrl()}${url}`;
  }
  return url;
};

// --- SETTINGS TYPES & ENDPOINTS ---

export interface Settings {
  _id?: string;
  heroSubtitle: string;
  heroBadge: string;
  
  bioText1: string;
  bioText2: string;
  
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;

  card1Title: string;
  card1Sub: string;
  card2Title: string;
  card2Sub: string;
  card3Title: string;
  card3Sub: string;

  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  instagramUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
}

export const apiSettings = {
  get: async (): Promise<Settings> => {
    const res = await fetch(`${getBaseUrl()}/api/settings`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Erro ao buscar as configurações');
    }
    return res.json();
  },

  update: async (settingsData: Partial<Settings>): Promise<{ message: string; settings: Settings }> => {
    const res = await fetch(`${getBaseUrl()}/api/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settingsData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar configurações');
    }
    return data;
  },
};

// --- ALBUM / DISCOGRAPHY TYPES & ENDPOINTS ---

export interface Track {
  _id?: string;
  title: string;
  duration: string;
  order: number;
}

export interface Album {
  _id: string;
  title: string;
  year: string;
  coverUrl: string;
  order: number;
  spotifyUrl: string;
  appleMusicUrl: string;
  deezerUrl: string;
  youtubeMusicUrl: string;
  tracks: Track[];
}

export const apiAlbums = {
  getAll: async (): Promise<Album[]> => {
    const res = await fetch(`${getBaseUrl()}/api/albums`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro ao buscar álbuns');
    return res.json();
  },

  create: async (albumData: Omit<Album, '_id'>): Promise<{ message: string; album: Album }> => {
    const res = await fetch(`${getBaseUrl()}/api/albums`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(albumData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao criar álbum');
    return data;
  },

  update: async (id: string, albumData: Partial<Album>): Promise<{ message: string; album: Album }> => {
    const res = await fetch(`${getBaseUrl()}/api/albums/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(albumData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao atualizar álbum');
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${getBaseUrl()}/api/albums/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao excluir álbum');
    return data;
  },
};


