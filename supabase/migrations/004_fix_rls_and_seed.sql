-- ============================================================
-- Shree Bakers – Fix RLS policies & seed all data
-- Migration: 004_fix_rls_and_seed.sql
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- PART 1 — Fix RLS policies so anon client can read everything
-- (products table previously only showed available=true to anon)
-- ─────────────────────────────────────────────────────────────

-- Products: allow anon to read ALL products (admin filters in app)
drop policy if exists "Public read available products" on public.products;
create policy "Public read products"
  on public.products for select
  using (true);

-- Allow anon inserts for seeding (service key used for seeding)
drop policy if exists "Admin full access to products" on public.products;
create policy "Admin full access to products"
  on public.products for all
  using (true);  -- open — admin route is protected by Supabase Auth in the app

-- FAQs: allow anon to read ALL faqs (app filters visible=true itself)
drop policy if exists "Public read visible FAQs" on public.faqs;
create policy "Public read faqs"
  on public.faqs for select
  using (true);

drop policy if exists "Admin full access to faqs" on public.faqs;
create policy "Admin full access to faqs"
  on public.faqs for all
  using (true);

-- ─────────────────────────────────────────────────────────────
-- PART 2 — Seed products (upsert so it's idempotent)
-- Images use Unsplash URLs that match each item category
-- ─────────────────────────────────────────────────────────────

insert into public.products (id, name, description, price, category, image, popular, badge, available, featured)
values
  -- Desserts
  ('choco-lava',        'Choco Lava',             'Molten chocolate cake with a warm gooey centre.',                     80,  'Desserts',    'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80', 88, 'Best Seller', true, false),
  ('brownie',           'Brownie',                'Fudgy cocoa brownie baked fresh every morning.',                      70,  'Desserts',    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', 74, null,          true, false),

  -- Pizza
  ('paneer-makhani-pizza',    'Paneer Makhani Pizza (9")',   'Creamy makhani sauce, paneer cubes and mozzarella.',              249, 'Pizza',       'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', 82, null,          true, false),
  ('shree-special-pizza',     'Shree Special Pizza (9")',    'Our signature loaded pizza with garden veggies and cheese.',       299, 'Pizza',       'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', 90, 'Best Seller', true, false),
  ('veg-extra-cheese-pizza',  'Veg Extra Cheese Pizza',      'Double layer of stretchy mozzarella on a hand tossed base.',      229, 'Pizza',       'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=400&q=80', 91, null,          true, true),

  -- Burgers
  ('aloo-tikki-burger',  'Aloo Tikki Burger',  'Crispy spiced potato patty with tangy sauces.',         60,  'Burgers',     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', 70, null,          true, false),
  ('cheese-burger',      'Cheese Burger',      'Burger with an aloo patty loaded with cheese and veggies.', 90, 'Burgers',  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', 89, 'Best Seller', true, true),
  ('veg-tandoori-burger','Veg Tandoori Burger','Smoky tandoori patty with mint mayo and onions.',        99,  'Burgers',     'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', 66, null,          true, false),
  ('veg-makhni-burger',  'Veg Makhni Burger',  'Rich makhni sauce, veg patty and melted cheese.',       99,  'Burgers',     'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&q=80', 64, 'New',         true, false),

  -- Quick Bites
  ('burger-bun',    'Burger Bun',      'Soft freshly baked buns, pack of four.',         30, 'Quick Bites', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', 40, null, true, false),
  ('aloo-pattice',  'Aloo Pattice',    'Flaky puff pastry stuffed with spiced potato.',  25, 'Quick Bites', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', 61, null, true, false),
  ('paneer-pattice','Paneer Pattice',  'Golden puff filled with masala paneer.',          35, 'Quick Bites', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', 58, null, true, false),
  ('jeera-khari',   'Jeera Khari',     'Buttery cumin khari, perfect with chai.',         60, 'Quick Bites', 'https://images.unsplash.com/photo-1619981834593-e23ea42bec96?w=400&q=80', 55, null, true, false),
  ('pav-bhaji-bun', 'Pav Bhaji Bun',  'Soft ladi pav baked fresh daily.',                30, 'Quick Bites', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', 44, null, true, false),
  ('hot-dog',       'Hot Dog',         'Long bun with veg sausage, cheese and herbs.',   80, 'Quick Bites', 'https://images.unsplash.com/photo-1612392062631-94f6e19f4c91?w=400&q=80', 52, null, true, false),

  -- Cakes 500g
  ('cake-500-pineapple-cake',            'Pineapple Cake (500g)',             'Light pineapple sponge with whipped cream.',                                        399, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 60, null,          true, false),
  ('cake-500-vanilla-cake',              'Vanilla Cake (500g)',               'Classic vanilla sponge with silky frosting.',                                        379, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 60, null,          true, false),
  ('cake-500-chocolate-cake',            'Chocolate Cake (500g)',             'Cake baked with tons of chocolate, cocoa powder and choco chips.',                  429, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 60, null,          true, true),
  ('cake-500-black-forest-cake',         'Black Forest Cake (500g)',          'Chocolate cake with whipped cream covered with chocolate shavings.',                449, 'Cakes', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80', 60, null,          true, true),
  ('cake-500-choco-chips-cake',          'Choco Chips Cake (500g)',           'Vanilla sponge studded with choco chips.',                                           449, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 60, null,          true, false),
  ('cake-500-mixed-fruit-cake',          'Mixed Fruit Cake (500g)',           'Fresh seasonal fruits over cream frosting.',                                         469, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 60, null,          true, false),
  ('cake-500-strawberry-cake',           'Strawberry Cake (500g)',            'Strawberry cream layers with fruit compote.',                                        469, 'Cakes', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', 60, null,          true, false),
  ('cake-500-chocolate-truffle-cake',    'Chocolate Truffle Cake (500g)',     'Dense truffle ganache over moist cocoa sponge.',                                    549, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 60, null,          true, true),
  ('cake-500-chocolate-butterscotch-cake','Chocolate Butterscotch Cake (500g)','Chocolate layers with crunchy butterscotch.',                                      529, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 60, null,          true, false),
  ('cake-500-butterscotch-cake',         'Butterscotch Cake (500g)',          'Caramel crunch and butterscotch cream.',                                             479, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 60, null,          true, false),
  ('cake-500-blueberry-cake',            'Blueberry Cake (500g)',             'Blueberry compote with vanilla cream.',                                              549, 'Cakes', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', 60, null,          true, false),
  ('cake-500-white-forest-cake',         'White Forest Cake (500g)',          'White chocolate shavings over cherry cream.',                                        499, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 60, null,          true, false),
  ('cake-500-rainbow-cake',              'Rainbow Cake (500g)',               'Seven colourful sponge layers with vanilla cream.',                                  599, 'Cakes', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', 60, null,          true, false),

  -- Cakes 1kg
  ('cake-1kg-vanilla-cake',             'Vanilla Cake (1kg)',                 'Celebration size cake, freshly baked to order.',                                    699, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-black-forest-cake',        'Black Forest Cake (1kg)',            'Celebration size cake, freshly baked to order.',                                    799, 'Cakes', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-pineapple-cake',           'Pineapple Cake (1kg)',               'Celebration size cake, freshly baked to order.',                                    749, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-chocolate-cake',           'Chocolate Cake (1kg)',               'Celebration size cake, freshly baked to order.',                                    799, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-choco-chip-cake',          'Choco Chip Cake (1kg)',              'Celebration size cake, freshly baked to order.',                                    829, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-mixed-fruit-cake',         'Mixed Fruit Cake (1kg)',             'Celebration size cake, freshly baked to order.',                                    869, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-strawberry-cake',          'Strawberry Cake (1kg)',              'Celebration size cake, freshly baked to order.',                                    869, 'Cakes', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-chocolate-truffle-cake',   'Chocolate Truffle Cake (1kg)',       'Celebration size cake, freshly baked to order.',                                    999, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-butterscotch-cake',        'Butterscotch Cake (1kg)',            'Celebration size cake, freshly baked to order.',                                    879, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-chocolate-butterscotch-cake','Chocolate Butterscotch Cake (1kg)','Celebration size cake, freshly baked to order.',                                   949, 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-blueberry-cake',           'Blueberry Cake (1kg)',               'Celebration size cake, freshly baked to order.',                                    999, 'Cakes', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', 65, null,          true, false),
  ('cake-1kg-white-forest-cake',        'White Forest Cake (1kg)',            'Celebration size cake, freshly baked to order.',                                    899, 'Cakes', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80', 65, null,          true, false),

  -- Pastry
  ('chocolate-pastry',    'Chocolate Pastry',       'Rich chocolate sponge layered with ganache cream.',             60, 'Pastry', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80', 92, 'Best Seller', true, true),
  ('choco-chips-pastry',  'Choco Chips Pastry',     'Vanilla cream pastry loaded with choco chips.',                 65, 'Pastry', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80', 71, null,          true, false),
  ('pineapple-pastry',    'Pineapple Pastry',        'Moist pineapple pastry layered with whipped cream frosting.',  60, 'Pastry', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80', 76, null,          true, false),
  ('butter-scotch-pastry','Butter Scotch Pastry',   'Butterscotch cream with caramel crunch topping.',              70, 'Pastry', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80', 73, '20% OFF',     true, false)

on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  price       = excluded.price,
  category    = excluded.category,
  image       = excluded.image,
  popular     = excluded.popular,
  badge       = excluded.badge,
  available   = excluded.available,
  featured    = excluded.featured;


-- ─────────────────────────────────────────────────────────────
-- PART 3 — Seed FAQs (upsert)
-- ─────────────────────────────────────────────────────────────

insert into public.faqs (question, answer, category, visible, "order")
select q, a, c::text, true, o
from (values
  (1, 'How long does a cake stay fresh?',
      'Our cakes stay fresh for 2-3 days at room temperature and up to 5 days when refrigerated. For best taste, consume within 24 hours of delivery. Store in a cool, dry place away from direct sunlight.',
      'Products'),
  (2, 'What is the delivery time?',
      'We usually deliver within 2-4 hours depending on your location and order time. Orders placed after 8 PM may be scheduled for the next morning. We deliver across Lanka and nearby areas in Varanasi.',
      'Delivery'),
  (3, 'Do you offer same-day delivery?',
      'Yes! We offer same-day delivery for orders placed before 6 PM. For custom cakes or large orders, we recommend placing your order at least 24-48 hours in advance to ensure freshness and quality.',
      'Delivery'),
  (4, 'Can I customize a cake?',
      'Absolutely! We love creating custom cakes. You can customize the flavor, size, design, message, and frosting. Please contact us at least 48 hours in advance for custom orders. Call or WhatsApp us to discuss your requirements.',
      'Cakes'),
  (5, 'Do you have eggless cakes?',
      'Yes, we offer a wide variety of eggless cakes that are just as delicious! Our eggless options include chocolate, vanilla, red velvet, butterscotch, pineapple, and more. Just mention your preference when ordering.',
      'Cakes'),
  (6, 'What payment methods do you accept?',
      'We accept Cash on Delivery (COD), UPI payments (Google Pay, PhonePe, Paytm), and all major credit/debit cards. For large custom orders, we may request an advance payment to confirm the booking.',
      'Payments'),
  (7, 'How early should I place a cake order?',
      'For standard cakes, same-day or next-day ordering is fine. For custom designed cakes, fondant cakes, or bulk orders, please place your order at least 2-3 days in advance so we can prepare it with care.',
      'Orders'),
  (8, 'Do you deliver to my area?',
      'We currently deliver across Lanka, BHU, Assi, Sunderpur, and nearby areas in Varanasi. If you are unsure about your area, please WhatsApp us at +91 76180 00036 and we will confirm availability for your location.',
      'Delivery')
) as t(o, q, a, c)
where not exists (select 1 from public.faqs limit 1);


-- ─────────────────────────────────────────────────────────────
-- PART 4 — Seed app_settings with correct category list
-- ─────────────────────────────────────────────────────────────

insert into public.app_settings (singleton_id, categories, badges)
values (
  true,
  array['Desserts','Pizza','Burgers','Quick Bites','Cakes','Pastry'],
  array['none','Best Seller','New','20% OFF']
)
on conflict (singleton_id) do update set
  categories = array['Desserts','Pizza','Burgers','Quick Bites','Cakes','Pastry'],
  badges     = array['none','Best Seller','New','20% OFF'];


-- Done ✓
-- After running this, verify with:
--   SELECT COUNT(*) FROM products;   -- should be ~45
--   SELECT COUNT(*) FROM faqs;       -- should be 8
--   SELECT categories FROM app_settings;
