import { useRef } from "react";
import { MapPin, Phone, Mail, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StoreMap from "@/components/map";

export default function Contacts() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-12">Контакты</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Свяжитесь с нами</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Адрес магазина и сервиса</h3>
                <p className="text-muted-foreground">Центральная площадь. д.1, здание экономического колледжа <br/>вход с торца.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Телефон</h3>
                <p className="text-muted-foreground">+375 29 888 1020 <br/> +375 44 455 8888</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Время работы</h3>
                <p className="text-muted-foreground">Понедельник - пятница : 10:00–18:00<br/>Суббота - Воскресенье: 10:00-16:00<br/>Обед с 13:00 до 14:00<br/>ВЫХОДНЫЕ: ВТОРНИК, СРЕДА</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Email</h3>
                <p className="text-muted-foreground">velo.dream.by@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Реквизиты</h3>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p>ИП Мацко Владимир Владимирович</p>
                  <p>ОКПО 738138926000</p>
                  <p>УНП 692022235</p>
                  <p>GLN 4819303020006</p>
                  <p className="pt-1">Регистрация в торговом реестре РБ<br/>№418857 от 20.06.2018</p>
                  <p>Регистрация в реестре бытовых услуг<br/>№000000076238 от 25.05.2018</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden flex flex-col">
          <div className="flex-1 min-h-[400px]">
            <StoreMap />
          </div>
          <div className="p-4 flex items-center justify-between gap-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary w-5 h-5 shrink-0" />
              <p className="text-sm text-muted-foreground">Центральная площадь, д.1 — вход с торца</p>
            </div>
            <a href="https://maps.app.goo.gl/x6K4q5ew89ZaBTis8" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/10 text-white bg-black/50 shrink-0">
                Открыть
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Написать нам</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Ваше имя" className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Email или телефон" className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Тема" className="bg-white/5 border-white/10 text-white" />
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            placeholder="Сообщение"
            rows={4}
            className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm w-full md:col-span-3 resize-none overflow-hidden outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
          <div className="md:col-span-3 flex justify-end">
            <Button className="bg-primary hover:bg-primary/90 text-white px-10">Отправить</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
