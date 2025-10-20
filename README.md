# 🐾 PetJoy - E-commerce para Produtos Pet

![PetJoy Logo](https://via.placeholder.com/150x50/FF9A3D/FFFFFF?text=PetJoy)

**PetJoy** é uma loja digital moderna e alegre, focada em produtos para pets. Com design cartoon premium, experiência responsiva e otimizada para conversão, acessibilidade e performance.

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
# Clone o repositório
git clone <repository-url>
cd petjoy-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
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
│   ├── data/           # Mock API (JSON)
│   │   ├── products.json
│   │   └── categories.json
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

## 📊 Mock API

### Produtos (`/src/data/products.json`)
12 produtos com:
- ID, título, slug, descrição
- Preço (em centavos)
- Imagens (URLs Unsplash)
- Categoria, badges, tags
- Rating, reviewCount, stock
- Variantes (tamanho, cor)

### Categorias (`/src/data/categories.json`)
- Brinquedos 🎾
- Acessórios 🎀
- Petiscos 🦴
- Coleções ⭐

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

## 📈 Analytics (Mock)

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
- [ ] Adicionar ao carrinho (mock)
- [ ] Newsletter signup (mock)

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
1. Substituir mock API por endpoints reais
2. Implementar autenticação de usuário
3. Integrar gateway de pagamento (Stripe/Mercado Pago)
4. Sistema de reviews com upload de fotos
5. Carrinho persistente (localStorage/backend)

### Features Adicionais
- [ ] Busca com autocomplete
- [ ] Wishlist/Favoritos
- [ ] Comparação de produtos
- [ ] Chat de suporte (Tobias bot)
- [ ] Quiz "Qual brinquedo para meu pet?"
- [ ] Sistema de pontos/gamification
- [ ] Abandoned cart recovery

---

## 📝 Microcopy & Voz da Marca

**Tom**: Leve, carismático, direto, acolhedor

**Exemplos**:
- CTA: "Adicionar Alegria", "Espalhe Alegria!"
- Empty cart: "Seu carrinho está vazio — talvez um brinquedo prefira você?"
- Newsletter: "Receba mimos e 10% de desconto — prometo só coisas boas."
- 404: "Ops — o mascote se perdeu. Vamos te levar pra casa."

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
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
