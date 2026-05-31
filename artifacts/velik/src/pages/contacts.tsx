import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contacts() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-12">Контакты</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Свяжитесь с нами</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Адрес магазина и сервиса</h3>
                  <p className="text-muted-foreground">г. Тест, ул. Тест, 1<br/>ТЦ Тест, 1 этаж</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Телефон</h3>
                  <p className="text-muted-foreground">+375 777 777 777</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Время работы</h3>
                  <p className="text-muted-foreground">Ежедневно с 10:00 до 22:00<br/>Без выходных</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Email</h3>
                  <p className="text-muted-foreground">test@test.by</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Написать нам</h2>
            <form className="space-y-4">
              <Input placeholder="Ваше имя" className="bg-white/5 border-white/10 text-white" />
              <Input placeholder="Email или телефон" className="bg-white/5 border-white/10 text-white" />
              <Textarea placeholder="Сообщение" className="bg-white/5 border-white/10 text-white min-h-[120px]" />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">Отправить</Button>
            </form>
          </div>
        </div>
        
        <div className="glass-card rounded-3xl p-2 h-[600px] lg:h-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center p-8 text-center z-10 backdrop-blur-[2px]">
             <MapPin className="w-16 h-16 text-primary mb-4" />
             <h3 className="text-2xl font-bold text-white mb-2">г. Тест, ул. Тест, 1</h3>
             <p className="text-muted-foreground mb-4">ТЦ Тест, 1 этаж</p>
             <Button variant="outline" className="border-white/10 text-white bg-black/50">Открыть в навигаторе</Button>
          </div>
          <div className="w-full h-full bg-[#1e2336] rounded-[1.25rem] opacity-50" />
        </div>
      </div>
    </div>
  );
}
