import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, User, Bike, MapPin, Phone, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCart, useGetMe } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export function Layout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();

  const { data: cart } = useGetCart();
  const { data: user } = useGetMe();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background ambient light orbs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[150px] mix-blend-screen"></div>
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <span className="font-display font-bold text-2xl tracking-tight hidden sm:block text-glow">ВЕЛIК</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors hover:text-glow-secondary">Каталог</Link>
            <Link href="/promotions" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors hover:text-glow-secondary">Акции</Link>
            <Link href="/repair" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors hover:text-glow-secondary">Ремонт</Link>
            <Link href="/installment" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors hover:text-glow-secondary">Рассрочка</Link>
            <Link href="/contacts" className="text-sm font-medium text-foreground/80 hover:text-white transition-colors hover:text-glow-secondary">Контакты</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 z-50">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="text-foreground/80 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-white">
                <ShoppingCart className="h-5 w-5" />
                {cart && cart.itemCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-[0_0_10px_rgba(90,49,255,0.8)]">
                    {cart.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden text-foreground/80 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    autoFocus
                    placeholder="Поиск товаров..." 
                    className="w-full pl-10 bg-background/50 border-white/10 h-12 text-lg focus-visible:ring-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 h-[calc(100vh-80px)] bg-background/95 backdrop-blur-xl border-t border-white/5 overflow-y-auto md:hidden"
            >
              <nav className="flex flex-col p-6 gap-6">
                <Link href="/catalog" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">
                  Каталог <Bike className="h-6 w-6 text-primary" />
                </Link>
                <Link href="/promotions" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">
                  Акции
                </Link>
                <Link href="/repair" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">
                  Ремонт
                </Link>
                <Link href="/installment" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">
                  Рассрочка
                </Link>
                <Link href="/contacts" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">
                  Контакты
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="text-2xl font-display font-medium text-primary flex items-center justify-between border-b border-white/10 pb-4">
                    Админ-панель
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-20">
        {children}
      </main>

      <footer className="bg-card/50 border-t border-white/5 pt-16 pb-8 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <span className="font-display font-bold text-xl tracking-tight text-white">ВЕЛIК</span>
              </Link>
              <p className="text-muted-foreground mb-2">
                Премиальный магазин электротранспорта и велосипедов. Будущее городской мобильности.
              </p>
              <p className="text-white/40 italic text-sm mb-6">«Велiк — кататься с удовольствием»</p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-6">Каталог</h3>
              <ul className="space-y-4">
                <li><Link href="/catalog?category=ebikes" className="text-muted-foreground hover:text-primary transition-colors">Электровелосипеды</Link></li>
                <li><Link href="/catalog?category=scooters" className="text-muted-foreground hover:text-primary transition-colors">Электросамокаты</Link></li>
                <li><Link href="/catalog?category=bikes" className="text-muted-foreground hover:text-primary transition-colors">Велосипеды</Link></li>
                <li><Link href="/catalog?category=accessories" className="text-muted-foreground hover:text-primary transition-colors">Аксессуары</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-6">Клиентам</h3>
              <ul className="space-y-4">
                <li><Link href="/promotions" className="text-muted-foreground hover:text-primary transition-colors">Акции</Link></li>
                <li><Link href="/repair" className="text-muted-foreground hover:text-primary transition-colors">Ремонт и сервис</Link></li>
                <li><Link href="/installment" className="text-muted-foreground hover:text-primary transition-colors">Рассрочка</Link></li>
                <li><Link href="/warranty" className="text-muted-foreground hover:text-primary transition-colors">Гарантия</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-6">Контакты</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>г. Центральная площадь. д.1, здание экономического колледжа
                    1<br/>вход с торца.</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>+375 29 888 1020<br/> +375 44 455 8888</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Способы оплаты:</span>
              {["payment1.avif","payment3.avif","payment4.avif","payment5.avif","payment8.avif"].map((file) => (
                <img key={file} src={`/${file}`} alt="" className="h-16 object-contain opacity-80 hover:opacity-100 transition-opacity" />
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} ВЕЛIК. Все права защищены.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Пользовательское соглашение</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
