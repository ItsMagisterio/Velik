import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
};

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: item, isLoading, isError } = useQuery<NewsItem>({
    queryKey: ["news", "by-slug", slug],
    queryFn: () =>
      fetch(`/api/news/by-slug/${slug}`).then(async (r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      }),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl animate-pulse space-y-6">
        <div className="h-4 bg-white/5 rounded w-24" />
        <div className="h-10 bg-white/5 rounded w-3/4" />
        <div className="aspect-[16/9] bg-white/5 rounded-2xl" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !item || !item.isPublished) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-white/40 text-xl mb-6">Новость не найдена</p>
        <Link href="/news">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Все новости
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/news">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Все новости
        </button>
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(item.createdAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight mb-6">
          {item.title}
        </h1>

        {item.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 border-l-2 border-primary/50 pl-4 italic">
            {item.excerpt}
          </p>
        )}

        {item.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9]">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed whitespace-pre-wrap">
          {item.content}
        </div>
      </motion.article>
    </div>
  );
}
