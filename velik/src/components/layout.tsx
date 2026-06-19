import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, User, Bike, MapPin, Phone, Search, X, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCart, useGetMe } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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

      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Row 1 — utility bar */}
        <div className="bg-background/95 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-12 gap-4">
            <div className="hidden md:flex items-center gap-5">
              <Link href="/catalog" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" /> Умный подбор
              </Link>
              <Link href="/delivery" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors">Оплата и доставка</Link>
              <Link href="/catalog" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors">Расширенный поиск</Link>
              <Link href="/news" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors">Новости</Link>
              <Link href="/contacts" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors">Обратная связь</Link>
              <Link href="/returns" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors">Обмен и возврат товара</Link>
              <Link href="/contacts" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors">О магазине</Link>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden md:flex items-center gap-3 border-r border-white/10 pr-4">
                <a href="https://www.instagram.com/velo_dream_by/" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://vk.com/velo_dream_by" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.169.508.271.508.22 0 .407-.136.813-.542 1.253-1.405 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
                </a>
                <a href="https://www.facebook.com/remontveloMolodechno/" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.youtube.com/@VeloDream-p8z" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
              <Link href="/profile" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
                <User className="h-4 w-4" />
                {user ? user.name : "Войти"}
              </Link>
              <Link href="/cart" className="text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 relative">
                <ShoppingCart className="h-4 w-4" />
                Корзина
                {cart && cart.itemCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-[0_0_8px_rgba(90,49,255,0.8)]">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 — logo + phones + search */}
        <div className={`transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-xl py-2" : "bg-background/70 backdrop-blur-md py-3"} border-b border-white/5`}>
          <div className="container mx-auto px-4 md:px-6 flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img src="/logo.png" alt="ВЕЛІК" className="h-24 w-auto -my-4 object-contain" />
            </Link>

            {/* Phones */}
            <div className="hidden lg:flex flex-col gap-1 ml-4 mr-auto">
              <a href="tel:+375444558888" className="flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                +375 44 455 8888
              </a>
              <span className="text-[11px] text-foreground/40 pl-6">Без выходных, с 10:00 до 22:00</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                className="w-full pl-10 bg-white/5 border-white/10 h-10 focus-visible:ring-primary focus-visible:border-primary/50"
              />
              <button className="absolute right-0 top-0 h-10 px-4 bg-primary hover:bg-primary/80 transition-colors rounded-r-md flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 md:hidden ml-auto">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="text-foreground/80 hover:text-white">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Row 3 — category nav */}
        <div className="hidden md:block bg-card/80 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 md:px-6">
            <nav className="flex items-center gap-0">
              {[
                { href: "/catalog", label: "Каталог" },
                { href: "/catalog?type=bike", label: "Велосипеды" },
                { href: "/catalog?type=scooter", label: "Самокаты" },
                { href: "/catalog?type=ebike", label: "Электротранспорт" },
                { href: "/catalog?type=accessories", label: "Аксессуары" },
                { href: "/repair", label: "Ремонт" },
                { href: "/promotions", label: "Акции" },
                { href: "/installment", label: "Рассрочка" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] font-medium text-foreground/70 hover:text-white hover:bg-white/5 px-4 py-3 transition-colors border-r border-white/5 last:border-r-0 whitespace-nowrap"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-card/95 backdrop-blur-xl border-b border-white/5 overflow-hidden md:hidden"
            >
              <div className="container mx-auto px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="Поиск товаров..."
                    className="w-full pl-10 bg-background/50 border-white/10 h-11 focus-visible:ring-primary"
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
              className="h-[calc(100vh-120px)] bg-background/95 backdrop-blur-xl border-t border-white/5 overflow-y-auto md:hidden"
            >
              <nav className="flex flex-col p-6 gap-6">
                <Link href="/catalog" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">
                  Каталог <Bike className="h-6 w-6 text-primary" />
                </Link>
                <Link href="/promotions" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">Акции</Link>
                <Link href="/repair" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">Ремонт</Link>
                <Link href="/installment" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">Рассрочка</Link>
                <Link href="/contacts" className="text-2xl font-display font-medium text-white flex items-center justify-between border-b border-white/10 pb-4">Контакты</Link>
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

      <main className="flex-1 pt-36">
        {children}
      </main>

      <footer className="bg-card/50 border-t border-white/5 pt-16 pb-8 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="ВЕЛІК" className="h-36 w-auto" />
              </Link>
              <p className="text-muted-foreground mb-2">
                Сеть веломагазинов, основанная как велосервис. Мы разбираемся в том, что продаём.
              </p>
              <p className="text-white/40 italic text-sm mb-6">«Велосипедные решения с историей — 15 лет»</p>
              <div className="flex gap-3">
                {/* Instagram */}
                <a href="https://www.instagram.com/velo_dream_by/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                {/* VK */}
                <a href="https://vk.com/velo_dream_by" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.169.508.271.508.22 0 .407-.136.813-.542 1.253-1.405 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/remontveloMolodechno/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                {/* YouTube */}
                <a href="https://www.youtube.com/@VeloDream-p8z" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
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
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} ВЕЛIК. Все права защищены.
              </p>
              <div className="text-xs text-white/30 leading-relaxed md:text-right">
                <p>ИП Мацко Владимир Владимирович</p>
                <p>ОКПО 738138926000 · УНП 692022235 · GLN 4819303020006</p>
                <p>Регистрация в торговом реестре РБ №418857 от 20.06.2018</p>
                <p>Регистрация в реестре бытовых услуг №000000076238 от 25.05.2018</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
