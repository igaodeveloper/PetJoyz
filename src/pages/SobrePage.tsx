import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, PawPrint, Shield, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Team member interface
interface Member {
  name: string;
  role: string;
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

// Team data
const teamMembers: Member[] = [
  {
    name: 'Igor C. Oliveira',
    role: 'Fundador & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=60',
    social: {
      twitter: '#',
      linkedin: 'https://www.linkedin.com/in/igor-costa-oliveira-673866169/',
    },
  },
];

// Values data
const values = [
  {
    icon: <Heart className="w-8 h-8 text-joy-orange" />,
    title: 'Amor pelos Animais',
    description: 'Cada produto é selecionado com carinho, pensando no bem-estar e felicidade do seu pet.'
  },
  {
    icon: <Shield className="w-8 h-8 text-joy-orange" />,
    title: 'Qualidade Garantida',
    description: 'Trabalhamos apenas com as melhores marcas e produtos testados e aprovados por especialistas.'
  },
  {
    icon: <PawPrint className="w-8 h-8 text-joy-orange" />,
    title: 'Compromisso Animal',
    description: 'Parte do nosso lucro é revertido para ONGs e projetos de proteção animal.'
  },
  {
    icon: <Truck className="w-8 h-8 text-joy-orange" />,
    title: 'Entrega Rápida',
    description: 'Entregamos em todo o Brasil com rapidez e segurança para você e seu pet.'
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "A Focinhus mudou a vida do meu cachorro! Os produtos são incríveis e o atendimento é excepcional.",
    author: "Mariana S.",
    rating: 5
  },
  {
    quote: "Sempre encontro tudo que preciso para meus gatos. A qualidade dos produtos é excelente!",
    author: "Roberto M.",
    rating: 5
  },
  {
    quote: "Adoro a variedade de produtos naturais. Meu cachorro adorou os petiscos saudáveis!",
    author: "Camila R.",
    rating: 4
  }
];

const renderStars = (rating: number) => {
  return Array(5).fill(0).map((_, i) => (
    <Star 
      key={i} 
      className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
    />
  ));
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-joy-orange/90 to-aqua-mint/90 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-primary">Sobre a Focinhus</h1>
            <p className="text-xl md:text-2xl mb-8">Sua loja de confiança para produtos de alta qualidade para seu pet</p>
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-white text-joy-orange hover:bg-gray-100 px-8 py-6 text-lg">
                <Link to="/produtos">
                  Nossos Produtos <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={item} className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-joy-orange/10 text-joy-orange rounded-full text-sm font-medium mb-4">Nossa História</span>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-6">Transformando vidas com amor e cuidado</h2>
              <div className="h-1 w-20 bg-joy-orange mx-auto mb-8"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeIn} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/images/pet.png" 
                    alt="Nossa equipe" 
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-6">
                <p className="text-lg text-gray-700">
                  Fundada em 2020, a Focinhus nasceu do amor incondicional pelos animais e da paixão por proporcionar uma vida mais feliz e saudável para os nossos amigos de quatro patas.
                </p>
                <p className="text-lg text-gray-700">
                  Tudo começou com uma pequena loja física e o sonho de criar um espaço onde os tutores pudessem encontrar produtos de qualidade para seus pets, com atendimento personalizado e muito carinho.
                </p>
                <p className="text-lg text-gray-700">
                  Hoje, somos uma equipe apaixonada que trabalha incansavelmente para oferecer os melhores produtos e serviços, sempre com foco no bem-estar animal e na satisfação dos nossos clientes.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-joy-orange/10 text-joy-orange rounded-full text-sm font-medium mb-4">Nossos Valores</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-6">O que nos move</h2>
            <div className="h-1 w-20 bg-joy-orange mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-joy-orange/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-deep-navy mb-3 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-joy-orange/10 text-joy-orange rounded-full text-sm font-medium mb-4">Nossa Equipe</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-6">Conheça quem faz acontecer</h2>
            <div className="h-1 w-20 bg-joy-orange mx-auto"></div>
          </motion.div>

          {teamMembers.length === 1 ? (
            <div className="flex justify-center">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-sm mx-auto"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-deep-navy mb-1">{member.name}</h3>
                    <p className="text-joy-orange font-medium mb-4">{member.role}</p>
                    <div className="flex justify-center space-x-4">
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="text-gray-400 hover:text-joy-orange transition-colors">
                          <span className="sr-only">Twitter</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-400 hover:text-joy-orange transition-colors">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {member.social.instagram && (
                        <a href={member.social.instagram} className="text-gray-400 hover:text-joy-orange transition-colors">
                          <span className="sr-only">Instagram</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center justify-items-center">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-sm"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-deep-navy mb-1">{member.name}</h3>
                    <p className="text-joy-orange font-medium mb-4">{member.role}</p>
                    <div className="flex justify-center space-x-4">
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="text-gray-400 hover:text-joy-orange transition-colors">
                          <span className="sr-only">Twitter</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-400 hover:text-joy-orange transition-colors">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {member.social.instagram && (
                        <a href={member.social.instagram} className="text-gray-400 hover:text-joy-orange transition-colors">
                          <span className="sr-only">Instagram</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-joy-orange/10 text-joy-orange rounded-full text-sm font-medium mb-4">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-6">O que nossos clientes dizem</h2>
            <div className="h-1 w-20 bg-joy-orange mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="text-yellow-400 flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-gray-700 italic mb-6">"{testimonial.quote}"</blockquote>
                <div className="font-medium text-deep-navy">{testimonial.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-joy-orange to-aqua-mint text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para tornar a vida do seu pet mais feliz?</h2>
            <p className="text-xl mb-8">Descubra nossa seleção de produtos premium para o seu melhor amigo.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-white text-joy-orange hover:bg-gray-100 px-8 py-6 text-lg">
                <Link to="/produtos">
                  Ver Produtos <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Fale Conosco
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
