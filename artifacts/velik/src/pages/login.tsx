import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey } from "@workspace/api-client-react";

const formSchema = z.object({
  email: z.string().min(1, "Введите логин или email"),
  password: z.string().min(1, "Введите пароль"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useLogin();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login.mutate({ data: values }, {
      onSuccess: (data) => {
        localStorage.setItem("auth_token", data.token);
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Вход выполнен успешно" });
        setLocation(data.user.role === "admin" ? "/admin" : "/");
      },
      onError: (error) => {
        toast({
          title: "Ошибка входа",
          description: error.message || "Неверный email или пароль",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none z-[-1]" />
      
      <div className="glass-card rounded-3xl p-8 sm:p-12 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-[0_0_20px_rgba(90,49,255,0.5)]">
            V
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Вход</h1>
          <p className="text-muted-foreground">Войдите, чтобы управлять заказами и сохранять товары в избранное.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Логин или Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin или your@email.com" type="text" className="bg-white/5 border-white/10 text-white h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-white/80">Пароль</FormLabel>
                    <a href="#" className="text-xs text-primary hover:text-white transition-colors">Забыли пароль?</a>
                  </div>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" className="bg-white/5 border-white/10 text-white h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(90,49,255,0.4)] mt-4"
              disabled={login.isPending}
            >
              {login.isPending ? "Вход..." : "Войти"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8 text-center text-muted-foreground text-sm border-t border-white/10 pt-6">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-primary hover:text-white font-medium transition-colors">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}
