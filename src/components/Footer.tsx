import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-navy text-soft-cream">
      {/* Newsletter Section */}
      <div className="border-b border-soft-cream/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Receba mimos e 10% de desconto
            </h3>
            <p className="text-soft-cream/80 mb-6">
              Prometo só coisas boas: novidades, ofertas e dicas para seu pet! 🐾
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="bg-soft-cream/10 border-soft-cream/20 text-soft-cream placeholder:text-soft-cream/50 focus:border-joy-orange"
              />
              <Button className="bg-joy-orange hover:bg-aqua-mint text-white rounded-petjoy whitespace-nowrap">
                Quero Descontos!
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-joy-orange rounded-full flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <span className="font-primary font-bold text-xl">PetJoy</span>
            </div>
            <p className="text-soft-cream/70 text-sm mb-4">
              Espalhando alegria para pets e tutores desde 2024. Produtos selecionados com carinho para o bem-estar do seu melhor amigo.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-soft-cream hover:text-joy-orange">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-soft-cream hover:text-joy-orange">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-soft-cream hover:text-joy-orange">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-primary font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categoria/brinquedos" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Brinquedos</Link></li>
              <li><Link to="/categoria/acessorios" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Acessórios</Link></li>
              <li><Link to="/categoria/petiscos" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Petiscos</Link></li>
              <li><Link to="/sobre" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Quem Somos</Link></li>
              <li><Link to="/contato" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-primary font-semibold text-lg mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-soft-cream/70 hover:text-joy-orange transition-colors">FAQ</Link></li>
              <li><Link to="/envios" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Envios e Entregas</Link></li>
              <li><Link to="/trocas" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Trocas e Devoluções</Link></li>
              <li><Link to="/privacidade" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="text-soft-cream/70 hover:text-joy-orange transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-primary font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-soft-cream/70">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>contato@petjoy.com.br</span>
              </li>
              <li className="flex items-start gap-2 text-soft-cream/70">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-start gap-2 text-soft-cream/70">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>São Paulo, SP<br />Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-soft-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-soft-cream/60">
          <p>© {currentYear} PetJoy. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>🔒 Compra Segura</span>
            <span>💳 Pix, Cartão, Boleto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
