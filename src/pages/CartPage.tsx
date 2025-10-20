import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15 : 0; // Example shipping cost
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-joy-orange/10 rounded-full">
            <ShoppingCart className="h-12 w-12 text-joy-orange" />
          </div>
          <h1 className="text-3xl font-bold text-deep-navy mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">Parece que você ainda não adicionou nenhum produto ao carrinho.</p>
          <Link to="/produtos">
            <Button className="bg-joy-orange hover:bg-aqua-mint text-white">
              Ver Produtos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-deep-navy mb-8">Seu Carrinho</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-xl shadow-petjoy-soft">
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-deep-navy">{item.name}</h3>
                    <p className="text-gray-600">Tamanho: {item.size || 'Único'}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-coral-red transition-colors"
                    aria-label="Remover item"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 h-full"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 w-12 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 h-full"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-deep-navy">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-gray-500">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.price)} cada
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end">
            <button 
              onClick={clearCart}
              className="flex items-center gap-2 text-sm text-coral-red hover:underline"
            >
              <Trash2 className="h-4 w-4" />
              Limpar carrinho
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white p-6 rounded-xl shadow-petjoy-soft">
            <h2 className="text-xl font-semibold text-deep-navy mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(subtotal)}
                </span>
              </div>
              
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium">
                  {shipping > 0 ? (
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(shipping)
                  ) : (
                    'Grátis'
                  )}
                </span>
              </div>
              
              <div className="flex justify-between pt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-joy-orange">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(total)}
                </span>
              </div>
              
              <Button className="w-full mt-6 bg-joy-orange hover:bg-aqua-mint text-white h-12 text-lg">
                Finalizar Compra
              </Button>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/produtos" 
                  className="text-sm text-forest-green hover:underline"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-6 bg-soft-cream/50 rounded-xl">
            <h3 className="font-medium text-deep-navy mb-3">Entrega segura</h3>
            <p className="text-sm text-gray-600">
              Seus dados estão protegidos com criptografia de ponta. 
              Processamos seus pagamentos com segurança.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
