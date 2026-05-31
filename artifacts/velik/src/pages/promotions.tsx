import { useListPromotions } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Timer, Tag } from "lucide-react";

export default function Promotions() {
  const { data: promotions, isLoading } = useListPromotions();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Акции и скидки</h1>
        <p className="text-muted-foreground text-lg">Специальные предложения для наших клиентов.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map(i => <div key={i} className="glass-card rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : promotions?.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Сейчас нет активных акций</h3>
          <p className="text-muted-foreground">Подпишитесь на рассылку, чтобы узнавать о скидках первыми.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promotions?.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden group"
            >
              <div className="h-48 md:h-64 relative bg-background/50 overflow-hidden">
                {promo.imageUrl ? (
                  <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Tag className="w-16 h-16 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="text-lg px-4 py-1 shadow-lg border-none">-{promo.discountPercent}%</Badge>
                </div>
                
                {promo.expiresAt && (
                  <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-lg flex items-center text-sm font-medium text-white/90">
                    <Timer className="w-4 h-4 mr-2 text-primary" />
                    До {new Date(promo.expiresAt).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">{promo.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{promo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
