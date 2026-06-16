import { motion } from "framer-motion";
import { Link } from "wouter";
import { Product } from "@/api";
import { Star, ShoppingCart, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddCartItem, useGetCart } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toast } = useToast();
  const { data: cart } = useGetCart();
  const addCartItem = useAddCartItem();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addCartItem.mutate({
      data: {
        productId: product.id,
        quantity: 1,
        sessionId: localStorage.getItem("sessionId")
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Товар добавлен в корзину",
          description: `${product.name} успешно добавлен.`
        });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/catalog/${product.id}`} className="block group h-full">
        <div className="glass-card rounded-2xl p-4 h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(90,49,255,0.2)] hover:-translate-y-1">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
            {product.badge && (
              <Badge className="bg-gradient-to-r from-primary to-secondary border-none text-white shadow-lg backdrop-blur-sm px-3 py-1 font-medium tracking-wide">
                {product.badge}
              </Badge>
            )}
            {product.discountPercent && (
              <Badge variant="destructive" className="border-none shadow-lg px-3 py-1 font-medium">
                -{product.discountPercent}%
              </Badge>
            )}
          </div>

          {/* Image */}
          <div className="relative aspect-square mb-6 flex items-center justify-center p-4 bg-white/5 rounded-xl overflow-hidden">
            {product.imageUrl && product.imageUrl !== "placeholder" ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-white/20">
                <ImageOff className="w-12 h-12" />
                <span className="text-xs">Фото отсутствует</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1">
            <div className="text-xs text-muted-foreground mb-2 flex justify-between items-center">
              <span>{product.brand}</span>
              <div className="flex items-center text-yellow-500">
                <Star className="h-3 w-3 fill-current mr-1" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <h3 className="font-medium text-lg text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="mt-auto pt-4 flex items-end justify-between">
              <div>
                {product.oldPrice && (
                  <div className="text-sm text-muted-foreground line-through mb-1">
                    {product.oldPrice.toLocaleString('ru-RU')} BYN
                  </div>
                )}
                <div className="text-xl font-bold text-white text-glow">
                  {product.price.toLocaleString('ru-RU')} <span className="text-sm font-normal text-white/70">BYN</span>
                </div>
              </div>
              
              <Button 
                size="icon" 
                className="rounded-full bg-white/10 hover:bg-primary text-white border border-white/10 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(90,49,255,0.6)] hover:scale-110"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
