import { create } from 'zustand'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: 'jaquetas' | 'chuteiras' | 'sapatos' | 'bolsas'
  image: string
  description: string
  sizes?: string[]
  colors?: string[]
  isNew?: boolean
  isFeatured?: boolean
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, size?: string, color?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product, size, color) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      )
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        items: [...state.items, { ...product, quantity: 1, selectedSize: size, selectedColor: color }],
      }
    })
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0),
    }))
  },
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}))

export const products: Product[] = [
  // Jaquetas
  {
    id: 'jaq-001',
    name: 'Jaqueta Couro Premium',
    price: 899.90,
    originalPrice: 1199.90,
    category: 'jaquetas',
    image: '/placeholder-jaqueta-1.jpg',
    description: 'Jaqueta de couro legítimo com forro interno macio. Design atemporal e sofisticado.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Marrom'],
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'jaq-002',
    name: 'Jaqueta Bomber Clássica',
    price: 459.90,
    category: 'jaquetas',
    image: '/placeholder-jaqueta-2.jpg',
    description: 'Jaqueta bomber em tecido impermeável com bolsos laterais e punhos elásticos.',
    sizes: ['P', 'M', 'G', 'GG', 'XG'],
    colors: ['Preto', 'Verde Militar', 'Azul Marinho'],
    isFeatured: true,
  },
  {
    id: 'jaq-003',
    name: 'Jaqueta Jeans Oversized',
    price: 349.90,
    category: 'jaquetas',
    image: '/placeholder-jaqueta-3.jpg',
    description: 'Jaqueta jeans com corte oversized moderno. Perfeita para looks casuais.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Azul Claro', 'Azul Escuro'],
  },
  {
    id: 'jaq-004',
    name: 'Jaqueta Puffer Térmica',
    price: 529.90,
    originalPrice: 699.90,
    category: 'jaquetas',
    image: '/placeholder-jaqueta-4.jpg',
    description: 'Jaqueta puffer com enchimento térmico. Ideal para dias frios.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Branco', 'Vermelho'],
    isNew: true,
  },
  // Chuteiras
  {
    id: 'chu-001',
    name: 'Chuteira Campo Pro Elite',
    price: 799.90,
    originalPrice: 999.90,
    category: 'chuteiras',
    image: '/placeholder-chuteira-1.jpg',
    description: 'Chuteira profissional para campo com travas de alumínio e cabedal sintético.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Preto/Dourado', 'Branco/Azul'],
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'chu-002',
    name: 'Chuteira Society Velocidade',
    price: 399.90,
    category: 'chuteiras',
    image: '/placeholder-chuteira-2.jpg',
    description: 'Chuteira society com solado de borracha para máxima aderência.',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Preto/Verde', 'Laranja/Preto'],
  },
  {
    id: 'chu-003',
    name: 'Chuteira Futsal Indoor',
    price: 349.90,
    category: 'chuteiras',
    image: '/placeholder-chuteira-3.jpg',
    description: 'Chuteira futsal com solado plano para quadras indoor.',
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    colors: ['Branco/Vermelho', 'Preto/Amarelo'],
    isFeatured: true,
  },
  {
    id: 'chu-004',
    name: 'Chuteira Campo Junior',
    price: 279.90,
    category: 'chuteiras',
    image: '/placeholder-chuteira-4.jpg',
    description: 'Chuteira campo infantil com tecnologia de amortecimento.',
    sizes: ['33', '34', '35', '36', '37'],
    colors: ['Azul/Branco', 'Preto/Rosa'],
  },
  // Sapatos
  {
    id: 'sap-001',
    name: 'Oxford Couro Legítimo',
    price: 599.90,
    originalPrice: 799.90,
    category: 'sapatos',
    image: '/placeholder-sapato-1.jpg',
    description: 'Sapato oxford em couro legítimo com acabamento artesanal.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Preto', 'Marrom', 'Caramelo'],
    isFeatured: true,
  },
  {
    id: 'sap-002',
    name: 'Tênis Casual Urbano',
    price: 329.90,
    category: 'sapatos',
    image: '/placeholder-sapato-2.jpg',
    description: 'Tênis casual com design moderno para uso diário.',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Branco', 'Preto', 'Cinza'],
    isNew: true,
  },
  {
    id: 'sap-003',
    name: 'Mocassim Confort',
    price: 449.90,
    category: 'sapatos',
    image: '/placeholder-sapato-3.jpg',
    description: 'Mocassim em couro macio com palmilha anatômica.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Preto', 'Marrom'],
  },
  {
    id: 'sap-004',
    name: 'Boot Chelsea Premium',
    price: 699.90,
    originalPrice: 899.90,
    category: 'sapatos',
    image: '/placeholder-sapato-4.jpg',
    description: 'Bota chelsea em couro com elásticos laterais e solado tratorado.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Preto', 'Marrom Escuro'],
    isNew: true,
    isFeatured: true,
  },
  // Bolsas
  {
    id: 'bol-001',
    name: 'Bolsa Tote Executiva',
    price: 549.90,
    originalPrice: 749.90,
    category: 'bolsas',
    image: '/placeholder-bolsa-1.jpg',
    description: 'Bolsa tote em couro sintético premium com divisórias internas.',
    colors: ['Preto', 'Nude', 'Caramelo'],
    isFeatured: true,
  },
  {
    id: 'bol-002',
    name: 'Mochila Urban Style',
    price: 399.90,
    category: 'bolsas',
    image: '/placeholder-bolsa-2.jpg',
    description: 'Mochila moderna com compartimento para notebook e bolsos organizadores.',
    colors: ['Preto', 'Cinza', 'Azul Marinho'],
    isNew: true,
  },
  {
    id: 'bol-003',
    name: 'Clutch Festa Elegance',
    price: 299.90,
    category: 'bolsas',
    image: '/placeholder-bolsa-3.jpg',
    description: 'Clutch para eventos especiais com acabamento em couro texturizado.',
    colors: ['Preto', 'Dourado', 'Prata'],
  },
  {
    id: 'bol-004',
    name: 'Bolsa Crossbody Mini',
    price: 349.90,
    category: 'bolsas',
    image: '/placeholder-bolsa-4.jpg',
    description: 'Bolsa crossbody compacta com alça ajustável e fechamento em zíper.',
    colors: ['Preto', 'Vermelho', 'Verde'],
    isNew: true,
    isFeatured: true,
  },
]

export const categories = [
  {
    id: 'jaquetas',
    name: 'Jaquetas',
    description: 'Estilo e proteção em uma peça',
    count: products.filter(p => p.category === 'jaquetas').length,
  },
  {
    id: 'chuteiras',
    name: 'Chuteiras',
    description: 'Performance no campo',
    count: products.filter(p => p.category === 'chuteiras').length,
  },
  {
    id: 'sapatos',
    name: 'Sapatos',
    description: 'Elegância para cada ocasião',
    count: products.filter(p => p.category === 'sapatos').length,
  },
  {
    id: 'bolsas',
    name: 'Bolsas',
    description: 'Acessórios que completam o look',
    count: products.filter(p => p.category === 'bolsas').length,
  },
]
