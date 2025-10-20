import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-soft-cream flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="text-9xl mb-6 animate-bounce-subtle">🐕</div>
          <h1 className="text-5xl md:text-6xl font-bold text-deep-navy mb-4">
            Ops! Página Perdida
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            O mascote se perdeu... Parece que essa página não existe. Vamos te levar de volta para casa!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-joy-orange hover:bg-aqua-mint text-white rounded-petjoy shadow-petjoy-crisp"
              >
                Voltar para Home
              </Button>
            </Link>
            <Link to="/categoria/brinquedos">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-joy-orange text-joy-orange hover:bg-joy-orange hover:text-white rounded-petjoy"
              >
                Ver Produtos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
