import mysql from "mysql2/promise";

const url = process.env.MYSQL_URL || "mysql://root@127.0.0.1:3306/velik";
const conn = await mysql.createConnection(url);

const categories = [
  { name: "Велосипеды", slug: "velosipedy", icon: "🚲", description: "Городские, горные, шоссейные и детские велосипеды", imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400" },
  { name: "Электросамокаты", slug: "elektrosamokaty", icon: "🛴", description: "Современные электросамокаты для города", imageUrl: "https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=400" },
  { name: "Электровелосипеды", slug: "elektravelasipedy", icon: "⚡", description: "Велосипеды с электроприводом", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { name: "Самокаты", slug: "samokaty", icon: "🛵", description: "Классические самокаты для детей и взрослых", imageUrl: "https://images.unsplash.com/photo-1601972598119-9fa91c4faf90?w=400" },
  { name: "Запчасти", slug: "zapchasti", icon: "🔧", description: "Запасные части и комплектующие", imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400" },
  { name: "Аксессуары", slug: "aksessuary", icon: "🎒", description: "Шлемы, замки, фонари и многое другое", imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400" },
  { name: "Одежда", slug: "odezhda", icon: "👕", description: "Велосипедная экипировка и одежда", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400" },
  { name: "Сервис", slug: "servis", icon: "🔩", description: "Ремонт и обслуживание велосипедов", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
];

await conn.query("DELETE FROM products");
await conn.query("DELETE FROM categories");
await conn.query("ALTER TABLE categories AUTO_INCREMENT = 1");
await conn.query("ALTER TABLE products AUTO_INCREMENT = 1");

for (const cat of categories) {
  await conn.query(
    "INSERT INTO categories (name, slug, icon, description, image_url, product_count) VALUES (?, ?, ?, ?, ?, 0)",
    [cat.name, cat.slug, cat.icon, cat.description, cat.imageUrl]
  );
}

const products = [
  {
    name: "Trek Marlin 5 2024", slug: "trek-marlin-5-2024", price: 1299.99, oldPrice: 1499.99,
    categoryId: 1, brand: "Trek", inStock: true, stockCount: 5,
    imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600",
    images: "[]", rating: 4.8, reviewCount: 24, badge: "Хит", isFeatured: true, isNew: false, discountPercent: 13,
    description: "Надёжный горный велосипед для начинающих и опытных райдеров. Алюминиевая рама, 21 скорость.",
    specs: JSON.stringify({ "Рама": "Alpha Silver Aluminium", "Вилка": "SR Suntour XCT", "Скорости": "21", "Тормоза": "Механические дисковые", "Колёса": '27.5"' }),
  },
  {
    name: "Xiaomi Electric Scooter 4 Pro", slug: "xiaomi-electric-scooter-4-pro", price: 849.99, oldPrice: null,
    categoryId: 2, brand: "Xiaomi", inStock: true, stockCount: 12,
    imageUrl: "https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=600",
    images: "[]", rating: 4.9, reviewCount: 67, badge: "Новинка", isFeatured: true, isNew: true, discountPercent: null,
    description: "Мощный электросамокат с запасом хода до 55 км. Максимальная скорость 25 км/ч.",
    specs: JSON.stringify({ "Мощность мотора": "700 Вт", "Запас хода": "55 км", "Макс. скорость": "25 км/ч", "Вес": "18.6 кг", "Макс. нагрузка": "120 кг" }),
  },
  {
    name: "Cube Access WS EAZ 2024", slug: "cube-access-ws-eaz-2024", price: 2199.99, oldPrice: 2499.99,
    categoryId: 3, brand: "Cube", inStock: true, stockCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    images: "[]", rating: 4.7, reviewCount: 11, badge: "Скидка", isFeatured: true, isNew: false, discountPercent: 12,
    description: "Женский электровелосипед с мотором Bosch. Идеален для городских поездок.",
    specs: JSON.stringify({ "Мотор": "Bosch Active Plus", "Батарея": "500 Вт·ч", "Запас хода": "до 120 км", "Рама": "Алюминий", "Тормоза": "Гидравлические дисковые" }),
  },
  {
    name: "Самокат Micro Flex Air", slug: "samokat-micro-flex-air", price: 189.99, oldPrice: null,
    categoryId: 4, brand: "Micro", inStock: true, stockCount: 20,
    imageUrl: "https://images.unsplash.com/photo-1601972598119-9fa91c4faf90?w=600",
    images: "[]", rating: 4.6, reviewCount: 33, badge: null, isFeatured: false, isNew: true, discountPercent: null,
    description: "Лёгкий и прочный самокат для детей и подростков. Надувные колёса для максимального комфорта.",
    specs: JSON.stringify({ "Возраст": "8+", "Макс. нагрузка": "100 кг", "Колёса": "200 мм надувные", "Вес": "3.9 кг" }),
  },
  {
    name: "Shimano Deore XT M8100 Кассета", slug: "shimano-deore-xt-m8100-kasseta", price: 89.99, oldPrice: 109.99,
    categoryId: 5, brand: "Shimano", inStock: true, stockCount: 30,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600",
    images: "[]", rating: 4.9, reviewCount: 87, badge: null, isFeatured: false, isNew: false, discountPercent: 18,
    description: "Профессиональная кассета 12 скоростей для горных велосипедов. 10-51T.",
    specs: JSON.stringify({ "Скорости": "12", "Диапазон": "10-51T", "Вес": "408 г", "Материал": "Стальные звёзды/алюминиевые пауки" }),
  },
  {
    name: "Шлем Giro Montaro MIPS 2024", slug: "shlem-giro-montaro-mips-2024", price: 149.99, oldPrice: null,
    categoryId: 6, brand: "Giro", inStock: true, stockCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600",
    images: "[]", rating: 4.8, reviewCount: 41, badge: "Топ", isFeatured: true, isNew: false, discountPercent: null,
    description: "Горный шлем с защитой MIPS. Отличная вентиляция и регулировка.",
    specs: JSON.stringify({ "Стандарт": "CPSC / EN 1078", "Технология": "MIPS", "Вес": "310 г", "Вентиляция": "18 каналов" }),
  },
  {
    name: "Джерси Fox Ranger 2024", slug: "dzhersi-fox-ranger-2024", price: 69.99, oldPrice: 89.99,
    categoryId: 7, brand: "Fox Racing", inStock: true, stockCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600",
    images: "[]", rating: 4.5, reviewCount: 19, badge: null, isFeatured: false, isNew: false, discountPercent: 22,
    description: "Технологичная велоджерси с влагоотводящей тканью для MTB-катания.",
    specs: JSON.stringify({ "Материал": "100% полиэстер", "Посадка": "Relaxed fit", "Размеры": "S-XXL" }),
  },
  {
    name: "Trek FX 3 Disc 2024", slug: "trek-fx-3-disc-2024", price: 999.99, oldPrice: null,
    categoryId: 1, brand: "Trek", inStock: true, stockCount: 7,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600",
    images: "[]", rating: 4.7, reviewCount: 15, badge: "Новинка", isFeatured: true, isNew: true, discountPercent: null,
    description: "Гибридный велосипед для города и дальних поездок. Дисковые тормоза, 24 скорости.",
    specs: JSON.stringify({ "Рама": "Alpha Gold Aluminium", "Вилка": "Bontrager Approved", "Скорости": "24", "Тормоза": "Hydraulic disc", "Колёса": "700c" }),
  },
];

for (const p of products) {
  await conn.query(
    `INSERT INTO products 
     (name, slug, price, old_price, category_id, brand, in_stock, stock_count, image_url, images, rating, review_count, badge, is_featured, is_new, discount_percent, description, specs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.name, p.slug, p.price, p.oldPrice || null, p.categoryId, p.brand, p.inStock ? 1 : 0,
     p.stockCount, p.imageUrl, p.images, p.rating, p.reviewCount, p.badge || null,
     p.isFeatured ? 1 : 0, p.isNew ? 1 : 0, p.discountPercent || null, p.description, p.specs || null]
  );
}

for (let i = 1; i <= 8; i++) {
  const [[{ cnt }]] = await conn.query("SELECT COUNT(*) as cnt FROM products WHERE category_id = ?", [i]);
  await conn.query("UPDATE categories SET product_count = ? WHERE id = ?", [cnt, i]);
}

await conn.end();
console.log("Seed complete: 8 categories, 8 products.");
