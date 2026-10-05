-- ============================================================
-- Shree Bakers - Seed Data Migration
-- Migration: 003_seed_data.sql
-- Seeds all menu products and FAQ data into Supabase tables.
-- This must be run with the service role (bypasses RLS).
-- ============================================================

-- 1. PRODUCTS SEED
INSERT INTO public.products (id, name, description, price, category, image, popular, badge, available, featured)
VALUES
  -- Desserts
  ('choco-lava',           'Choco Lava',                   'Molten chocolate cake with a warm gooey centre.',                           80,  'Desserts',   'chocoLava',          88, 'Best Seller', true, false),
  ('brownie',              'Brownie',                       'Fudgy cocoa brownie baked fresh every morning.',                            70,  'Desserts',   'brownie',            74, NULL,          true, false),
  -- Pizza
  ('paneer-makhani-pizza', 'Paneer Makhani Pizza (9")',     'Creamy makhani sauce, paneer cubes and mozzarella.',                       249, 'Pizza',      'pizzaPaneer',        82, NULL,          true, false),
  ('shree-special-pizza',  'Shree Special Pizza (9")',      'Our signature loaded pizza with garden veggies and cheese.',               299, 'Pizza',      'pizzaVeggie',        90, 'Best Seller', true, false),
  ('veg-extra-cheese-pizza','Veg Extra Cheese Pizza',       'Double layer of stretchy mozzarella on a hand tossed base.',              229, 'Pizza',      'pizza',              91, NULL,          true, true),
  -- Burgers
  ('aloo-tikki-burger',    'Aloo Tikki Burger',             'Crispy spiced potato patty with tangy sauces.',                            60,  'Burgers',    'burgerAloo',         70, NULL,          true, false),
  ('cheese-burger',        'Cheese Burger',                 'Burger with an aloo patty loaded with cheese and veggies.',                90,  'Burgers',    'burger',             89, 'Best Seller', true, true),
  ('veg-tandoori-burger',  'Veg Tandoori Burger',           'Smoky tandoori patty with mint mayo and onions.',                          99,  'Burgers',    'burgerTandoori',     66, NULL,          true, false),
  ('veg-makhni-burger',    'Veg Makhni Burger',             'Rich makhni sauce, veg patty and melted cheese.',                          99,  'Burgers',    'burgerTandoori',     64, 'New',         true, false),
  -- Quick Bites
  ('burger-bun',           'Burger Bun',                   'Soft freshly baked buns, pack of four.',                                   30,  'Quick Bites','buns',               40, NULL,          true, false),
  ('aloo-pattice',         'Aloo Pattice',                 'Flaky puff pastry stuffed with spiced potato.',                            25,  'Quick Bites','pattice',            61, NULL,          true, false),
  ('paneer-pattice',       'Paneer Pattice',               'Golden puff filled with masala paneer.',                                   35,  'Quick Bites','pattice',            58, NULL,          true, false),
  ('jeera-khari',          'Jeera Khari',                  'Buttery cumin khari, perfect with chai.',                                  60,  'Quick Bites','khari',              55, NULL,          true, false),
  ('pav-bhaji-bun',        'Pav Bhaji Bun',                'Soft ladi pav baked fresh daily.',                                         30,  'Quick Bites','buns',               44, NULL,          true, false),
  ('hot-dog',              'Hot Dog',                      'Long bun with veg sausage, cheese and herbs.',                             80,  'Quick Bites','hotdog',             52, NULL,          true, false),
  -- Pastry
  ('chocolate-pastry',     'Chocolate Pastry',             'Rich chocolate sponge layered with ganache cream.',                        60,  'Pastry',     'pastry',             92, 'Best Seller', true, true),
  ('choco-chips-pastry',   'Choco Chips Pastry',           'Vanilla cream pastry loaded with choco chips.',                           65,  'Pastry',     'pastry',             71, NULL,          true, false),
  ('pineapple-pastry',     'Pineapple Pastry',             'Moist pineapple pastry layered with whipped cream frosting.',             60,  'Pastry',     'pastryPineapple',    76, NULL,          true, false),
  ('butter-scotch-pastry', 'Butter Scotch Pastry',         'Butterscotch cream with caramel crunch topping.',                         70,  'Pastry',     'pastryButterscotch', 73, '20% OFF',     true, false),
  -- Cakes 500g
  ('cake-500-pineapple-cake',              'Pineapple Cake (500g)',              'Light pineapple sponge with whipped cream.',                     399, 'Cakes', 'cakePineapple',    60, NULL, true, false),
  ('cake-500-vanilla-cake',                'Vanilla Cake (500g)',                'Classic vanilla sponge with silky frosting.',                    379, 'Cakes', 'cakePineapple',    60, NULL, true, false),
  ('cake-500-chocolate-cake',              'Chocolate Cake (500g)',              'Cake baked with tons of chocolate, cocoa powder and choco chips.',429, 'Cakes', 'chocolateCake',    60, NULL, true, true),
  ('cake-500-black-forest-cake',           'Black Forest Cake (500g)',           'Chocolate cake with whipped cream covered with chocolate shavings.',449,'Cakes','blackForest',     60, NULL, true, true),
  ('cake-500-choco-chips-cake',            'Choco Chips Cake (500g)',            'Vanilla sponge studded with choco chips.',                       449, 'Cakes', 'chocolateCake',    60, NULL, true, false),
  ('cake-500-mixed-fruit-cake',            'Mixed Fruit Cake (500g)',            'Fresh seasonal fruits over cream frosting.',                      469, 'Cakes', 'cakePineapple',    60, NULL, true, false),
  ('cake-500-strawberry-cake',             'Strawberry Cake (500g)',             'Strawberry cream layers with fruit compote.',                     469, 'Cakes', 'cakeStrawberry',   60, NULL, true, false),
  ('cake-500-chocolate-truffle-cake',      'Chocolate Truffle Cake (500g)',      'Dense truffle ganache over moist cocoa sponge.',                  549, 'Cakes', 'truffleCake',      60, NULL, true, true),
  ('cake-500-chocolate-butterscotch-cake', 'Chocolate Butterscotch Cake (500g)', 'Chocolate layers with crunchy butterscotch.',                    529, 'Cakes', 'cakeButterscotch', 60, NULL, true, false),
  ('cake-500-butterscotch-cake',           'Butterscotch Cake (500g)',           'Caramel crunch and butterscotch cream.',                         479, 'Cakes', 'cakeButterscotch', 60, NULL, true, false),
  ('cake-500-blueberry-cake',              'Blueberry Cake (500g)',              'Blueberry compote with vanilla cream.',                           549, 'Cakes', 'cakePineapple',    60, NULL, true, false),
  ('cake-500-white-forest-cake',           'White Forest Cake (500g)',           'White chocolate shavings over cherry cream.',                     499, 'Cakes', 'cakePineapple',    60, NULL, true, false),
  ('cake-500-rainbow-cake',                'Rainbow Cake (500g)',                'Seven colourful sponge layers with vanilla cream.',               599, 'Cakes', 'cakeRainbow',      60, NULL, true, false),
  -- Cakes 1kg
  ('cake-1kg-vanilla-cake',                'Vanilla Cake (1kg)',                 'Celebration size cake, freshly baked to order.',                  699, 'Cakes', 'cakePineapple',    65, NULL, true, false),
  ('cake-1kg-black-forest-cake',           'Black Forest Cake (1kg)',            'Celebration size cake, freshly baked to order.',                  799, 'Cakes', 'blackForest',      65, NULL, true, false),
  ('cake-1kg-pineapple-cake',              'Pineapple Cake (1kg)',               'Celebration size cake, freshly baked to order.',                  749, 'Cakes', 'cakePineapple',    65, NULL, true, false),
  ('cake-1kg-chocolate-cake',              'Chocolate Cake (1kg)',               'Celebration size cake, freshly baked to order.',                  799, 'Cakes', 'chocolateCake',    65, NULL, true, false),
  ('cake-1kg-choco-chip-cake',             'Choco Chip Cake (1kg)',              'Celebration size cake, freshly baked to order.',                  829, 'Cakes', 'chocolateCake',    65, NULL, true, false),
  ('cake-1kg-mixed-fruit-cake',            'Mixed Fruit Cake (1kg)',             'Celebration size cake, freshly baked to order.',                  869, 'Cakes', 'cakePineapple',    65, NULL, true, false),
  ('cake-1kg-strawberry-cake',             'Strawberry Cake (1kg)',              'Celebration size cake, freshly baked to order.',                  869, 'Cakes', 'cakeStrawberry',   65, NULL, true, false),
  ('cake-1kg-chocolate-truffle-cake',      'Chocolate Truffle Cake (1kg)',       'Celebration size cake, freshly baked to order.',                  999, 'Cakes', 'truffleCake',      65, NULL, true, false),
  ('cake-1kg-butterscotch-cake',           'Butterscotch Cake (1kg)',            'Celebration size cake, freshly baked to order.',                  879, 'Cakes', 'cakeButterscotch', 65, NULL, true, false),
  ('cake-1kg-chocolate-butterscotch-cake', 'Chocolate Butterscotch Cake (1kg)', 'Celebration size cake, freshly baked to order.',                   949, 'Cakes', 'cakeButterscotch', 65, NULL, true, false),
  ('cake-1kg-blueberry-cake',              'Blueberry Cake (1kg)',               'Celebration size cake, freshly baked to order.',                  999, 'Cakes', 'cakePineapple',    65, NULL, true, false),
  ('cake-1kg-white-forest-cake',           'White Forest Cake (1kg)',            'Celebration size cake, freshly baked to order.',                  899, 'Cakes', 'cakePineapple',    65, NULL, true, false)
ON CONFLICT (id) DO NOTHING;


-- 2. FAQS SEED
INSERT INTO public.faqs (question, answer, category, visible, "order")
SELECT q, a, c::text, v, o
FROM (VALUES
  ('How long does a cake stay fresh?',
   'Our cakes stay fresh for 2-3 days at room temperature and up to 5 days when refrigerated. For best taste, consume within 24 hours of delivery. Store in a cool, dry place away from direct sunlight.',
   'Products', true, 1),
  ('What is the delivery time?',
   'We usually deliver within 2-4 hours depending on your location and order time. Orders placed after 8 PM may be scheduled for the next morning. We deliver across Lanka and nearby areas in Varanasi.',
   'Delivery', true, 2),
  ('Do you offer same-day delivery?',
   'Yes! We offer same-day delivery for orders placed before 6 PM. For custom cakes or large orders, we recommend placing your order at least 24-48 hours in advance to ensure freshness and quality.',
   'Delivery', true, 3),
  ('Can I customize a cake?',
   'Absolutely! We love creating custom cakes. You can customize the flavor, size, design, message, and frosting. Please contact us at least 48 hours in advance for custom orders. Call or WhatsApp us to discuss your requirements.',
   'Cakes', true, 4),
  ('Do you have eggless cakes?',
   'Yes, we offer a wide variety of eggless cakes that are just as delicious! Our eggless options include chocolate, vanilla, red velvet, butterscotch, pineapple, and more. Just mention your preference when ordering.',
   'Cakes', true, 5),
  ('What payment methods do you accept?',
   'We accept Cash on Delivery (COD), UPI payments (Google Pay, PhonePe, Paytm), and all major credit/debit cards. For large custom orders, we may request an advance payment to confirm the booking.',
   'Payments', true, 6),
  ('How early should I place a cake order?',
   'For standard cakes, same-day or next-day ordering is fine. For custom designed cakes, fondant cakes, or bulk orders, please place your order at least 2-3 days in advance so we can prepare it with care.',
   'Orders', true, 7),
  ('Do you deliver to my area?',
   'We currently deliver across Lanka, BHU, Assi, Sunderpur, and nearby areas in Varanasi. If you are unsure about your area, please WhatsApp us at +91 76180 00036 and we will confirm availability for your location.',
   'Delivery', true, 8)
) AS t(q, a, c, v, o)
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE "order" = t.o);


-- 3. FIX RLS: Allow anon INSERT so client seedIfEmpty() can insert seed data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anon seed products'
  ) THEN
    EXECUTE 'CREATE POLICY "Anon seed products" ON public.products FOR INSERT WITH CHECK (true)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Anon seed faqs'
  ) THEN
    EXECUTE 'CREATE POLICY "Anon seed faqs" ON public.faqs FOR INSERT WITH CHECK (true)';
  END IF;
END $$;

-- Done
