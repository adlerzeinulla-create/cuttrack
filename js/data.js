/* CUTTRACK — база продуктов, упражнений и контент гайда.
   Значения КБЖУ — на 100 г продукта (приблизительные, по открытым данным). */

window.DB = {

  appName: "CUTTRACK",
  appVersion: "0.1v",
  source: "https://www.youtube.com/watch?v=fSfhQebFiHk",

  meals: [
    { id: "breakfast", name: "Завтрак", icon: "sun" },
    { id: "lunch", name: "Обед", icon: "bowl" },
    { id: "dinner", name: "Ужин", icon: "moon" },
    { id: "snack", name: "Перекус", icon: "snack" }
  ],

  activityLevels: [
    { id: "low", label: "Мало", hint: "до 6 тыс. шагов", factor: 1.30 },
    { id: "mid", label: "Средне", hint: "6–10 тыс. шагов", factor: 1.45 },
    { id: "high", label: "Много", hint: "10–15 тыс. шагов", factor: 1.60 },
    { id: "veryhigh", label: "Очень много", hint: "15 тыс.+", factor: 1.75 }
  ],

  foodCats: [
    { id: "all", name: "Всё" },
    { id: "protein", name: "Белки" },
    { id: "carb", name: "Углеводы" },
    { id: "fat", name: "Жиры" },
    { id: "veg", name: "Овощи" },
    { id: "fruit", name: "Фрукты" },
    { id: "dairy", name: "Молочное" },
    { id: "other", name: "Другое" }
  ],

  allergens: [
    { id: "gluten", name: "Глютен", hint: "пшеница, ячмень, рожь, овёс" },
    { id: "dairy", name: "Молочное", hint: "лактоза и молочный белок" },
    { id: "egg", name: "Яйца", hint: "яйцо и продукты с ним" },
    { id: "fish", name: "Рыба", hint: "лосось, треска, тунец" },
    { id: "seafood", name: "Морепродукты", hint: "креветки, моллюски" },
    { id: "soy", name: "Соя", hint: "тофу, темпе, эдамаме" },
    { id: "nuts", name: "Орехи", hint: "миндаль, грецкий орех, кешью" },
    { id: "peanut", name: "Арахис", hint: "арахис и арахисовая паста" },
    { id: "sesame", name: "Кунжут", hint: "тахини, хумус" }
  ],

  cuisines: [
    { id: "central-asia", name: "Средняя Азия", short: "плов, лагман, шурпа", icon: "flame", note: "Узбекская, казахская, кыргызская и таджикская классика — адаптированная под дефицит и доступные продукты." },
    { id: "home", name: "СНГ · домашняя", short: "гречка, щи, творог", icon: "bowl", note: "Привычные домашние блюда: гречка, щи, творог, кефир и курица. Просто, сытно и без экзотики." },
    { id: "caucasus", name: "Кавказ", short: "шашлык, лобио, сациви", icon: "target", note: "Грузинские, армянские и азербайджанские мотивы: много зелени, овощей, фасоли и орехов." },
    { id: "east", name: "Восточная Азия", short: "рис, тофу, терияки", icon: "moon", note: "Китайские, корейские и японские идеи: рис, соевые продукты, рыба и быстрые обжарки." },
    { id: "mediterranean", name: "Средиземноморье", short: "рыба, кускус, фета", icon: "sun", note: "Овощи, рыба, бобовые, кускус и оливковое масло — лёгкие и полезные сочетания." },
    { id: "budget", name: "Бюджет · зал", short: "просто и сытно", icon: "dumbbell", note: "Максимум белка и сытости за минимальные деньги: курица, яйца, крупы, капуста и фасоль." }
  ],

  foods: (window.CUTTRACK_FOODS && window.CUTTRACK_FOODS.length ? window.CUTTRACK_FOODS : [
    // белки
    { id: "chicken", name: "Куриная грудка", cat: "protein", kcal: 165, p: 31, f: 3.6, c: 0, portion: 150 },
    { id: "chicken-thigh", name: "Куриное бедро без кожи", cat: "protein", kcal: 209, p: 26, f: 10.9, c: 0, portion: 150 },
    { id: "turkey", name: "Индейка, грудка", cat: "protein", kcal: 147, p: 30, f: 2, c: 0, portion: 150 },
    { id: "beef", name: "Говядина 10%", cat: "protein", kcal: 217, p: 26, f: 12, c: 0, portion: 150 },
    { id: "egg", name: "Яйцо куриное", cat: "protein", kcal: 143, p: 13, f: 9.5, c: 1.1, portion: 50 },
    { id: "egg-white", name: "Яичный белок", cat: "protein", kcal: 52, p: 11, f: 0.2, c: 0.7, portion: 100 },
    { id: "cottage5", name: "Творог 5%", cat: "protein", kcal: 121, p: 17, f: 5, c: 3, portion: 180 },
    { id: "cottage0", name: "Творог 0%", cat: "protein", kcal: 71, p: 16.5, f: 0.2, c: 1.8, portion: 180 },
    { id: "greek", name: "Греческий йогурт 2%", cat: "protein", kcal: 73, p: 10, f: 2, c: 3.5, portion: 170 },
    { id: "kefir", name: "Кефир 1%", cat: "protein", kcal: 40, p: 3, f: 1, c: 4, portion: 250 },
    { id: "milk", name: "Молоко 2,5%", cat: "protein", kcal: 52, p: 2.9, f: 2.5, c: 4.7, portion: 250 },
    { id: "tuna", name: "Тунец в собственном соку", cat: "protein", kcal: 116, p: 26, f: 1, c: 0, portion: 150 },
    { id: "salmon", name: "Лосось", cat: "protein", kcal: 208, p: 20, f: 13, c: 0, portion: 150 },
    { id: "cod", name: "Треска", cat: "protein", kcal: 82, p: 18, f: 0.7, c: 0, portion: 150 },
    { id: "shrimp", name: "Креветки", cat: "protein", kcal: 99, p: 24, f: 0.3, c: 0.2, portion: 150 },
    { id: "whey", name: "Протеин whey", cat: "protein", kcal: 400, p: 80, f: 7, c: 8, portion: 30 },
    { id: "tofu", name: "Тофу", cat: "protein", kcal: 76, p: 8, f: 4.8, c: 1.9, portion: 150 },
    { id: "beans", name: "Фасоль красная, варёная", cat: "protein", kcal: 127, p: 8.7, f: 0.5, c: 22.8, portion: 150 },
    { id: "lentils", name: "Чечевица, варёная", cat: "protein", kcal: 116, p: 9, f: 0.4, c: 20, portion: 150 },

    // углеводы
    { id: "rice", name: "Рис белый, варёный", cat: "carb", kcal: 130, p: 2.7, f: 0.3, c: 28, portion: 200 },
    { id: "brown-rice", name: "Рис бурый, варёный", cat: "carb", kcal: 123, p: 2.7, f: 1, c: 25.6, portion: 200 },
    { id: "buckwheat", name: "Гречка, варёная", cat: "carb", kcal: 110, p: 4, f: 1, c: 21, portion: 200 },
    { id: "oats", name: "Овсянка на воде", cat: "carb", kcal: 88, p: 3, f: 1.7, c: 15, portion: 250 },
    { id: "potato", name: "Картофель, варёный", cat: "carb", kcal: 87, p: 2, f: 0.1, c: 20, portion: 250 },
    { id: "sweet-potato", name: "Батат, варёный", cat: "carb", kcal: 86, p: 1.6, f: 0.1, c: 20, portion: 200 },
    { id: "pasta", name: "Паста, варёная", cat: "carb", kcal: 158, p: 5.8, f: 0.9, c: 31, portion: 200 },
    { id: "bread", name: "Хлеб цельнозерновой", cat: "carb", kcal: 247, p: 13, f: 3.4, c: 41, portion: 40 },
    { id: "banana", name: "Банан", cat: "carb", kcal: 89, p: 1.1, f: 0.3, c: 23, portion: 120 },
    { id: "apple", name: "Яблоко", cat: "carb", kcal: 52, p: 0.3, f: 0.2, c: 14, portion: 180 },
    { id: "orange", name: "Апельсин", cat: "carb", kcal: 47, p: 0.9, f: 0.1, c: 12, portion: 180 },
    { id: "blueberry", name: "Черника", cat: "carb", kcal: 57, p: 0.7, f: 0.3, c: 14, portion: 100 },
    { id: "honey", name: "Мёд", cat: "carb", kcal: 304, p: 0.3, f: 0, c: 82, portion: 15 },
    { id: "rice-cakes", name: "Рисовые хлебцы", cat: "carb", kcal: 387, p: 8, f: 2.8, c: 82, portion: 10 },
    { id: "corn", name: "Кукуруза, варёная", cat: "carb", kcal: 96, p: 3.4, f: 1.5, c: 21, portion: 150 },
    { id: "quinoa", name: "Киноа, варёная", cat: "carb", kcal: 120, p: 4.4, f: 1.9, c: 21, portion: 200 },
    { id: "oat-dry", name: "Овсяные хлопья (сухие)", cat: "carb", kcal: 389, p: 16.9, f: 6.9, c: 66, portion: 60 },

    // жиры
    { id: "olive-oil", name: "Оливковое масло", cat: "fat", kcal: 884, p: 0, f: 100, c: 0, portion: 10 },
    { id: "avocado", name: "Авокадо", cat: "fat", kcal: 160, p: 2, f: 15, c: 9, portion: 100 },
    { id: "almond", name: "Миндаль", cat: "fat", kcal: 579, p: 21, f: 50, c: 22, portion: 25 },
    { id: "walnut", name: "Грецкий орех", cat: "fat", kcal: 654, p: 15, f: 65, c: 14, portion: 25 },
    { id: "peanut-butter", name: "Арахисовая паста", cat: "fat", kcal: 588, p: 25, f: 50, c: 20, portion: 25 },
    { id: "chia", name: "Семена чиа", cat: "fat", kcal: 486, p: 17, f: 31, c: 42, portion: 15 },
    { id: "butter", name: "Сливочное масло", cat: "fat", kcal: 717, p: 0.9, f: 81, c: 0.1, portion: 10 },

    // овощи
    { id: "broccoli", name: "Брокколи", cat: "veg", kcal: 34, p: 2.8, f: 0.4, c: 7, portion: 200 },
    { id: "cucumber", name: "Огурец", cat: "veg", kcal: 15, p: 0.7, f: 0.1, c: 3.6, portion: 150 },
    { id: "tomato", name: "Помидор", cat: "veg", kcal: 18, p: 0.9, f: 0.2, c: 3.9, portion: 150 },
    { id: "salad", name: "Салат листовой", cat: "veg", kcal: 15, p: 1.4, f: 0.2, c: 2.9, portion: 100 },
    { id: "carrot", name: "Морковь", cat: "veg", kcal: 41, p: 0.9, f: 0.2, c: 10, portion: 100 },
    { id: "zucchini", name: "Кабачок", cat: "veg", kcal: 17, p: 1.2, f: 0.3, c: 3.1, portion: 200 },
    { id: "pepper", name: "Перец болгарский", cat: "veg", kcal: 31, p: 1, f: 0.3, c: 6, portion: 150 },
    { id: "spinach", name: "Шпинат", cat: "veg", kcal: 23, p: 2.9, f: 0.4, c: 3.6, portion: 100 },

    // другое
    { id: "chocolate", name: "Шоколад 70%", cat: "other", kcal: 598, p: 7.8, f: 42, c: 46, portion: 20 },
    { id: "pizza", name: "Пицца", cat: "other", kcal: 266, p: 11, f: 10, c: 33, portion: 150 },
    { id: "chips", name: "Чипсы", cat: "other", kcal: 536, p: 7, f: 35, c: 53, portion: 50 },
    { id: "cereal", name: "Хлопья с сахаром", cat: "other", kcal: 379, p: 7, f: 1, c: 84, portion: 40 },
    { id: "icecream", name: "Мороженое", cat: "other", kcal: 207, p: 3.5, f: 11, c: 24, portion: 100 },
    { id: "coffee", name: "Кофе чёрный", cat: "other", kcal: 2, p: 0.1, f: 0, c: 0, portion: 250 },
    { id: "cola", name: "Кола", cat: "other", kcal: 42, p: 0, f: 0, c: 10.6, portion: 330 },
    { id: "beer", name: "Пиво", cat: "other", kcal: 43, p: 0.5, f: 0, c: 3.6, portion: 500 }
  ]),

  mealPlan: {
    splits: { breakfast: 0.25, lunch: 0.35, dinner: 0.30, snack: 0.10 },
    mealOrder: ["breakfast", "lunch", "dinner", "snack"],
    tips: {
      breakfast: [
        "Белок утром снижает голод до обеда. Если нет аппетита — whey или творог.",
        "Углеводы утром — топливо для тренировки. Овсянка или хлеб + фрукт.",
        "Не пей калории: кофе без сахара, вода. Сладкий латте легко съедает 200–300 ккал."
      ],
      lunch: [
        "Половина тарелки — овощи, ладонь белка, кулак углеводов. Так проще держать сытость.",
        "Если тренировка вечером, оставь 30–60 г углеводов на предтренировочный приём.",
        "Сначала белок и овощи, потом углеводы — так проще не переесть."
      ],
      dinner: [
        "Ужин — белок + овощи. Углеводы оставь, если тренировался днём или утром.",
        "Не бойся углеводов вечером: общий калораж важнее времени приёма.",
        "Если голодно перед сном — добавь творог, кефир или греческий йогурт."
      ],
      snack: [
        "Перекус = белок + фрукт. Так проще дожить до следующего приёма без срыва.",
        "Орехи калорийны: 20–25 г достаточно, чтобы не выйти из дефицита.",
        "Whey или греческий йогурт выручают, когда нет времени на готовку."
      ]
    },
    dayThemes: [
      "Классика: мясо или рыба + крупа + овощи",
      "Быстрый день: яйца, творог, хлебцы и фрукты",
      "Рыбный день: лосось или треска + рис + зелень",
      "Растительный день: тофу, чечевица или фасоль + овощи",
      "Бюджетный день: курица, гречка, капуста и морковь",
      "Разнообразие: индейка, киноа, перец и шпинат",
      "Лёгкий день: много овощей, белок и немного углеводов"
    ]
  },

  recipes: [
    /* ---------- завтраки ---------- */
    {
      id: "b-oat-banana", name: "Овсянка с бананом и грецким орехом", cuisine: "home", meal: "breakfast", time: 7,
      tags: ["quick", "vegetarian"],
      items: [{ food: "oats-cooked", grams: 250 }, { food: "banana", grams: 120 }, { food: "walnuts", grams: 15 }],
      steps: ["Свари овсянку на воде — около 250 г готовой.", "Нарежь банан кружками и добавь к овсянке.", "Посыпь грецким орехом. Сахара не нужно: сладости банана хватит."],
      tip: "Если тренировка утром, добавь 10 г мёда — это быстрые углеводы."
    },
    {
      id: "b-cottage-apple", name: "Творог с яблоком и мёдом", cuisine: "home", meal: "breakfast", time: 5,
      tags: ["quick", "high-protein", "vegetarian"],
      items: [{ food: "cottage-2", grams: 180 }, { food: "apple", grams: 150 }, { food: "honey", grams: 10 }, { food: "walnuts", grams: 10 }],
      steps: ["Выложи творог в миску.", "Нарежь яблоко кубиками, добавь мёд и орехи.", "Перемешай. Если творог сухой — добавь 2 ст. л. кефира."],
      tip: "Для большей сытости оставь кожуру яблока — в ней клетчатка."
    },
    {
      id: "b-syrniki", name: "Ленивые сырники с яблоком", cuisine: "home", meal: "breakfast", time: 20,
      tags: ["high-protein", "vegetarian"],
      items: [{ food: "cottage-2", grams: 180 }, { food: "egg", grams: 50 }, { food: "oats-dry", grams: 30 }, { food: "apple", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Смешай творог, яйцо и овсяные хлопья.", "Добавь тёртое яблоко и дай постоять 5 минут.", "Сформируй сырники и обжарь на оливковом масле по 3–4 минуты с каждой стороны."],
      tip: "Подавай с греческим йогуртом вместо сметаны — больше белка."
    },
    {
      id: "b-oat-peanut", name: "Овсянка с яблоком и арахисовой пастой", cuisine: "budget", meal: "breakfast", time: 5,
      tags: ["quick", "budget", "vegetarian"],
      items: [{ food: "oats-cooked", grams: 250 }, { food: "apple", grams: 150 }, { food: "peanut-butter", grams: 15 }],
      steps: ["Свари овсянку на воде.", "Добавь нарезанное яблоко и арахисовую пасту.", "Перемешай. При желании добавь корицу."],
      tip: "Арахисовая паста калорийна — 15 г достаточно для вкуса и сытости."
    },
    {
      id: "b-yogurt-berries", name: "Йогурт с ягодами и миндалём", cuisine: "mediterranean", meal: "breakfast", time: 3,
      tags: ["quick", "high-protein", "vegetarian"],
      items: [{ food: "greek-2", grams: 170 }, { food: "blueberry", grams: 100 }, { food: "almonds", grams: 15 }, { food: "honey", grams: 10 }],
      steps: ["Выложи греческий йогурт в миску.", "Добавь ягоды, миндаль и мёд.", "Перемешай непосредственно перед едой."],
      tip: "Замороженные ягоды не хуже свежих — дай им немного оттаять."
    },
    {
      id: "b-egg-spinach", name: "Омлет со шпинатом и фетой", cuisine: "caucasus", meal: "breakfast", time: 12,
      tags: ["high-protein", "low-carb", "vegetarian"],
      items: [{ food: "egg", grams: 100 }, { food: "spinach", grams: 80 }, { food: "feta", grams: 30 }, { food: "tomato", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Разогрей сковороду с оливковым маслом.", "Обжарь шпинат и томат 2–3 минуты.", "Залей яйцами, посыпь фетой и готовь под крышкой 3–4 минуты."],
      tip: "Соль добавляй в конце — фета уже солёная."
    },
    {
      id: "b-shakshuka", name: "Шакшука с цельнозерновым хлебом", cuisine: "east", meal: "breakfast", time: 20,
      tags: ["vegetarian", "fiber"],
      items: [{ food: "egg", grams: 100 }, { food: "tomato", grams: 150 }, { food: "pepper", grams: 100 }, { food: "onion", grams: 50 }, { food: "olive-oil", grams: 5 }, { food: "bread-ww", grams: 40 }],
      steps: ["Обжарь лук и перец на оливковом масле.", "Добавь томаты и туши 7–8 минут.", "Сделай лунки, вбей яйца, накрой крышкой и готовь 5 минут.", "Подавай с цельнозерновым хлебом."],
      tip: "Любишь острее — добавь щепотку паприки или чили."
    },
    {
      id: "b-rice-egg", name: "Рис с яйцом и овощами", cuisine: "east", meal: "breakfast", time: 15,
      tags: ["quick", "budget"],
      items: [{ food: "rice-white", grams: 150 }, { food: "egg", grams: 100 }, { food: "peas", grams: 50 }, { food: "carrot", grams: 50 }, { food: "olive-oil", grams: 5 }],
      steps: ["Разогрей масло, обжарь морковь и горошек 3 минуты.", "Добавь рис и прогрей.", "Вбей яйца, быстро перемешай и готовь 2 минуты."],
      tip: "Идеально для остатков риса с вечера."
    },
    {
      id: "b-kefir-cucumber", name: "Кефир с огурцом и ржаным хлебом", cuisine: "central-asia", meal: "breakfast", time: 3,
      tags: ["quick", "budget", "vegetarian"],
      items: [{ food: "kefir", grams: 250 }, { food: "cucumber", grams: 100 }, { food: "bread-rye", grams: 30 }],
      steps: ["Нарежь огурец.", "Залей кефиром, добавь зелень и щепотку соли.", "Подавай с ржаным хлебом."],
      tip: "В жару это ещё и отличный способ добрать жидкость."
    },
    {
      id: "b-cottage-banana", name: "Творог с бананом и овсянкой", cuisine: "budget", meal: "breakfast", time: 5,
      tags: ["quick", "high-protein", "budget"],
      items: [{ food: "cottage-1", grams: 180 }, { food: "banana", grams: 120 }, { food: "oats-dry", grams: 30 }],
      steps: ["Смешай творог и овсяные хлопья.", "Добавь нарезанный банан.", "Дай постоять 5 минут, чтобы хлопья размягчились."],
      tip: "Можно собрать вечером в контейнер — утром готово."
    },
    {
      id: "b-omelet-cheese", name: "Омлет с моцареллой и шпинатом", cuisine: "caucasus", meal: "breakfast", time: 12,
      tags: ["high-protein", "low-carb", "vegetarian"],
      items: [{ food: "egg", grams: 100 }, { food: "mozzarella", grams: 40 }, { food: "spinach", grams: 80 }, { food: "tomato", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Обжарь шпинат и томат на масле.", "Залей яйцами, посыпь моцареллой.", "Готовь под крышкой 4–5 минут."],
      tip: "Не пересушивай: омлет должен остаться мягким."
    },

    /* ---------- основные блюда ---------- */
    {
      id: "l-plov", name: "Плов с говядиной", cuisine: "central-asia", meal: "lunch", time: 45,
      tags: ["high-protein", "batch"],
      items: [{ food: "rice-white", grams: 200 }, { food: "beef-ground", grams: 150 }, { food: "carrot", grams: 100 }, { food: "onion", grams: 50 }, { food: "olive-oil", grams: 10 }],
      steps: ["Обжарь говядину на оливковом масле до румяности.", "Добавь лук и морковь, готовь 5 минут.", "Всыпь рис, добавь воды на 1–1,5 см выше риса, посоли и туши под крышкой 20–25 минут."],
      tip: "Классический плов жирнее — здесь масло ограничено. Добавь зиру и барбарис для аромата."
    },
    {
      id: "l-shurpa", name: "Шурпа с говядиной", cuisine: "central-asia", meal: "lunch", time: 40,
      tags: ["high-protein", "soup"],
      items: [{ food: "beef-ground", grams: 150 }, { food: "potato", grams: 200 }, { food: "carrot", grams: 100 }, { food: "onion", grams: 50 }, { food: "tomato", grams: 100 }, { food: "pepper", grams: 50 }],
      steps: ["Обжарь мясо с луком.", "Добавь картофель, морковь, томат и перец.", "Залей водой и вари 25–30 минут до готовности овощей.", "Посыпь зеленью перед подачей."],
      tip: "Шурпа — это и суп, и второе: овощи дают много объёма и сытости."
    },
    {
      id: "l-lagman", name: "Лагман с говядиной", cuisine: "central-asia", meal: "lunch", time: 35,
      tags: ["high-protein", "fiber"],
      items: [{ food: "pasta", grams: 200 }, { food: "beef-steak", grams: 150 }, { food: "pepper", grams: 100 }, { food: "tomato", grams: 100 }, { food: "onion", grams: 50 }, { food: "carrot", grams: 50 }, { food: "olive-oil", grams: 5 }],
      steps: ["Обжарь говядину на масле.", "Добавь овощи и туши 10 минут.", "Отвари пасту отдельно.", "Смешай пасту с соусом, добавь зелень."],
      tip: "Если любишь острее — добавь немного чили или чёрного перца."
    },
    {
      id: "l-tefteli", name: "Тефтели с рисом и томатами", cuisine: "central-asia", meal: "lunch", time: 35,
      tags: ["high-protein", "batch"],
      items: [{ food: "beef-ground", grams: 150 }, { food: "rice-white", grams: 150 }, { food: "onion", grams: 50 }, { food: "egg", grams: 50 }, { food: "tomato", grams: 100 }],
      steps: ["Смешай фарш, лук и яйцо, сформируй тефтели.", "Обжарь до корочки.", "Добавь рис, томат и воду, туши 20 минут."],
      tip: "Тефтели удобно готовить на 2–3 порции и хранить в холодильнике."
    },
    {
      id: "l-chicken-rice-carrot", name: "Курица с рисом и морковью", cuisine: "central-asia", meal: "lunch", time: 30,
      tags: ["high-protein", "budget"],
      items: [{ food: "chicken-thigh", grams: 150 }, { food: "rice-white", grams: 180 }, { food: "carrot", grams: 100 }, { food: "onion", grams: 50 }, { food: "olive-oil", grams: 5 }],
      steps: ["Обжарь курицу с луком.", "Добавь морковь и рис.", "Залей водой и туши под крышкой 20 минут."],
      tip: "Куриное бедро сочнее грудки — на дефиците это помогает не срываться."
    },
    {
      id: "l-lentil-soup", name: "Чечевичный суп с овощами", cuisine: "central-asia", meal: "lunch", time: 30,
      tags: ["vegetarian", "fiber", "budget"],
      items: [{ food: "lentils", grams: 150 }, { food: "carrot", grams: 80 }, { food: "onion", grams: 50 }, { food: "tomato", grams: 100 }, { food: "potato", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Промой чечевицу.", "Обжарь лук и морковь на масле.", "Добавь чечевицу, картофель, томат и воду.", "Вари 20–25 минут до мягкости."],
      tip: "Чечевица даёт белок и клетчатку — суп хорошо насыщает."
    },
    {
      id: "l-achichuk", name: "Салат ачичук", cuisine: "central-asia", meal: "lunch", time: 7,
      tags: ["quick", "vegetarian", "low-carb"],
      items: [{ food: "tomato", grams: 150 }, { food: "cucumber", grams: 150 }, { food: "onion", grams: 30 }, { food: "pepper", grams: 50 }, { food: "olive-oil", grams: 5 }],
      steps: ["Нарежь томаты, огурцы и перец.", "Добавь тонко нарезанный лук.", "Заправь маслом, посоли и поперчи."],
      tip: "Подавай к плову или шашлыку вместо тяжёлого соуса."
    },
    {
      id: "l-shashlik", name: "Шашлык из говядины с овощами", cuisine: "caucasus", meal: "lunch", time: 25,
      tags: ["high-protein", "low-carb"],
      items: [{ food: "beef-steak", grams: 180 }, { food: "pepper", grams: 100 }, { food: "tomato", grams: 100 }, { food: "onion", grams: 50 }, { food: "olive-oil", grams: 5 }],
      steps: ["Нарежь мясо кусочками, посоли и поперчи.", "Обжарь на сковороде-гриль или запеки 12–15 минут.", "Подавай с овощами и луком."],
      tip: "Не маринуй в майонезе — кефир или лук дадут мягкость без лишних калорий."
    },
    {
      id: "l-lobio", name: "Лобио из красной фасоли", cuisine: "caucasus", meal: "lunch", time: 20,
      tags: ["vegetarian", "fiber", "budget"],
      items: [{ food: "kidney-beans", grams: 200 }, { food: "onion", grams: 50 }, { food: "walnuts", grams: 15 }, { food: "olive-oil", grams: 5 }, { food: "tomato", grams: 100 }],
      steps: ["Обжарь лук на масле.", "Добавь фасоль и томат, туши 10 минут.", "Измельчи орехи и добавь в блюдо.", "Заправь зеленью."],
      tip: "Лобио вкуснее на следующий день — можно готовить заранее."
    },
    {
      id: "l-ajapsandali", name: "Аджапсандали", cuisine: "caucasus", meal: "lunch", time: 30,
      tags: ["vegetarian", "fiber", "low-carb"],
      items: [{ food: "eggplant", grams: 200 }, { food: "pepper", grams: 100 }, { food: "tomato", grams: 150 }, { food: "onion", grams: 50 }, { food: "olive-oil", grams: 10 }],
      steps: ["Нарежь баклажан, перец, томат и лук.", "Обжарь баклажан до мягкости.", "Добавь остальные овощи и туши 15 минут.", "Посыпь зеленью."],
      tip: "Баклажан впитывает много масла — сначала обжарь его на сухой сковороде."
    },
    {
      id: "l-satsivi", name: "Курица в ореховом соусе", cuisine: "caucasus", meal: "lunch", time: 30,
      tags: ["high-protein", "low-carb"],
      items: [{ food: "chicken-breast", grams: 180 }, { food: "walnuts", grams: 20 }, { food: "kefir", grams: 100 }, { food: "onion", grams: 50 }],
      steps: ["Отвари или запеки курицу.", "Измельчи орехи, смешай с кефиром и луком.", "Прогрей соус, не доводя до кипения.", "Залей курицу соусом."],
      tip: "Классическое сациви жирнее — здесь вместо сливок кефир."
    },
    {
      id: "l-greek-salad", name: "Греческий салат с фетой", cuisine: "mediterranean", meal: "lunch", time: 10,
      tags: ["quick", "vegetarian", "low-carb"],
      items: [{ food: "tomato", grams: 150 }, { food: "cucumber", grams: 150 }, { food: "pepper", grams: 100 }, { food: "feta", grams: 40 }, { food: "olive-oil", grams: 10 }],
      steps: ["Нарежь томаты, огурцы и перец.", "Добавь фету кубиками.", "Заправь оливковым маслом и орегано."],
      tip: "Салат — не полноценный приём пищи: добавь курицу или рыбу, если голодно."
    },
    {
      id: "l-chicken-couscous", name: "Курица с кускусом и овощами", cuisine: "mediterranean", meal: "lunch", time: 25,
      tags: ["high-protein", "quick"],
      items: [{ food: "chicken-breast", grams: 180 }, { food: "couscous", grams: 180 }, { food: "zucchini", grams: 150 }, { food: "tomato", grams: 100 }, { food: "olive-oil", grams: 10 }],
      steps: ["Залей кускус кипятком по инструкции.", "Обжарь курицу с овощами на масле.", "Смешай кускус с курицей и овощами."],
      tip: "Кускус готовится за 5 минут — хороший вариант для буднего дня."
    },
    {
      id: "l-tuna-beans", name: "Тунец с белой фасолью", cuisine: "mediterranean", meal: "lunch", time: 10,
      tags: ["quick", "high-protein", "budget"],
      items: [{ food: "tuna", grams: 120 }, { food: "white-beans", grams: 150 }, { food: "tomato", grams: 100 }, { food: "onion", grams: 30 }, { food: "olive-oil", grams: 5 }],
      steps: ["Промой фасоль.", "Смешай с тунцом, томатом и луком.", "Заправь маслом и лимонным соком."],
      tip: "Если нет лимона — добавь щепотку чёрного перца и зелень."
    },
    {
      id: "l-teriyaki", name: "Курица терияки с рисом и брокколи", cuisine: "east", meal: "lunch", time: 25,
      tags: ["high-protein", "quick"],
      items: [{ food: "chicken-thigh", grams: 180 }, { food: "rice-white", grams: 180 }, { food: "broccoli", grams: 150 }, { food: "honey", grams: 10 }, { food: "onion", grams: 30 }, { food: "olive-oil", grams: 5 }],
      steps: ["Обжарь курицу на масле.", "Добавь мёд, лук и немного воды, туши 5 минут.", "Отвари рис и брокколи.", "Подавай курицу с рисом и брокколи."],
      tip: "Вместо готового соуса терияки — мёд, вода и немного соли: меньше сахара."
    },
    {
      id: "l-tofu-rice", name: "Тофу с рисом и овощами", cuisine: "east", meal: "lunch", time: 20,
      tags: ["vegetarian", "high-protein"],
      items: [{ food: "tofu", grams: 200 }, { food: "rice-white", grams: 180 }, { food: "broccoli", grams: 150 }, { food: "pepper", grams: 100 }, { food: "onion", grams: 30 }, { food: "olive-oil", grams: 10 }],
      steps: ["Обжарь тофу до корочки.", "Добавь овощи и готовь 5 минут.", "Подавай с рисом."],
      tip: "Тофу любит специи: добавь паприку, чеснок или чёрный перец."
    },
    {
      id: "l-salmon-rice", name: "Лосось с рисом и огурцом", cuisine: "east", meal: "lunch", time: 20,
      tags: ["high-protein", "omega-3"],
      items: [{ food: "salmon", grams: 150 }, { food: "rice-white", grams: 180 }, { food: "cucumber", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Запеки лосось 12–15 минут при 200 °C.", "Отвари рис.", "Нарежь огурец, подавай с маслом и лимоном."],
      tip: "Лосось можно заменить треской — будет меньше жиров и калорий."
    },
    {
      id: "l-chicken-buckwheat", name: "Курица с гречкой и грибами", cuisine: "home", meal: "lunch", time: 25,
      tags: ["high-protein", "fiber"],
      items: [{ food: "chicken-breast", grams: 180 }, { food: "buckwheat", grams: 200 }, { food: "mushrooms", grams: 100 }, { food: "onion", grams: 50 }, { food: "olive-oil", grams: 5 }],
      steps: ["Отвари гречку.", "Обжарь курицу с луком и грибами.", "Смешай и прогрейте 1–2 минуты."],
      tip: "Гречка — один из самых сытных гарниров на дефиците."
    },
    {
      id: "l-borsch", name: "Ленивые щи с говядиной", cuisine: "home", meal: "lunch", time: 40,
      tags: ["high-protein", "soup", "fiber"],
      items: [{ food: "beef-ground", grams: 120 }, { food: "cabbage", grams: 150 }, { food: "potato", grams: 150 }, { food: "carrot", grams: 80 }, { food: "onion", grams: 50 }, { food: "tomato", grams: 100 }, { food: "sour-cream", grams: 20 }],
      steps: ["Обжарь мясо с луком и морковью.", "Добавь капусту, картофель, томат и воду.", "Вари 25 минут.", "Подавай со сметаной."],
      tip: "Чем больше капусты, тем больше объём порции при тех же калориях."
    },
    {
      id: "l-chicken-potato", name: "Курица с картофелем и квашеной капустой", cuisine: "home", meal: "lunch", time: 30,
      tags: ["high-protein", "budget"],
      items: [{ food: "chicken-breast", grams: 180 }, { food: "potato", grams: 250 }, { food: "sauerkraut", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Отвари или запеки картофель.", "Обжарь курицу на масле.", "Подавай с квашеной капустой."],
      tip: "Квашеная капуста добавляет вкус и probiotics без лишних калорий."
    },
    {
      id: "l-cod-veg", name: "Треска с брокколи и морковью", cuisine: "home", meal: "lunch", time: 20,
      tags: ["high-protein", "low-carb", "lean"],
      items: [{ food: "cod", grams: 180 }, { food: "broccoli", grams: 200 }, { food: "carrot", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Запеки треску 15 минут при 200 °C.", "Приготовь брокколи и морковь на пару.", "Сбрызни маслом и лимоном."],
      tip: "Треска — один из самых лёгких источников белка."
    },
    {
      id: "l-bean-rice", name: "Фасоль с рисом и овощами", cuisine: "budget", meal: "lunch", time: 20,
      tags: ["vegetarian", "fiber", "budget"],
      items: [{ food: "kidney-beans", grams: 150 }, { food: "rice-white", grams: 180 }, { food: "carrot", grams: 80 }, { food: "onion", grams: 50 }, { food: "tomato", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Отвари рис.", "Обжарь лук и морковь.", "Добавь фасоль и томат, прогрейте.", "Смешай с рисом."],
      tip: "Фасоль + рис — недорогой источник растительного белка."
    },
    {
      id: "l-egg-potato", name: "Яйца с картофелем и огурцом", cuisine: "budget", meal: "lunch", time: 20,
      tags: ["quick", "budget", "vegetarian"],
      items: [{ food: "egg", grams: 100 }, { food: "potato", grams: 250 }, { food: "cucumber", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Отвари картофель.", "Свари яйца.", "Подавай с огурцом и маслом."],
      tip: "Простой обед, который не требует много времени и денег."
    },
    {
      id: "l-tuna-rice", name: "Тунец с рисом и огурцом", cuisine: "budget", meal: "lunch", time: 15,
      tags: ["quick", "high-protein", "budget"],
      items: [{ food: "tuna", grams: 120 }, { food: "rice-white", grams: 180 }, { food: "cucumber", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Отвари рис.", "Смешай тунец с нарезанным огурцом.", "Подавай с рисом и маслом."],
      tip: "Банка тунца в воде — дешёвый и удобный белок."
    },
    {
      id: "l-chicken-cabbage", name: "Курица с капустой и морковью", cuisine: "budget", meal: "lunch", time: 20,
      tags: ["high-protein", "low-carb", "budget"],
      items: [{ food: "chicken-breast", grams: 180 }, { food: "cabbage", grams: 200 }, { food: "carrot", grams: 100 }, { food: "onion", grams: 50 }, { food: "olive-oil", grams: 5 }],
      steps: ["Обжарь курицу на масле.", "Добавь капусту, морковь и лук.", "Туши 10–12 минут."],
      tip: "Овощи можно тушить в воде — масло добавь в конце для аромата."
    },
    {
      id: "l-omelet-cheese", name: "Омлет с моцареллой и шпинатом", cuisine: "caucasus", meal: "lunch", time: 12,
      tags: ["high-protein", "low-carb", "vegetarian"],
      items: [{ food: "egg", grams: 100 }, { food: "mozzarella", grams: 40 }, { food: "spinach", grams: 80 }, { food: "tomato", grams: 100 }, { food: "olive-oil", grams: 5 }],
      steps: ["Обжарь шпинат и томат на масле.", "Залей яйцами, посыпь моцареллой.", "Готовь под крышкой 4–5 минут."],
      tip: "Подходит и на завтрак, и на лёгкий ужин."
    },

    /* ---------- перекусы ---------- */
    {
      id: "s-kefir-cucumber", name: "Кефир с огурцом", cuisine: "home", meal: "snack", time: 3,
      tags: ["quick", "budget", "vegetarian"],
      items: [{ food: "kefir", grams: 250 }, { food: "cucumber", grams: 100 }],
      steps: ["Нарежь огурец.", "Залей кефиром, добавь зелень и щепотку соли."],
      tip: "Освежает и помогает добрать жидкость."
    },
    {
      id: "s-cottage-apple", name: "Творог с яблоком", cuisine: "home", meal: "snack", time: 5,
      tags: ["quick", "high-protein", "vegetarian"],
      items: [{ food: "cottage-2", grams: 150 }, { food: "apple", grams: 150 }, { food: "honey", grams: 5 }],
      steps: ["Нарежь яблоко.", "Смешай с творогом и мёдом."],
      tip: "Если творог сухой — добавь 2 ст. л. кефира."
    },
    {
      id: "s-yogurt-berries", name: "Йогурт с ягодами", cuisine: "mediterranean", meal: "snack", time: 3,
      tags: ["quick", "high-protein", "vegetarian"],
      items: [{ food: "greek-2", grams: 170 }, { food: "blueberry", grams: 100 }, { food: "almonds", grams: 15 }],
      steps: ["Выложи йогурт.", "Добавь ягоды и миндаль."],
      tip: "Без мёда — меньше сахара, ягоды дадут сладость."
    },
    {
      id: "s-hummus-veg", name: "Хумус с овощами и хлебом", cuisine: "east", meal: "snack", time: 5,
      tags: ["vegetarian", "fiber", "quick"],
      items: [{ food: "hummus", grams: 50 }, { food: "cucumber", grams: 100 }, { food: "carrot", grams: 80 }, { food: "bread-ww", grams: 30 }],
      steps: ["Нарежь овощи соломкой.", "Подавай с хумусом и цельнозерновым хлебом."],
      tip: "Хумус содержит кунжут — учитывай при аллергии."
    },
    {
      id: "s-tuna-cucumber", name: "Тунец с огурцом и хлебом", cuisine: "budget", meal: "snack", time: 5,
      tags: ["quick", "high-protein", "budget"],
      items: [{ food: "tuna", grams: 100 }, { food: "cucumber", grams: 100 }, { food: "bread-rye", grams: 30 }],
      steps: ["Нарежь огурец.", "Смешай с тунцом.", "Подавай с ржаным хлебом."],
      tip: "Если тунец сухой — добавь немного кефира или лимонного сока."
    },
    {
      id: "s-nuts-fruit", name: "Яблоко с грецким орехом", cuisine: "home", meal: "snack", time: 2,
      tags: ["quick", "vegetarian", "budget"],
      items: [{ food: "apple", grams: 150 }, { food: "walnuts", grams: 15 }],
      steps: ["Нарежь яблоко.", "Добавь грецкий орех."],
      tip: "Орехи калорийны — 15 г достаточно."
    },
    {
      id: "s-cheese-fruit", name: "Фета с томатами и огурцом", cuisine: "caucasus", meal: "snack", time: 5,
      tags: ["quick", "vegetarian", "low-carb"],
      items: [{ food: "feta", grams: 30 }, { food: "tomato", grams: 100 }, { food: "cucumber", grams: 100 }],
      steps: ["Нарежь томат и огурец.", "Добавь фету."],
      tip: "Фета солёная — соль не нужна."
    },
    {
      id: "s-cottage-banana", name: "Творог с бананом", cuisine: "budget", meal: "snack", time: 3,
      tags: ["quick", "high-protein", "budget"],
      items: [{ food: "cottage-1", grams: 150 }, { food: "banana", grams: 120 }],
      steps: ["Смешай творог с нарезанным бананом."],
      tip: "Отличный перекус после тренировки."
    }
  ],

  menus: [
    /* ---------- Средняя Азия ---------- */
    {
      id: "ca-plov", cuisine: "central-asia", name: "Плов-день", desc: "Плов, шурпа и ачичук — сытно и по-домашнему.",
      meals: { breakfast: "b-cottage-banana", lunch: "l-plov", dinner: "l-shurpa", snack: "l-achichuk" }
    },
    {
      id: "ca-lagman", cuisine: "central-asia", name: "Лагман-день", desc: "Лагман, тефтели и кефир — классика на каждый день.",
      meals: { breakfast: "b-oat-banana", lunch: "l-lagman", dinner: "l-tefteli", snack: "s-kefir-cucumber" }
    },
    {
      id: "ca-chicken", cuisine: "central-asia", name: "Курица и рис", desc: "Курица с рисом, чечевичный суп и овощной салат.",
      meals: { breakfast: "b-syrniki", lunch: "l-chicken-rice-carrot", dinner: "l-lentil-soup", snack: "l-achichuk" }
    },
    {
      id: "ca-light", cuisine: "central-asia", name: "Лёгкий среднеазиатский", desc: "Меньше калорий, больше овощей и белка.",
      meals: { breakfast: "b-oat-peanut", lunch: "l-lentil-soup", dinner: "l-cod-veg", snack: "s-hummus-veg" }
    },

    /* ---------- СНГ ---------- */
    {
      id: "home-classic", cuisine: "home", name: "Домашний классический", desc: "Щи, гречка с курицей и кефир — привычный день.",
      meals: { breakfast: "b-oat-banana", lunch: "l-borsch", dinner: "l-chicken-buckwheat", snack: "s-kefir-cucumber" }
    },
    {
      id: "home-quick", cuisine: "home", name: "Быстрый домашний", desc: "Сырники, курица с картофелем и треска с овощами.",
      meals: { breakfast: "b-syrniki", lunch: "l-chicken-potato", dinner: "l-cod-veg", snack: "s-cottage-apple" }
    },
    {
      id: "home-budget", cuisine: "home", name: "Домашний бюджет", desc: "Недорого, просто и с высоким белком.",
      meals: { breakfast: "b-oat-peanut", lunch: "l-chicken-cabbage", dinner: "l-bean-rice", snack: "s-kefir-cucumber" }
    },
    {
      id: "home-light", cuisine: "home", name: "Лёгкий домашний", desc: "Творог, треска и омлет — меньше углеводов.",
      meals: { breakfast: "b-cottage-apple", lunch: "l-cod-veg", dinner: "l-omelet-cheese", snack: "s-yogurt-berries" }
    },

    /* ---------- Кавказ ---------- */
    {
      id: "cau-shashlik", cuisine: "caucasus", name: "Шашлык-день", desc: "Шашлык, лобио и овощи — много белка и клетчатки.",
      meals: { breakfast: "b-egg-spinach", lunch: "l-shashlik", dinner: "l-lobio", snack: "s-cheese-fruit" }
    },
    {
      id: "cau-ajapsandali", cuisine: "caucasus", name: "Аджапсандали", desc: "Овощи, курица в ореховом соусе и фрукты.",
      meals: { breakfast: "b-yogurt-berries", lunch: "l-ajapsandali", dinner: "l-satsivi", snack: "s-nuts-fruit" }
    },
    {
      id: "cau-lobio", cuisine: "caucasus", name: "Лобио и курица", desc: "Фасоль, курица с кускусом и йогурт.",
      meals: { breakfast: "b-omelet-cheese", lunch: "l-lobio", dinner: "l-chicken-couscous", snack: "s-yogurt-berries" }
    },
    {
      id: "cau-light", cuisine: "caucasus", name: "Лёгкий кавказский", desc: "Омлет, греческий салат и шашлык.",
      meals: { breakfast: "b-egg-spinach", lunch: "l-greek-salad", dinner: "l-shashlik", snack: "s-cheese-fruit" }
    },

    /* ---------- Восточная Азия ---------- */
    {
      id: "east-teriyaki", cuisine: "east", name: "Терияки-день", desc: "Курица терияки, рис с яйцом и тофу.",
      meals: { breakfast: "b-rice-egg", lunch: "l-teriyaki", dinner: "l-tofu-rice", snack: "s-hummus-veg" }
    },
    {
      id: "east-fish", cuisine: "east", name: "Рыбный восточный", desc: "Лосось, тофу и ягоды — лёгкий и белковый день.",
      meals: { breakfast: "b-oat-banana", lunch: "l-salmon-rice", dinner: "l-tofu-rice", snack: "s-nuts-fruit" }
    },
    {
      id: "east-chicken", cuisine: "east", name: "Курица и гречка", desc: "Шакшука, курица с гречкой и лагман.",
      meals: { breakfast: "b-shakshuka", lunch: "l-chicken-buckwheat", dinner: "l-lagman", snack: "s-yogurt-berries" }
    },
    {
      id: "east-light", cuisine: "east", name: "Лёгкий восточный", desc: "Йогурт, тофу и лосось — меньше калорий.",
      meals: { breakfast: "b-yogurt-berries", lunch: "l-tofu-rice", dinner: "l-salmon-rice", snack: "s-hummus-veg" }
    },

    /* ---------- Средиземноморье ---------- */
    {
      id: "med-greek", cuisine: "mediterranean", name: "Греческий день", desc: "Кускус с курицей, греческий салат и хумус.",
      meals: { breakfast: "b-yogurt-berries", lunch: "l-chicken-couscous", dinner: "l-greek-salad", snack: "s-hummus-veg" }
    },
    {
      id: "med-couscous", cuisine: "mediterranean", name: "Кускус и курица", desc: "Омлет, кускус и чечевичный суп.",
      meals: { breakfast: "b-omelet-cheese", lunch: "l-chicken-couscous", dinner: "l-lentil-soup", snack: "s-yogurt-berries" }
    },
    {
      id: "med-fish", cuisine: "mediterranean", name: "Рыбный средиземноморский", desc: "Тунец с фасолью, лосось и фрукты.",
      meals: { breakfast: "b-egg-spinach", lunch: "l-tuna-beans", dinner: "l-salmon-rice", snack: "s-nuts-fruit" }
    },
    {
      id: "med-light", cuisine: "mediterranean", name: "Лёгкий средиземноморский", desc: "Йогурт, салат и треска с овощами.",
      meals: { breakfast: "b-yogurt-berries", lunch: "l-greek-salad", dinner: "l-cod-veg", snack: "s-hummus-veg" }
    },

    /* ---------- Бюджет ---------- */
    {
      id: "budget-sport", cuisine: "budget", name: "Спортивный бюджет", desc: "Курица, фасоль и тунец — максимум белка за минимум денег.",
      meals: { breakfast: "b-oat-peanut", lunch: "l-chicken-cabbage", dinner: "l-bean-rice", snack: "s-tuna-cucumber" }
    },
    {
      id: "budget-eggs", cuisine: "budget", name: "Яйца и картофель", desc: "Омлет, яйца с картофелем и курица с гречкой.",
      meals: { breakfast: "b-omelet-cheese", lunch: "l-egg-potato", dinner: "l-chicken-buckwheat", snack: "s-cottage-apple" }
    },
    {
      id: "budget-tuna", cuisine: "budget", name: "Тунец и рис", desc: "Дешёвый белок, рис и капуста.",
      meals: { breakfast: "b-oat-banana", lunch: "l-tuna-rice", dinner: "l-chicken-cabbage", snack: "s-kefir-cucumber" }
    },
    {
      id: "budget-plant", cuisine: "budget", name: "Растительный бюджет", desc: "Фасоль, тофу и хумус — без мяса.",
      meals: { breakfast: "b-oat-peanut", lunch: "l-bean-rice", dinner: "l-tofu-rice", snack: "s-hummus-veg" }
    }
  ],

  exerciseGroups: ["Все", "Грудь", "Спина", "Ноги", "Плечи", "Руки", "Пресс", "Кардио"],

  exercises: [
    { id: "bench", name: "Жим штанги лёжа", group: "Грудь", eq: "Штанга" },
    { id: "db-bench", name: "Жим гантелей лёжа", group: "Грудь", eq: "Гантели" },
    { id: "machine-press", name: "Жим в тренажёре", group: "Грудь", eq: "Тренажёр" },
    { id: "fly", name: "Разводка гантелей", group: "Грудь", eq: "Гантели" },
    { id: "dips", name: "Отжимания на брусьях", group: "Грудь", eq: "Своё тело" },
    { id: "crossover", name: "Кроссовер", group: "Грудь", eq: "Блок" },
    { id: "smith-press", name: "Жим Смита", group: "Грудь", eq: "Тренажёр" },
    { id: "row", name: "Тяга штанги в наклоне", group: "Спина", eq: "Штанга" },
    { id: "lat-pulldown", name: "Тяга верхнего блока", group: "Спина", eq: "Блок" },
    { id: "low-row", name: "Тяга нижнего блока", group: "Спина", eq: "Блок" },
    { id: "pullup", name: "Подтягивания", group: "Спина", eq: "Своё тело" },
    { id: "db-row", name: "Тяга гантели одной рукой", group: "Спина", eq: "Гантели" },
    { id: "hyper", name: "Гиперэкстензия", group: "Спина", eq: "Своё тело" },
    { id: "tbar", name: "Тяга Т-грифа", group: "Спина", eq: "Штанга" },
    { id: "pullover", name: "Пуловер", group: "Спина", eq: "Блок" },
    { id: "deadlift", name: "Становая тяга", group: "Ноги", eq: "Штанга" },
    { id: "rdl", name: "Румынская тяга", group: "Ноги", eq: "Штанга" },
    { id: "squat", name: "Приседания со штангой", group: "Ноги", eq: "Штанга" },
    { id: "leg-press", name: "Жим ногами", group: "Ноги", eq: "Тренажёр" },
    { id: "bulgarian", name: "Болгарский выпад", group: "Ноги", eq: "Гантели" },
    { id: "leg-ext", name: "Разгибания ног", group: "Ноги", eq: "Тренажёр" },
    { id: "leg-curl", name: "Сгибания ног лёжа", group: "Ноги", eq: "Тренажёр" },
    { id: "leg-curl-seat", name: "Сгибания ног сидя", group: "Ноги", eq: "Тренажёр" },
    { id: "calf", name: "Подъём на носки стоя", group: "Ноги", eq: "Тренажёр" },
    { id: "hip-thrust", name: "Ягодичный мост", group: "Ноги", eq: "Штанга" },
    { id: "abduction", name: "Отведение ноги в кроссовере", group: "Ноги", eq: "Блок" },
    { id: "ohp", name: "Жим гантелей сидя", group: "Плечи", eq: "Гантели" },
    { id: "lateral", name: "Махи гантелями в стороны", group: "Плечи", eq: "Гантели" },
    { id: "cable-lateral", name: "Махи в кроссовере", group: "Плечи", eq: "Блок" },
    { id: "rear-fly", name: "Обратная разводка", group: "Плечи", eq: "Тренажёр" },
    { id: "facepull", name: "Фейс-пулл", group: "Плечи", eq: "Блок" },
    { id: "arnold", name: "Жим Арнольда", group: "Плечи", eq: "Гантели" },
    { id: "shrug", name: "Шраги", group: "Плечи", eq: "Гантели" },
    { id: "bb-curl", name: "Подъём штанги на бицепс", group: "Руки", eq: "Штанга" },
    { id: "db-curl", name: "Подъём гантелей на бицепс", group: "Руки", eq: "Гантели" },
    { id: "hammer", name: "Молотковые сгибания", group: "Руки", eq: "Гантели" },
    { id: "preacher", name: "Сгибания на скамье Скотта", group: "Руки", eq: "Штанга" },
    { id: "skull", name: "Французский жим", group: "Руки", eq: "Штанга" },
    { id: "pushdown", name: "Разгибания на блоке", group: "Руки", eq: "Блок" },
    { id: "oh-extension", name: "Разгибания гантели из-за головы", group: "Руки", eq: "Гантели" },
    { id: "close-bench", name: "Жим лёжа узким хватом", group: "Руки", eq: "Штанга" },
    { id: "kickback", name: "Кикбэк", group: "Руки", eq: "Гантели" },
    { id: "plank", name: "Планка", group: "Пресс", eq: "Своё тело" },
    { id: "crunch", name: "Скручивания", group: "Пресс", eq: "Своё тело" },
    { id: "leg-raise", name: "Подъём ног в висе", group: "Пресс", eq: "Своё тело" },
    { id: "cable-crunch", name: "Кабельные скручивания", group: "Пресс", eq: "Блок" },
    { id: "side-plank", name: "Боковая планка", group: "Пресс", eq: "Своё тело" },
    { id: "treadmill", name: "Ходьба на дорожке", group: "Кардио", eq: "Кардио" },
    { id: "bike", name: "Велотренажёр", group: "Кардио", eq: "Кардио" },
    { id: "elliptical", name: "Эллипс", group: "Кардио", eq: "Кардио" },
    { id: "rower", name: "Гребной тренажёр", group: "Кардио", eq: "Кардио" },
    { id: "burpee", name: "Бёрпи", group: "Кардио", eq: "Своё тело" },
    { id: "rope", name: "Скакалка", group: "Кардио", eq: "Кардио" }
  ],

  templates: [
    {
      id: "ul4", name: "Upper / Lower 4×",
      days: [
        { id: "ul-a", name: "Upper A", exercises: ["bench", "lat-pulldown", "ohp", "low-row", "pushdown", "bb-curl"] },
        { id: "ul-b", name: "Lower A", exercises: ["squat", "rdl", "leg-press", "leg-curl", "calf", "plank"] },
        { id: "ul-c", name: "Upper B", exercises: ["db-bench", "pullup", "lateral", "row", "skull", "hammer"] },
        { id: "ul-d", name: "Lower B", exercises: ["deadlift", "bulgarian", "leg-ext", "leg-curl-seat", "calf", "crunch"] }
      ]
    },
    {
      id: "fb3", name: "Full Body 3×",
      days: [
        { id: "fb-a", name: "Full Body A", exercises: ["squat", "bench", "lat-pulldown", "ohp", "leg-curl", "plank"] },
        { id: "fb-b", name: "Full Body B", exercises: ["rdl", "db-bench", "low-row", "lateral", "leg-ext", "crunch"] }
      ]
    },
    {
      id: "ppl", name: "Push / Pull / Legs",
      days: [
        { id: "ppl-push", name: "Push", exercises: ["bench", "ohp", "fly", "lateral", "pushdown", "skull"] },
        { id: "ppl-pull", name: "Pull", exercises: ["row", "pullup", "low-row", "rear-fly", "bb-curl", "hammer"] },
        { id: "ppl-legs", name: "Legs", exercises: ["squat", "rdl", "leg-press", "leg-curl", "calf", "crunch"] }
      ]
    }
  ],

  guide: [
    {
      id: "start", title: "С чего начать и чего ждать", icon: "target",
      items: [
        "Две причины сушки: <b>здоровье</b> (плохие анализы, гормоны) и <b>эстетика</b>. Если с анализами всё плохо — сначала к врачу.",
        "Ориентир по жиру — <b>10–20%</b>. Но разница в прогрессе между «нормой» и повышенным % на практике не доказана: не паникуй, если ты выше.",
        "Люди недооценивают масштаб: в примере автора понадобилось <b>~40 фунтов</b>, а не 10–20.",
        "Подросткам агрессивный дефицит <b>не рекомендован</b>."
      ]
    },
    {
      id: "rate", title: "Темп и дефицит", icon: "bolt",
      items: [
        "Темп: <b>1–1,5% массы тела в неделю</b>. 100 кг → примерно 1–1,5 кг в неделю (верхняя граница — агрессивно).",
        "Максимум окисления жира: <b>31–41 ккал на фунт жира в теле в сутки</b> (Alpert). Чем больше жира — тем больше можно урезать.",
        "Умеренный дефицит: <b>~500 ккал/день</b> (~0,45 кг/нед). Агрессивный: <b>~1000+ ккал/день</b> (~0,7+ кг/нед).",
        "Стартуй агрессивно при <b>20–30%+ жира</b>, затем смягчай. Чем ближе к цели — тем меньше жира и тем меньше смысла спешить.",
        "1 фунт жира ≈ <b>3500 ккал</b>. 1 фунт жира в теле даёт примерно <b>10 ккал/день</b> поддержки."
      ],
      tip: "Приложение считает безопасный максимум дефицита по проценту жира и не даст уйти ниже пола калорий."
    },
    {
      id: "macros", title: "Макросы", icon: "pie",
      items: [
        "Порядок: <b>белок → жиры → углеводы</b>.",
        "Белок: <b>0,8 г/фунт</b> массы тела (≈1,6 г/кг). При агрессивном дефиците — до <b>1 г/фунт</b> (≈2,2 г/кг).",
        "Жиры: <b>0,3–0,5 г/фунт</b> (обычно <b>30–60 г</b> в сутки).",
        "Углеводы: всё, что осталось от калорий. Не поднимай белок выше нормы: он забирает калории у углеводов и бьёт по тренировкам.",
        "Пример на 80 кг: белок ~141 г, жиры ~62 г, остальное — углеводы."
      ]
    },
    {
      id: "carbs", title: "Углеводы и тайминг", icon: "clock",
      items: [
        "До тренировки: <b>30–60 г углеводов</b> за ~1 час. Источники: рис, рисовые хлебцы, cream of rice.",
        "Усвоение: <b>60 г/час</b> глюкозы; до <b>90 г/час</b>, если добавить фруктозу (мёд, фрукты, сок).",
        "Intra-workout: <b>20–40 г</b>, каждые ~5 минут или каждый подход. Нужно не всем — только если чувствуешь «выжатость».",
        "Полоскание рта: <b>10–15 секунд</b>, 20–40 г углеводов. Работает именно распознавание углеводов, а не сладкий вкус.",
        "Carb cycling <b>переоценён</b>: проще держать одинаковые калории каждый день."
      ]
    },
    {
      id: "tdee", title: "TDEE, шаги и кардио", icon: "steps",
      items: [
        "TDEE = BMR + NEAT + TEF + EAT. Силовая тренировка сжигает <b>мало</b> — не добавляй «+200 ккал за тренировку».",
        "Шаги: <b>10–20 тыс./день</b> (10 тыс. ≈ 300–500 ккал, 20 тыс. ≈ 600–800 ккал), максимум <b>25 тыс.</b>",
        "Выше ~2× BMR включается <b>constrained TDEE</b>: тело компенсирует расход, и дополнительные шаги дают всё меньше.",
        "Шаги — это способ увеличить «бюджет калорий», а не наказание. Больше шагов → больше еды и легче макросы."
      ]
    },
    {
      id: "satiety", title: "Сытость и продукты", icon: "apple",
      items: [
        "Основа — <b>овощи и клетчатка</b>. Оксалаты и фитаты в них не проблема, польза перевешивает.",
        "Самый сытный продукт — <b>варёный картофель</b>. Rice и паста — тоже ок, но сытости меньше.",
        "Гиперпалатабельная еда (чипсы, конфеты, десерты) <b>провоцирует переедание</b> и почти не насыщает.",
        "Убери «пищевой мусор» из дома. Если не контролируешь закупки — минимизируй соблазны вокруг.",
        "Оставь <b>~200 ккал</b> в день на то, что любишь: полный запрет → срыв."
      ]
    },
    {
      id: "habits", title: "Приёмы, чтобы держаться", icon: "check",
      items: [
        "Мелкие приборы → ешь медленнее.",
        "Жуй каждый кусок <b>~10 секунд</b>: меньше голода и объёма еды.",
        "Пей воду во время еды — растягиваешь приём пищи.",
        "Планируй меню заранее, не импровизируй «на 400 ккал».",
        "Не запрещай всё: вписанная «вкусняшка» лучше срыва."
      ]
    },
    {
      id: "training", title: "Тренировки на дефиците", icon: "train",
      items: [
        "Сплит и упражнения <b>не меняй</b>. Радикальные перемены не нужны.",
        "Если 6 тренировок «выжимают» — перейди на 4 (upper/lower). Full body через день → 3×/нед.",
        "Нелюбимые упражнения: <b>4–5 повторений, 1–2 RIR</b> — быстрее закончить, меньше страданий.",
        "Экономия сил: SLDL → гиперэкстензия, plate-loaded → pin-loaded. Экономит до 10 минут.",
        "Прогресс в рабочих весах = сигнал, что мышцы в порядке. Sub-10% — отдельная история."
      ]
    },
    {
      id: "supps", title: "Добавки", icon: "pill",
      items: [
        "<b>Омега-3</b> — особенно на дефиците, когда жиров мало.",
        "<b>Мультивитамин</b> — страховка, если не уверен в микронутриентах.",
        "<b>Магний глицинат</b> — частый дефицит.",
        "<b>Витамин D3</b> — сложно набрать из еды, особенно без солнца."
      ],
      tip: "Добавки не заменяют еду и не компенсируют плохой план."
    },
    {
      id: "after", title: "После диеты", icon: "flag",
      items: [
        "Выход: <b>reverse diet</b> (+50 ккал) или быстрый расчёт новой поддержки (2500 → ~2350, чуть ниже).",
        "Поддержание <b>сложнее сушки</b>: тело стремится к прежнему весу (dual intervention point model).",
        "Грелин растёт, лептин падает → сильный голод. Это норма, но нужно время.",
        "Долго оставайся на поддержании, прежде чем идти в профицит. Сначала — привычки."
      ]
    },
    {
      id: "redflags", title: "Красные флаги", icon: "info",
      items: [
        "Не гонись за темпом: потеря 1–1,5% в неделю — уже отлично.",
        "Головокружения, постоянная слабость, пропавший сон и либидо — повод поднять калории и обратиться к врачу.",
        "Подросткам, беременным и людям с РПП нужен специалист, а не приложение.",
        "Данные приложения — оценка, а не медицинская рекомендация."
      ]
    }
  ]
};
