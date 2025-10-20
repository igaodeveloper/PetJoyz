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
                className="overflow-hidden rounded-3xl bg-white/50 p-2 shadow-2xl relative"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.img 
                  src="/images/pet.png" 
                  alt="Pet feliz" 
                  className="w-full h-auto max-h-[32rem] object-cover rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: 'easeOut'
                  }}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-navy mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Explore por Categoria
            </motion.h2>
            <div className="w-24 h-1 bg-joy-orange mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre os melhores produtos para o seu pet em nossas categorias selecionadas
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {categoriesData.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className="group cursor-pointer border-2 border-transparent hover:border-joy-orange/30 bg-white shadow-petjoy-soft hover:shadow-petjoy-crisp transition-all duration-300 h-full flex flex-col"
                >
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                    <div className="text-6xl mb-6 text-joy-orange group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-primary font-bold text-xl text-deep-navy mb-3 group-hover:text-joy-orange transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <Button 
                      variant="outline" 
                      className="mt-auto border-joy-orange text-joy-orange hover:bg-joy-orange/10 transition-colors"
                    >
                      Ver Produtos <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
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