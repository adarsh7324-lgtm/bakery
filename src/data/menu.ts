import chocolateCake from "@/assets/chocolate-cake.jpg";
import blackForest from "@/assets/black-forest.jpg";
import truffleCake from "@/assets/truffle-cake.jpg";
import pizza from "@/assets/pizza.jpg";
import pizzaPaneer from "@/assets/pizza-paneer.jpg";
import pizzaVeggie from "@/assets/pizza-veggie.jpg";
import burger from "@/assets/burger.jpg";
import burgerAloo from "@/assets/burger-aloo.jpg";
import burgerTandoori from "@/assets/burger-tandoori.jpg";
import pastry from "@/assets/pastry.jpg";
import pastryPineapple from "@/assets/pastry-pineapple.jpg";
import pastryButterscotch from "@/assets/pastry-butterscotch.jpg";
import quickbites from "@/assets/quickbites.jpg";
import buns from "@/assets/buns.jpg";
import pattice from "@/assets/pattice.jpg";
import khari from "@/assets/khari.jpg";
import hotdog from "@/assets/hotdog.jpg";
import dessert from "@/assets/dessert.jpg";
import chocoLava from "@/assets/choco-lava.jpg";
import brownie from "@/assets/brownie.jpg";
import cakePineapple from "@/assets/cake-pineapple.jpg";
import cakeStrawberry from "@/assets/cake-strawberry.jpg";
import cakeButterscotch from "@/assets/cake-butterscotch.jpg";
import cakeRainbow from "@/assets/cake-rainbow.jpg";

export type Category =
  | "Desserts"
  | "Pizza"
  | "Burgers"
  | "Quick Bites"
  | "Cakes"
  | "Pastry";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  popular?: number;
  badge?: "Best Seller" | "New" | "20% OFF";
};

const img: Record<string, string> = {
  chocolateCake,
  blackForest,
  truffleCake,
  pizza,
  pizzaPaneer,
  pizzaVeggie,
  burger,
  burgerAloo,
  burgerTandoori,
  pastry,
  pastryPineapple,
  pastryButterscotch,
  quickbites,
  buns,
  pattice,
  khari,
  hotdog,
  dessert,
  chocoLava,
  brownie,
  cakePineapple,
  cakeStrawberry,
  cakeButterscotch,
  cakeRainbow,
};

export const images = img;

/** Pick the best-matching cake photo for a flavour name. */
function cakeImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("black forest")) return blackForest;
  if (n.includes("truffle")) return truffleCake;
  if (n.includes("pineapple")) return cakePineapple;
  if (n.includes("strawberry")) return cakeStrawberry;
  if (n.includes("butterscotch")) return cakeButterscotch;
  if (n.includes("rainbow")) return cakeRainbow;
  if (n.includes("vanilla") || n.includes("white forest") || n.includes("fruit"))
    return cakePineapple;
  return chocolateCake;
}

export const menu: MenuItem[] = [
  // Desserts
  {
    id: "choco-lava",
    name: "Choco Lava",
    description: "Molten chocolate cake with a warm gooey centre.",
    price: 80,
    category: "Desserts",
    image: chocoLava,
    popular: 88,
    badge: "Best Seller",
  },
  {
    id: "brownie",
    name: "Brownie",
    description: "Fudgy cocoa brownie baked fresh every morning.",
    price: 70,
    category: "Desserts",
    image: brownie,
    popular: 74,
  },

  // Pizza
  {
    id: "paneer-makhani-pizza",
    name: "Paneer Makhani Pizza (9\")",
    description: "Creamy makhani sauce, paneer cubes and mozzarella.",
    price: 249,
    category: "Pizza",
    image: pizzaPaneer,
    popular: 82,
  },
  {
    id: "shree-special-pizza",
    name: "Shree Special Pizza (9\")",
    description: "Our signature loaded pizza with garden veggies and cheese.",
    price: 299,
    category: "Pizza",
    image: pizzaVeggie,
    popular: 90,
    badge: "Best Seller",
  },
  {
    id: "veg-extra-cheese-pizza",
    name: "Veg Extra Cheese Pizza",
    description: "Double layer of stretchy mozzarella on a hand tossed base.",
    price: 229,
    category: "Pizza",
    image: pizza,
    popular: 91,
  },

  // Burgers
  {
    id: "aloo-tikki-burger",
    name: "Aloo Tikki Burger",
    description: "Crispy spiced potato patty with tangy sauces.",
    price: 60,
    category: "Burgers",
    image: burgerAloo,
    popular: 70,
  },
  {
    id: "cheese-burger",
    name: "Cheese Burger",
    description: "Burger with an aloo patty loaded with cheese and veggies.",
    price: 90,
    category: "Burgers",
    image: burger,
    popular: 89,
    badge: "Best Seller",
  },
  {
    id: "veg-tandoori-burger",
    name: "Veg Tandoori Burger",
    description: "Smoky tandoori patty with mint mayo and onions.",
    price: 99,
    category: "Burgers",
    image: burgerTandoori,
    popular: 66,
  },
  {
    id: "veg-makhni-burger",
    name: "Veg Makhni Burger",
    description: "Rich makhni sauce, veg patty and melted cheese.",
    price: 99,
    category: "Burgers",
    image: burgerTandoori,
    popular: 64,
    badge: "New",
  },

  // Quick Bites
  {
    id: "burger-bun",
    name: "Burger Bun",
    description: "Soft freshly baked buns, pack of four.",
    price: 30,
    category: "Quick Bites",
    image: buns,
    popular: 40,
  },
  {
    id: "aloo-pattice",
    name: "Aloo Pattice",
    description: "Flaky puff pastry stuffed with spiced potato.",
    price: 25,
    category: "Quick Bites",
    image: pattice,
    popular: 61,
  },
  {
    id: "paneer-pattice",
    name: "Paneer Pattice",
    description: "Golden puff filled with masala paneer.",
    price: 35,
    category: "Quick Bites",
    image: pattice,
    popular: 58,
  },
  {
    id: "jeera-khari",
    name: "Jeera Khari",
    description: "Buttery cumin khari, perfect with chai.",
    price: 60,
    category: "Quick Bites",
    image: khari,
    popular: 55,
  },
  {
    id: "pav-bhaji-bun",
    name: "Pav Bhaji Bun",
    description: "Soft ladi pav baked fresh daily.",
    price: 30,
    category: "Quick Bites",
    image: buns,
    popular: 44,
  },
  {
    id: "hot-dog",
    name: "Hot Dog",
    description: "Long bun with veg sausage, cheese and herbs.",
    price: 80,
    category: "Quick Bites",
    image: hotdog,
    popular: 52,
  },

  // Cakes 500g
  ...[
    ["Pineapple Cake", 399, "Light pineapple sponge with whipped cream."],
    ["Vanilla Cake", 379, "Classic vanilla sponge with silky frosting."],
    [
      "Chocolate Cake",
      429,
      "Cake baked with tons of chocolate, cocoa powder and choco chips.",
    ],
    [
      "Black Forest Cake",
      449,
      "Chocolate cake with whipped cream covered with chocolate shavings.",
    ],
    ["Choco Chips Cake", 449, "Vanilla sponge studded with choco chips."],
    ["Mixed Fruit Cake", 469, "Fresh seasonal fruits over cream frosting."],
    ["Strawberry Cake", 469, "Strawberry cream layers with fruit compote."],
    ["Chocolate Truffle Cake", 549, "Dense truffle ganache over moist cocoa sponge."],
    ["Chocolate Butterscotch Cake", 529, "Chocolate layers with crunchy butterscotch."],
    ["Butterscotch Cake", 479, "Caramel crunch and butterscotch cream."],
    ["Blueberry Cake", 549, "Blueberry compote with vanilla cream."],
    ["White Forest Cake", 499, "White chocolate shavings over cherry cream."],
    ["Rainbow Cake", 599, "Seven colourful sponge layers with vanilla cream."],
  ].map(([name, price, description]) => ({
    id: `cake-500-${String(name).toLowerCase().replace(/[^a-z]+/g, "-")}`,
    name: `${name} (500g)`,
    description: String(description),
    price: Number(price),
    category: "Cakes" as Category,
    image: cakeImage(String(name)),
    popular: 60,
  })),

  // Cakes 1kg
  ...[
    ["Vanilla Cake", 699],
    ["Black Forest Cake", 799],
    ["Pineapple Cake", 749],
    ["Chocolate Cake", 799],
    ["Choco Chip Cake", 829],
    ["Mixed Fruit Cake", 869],
    ["Strawberry Cake", 869],
    ["Chocolate Truffle Cake", 999],
    ["Butterscotch Cake", 879],
    ["Chocolate Butterscotch Cake", 949],
    ["Blueberry Cake", 999],
    ["White Forest Cake", 899],
  ].map(([name, price]) => ({
    id: `cake-1kg-${String(name).toLowerCase().replace(/[^a-z]+/g, "-")}`,
    name: `${name} (1kg)`,
    description: "Celebration size cake, freshly baked to order.",
    price: Number(price),
    category: "Cakes" as Category,
    image: cakeImage(String(name)),
    popular: 65,
  })),

  // Pastry
  {
    id: "chocolate-pastry",
    name: "Chocolate Pastry",
    description: "Rich chocolate sponge layered with ganache cream.",
    price: 60,
    category: "Pastry",
    image: pastry,
    popular: 92,
    badge: "Best Seller",
  },
  {
    id: "choco-chips-pastry",
    name: "Choco Chips Pastry",
    description: "Vanilla cream pastry loaded with choco chips.",
    price: 65,
    category: "Pastry",
    image: pastry,
    popular: 71,
  },
  {
    id: "pineapple-pastry",
    name: "Pineapple Pastry",
    description: "Moist pineapple pastry layered with whipped cream frosting.",
    price: 60,
    category: "Pastry",
    image: pastryPineapple,
    popular: 76,
  },
  {
    id: "butter-scotch-pastry",
    name: "Butter Scotch Pastry",
    description: "Butterscotch cream with caramel crunch topping.",
    price: 70,
    category: "Pastry",
    image: pastryButterscotch,
    popular: 73,
    badge: "20% OFF",
  },
];

export const categories: Category[] = [
  "Desserts",
  "Pizza",
  "Burgers",
  "Quick Bites",
  "Cakes",
  "Pastry",
];

export const popularItems: MenuItem[] = [
  "cake-500-chocolate-cake",
  "cake-500-black-forest-cake",
  "cake-500-chocolate-truffle-cake",
  "veg-extra-cheese-pizza",
  "cheese-burger",
  "chocolate-pastry",
]
  .map((id) => menu.find((m) => m.id === id)!)
  .filter(Boolean);

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
