# 🐾 Focinhus - E-commerce para Produtos Pet

![Focinhus Logo](https://via.placeholder.com/150x50/FF9A3D/FFFFFF?text=Focinhus)

**Focinhus** é uma loja digital moderna e alegre, focada em produtos para pets. Com design premium, experiência responsiva e otimizada para conversão, acessibilidade e performance.

---

## 🎨 Design System

### Cores Principais
- **Joy Orange** (#FF9A3D) - Primária / CTAs
- **Aqua Mint** (#4FD1C5) - Secundária / CTAs alternativos
- **Deep Navy** (#1F2E45) - Textos principais
- **Soft Cream** (#FFF7E6) - Background principal
- **Peach Blush** (#FFD5A5) - Hover / highlights
- **Forest Green** (#3C8D63) - Eco / trust accents
- **Coral Red** (#FF6B6B) - Alertas
- **Green Mint** (#48BB78) - Sucesso

### Tipografia
- **Primária**: Poppins (300, 400, 600, 700) - Títulos e UI
- **Secundária**: Nunito (400, 600) - Textos longos e microcopy

---

## 🚀 Começando

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build e preview
npm run build; npm run preview
```

---

## 📁 Estrutura do Projeto

```
/petjoy-frontend
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── ui/         # Componentes base (shadcn/ui)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── home.tsx
│   ├── pages/          # Páginas da aplicação
│   │   ├── ProductDetail.tsx
│   │   ├── CategoryPage.tsx
│   │   └── NotFound.tsx
│   ├── data/           # (removed) local JSON data
│   ├── lib/            # Utilitários
│   ├── index.css       # Estilos globais
│   ├── App.tsx         # Componente raiz
│   └── main.tsx        # Entry point
├── design-tokens.json  # Design tokens
├── tailwind.config.js  # Configuração Tailwind
└── package.json
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Páginas
- [x] **Home** - Hero, categorias, produtos em destaque, valores
- [x] **Produto** - Galeria de imagens, variantes, reviews, produtos relacionados
- [x] **Categoria** - Filtros, ordenação, grid de produtos
- [x] **404** - Página de erro criativa

### ✅ Componentes
- [x] Header sticky com menu responsivo
- [x] Footer completo com newsletter
- [x] Product Cards com hover effects
- [x] Filtros e ordenação
- [x] Accordions para detalhes
- [x] Badges e tags
- [x] Botões com variantes
- [x] Inputs e forms

### ✅ Design & UX
- [x] Design system completo (design-tokens.json)
- [x] Paleta de cores vibrante
- [x] Tipografia Poppins + Nunito
- [x] Microinterações (hover, bounce, blink)
- [x] Layout 100% responsivo
- [x] Animações suaves

### ✅ Performance
- [x] Lazy loading de imagens
- [x] Otimização de assets
- [x] Code splitting
- [x] Tailwind CSS otimizado

---

## 🎨 Component Library

### Botões
```tsx
<Button className="bg-joy-orange hover:bg-aqua-mint">Primário</Button>
<Button variant="outline">Secundário</Button>
<Button variant="ghost">Ghost</Button>
```

### Cards
```tsx
<ProductCard 
  id="1"
  title="Produto"
  price={4990}
  images={[...]}
  rating={4.8}
  reviewCount={127}
/>
```

### Badges
```tsx
<Badge className="bg-peach-blush text-deep-navy">Top PetJoy</Badge>
<Badge className="bg-forest-green text-white">Eco</Badge>
```

---

## API
As páginas consomem dados de uma API externa configurada em `src/config/api.ts` via `VITE_API_URL`.

---

## 🔍 SEO & Meta Tags

### Implementar por página:
```html
<title>Produto | PetJoy</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:image" content="..." />
```

### JSON-LD para Produtos
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Bola Anti-Tédio",
  "image": [...],
  "description": "...",
  "sku": "1",
  "brand": "PetJoy",
  "offers": {
    "@type": "Offer",
    "price": "49.90",
    "priceCurrency": "BRL"
  }
}
```

---

## 📈 Analytics

### Eventos para rastrear:
- `page_view` - Visualização de página
- `view_item` - Visualização de produto
- `add_to_cart` - Adicionar ao carrinho
- `begin_checkout` - Iniciar checkout
- `purchase` - Compra concluída
- `newsletter_subscribe` - Inscrição newsletter

### Implementação:
```javascript
// Google Analytics 4
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'view_item',
  ecommerce: {
    items: [{
      item_id: 'SKU_123',
      item_name: 'Bola Anti-Tédio',
      price: 49.90
    }]
  }
});
```

---

## ♿ Acessibilidade

### Implementado:
- ✅ Navegação por teclado
- ✅ Focus ring visível (3px aqua-mint)
- ✅ Alt text em imagens
- ✅ ARIA labels e roles
- ✅ Contraste WCAG AA
- ✅ Semantic HTML5

### Testar com:
```bash
# Lighthouse
npm run lighthouse

# Axe DevTools
# Instalar extensão no Chrome/Firefox
```

---

## 🧪 Testing & QA

### Checklist Manual

#### Responsividade
- [ ] 320px (mobile pequeno)
- [ ] 375px (mobile)
- [ ] 768px (tablet)
- [ ] 1024px (desktop pequeno)
- [ ] 1440px (desktop)

#### Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Funcionalidades
- [ ] Navegação entre páginas
- [ ] Filtros de categoria
- [ ] Ordenação de produtos
- [ ] Seleção de variantes
  - [ ] Adicionar ao carrinho
  - [ ] Newsletter signup

---

## 🚢 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Variáveis de Ambiente
Nenhuma variável necessária para a versão mock.

---

## 🎯 Próximos Passos

### Backend Integration
1. Integrar com endpoints reais de backend
2. Implementar autenticação de usuário
3. Integrar gateway de pagamento (Stripe/Mercado Pago)
4. Sistema de reviews com upload de fotos
5. Carrinho persistente (localStorage/backend)

### Features Adicionais


## API

Este projeto foi originalmente inicializado com dados mock locais. Os arquivos de mock foram removidos e as páginas agora consomem uma API real quando disponível.

Configuração da API:
- A base URL é configurada em `src/config/api.ts` e pode ser sobrescrita pela variável de ambiente `VITE_API_URL`.
- Os métodos de leitura (GET) e de escrita (POST/PUT/DELETE) são expostos pelo cliente em `src/services/api.ts`.

Para desenvolvimento local sem backend, você pode executar um mock server (por exemplo `json-server`) ou apontar `VITE_API_URL` para um ambiente de testes.
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é licenciado sob a MIT License.

---

## 👥 Contato

**PetJoy Team**
- Email: contato@petjoy.com.br
- WhatsApp: (11) 9999-9999
- Instagram: @petjoy

---

## 🎉 Agradecimentos

- Design inspirado em cartoon premium
- Imagens via Unsplash
- Componentes base via shadcn/ui
- Icons via Lucide React

---

**Feito com 💖 e 🐾 pela equipe PetJoy**
