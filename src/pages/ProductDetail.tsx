import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, Plus, Minus } from 'lucide-react';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import productsData from '../data/products.json';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productsData.find(p => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-soft-cream">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-deep-navy mb-4">Produto não encontrado</h1>
          <Link to="/">
            <Button className="bg-joy-orange hover:bg-aqua-mint text-white">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-soft-cream">

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-joy-orange">Home</Link>
            <span>/</span>
            <Link to={`/categoria/${product.category}`} className="hover:text-joy-orange capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-deep-navy">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-petjoy overflow-hidden shadow-petjoy-soft">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-petjoy-sm overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-joy-orange' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className={`${
                      badge === 'Top PetJoy'
                        ? 'bg-peach-blush text-deep-navy'
                        : badge === 'Eco'
                        ? 'bg-forest-green text-white'
                        : 'bg-aqua-mint text-white'
                    }`}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-deep-navy mb-3">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-peach-blush text-peach-blush'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviewCount} avaliações)</span>
              </div>

              <div className="text-4xl font-bold text-joy-orange mb-4">
                {formatPrice(product.price)}
              </div>

              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="font-semibold text-deep-navy">Tamanho:</label>
                <div className="flex gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`px-4 py-2 rounded-petjoy-sm border-2 transition-all ${
                        selectedVariant === index
                          ? 'border-joy-orange bg-joy-orange/10 text-joy-orange'
                          : 'border-gray-300 hover:border-joy-orange'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="font-semibold text-deep-navy">Quantidade:</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-petjoy-sm"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-petjoy-sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <Badge className="bg-green-mint text-white">
                  {product.stock} unidades em estoque
                </Badge>
              ) : (
                <Badge className="bg-coral-red text-white">Esgotado</Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-joy-orange hover:bg-aqua-mint text-white rounded-petjoy shadow-petjoy-crisp"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar Alegria ao Carrinho
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-petjoy border-2 border-joy-orange text-joy-orange hover:bg-joy-orange hover:text-white"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-petjoy"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="text-deep-navy font-semibold">
                  Detalhes do Produto
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <ul className="space-y-2">
                    <li>• Material resistente e seguro para pets</li>
                    <li>• Fácil de limpar</li>
                    <li>• Testado e aprovado por veterinários</li>
                    <li>• Garantia de 90 dias</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-deep-navy font-semibold">
                  Envio e Entrega
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Frete grátis para compras acima de R$ 150,00</p>
                  <p className="mt-2">Entrega em 3-7 dias úteis para todo o Brasil</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns">
                <AccordionTrigger className="text-deep-navy font-semibold">
                  Trocas e Devoluções
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>30 dias para trocas e devoluções</p>
                  <p className="mt-2">Produto deve estar em perfeito estado com embalagem original</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-deep-navy mb-8 text-center">
              Brincadeiras que Combinam 🎾
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
