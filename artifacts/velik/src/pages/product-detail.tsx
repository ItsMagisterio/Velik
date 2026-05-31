import { useParams } from "wouter";
import { useGetProduct, useGetRelatedProducts, useAddCartItem, useListReviews, useCreateReview, getListReviewsQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, ShoppingCart, Truck, Shield, Wrench, ChevronRight, ImageOff, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/product-card";
import { motion } from "framer-motion";
import { getGetProductQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { toast } = useToast();
  
  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) }
  });
  
  const { data: relatedProducts } = useGetRelatedProducts(id, {
    query: { enabled: !!id }
  });
  
  const { data: reviews } = useListReviews(id, {
    query: { enabled: !!id }
  });
  
  const addCartItem = useAddCartItem();
  const createReview = useCreateReview();
  const queryClient = useQueryClient();

  const [activeImage, setActiveImage] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewHover, setReviewHover] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = () => {
    if (!reviewName.trim() || !reviewText.trim()) {
      toast({ title: "Заполните все поля", variant: "destructive" });
      return;
    }
    createReview.mutate(
      { productId: id, data: { authorName: reviewName.trim(), rating: reviewRating, text: reviewText.trim() } },
      {
        onSuccess: () => {
          toast({ title: "Отзыв опубликован", description: "Спасибо за ваш отзыв!" });
          setReviewName("");
          setReviewText("");
          setReviewRating(5);
          setShowReviewForm(false);
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(id) });
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Не удалось опубликовать отзыв", variant: "destructive" });
        }
      }
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    addCartItem.mutate({
      data: {
        productId: product.id,
        quantity: 1,
        sessionId: localStorage.getItem("sessionId")
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Товар добавлен в корзину",
          description: `${product.name} успешно добавлен.`
        });
      }
    });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-center">Загрузка...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-24 text-center">Товар не найден</div>;
  }

  const allImages = [product.imageUrl, ...(product.images || [])].filter(
    (img) => img && img !== "placeholder"
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <a href="/" className="hover:text-white transition-colors">Главная</a>
        <ChevronRight className="h-4 w-4" />
        <a href="/catalog" className="hover:text-white transition-colors">Каталог</a>
        <ChevronRight className="h-4 w-4" />
        {product.categoryName && (
          <>
            <a href={`/catalog?category=${product.categoryId}`} className="hover:text-white transition-colors">{product.categoryName}</a>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-white truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2/3 h-2/3 bg-primary/20 blur-[100px] rounded-full" />
            </div>
            {allImages.length > 0 ? (
              <img 
                src={allImages[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-white/30 z-10">
                <ImageOff className="w-20 h-20" />
                <span className="text-sm">Фото отсутствует</span>
              </div>
            )}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
              {product.badge && (
                <Badge className="bg-gradient-to-r from-primary to-secondary border-none text-white px-4 py-1.5 text-sm">
                  {product.badge}
                </Badge>
              )}
            </div>
          </motion.div>
          
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-24 h-24 rounded-xl flex-shrink-0 glass overflow-hidden transition-all ${activeImage === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-primary font-medium">{product.brand}</div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-5 w-5 ${star <= product.rating ? 'fill-current' : 'text-white/20'}`} />
              ))}
            </div>
            <span className="text-muted-foreground">{product.reviewCount} отзывов</span>
            <span className="text-white/20">|</span>
            <span className={product.inStock ? "text-green-400" : "text-destructive"}>
              {product.inStock ? "В наличии" : "Нет в наличии"}
            </span>
          </div>

          <div className="mb-8">
            {product.oldPrice && (
              <div className="text-xl text-muted-foreground line-through mb-2">
                {product.oldPrice.toLocaleString('ru-RU')} BYN
              </div>
            )}
            <div className="text-4xl md:text-5xl font-bold text-white text-glow">
              {product.price.toLocaleString('ru-RU')} <span className="text-2xl font-normal text-white/70">BYN</span>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl mb-8 flex flex-col gap-4">
            <Button 
              size="lg" 
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white border-none shadow-[0_0_20px_rgba(90,49,255,0.4)]"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Добавить в корзину
            </Button>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col items-center text-center gap-2 text-muted-foreground">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xs">Доставка 1-2 дня</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 text-muted-foreground">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xs">Гарантия 1 год</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 text-muted-foreground">
                <Wrench className="h-6 w-6 text-primary" />
                <span className="text-xs">Свой сервис</span>
              </div>
            </div>
          </div>
          
          <div className="text-muted-foreground leading-relaxed">
            {product.description || "Официальная гарантия. Кредит и рассрочка. Бесплатная доставка по Минску."}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specs" className="w-full mb-24">
        <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0 gap-8 mb-8">
          <TabsTrigger value="specs" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-4 text-lg font-medium text-muted-foreground">
            Характеристики
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-4 text-lg font-medium text-muted-foreground">
            Отзывы ({product.reviewCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="specs" className="mt-0">
          <div className="glass-card rounded-2xl p-8 max-w-4xl">
            {product.specs && Object.keys(product.specs).length > 0 ? (
              <div className="divide-y divide-white/10">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="py-4 flex flex-col sm:flex-row sm:items-center">
                    <span className="sm:w-1/3 text-muted-foreground">{key}</span>
                    <span className="sm:w-2/3 text-white font-medium mt-1 sm:mt-0">{value as string}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Подробные характеристики отсутствуют.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-0">
          <div className="max-w-4xl space-y-6">
            {/* Review Form */}
            {showReviewForm ? (
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Оставить отзыв</h3>
                <Input
                  placeholder="Ваше имя"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Оценка:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHover(star)}
                        onMouseLeave={() => setReviewHover(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`h-7 w-7 transition-colors ${star <= (reviewHover || reviewRating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Ваш отзыв о товаре..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={createReview.isPending}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {createReview.isPending ? "Публикуется..." : "Опубликовать"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowReviewForm(false)} className="text-muted-foreground hover:text-white">
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowReviewForm(true)}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Написать отзыв
                </Button>
              </div>
            )}

            {/* Reviews List */}
            {reviews?.length ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-white mb-1">{review.authorName}</div>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-current' : 'text-white/20'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Star className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Пока нет отзывов</h3>
                <p className="text-muted-foreground">Будьте первым, кто поделится своим мнением об этом товаре.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-display font-bold text-white mb-8">Похожие модели</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
