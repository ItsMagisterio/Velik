import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const registerUser = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerUser.mutate({
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password
      }
    }, {
      onSuccess: (data) => {
        localStorage.setItem("auth_token", data.token);
        toast({ title: "Регистрация успешна", description: "Добро пожаловать в ВЕЛIК!" });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Ошибка регистрации",
          description: error.message || "Не удалось создать аккаунт",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 blur-[150px] rounded-full pointer-events-none z-[-1]" />
      
      <div className="glass-card rounded-3xl p-8 sm:p-12 w-full max-w-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary" />
        
        <div className="text-center mb-8">

          <h1 className="text-3xl font-display font-bold text-white mb-2">Создать аккаунт</h1>
          <p className="text-muted-foreground">Присоединяйтесь к сообществу ВЕЛIК.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван" className="bg-white/5 border-white/10 text-white h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Телефон (необязательно)</FormLabel>
                    <FormControl>
                      <Input placeholder="+375..." className="bg-white/5 border-white/10 text-white h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" type="email" className="bg-white/5 border-white/10 text-white h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Пароль</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" className="bg-white/5 border-white/10 text-white h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Подтвердите пароль</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" className="bg-white/5 border-white/10 text-white h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-secondary hover:bg-secondary/90 text-white shadow-[0_0_20px_rgba(43,127,255,0.4)] mt-4"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8 text-center text-muted-foreground text-sm border-t border-white/10 pt-6">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-secondary hover:text-white font-medium transition-colors">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
