import { Button } from "@/components/ui/button";
import { ArrowRight, Badge } from "lucide-react";
import { Link } from "wouter";
import { useGetFeaturedProducts, useGetPopularProducts, useListCategories } from "@/api";
import { ProductCard } from "@/components/product-card";
import { motion } from "framer-motion";
import { HeroSlider } from "@/components/hero-slider";

export default function Home() {
  const { data: categories } = useListCategories();
  const { data: featuredProducts } = useGetFeaturedProducts();
  const { data: popularProducts } = useGetPopularProducts();

  return (
    <div className="w-full flex flex-col">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Выбор за вами</h2>
              <p className="text-muted-foreground">От компактных электросамокатов для города до мощных фэтбайков для бездорожья.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories?.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={`/catalog?category=${cat.id}`} className="group block relative overflow-hidden rounded-xl aspect-[16/9]">
                  {/* Image */}
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/20" />
                  )}
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />
                  {/* Bottom label bar */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-center">
                    <span className="text-white font-display font-bold text-base uppercase tracking-widest">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Популярные модели</h2>
              <p className="text-muted-foreground">Самые востребованные устройства этого сезона.</p>
            </div>
            <Link href="/catalog">
              <Button variant="ghost" className="text-white hover:text-primary hidden md:flex items-center">
                Все модели <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts?.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Review promo banner */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-yellow-400 text-sm font-medium">Акция для клиентов</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  Нам важно ваше мнение!
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Оставьте отзыв о нас на <span className="text-white font-medium">Google</span> или <span className="text-white font-medium">Яндекс</span> и получите скидку <span className="text-primary font-bold text-xl">10 рублей</span> на любой товар или услугу.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <a href="https://www.google.com/search?cs=0&output=search&q=%D0%92%D0%B5%D0%BB%D0%BE%D0%94%D1%80%D0%B8%D0%BC&ludocid=11211468588778534593&gsas=1&lsig=AB86z5VkUtYjyx9HHWH31KE6weZ8&sa=X&ved=2ahUKEwiMsfDjk-37AhWCOOwKHd7dAWgQj9IGKAB6BAgYEAE&biw=1920&bih=880&dpr=1" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 gap-2 w-full sm:w-auto px-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Отзыв на Google
                  </Button>
                </a>
                <a href="https://yandex.by/search/?text=%D0%92%D0%B5%D0%BB%D0%BE%D0%94%D1%80%D0%B8%D0%BC%2C+%D0%91%D0%B5%D0%BB%D0%B0%D1%80%D1%83%D1%81%D1%8C%2C+%D0%9C%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D1%87%D0%BD%D0%BE&lr=157" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/10 gap-2 w-full sm:w-auto px-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.75 17.5h-1.5v-7.25l-3 1.25V10l4.5-2v9.5z" fill="#FC3F1D"/>
                    </svg>
                    Отзыв на Яндекс
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repair CTA */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-12 lg:p-20 relative z-10">
                <Badge className="bg-white/10 text-white mb-6 border-white/20">Мастерская ВЕЛIК</Badge>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  Профессиональный сервис и тюнинг
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Ремонтируем то, за что другие не берутся. Диагностика, ремонт аккумуляторов, гидроизоляция и кастомный тюнинг любой сложности.
                </p>
                <Link href="/repair">
                  <Button size="lg" className="bg-white text-background hover:bg-white/90 border-none px-8 h-14 rounded-xl text-lg font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Записаться на сервис
                  </Button>
                </Link>
              </div>
              <div className="h-64 lg:h-full relative overflow-hidden bg-black/20">
                {/* Tech pattern background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                   <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
