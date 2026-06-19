import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Feedback() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ message: "", name: "", phone: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast({ title: "Сообщение отправлено!", description: "Мы свяжемся с вами в ближайшее время." });
    setForm({ message: "", name: "", phone: "" });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <MessageSquare className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Обратная связь</h1>
            <p className="mt-2 text-muted-foreground">Напишите нам — ответим в ближайшее время</p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-10">
          <p className="mb-8 text-sm leading-6 text-muted-foreground">
            Внесите ваши данные, а также ваше сообщение или вопрос в форму. Сообщение будет
            отправлено администратору. Все поля обязательны для заполнения.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-sm text-white/70">
                Ваше сообщение <span className="text-primary">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Введите ваше сообщение..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm text-white/70">
                Ваше имя <span className="text-primary">*</span>
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Иван Иванов"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/30 rounded-xl h-11"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm text-white/70">
                Номер телефона <span className="text-primary">*</span>
              </label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                type="tel"
                placeholder="+375 XX XXX XX XX"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/30 rounded-xl h-11"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider px-10 h-12 rounded-xl"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Отправка...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Отправить
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
