import React from 'react';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Award, Leaf, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

export default function Home() {
  const featuredProducts = productsData.slice(0, 6);

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-joy-orange via-peach-blush to-soft-cream">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-navy mb-6 animate-bounce-subtle">
                Espalhe Alegria para seu Pet! 🐾
              </h1>
              <p className="text-lg md:text-xl text-forest-green mb-8 max-w-xl">
                Produtos selecionados com carinho para transformar cada momento com seu melhor amigo em pura diversão e amor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/produtos">
                  <Button
                    size="lg"
                    className="bg-joy-orange hover:bg-aqua-mint text-white text-lg px-8 py-6 rounded-petjoy shadow-petjoy-crisp hover:-translate-y-1 transition-all duration-300"
                  >
                    Explorar Produtos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/ofertas">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white text-lg px-8 py-6 rounded-petjoy transition-all duration-300"
                  >
                    Ver Ofertas
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual - Pet Image with Animation */}
            <motion.div 
              className="hidden lg:flex items-center justify-center p-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div 
                className="overflow-hidden rounded-3xl bg-white/50 p-2 shadow-2xl"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.img 
                  src="/images/pet.png" 
                  alt="Pet feliz" 
                  className="w-full h-auto max-h-[32rem] object-cover rounded-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                  }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-2xl border-2 border-joy-orange/30 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.1, 1.2]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeOut'
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-deep-navy mb-12">
            Explore por Categoria
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categoriesData.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer border-0 shadow-petjoy-soft hover:shadow-petjoy-crisp transition-all duration-300 hover:-translate-y-2 bg-soft-cream"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="font-primary font-semibold text-lg text-deep-navy mb-2 group-hover:text-joy-orange transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">
              Produtos Mais Amados 💖
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Selecionados especialmente pelos nossos clientes e seus pets felizes
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-joy-orange text-joy-orange hover:bg-joy-orange hover:text-white rounded-petjoy"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: 'Frete Rápido',
                description: 'Entrega em todo Brasil',
              },
              {
                icon: Award,
                title: 'Seleção PetJoy',
                description: 'Produtos testados e aprovados',
              },
              {
                icon: Leaf,
                title: 'Sustentável',
                description: 'Compromisso com o planeta',
              },
              {
                icon: Shield,
                title: 'Garantia Total',
                description: 'Satisfação garantida',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-joy-orange/10 rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-joy-orange" />
                </div>
                <h3 className="font-primary font-semibold text-lg text-deep-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}