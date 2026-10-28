/* CUTTRACK — приложение. Vanilla JS, localStorage, без сборки. */
(function () {
  "use strict";

  var DB = window.DB;
  var LS = "cuttrack_v1";
  var KG_LB = 0.45359237;
  var LAP = 2.2046226218;

  /* ---------------- utils ---------------- */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function round(n, d) { var p = Math.pow(10, d || 0); return Math.round(n * p) / p; }
  function pad(n) { return String(n).padStart(2, "0"); }
  function dkey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function parseKey(k) {
    var a = k.split("-").map(Number);
    return new Date(a[0], a[1] - 1, a[2]);
  }
  function shiftKey(k, delta) {
    var d = parseKey(k);
    d.setDate(d.getDate() + delta);
    return dkey(d);
  }
  function fmtDate(k) {
    var today = dkey();
    if (k === today) return "Сегодня";
    if (k === shiftKey(today, -1)) return "Вчера";
    if (k === shiftKey(today, 1)) return "Завтра";
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", weekday: "short" }).format(parseKey(k));
  }
  function fmtShort(k) {
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(parseKey(k));
  }
  function fmtClock(sec) {
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ":" + pad(m) : m) + ":" + pad(s);
  }
  function nowMs() { return Date.now(); }

  /* ---------------- icons ---------------- */
  var ICONS = {
    dumbbell: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    food: '<path d="M12 8.5c-3.2 0-5.3 2.1-5.3 5.1 0 3.1 2.1 5.9 5.3 5.9s5.3-2.8 5.3-5.9c0-3-2.1-5.1-5.3-5.1Z"/><path d="M12 8.5c0-2.1 1.1-3.2 3.1-4.1"/>',
    plan: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/>',
    train: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    progress: '<path d="M4 19V5M4 19h16"/><path d="m7.5 15 3-4 2.7 2 4.3-6"/>',
    guide: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h5.5v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5v-13Z"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c1.4-4 4-6 7.5-6s6.1 2 7.5 6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6.5 7l.8 13h9.4l.8-13M10 11v5M14 11v5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="m14 6-6 6 6 6"/>',
    right: '<path d="m10 6 6 6-6 6"/>',
    edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m14.5 6.5 3 3"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
    reset: '<path d="M4 10a8 8 0 1 1 2 6M4 4v6h6"/>',
    flame: '<path d="M12 22c4 0 6.5-2.7 6.5-6.2 0-4.6-4.4-6.8-4.8-11.8-2.4 1.1-4.2 3.5-4.2 6 0 1 .3 1.9.8 2.7-1.7-.3-2.8-1.9-2.8-3.6C6 12 5.5 13.4 5.5 15.2 5.5 19.1 8.2 22 12 22Z"/>',
    steps: '<path d="M8 3.5c-1.5 0-2.4 1.5-2.4 3.3S6.5 10 8 10s2.4-1.4 2.4-3.2S9.5 3.5 8 3.5Z"/><path d="M6 12.5c-1.3 1-1.9 2.4-1.9 3.8 0 1 .6 1.9 1.6 1.9 1.4 0 2.1-1.4 2.1-2.8 0-1.2-.6-2.3-1.8-2.9Z"/><path d="M16.5 7.5c-1.4 0-2.3 1.4-2.3 3.1s.9 3.1 2.3 3.1 2.3-1.4 2.3-3.1-.9-3.1-2.3-3.1Z"/><path d="M14.8 15c-1.2.7-1.7 1.9-1.7 3.1 0 1 .7 1.8 1.6 1.8 1.3 0 2-1.2 2-2.6 0-1.1-.6-2.1-1.9-2.3Z"/>',
    water: '<path d="M12 3.2s6.2 6.5 6.2 11.3a6.2 6.2 0 0 1-12.4 0C5.8 9.7 12 3.2 12 3.2Z"/>',
    alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    bolt: '<path d="M13 2 4.5 13H11l-1 9L19 10h-6.5L13 2Z"/>',
    pie: '<path d="M12 3v9h9A9 9 0 1 0 12 3Z"/><path d="M12 3a9 9 0 0 1 9 9h-9V3Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/>',
    bowl: '<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z"/><path d="M8 11V8M12 11V7M16 11V8"/>',
    snack: '<path d="M6.5 8h11l-1 12h-9l-1-12Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    flag: '<path d="M5 21V4M5 4h11l-1.5 4L16 12H5"/>',
    pill: '<path d="M10.5 4.5a4.2 4.2 0 0 1 6 6l-6 6a4.2 4.2 0 0 1-6-6l6-6Z"/><path d="m8 7 9 9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/>',
    play: '<path d="M8 5.5v13l11-6.5-11-6.5Z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>',
    scale: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12a4 4 0 0 1 8 0"/><path d="M12 12l2-2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'
  };
  function icon(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"' + (cls ? ' class="' + cls + '"' : "") + ">" + (ICONS[name] || "") + "</svg>";
  }

  /* ---------------- state ---------------- */
  function defaultState() {
    return {
      profile: null,
      days: {},
      weights: [],
      workouts: [],
      activeWorkout: null,
      customFoods: [],
      settings: { units: "kg", stepsGoal: 12000, restSec: 120, sound: true, waterGoalMl: 0 },
      createdAt: nowMs()
    };
  }
  function normalizeState(raw) {
    var s = Object.assign(defaultState(), raw || {});
    s.settings = Object.assign(defaultState().settings, (raw && raw.settings) || {});
    s.settings.units = s.settings.units === "lb" ? "lb" : "kg";
    s.settings.stepsGoal = clamp(Number(s.settings.stepsGoal) || 12000, 1000, 50000);
    s.settings.restSec = clamp(Number(s.settings.restSec) || 120, 30, 600);
    s.settings.sound = s.settings.sound !== false;
    s.settings.waterGoalMl = clamp(Number(s.settings.waterGoalMl) || 0, 0, 6000);
    if (!s.profile || typeof s.profile !== "object") s.profile = null;
    if (s.profile) {
      if (!Array.isArray(s.profile.allergies)) s.profile.allergies = [];
      s.profile.allergies = s.profile.allergies.filter(function (id) {
        return (DB.allergens || []).some(function (a) { return a.id === id; });
      });
    }
    s.days = (s.days && typeof s.days === "object" && !Array.isArray(s.days)) ? s.days : {};
    Object.keys(s.days).forEach(function (k) {
      var d = s.days[k];
      if (!d || typeof d !== "object" || Array.isArray(d)) { s.days[k] = { food: [], steps: 0, water: 0 }; return; }
      if (!Array.isArray(d.food)) d.food = [];
      d.steps = Number(d.steps) || 0;
      d.water = clamp(Number(d.water) || 0, 0, 20000);
    });
    s.weights = Array.isArray(s.weights) ? s.weights.filter(function (w) {
      return w && /^\d{4}-\d{2}-\d{2}$/.test(w.date) && isFinite(Number(w.kg));
    }).map(function (w) { return { date: w.date, kg: Number(w.kg) }; }) : [];
    s.weights.sort(function (a, b) { return a.date.localeCompare(b.date); });
    s.workouts = Array.isArray(s.workouts) ? s.workouts.filter(function (w) {
      return w && typeof w === "object" && w.id && w.name;
    }).map(function (w) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(w.date)) w.date = dkey();
      if (!Array.isArray(w.exercises)) w.exercises = [];
      w.exercises = w.exercises.filter(function (ex) {
        return ex && typeof ex === "object" && ex.name;
      });
      w.exercises.forEach(function (ex) { if (!Array.isArray(ex.sets)) ex.sets = []; });
      return w;
    }) : [];
    s.customFoods = Array.isArray(s.customFoods) ? s.customFoods : [];
    if (s.activeWorkout && (!Array.isArray(s.activeWorkout.exercises) || !s.activeWorkout.name)) s.activeWorkout = null;
    if (s.activeWorkout) {
      s.activeWorkout.startedAt = isFinite(Number(s.activeWorkout.startedAt)) ? Number(s.activeWorkout.startedAt) : nowMs();
      s.activeWorkout.exercises = s.activeWorkout.exercises.filter(function (ex) {
        return ex && typeof ex === "object" && ex.name;
      });
      s.activeWorkout.exercises.forEach(function (ex) {
        if (!Array.isArray(ex.sets)) ex.sets = [];
      });
    }
    return s;
  }
  function loadState() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS));
      if (!raw) return defaultState();
      return normalizeState(raw);
    } catch (e) {
      return defaultState();
    }
  }
  var state = loadState();

  var ui = {
    tab: "food",
    date: dkey(),
    foodQuery: "",
    foodCat: "all",
    exQuery: "",
    exGroup: "Все",
    pendingMeal: "breakfast",
    guideOpen: {},
    planMode: "day",
    planAnchor: dkey(),
    planCuisine: "central-asia",
    recipeQuery: "",
    recipeCuisine: "all",
    recipeMeal: "all",
    showAllergens: false,
    rest: null,
    restInterval: null,
    restHideTimer: null,
    workoutInterval: null,
    sheetOpen: false,
    sensor: {
      active: false,
      native: false,
      baseSteps: 0,
      session: 0,
      accel: 0,
      gyro: 0,
      gravity: 0,
      lastStepAt: 0,
      lastGyroAt: 0,
      lastUiAt: 0,
      inPeak: false,
      gyroSeen: false,
      gyroActive: false,
      poll: null,
      saveTimer: null,
      mode: "",
      day: "",
      error: ""
    }
  };

  function save() {
    try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) { toast("Не удалось сохранить данные"); }
  }
  function getDay(k) {
    if (!state.days[k]) state.days[k] = { food: [], steps: 0, water: 0 };
    if (!state.days[k].food) state.days[k].food = [];
    if (!isFinite(Number(state.days[k].water))) state.days[k].water = 0;
    return state.days[k];
  }

  /* ---------------- calculations ---------------- */
  function calcTargets() {
    var p = state.profile;
    if (!p) return null;
    var kg = Number(p.weightKg) || 0;
    var lbBody = kg * LAP;
    var bmr = 10 * kg + 6.25 * Number(p.heightCm) - 5 * Number(p.age) + (p.sex === "m" ? 5 : -161);
    var af = 1.45;
    DB.activityLevels.forEach(function (a) { if (a.id === p.activity) af = a.factor; });
    var tdee = Math.round(bmr * af);
    var deficit = p.goal === "maintain" ? 0 :
      p.deficitMode === "moderate" ? 500 :
      p.deficitMode === "aggressive" ? 1000 :
      Math.max(0, Number(p.customDeficit) || 0);

    var bf = Number(p.bodyFat) || 0;
    var maxDef = bf > 0 ? Math.round(lbBody * bf / 100 * 41) : null;
    var capped = false;
    if (maxDef != null && deficit > maxDef) { deficit = maxDef; capped = true; }

    var floor = p.sex === "m" ? 1500 : 1200;
    var rawTarget = tdee - deficit;
    var floorHit = p.goal !== "maintain" && rawTarget < floor;
    var target = p.goal === "maintain" ? tdee : Math.max(floor, Math.round(rawTarget / 5) * 5);
    deficit = Math.max(0, tdee - target);

    var highProtein = p.goal !== "maintain" && p.deficitMode === "aggressive";
    var protein = Math.round(lbBody * (highProtein ? 1.0 : 0.8));
    var fat = Math.round(lbBody * 0.35);
    var carbs = Math.round((target - protein * 4 - fat * 9) / 4);
    if (carbs < 0) {
      carbs = 0;
      fat = Math.max(20, Math.round((target - protein * 4) / 9));
    }
    if (target - protein * 4 - fat * 9 < 0) {
      protein = Math.max(60, Math.round((target - fat * 9) / 4));
    }
    var rateKg = deficit * 7 / 3500 * KG_LB;
    return {
      bmr: Math.round(bmr), tdee: tdee, af: af, deficit: deficit, target: target,
      protein: protein, fat: fat, carbs: carbs, maxDef: maxDef, capped: capped,
      floorHit: floorHit, rateKg: rateKg, ratePct: kg ? rateKg / kg * 100 : 0,
      bf: bf, highProtein: highProtein
    };
  }

  function totals(k) {
    var d = state.days[k];
    var t = { kcal: 0, p: 0, f: 0, c: 0 };
    if (!d || !d.food) return t;
    d.food.forEach(function (e) {
      var m = (Number(e.grams) || 0) / 100;
      t.kcal += (Number(e.kcal) || 0) * m;
      t.p += (Number(e.p) || 0) * m;
      t.f += (Number(e.f) || 0) * m;
      t.c += (Number(e.c) || 0) * m;
    });
    t.kcal = Math.round(t.kcal); t.p = Math.round(t.p); t.f = Math.round(t.f); t.c = Math.round(t.c);
    return t;
  }

  function units() { return state.settings.units === "lb" ? "lb" : "кг"; }
  function toDisp(kg) { return state.settings.units === "lb" ? kg / KG_LB : kg; }
  function fromDisp(v) { return state.settings.units === "lb" ? Number(v) * KG_LB : Number(v); }
  function fmtW(kg, d) { return round(toDisp(kg), d == null ? 1 : d) + " " + units(); }
  function stepKcal(steps, kg) { return Math.round(steps * 0.0005 * (Number(kg) || 80)); }

  /* ---------------- food / allergy / recipe helpers ---------------- */
  var FOOD_INDEX = {};
  (DB.foods || []).forEach(function (f) { FOOD_INDEX[f.id] = f; });
  var RECIPE_INDEX = {};
  (DB.recipes || []).forEach(function (r) { RECIPE_INDEX[r.id] = r; });
  var MENU_INDEX = {};
  (DB.menus || []).forEach(function (m) { MENU_INDEX[m.id] = m; });
  var CUISINE_INDEX = {};
  (DB.cuisines || []).forEach(function (c) { CUISINE_INDEX[c.id] = c; });

  function foodById(id) { return FOOD_INDEX[id] || null; }
  function allergenById(id) {
    return (DB.allergens || []).filter(function (a) { return a.id === id; })[0] || null;
  }
  function profileAllergies() {
    return (state.profile && Array.isArray(state.profile.allergies)) ? state.profile.allergies : [];
  }
  function foodAllergens(f) {
    return (f && Array.isArray(f.allergens)) ? f.allergens : [];
  }
  function hasAllergenConflict(ids) {
    var mine = profileAllergies();
    return (ids || []).some(function (id) { return mine.indexOf(id) >= 0; });
  }
  function allergenNames(ids) {
    return (ids || []).map(function (id) {
      var a = allergenById(id);
      return a ? a.name : id;
    }).join(", ");
  }
  function foodAllowed(f) { return !hasAllergenConflict(foodAllergens(f)); }
  function entryAllergens(e) {
    if (e && Array.isArray(e.allergens)) return e.allergens;
    if (e && e.foodId && FOOD_INDEX[e.foodId]) return foodAllergens(FOOD_INDEX[e.foodId]);
    var f = (DB.foods || []).filter(function (x) { return x.name === (e && e.name); })[0];
    return f ? foodAllergens(f) : [];
  }
  function entryBlocked(e) { return hasAllergenConflict(entryAllergens(e)); }
  function mealName(id) {
    var m = (DB.meals || []).filter(function (x) { return x.id === id; })[0];
    return m ? m.name : id;
  }
  function recipeFoodItems(recipe) {
    return ((recipe && recipe.items) || []).map(function (it) {
      return { food: foodById(it.food), grams: Number(it.grams) || 0 };
    }).filter(function (it) { return !!it.food; });
  }
  function recipeTotals(recipe) {
    var t = { kcal: 0, p: 0, f: 0, c: 0, fiber: 0 };
    recipeFoodItems(recipe).forEach(function (it) {
      var m = it.grams / 100;
      t.kcal += Number(it.food.kcal) * m;
      t.p += Number(it.food.p) * m;
      t.f += Number(it.food.f) * m;
      t.c += Number(it.food.c) * m;
      t.fiber += Number(it.food.fiber || 0) * m;
    });
    t.kcal = Math.round(t.kcal); t.p = Math.round(t.p); t.f = Math.round(t.f); t.c = Math.round(t.c); t.fiber = Math.round(t.fiber);
    return t;
  }
  function recipeAllergenIds(recipe) {
    var set = {};
    recipeFoodItems(recipe).forEach(function (it) {
      foodAllergens(it.food).forEach(function (id) { set[id] = true; });
    });
    ((recipe && recipe.extraAllergens) || []).forEach(function (id) { set[id] = true; });
    return Object.keys(set);
  }
  function recipeBlocked(recipe) { return hasAllergenConflict(recipeAllergenIds(recipe)); }
  function menuRecipeEntries(menu) {
    return (DB.meals || []).map(function (m) {
      var rid = menu && menu.meals ? menu.meals[m.id] : null;
      var recipe = rid ? RECIPE_INDEX[rid] : null;
      return recipe ? { meal: m, recipe: recipe } : null;
    }).filter(Boolean);
  }
  function menuTotals(menu) {
    var t = { kcal: 0, p: 0, f: 0, c: 0, fiber: 0 };
    menuRecipeEntries(menu).forEach(function (e) {
      var rt = recipeTotals(e.recipe);
      t.kcal += rt.kcal; t.p += rt.p; t.f += rt.f; t.c += rt.c; t.fiber += rt.fiber;
    });
    return t;
  }
  function autoWaterNorm() {
    var kg = Number(state.profile && state.profile.weightKg) || 80;
    var act = state.profile && state.profile.activity;
    var bonus = act === "low" ? 0 : act === "high" ? 300 : act === "veryhigh" ? 450 : 150;
    return Math.round(clamp(kg * 30 + bonus, 1500, 4500) / 50) * 50;
  }
  function waterNorm() {
    var manual = Number(state.settings.waterGoalMl) || 0;
    return manual > 0 ? manual : autoWaterNorm();
  }
  function waterGoalSource() { return Number(state.settings.waterGoalMl) > 0 ? "вручную" : "авто"; }
  function selectedAllergies(sel) {
    return $$(sel + " .chip.on").map(function (b) { return b.dataset.allergen; }).filter(Boolean);
  }
  function allergyShort() {
    var list = profileAllergies();
    if (!list.length) return "нет";
    if (list.length <= 2) return allergenNames(list);
    return list.length + " выбрано";
  }

  /* ---------------- meal planner ---------------- */
  var PLAN_CACHE = {};

  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function seededRandom(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function pickSeeded(list, seed, used) {
    if (!list || !list.length) return null;
    var avail = list.filter(function (f) { return !used[f.id]; });
    if (!avail.length) avail = list;
    var idx = Math.floor(seededRandom(seed)() * avail.length);
    var food = avail[idx];
    used[food.id] = true;
    return food;
  }
  function mealMatch(f, meal) {
    return !f.meals || !f.meals.length || f.meals.indexOf(meal) >= 0;
  }
  function planProteinPool(meal) {
    var list = DB.foods.filter(function (f) {
      return (f.role === "protein" || f.role === "dairy") && mealMatch(f, meal) && foodAllowed(f);
    });
    if (meal === "lunch" || meal === "dinner") {
      var main = list.filter(function (f) { return f.role === "protein" && Number(f.p) >= 15; });
      if (main.length) list = main;
    }
    if (meal === "breakfast" || meal === "snack") {
      var light = list.filter(function (f) {
        var tags = f.tags || [];
        return f.role === "dairy" || tags.indexOf("breakfast") >= 0 || tags.indexOf("quick") >= 0;
      });
      if (light.length) list = light;
    }
    var dense = list.filter(function (f) { return Number(f.p) >= 8; });
    return dense.length ? dense : list;
  }
  function planCarbPool(meal) {
    var list = DB.foods.filter(function (f) { return f.role === "carb" && mealMatch(f, meal) && foodAllowed(f); });
    if (!list.length) list = DB.foods.filter(function (f) { return f.role === "carb" && foodAllowed(f); });
    return list;
  }
  function planRolePool(role, meal) {
    var list = DB.foods.filter(function (f) { return f.role === role && mealMatch(f, meal) && foodAllowed(f); });
    if (!list.length) list = DB.foods.filter(function (f) { return f.role === role && foodAllowed(f); });
    return list;
  }
  function planItemsTotals(items) {
    var t = { kcal: 0, p: 0, f: 0, c: 0, fiber: 0 };
    items.forEach(function (it) {
      var m = it.grams / 100;
      t.kcal += Number(it.food.kcal) * m;
      t.p += Number(it.food.p) * m;
      t.f += Number(it.food.f) * m;
      t.c += Number(it.food.c) * m;
      t.fiber += Number(it.food.fiber || 0) * m;
    });
    t.kcal = Math.round(t.kcal); t.p = Math.round(t.p); t.f = Math.round(t.f); t.c = Math.round(t.c); t.fiber = Math.round(t.fiber);
    return t;
  }
  function roundPlanGrams(food, grams) {
    var step = Number(food.portion) <= 30 ? 1 : 5;
    return Math.max(step, Math.round(grams / step) * step);
  }
  function planItemByRole(items, role) {
    return items.filter(function (it) { return it.food.role === role; })[0] || null;
  }
  function adjustItem(item, key, delta, min, max) {
    if (!item) return;
    var perGram = Number(item.food[key]) / 100;
    if (!(perGram > 0)) return;
    item.grams = clamp(item.grams + delta / perGram, min, max);
  }
  function balanceMeal(items, pGoal, fGoal, cGoal, mealKcal) {
    var pItem = planItemByRole(items, "protein");
    var cItem = planItemByRole(items, "carb");
    var fItem = planItemByRole(items, "fat");
    var fMax = fItem ? (Number(fItem.food.portion) || 20) * 3.5 : 0;
    for (var pass = 0; pass < 3; pass++) {
      var t = planItemsTotals(items);
      adjustItem(pItem, "p", pGoal - t.p, 20, 320);
      t = planItemsTotals(items);
      adjustItem(cItem, "c", cGoal - t.c, 15, 380);
      t = planItemsTotals(items);
      adjustItem(fItem, "f", fGoal - t.f, 1, fMax);
      t = planItemsTotals(items);
      var diff = mealKcal - t.kcal;
      if (Math.abs(diff) > 15 && fItem) {
        adjustItem(fItem, "kcal", diff, 1, fMax);
        t = planItemsTotals(items);
        diff = mealKcal - t.kcal;
      }
      if (Math.abs(diff) > 15 && cItem) {
        adjustItem(cItem, "kcal", diff, 15, 400);
      }
    }
  }
  function buildMealPlan(dateKey, mealId, target) {
    var meta = DB.meals.filter(function (m) { return m.id === mealId; })[0] || { id: mealId, name: mealId, icon: "bowl" };
    var seed = hashSeed(dateKey + "|" + mealId + "|" + target.target + "|" + target.protein + "|" + profileAllergies().join(","));
    var used = {};
    var protein = pickSeeded(planProteinPool(mealId), seed + 1, used);
    var carb = null, fruit = null;
    if (mealId === "snack") {
      fruit = pickSeeded(planRolePool("fruit", "snack"), seed + 2, used);
      if (!fruit) carb = pickSeeded(planCarbPool("snack"), seed + 2, used);
    } else {
      carb = pickSeeded(planCarbPool(mealId), seed + 2, used);
      if (mealId === "breakfast") fruit = pickSeeded(planRolePool("fruit", "breakfast"), seed + 3, used);
    }
    var veg = mealId === "snack" ? null : pickSeeded(planRolePool("veg", mealId), seed + 4, used);
    var fat = pickSeeded(planRolePool("fat", mealId), seed + 5, used);
    if (!protein) protein = DB.foods.filter(foodAllowed)[0] || DB.foods[0];
    if (!carb && !fruit) carb = DB.foods.filter(function (f) { return f.role === "carb" && foodAllowed(f); })[0] || DB.foods.filter(function (f) { return f.role === "carb"; })[0];

    var mealKcal = Math.max(180, Math.round(target.target * ((DB.mealPlan.splits || {})[mealId] || 0.25)));
    var pShare = { breakfast: 0.25, lunch: 0.30, dinner: 0.30, snack: 0.15 }[mealId] || 0.25;
    var fShare = { breakfast: 0.25, lunch: 0.30, dinner: 0.30, snack: 0.15 }[mealId] || 0.25;
    var cShare = { breakfast: 0.30, lunch: 0.35, dinner: 0.25, snack: 0.10 }[mealId] || 0.25;
    var pGoal = Math.max(15, target.protein * pShare);
    var fGoal = Math.max(5, target.fat * fShare);
    var cGoal = Math.max(10, target.carbs * cShare);
    var items = [];
    function add(food, grams) {
      if (!food || grams <= 0) return;
      items.push({ food: food, grams: roundPlanGrams(food, grams) });
    }
    add(protein, clamp(pGoal / Math.max(Number(protein.p) / 100, 0.01), 30, 280));
    if (veg) add(veg, Number(veg.portion) || 150);
    if (fruit) add(fruit, Number(fruit.portion) || 120);
    if (fat) add(fat, clamp(fGoal / Math.max(Number(fat.f) / 100, 0.01), 3, (Number(fat.portion) || 20) * 3));
    if (carb) {
      var usedKcal = planItemsTotals(items).kcal;
      add(carb, clamp((mealKcal - usedKcal) / Math.max(Number(carb.kcal) / 100, 0.01), 20, 340));
    }

    balanceMeal(items, pGoal, fGoal, cGoal, mealKcal);
    items.forEach(function (it) { it.grams = roundPlanGrams(it.food, it.grams); });
    var totals = planItemsTotals(items);
    var tips = (DB.mealPlan.tips && DB.mealPlan.tips[mealId]) || ["Белок + овощи + немного углеводов — рабочая база."];
    return {
      id: mealId,
      name: meta.name,
      icon: meta.icon,
      items: items,
      totals: totals,
      targetKcal: mealKcal,
      tip: tips[hashSeed(dateKey + "|tip|" + mealId) % tips.length]
    };
  }
  function buildDayPlan(dateKey) {
    var c = calcTargets();
    if (!c) return null;
    var cacheKey = dateKey + "|" + c.target + "|" + c.protein + "|" + c.fat + "|" + c.carbs + "|" + profileAllergies().join(",");
    if (PLAN_CACHE[cacheKey]) return PLAN_CACHE[cacheKey];
    var order = (DB.mealPlan && DB.mealPlan.mealOrder) || ["breakfast", "lunch", "dinner", "snack"];
    var meals = order.map(function (id) { return buildMealPlan(dateKey, id, c); });
    var totals = { kcal: 0, p: 0, f: 0, c: 0, fiber: 0 };
    meals.forEach(function (m) {
      totals.kcal += m.totals.kcal; totals.p += m.totals.p; totals.f += m.totals.f; totals.c += m.totals.c; totals.fiber += m.totals.fiber;
    });
    var themes = (DB.mealPlan && DB.mealPlan.dayThemes) || ["Сбалансированный день"];
    var plan = { date: dateKey, target: c, meals: meals, totals: totals, theme: themes[hashSeed(dateKey + "|theme") % themes.length] };
    PLAN_CACHE[cacheKey] = plan;
    return plan;
  }
  function planPeriodTotals(plans) {
    var t = { kcal: 0, p: 0, f: 0, c: 0, fiber: 0 };
    plans.forEach(function (p) {
      t.kcal += p.totals.kcal; t.p += p.totals.p; t.f += p.totals.f; t.c += p.totals.c; t.fiber += p.totals.fiber;
    });
    return t;
  }
  function startOfWeek(k) {
    var d = parseKey(k);
    var day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return dkey(d);
  }
  function monthStart(k) { return k.slice(0, 7) + "-01"; }
  function monthEnd(k) {
    var d = parseKey(monthStart(k));
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return dkey(d);
  }
  function shiftMonth(k, delta) {
    var d = parseKey(monthStart(k));
    d.setMonth(d.getMonth() + delta);
    return dkey(d);
  }
  function monthDays(k) { return parseKey(monthEnd(k)).getDate(); }
  function monthTitle(k) {
    return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(parseKey(monthStart(k)));
  }
  function fmtPlanDay(k) {
    return new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric", month: "short" }).format(parseKey(k));
  }
  function weekLabel(k) {
    var start = startOfWeek(k);
    return fmtShort(start) + " — " + fmtShort(shiftKey(start, 6));
  }
  function planDateNav(title, sub) {
    return '<div class="date-nav"><div class="date-label">' + esc(title) + '<span>' + esc(sub) + '</span></div>' +
      '<div class="nav-btns">' +
        '<button class="icon-btn" data-action="plan-prev" aria-label="Назад">' + icon("left") + '</button>' +
        '<button class="icon-btn" data-action="plan-today" aria-label="Сегодня">' + icon("calendar") + '</button>' +
        '<button class="icon-btn" data-action="plan-next" aria-label="Вперёд">' + icon("right") + '</button>' +
      '</div></div>';
  }
  function planMacroLine(t) {
    return '<div class="macro-line plan-macros">' +
      '<div><b class="mono">' + t.p + '</b><span>белки</span></div>' +
      '<div><b class="mono">' + t.f + '</b><span>жиры</span></div>' +
      '<div><b class="mono">' + t.c + '</b><span>углеводы</span></div>' +
      '<div><b class="mono">' + t.fiber + '</b><span>клетчатка</span></div>' +
    '</div>';
  }
  function planSummaryCard(plan, mode, dayCount) {
    var c = plan.target;
    var t = plan.totals;
    var avg = dayCount > 1 ? {
      kcal: Math.round(t.kcal / dayCount), p: Math.round(t.p / dayCount), f: Math.round(t.f / dayCount),
      c: Math.round(t.c / dayCount), fiber: Math.round(t.fiber / dayCount)
    } : t;
    var kicker = mode === "day" ? "План на день" : mode === "week" ? "План на неделю" : "План на месяц";
    var main = mode === "day" ? t.kcal : avg.kcal;
    var unit = mode === "day" ? " ккал" : " ккал/день";
    var note = mode === "day" ? plan.theme : "Среднее по " + dayCount + " дням · цель " + c.target + " ккал/день";
    return '<div class="card plan-summary">' +
      '<div class="plan-summary-top"><div><div class="plan-kicker">' + kicker + '</div><div class="plan-kcal"><b class="mono">' + main + '</b><span>' + unit + '</span></div></div>' +
        '<span class="pill">цель ' + c.target + '</span></div>' +
      planMacroLine(avg) +
      '<p class="note" style="margin-top:10px">' + esc(note) + '</p>' +
      (mode === "day" ? '<button class="btn btn-primary btn-block" style="margin-top:12px" data-action="plan-add-day" data-date="' + plan.date + '">' + icon("plus") + 'Добавить весь день в дневник</button>' : '') +
    '</div>';
  }
  function planMealCard(meal, date) {
    var rows = meal.items.map(function (it) {
      var m = it.grams / 100;
      return '<div class="plan-item">' +
        '<div class="grow"><div class="pi-name">' + esc(it.food.name) + '</div><div class="pi-meta">' + it.grams + ' г · Б ' + round(Number(it.food.p) * m) + ' · Ж ' + round(Number(it.food.f) * m) + ' · У ' + round(Number(it.food.c) * m) + (it.food.fiber ? ' · клетчатка ' + round(Number(it.food.fiber) * m) : '') + '</div></div>' +
        '<div class="pi-kcal mono">' + Math.round(Number(it.food.kcal) * m) + '</div>' +
      '</div>';
    }).join("");
    return '<div class="card plan-meal">' +
      '<div class="plan-meal-head">' +
        '<span class="meal-ico">' + icon(meal.icon) + '</span>' +
        '<div class="grow"><div class="name">' + esc(meal.name) + '</div><div class="kcal">' + meal.totals.kcal + ' ккал · Б ' + meal.totals.p + ' · Ж ' + meal.totals.f + ' · У ' + meal.totals.c + '</div></div>' +
        '<button class="btn btn-sm btn-primary" data-action="plan-add-meal" data-date="' + date + '" data-meal="' + meal.id + '">В дневник</button>' +
      '</div>' +
      '<div class="plan-items">' + rows + '</div>' +
      '<div class="plan-tip">' + icon("info") + '<span>' + esc(meal.tip) + '</span></div>' +
    '</div>';
  }
  function planMealLine(meal, date) {
    var dishes = meal.items.map(function (it) { return it.food.name; }).join(", ");
    return '<div class="plan-meal-line">' +
      '<span class="pm-name">' + esc(meal.name) + '</span>' +
      '<span class="pm-dishes">' + esc(dishes) + '</span>' +
      '<span class="pm-kcal mono">' + meal.totals.kcal + '</span>' +
      '<button class="icon-btn plain plan-add" data-action="plan-add-meal" data-date="' + date + '" data-meal="' + meal.id + '" aria-label="Добавить ' + esc(meal.name) + '">' + icon("plus") + '</button>' +
    '</div>';
  }
  function planDayCard(plan) {
    var today = plan.date === dkey();
    return '<div class="card plan-day-card' + (today ? " today" : "") + '">' +
      '<div class="plan-day-head">' +
        '<div class="grow"><div class="plan-day-name">' + fmtPlanDay(plan.date) + (today ? ' <span class="pill">сегодня</span>' : '') + '</div>' +
        '<div class="plan-day-meta">' + plan.totals.kcal + ' ккал · Б ' + plan.totals.p + ' · Ж ' + plan.totals.f + ' · У ' + plan.totals.c + '</div></div>' +
        '<button class="btn btn-sm" data-action="plan-add-day" data-date="' + plan.date + '">День</button>' +
      '</div>' +
      '<div class="plan-day-meals">' + plan.meals.map(function (m) { return planMealLine(m, plan.date); }).join("") + '</div>' +
    '</div>';
  }
  function monthWeeks(start, end) {
    var first = startOfWeek(start);
    var last = startOfWeek(end);
    var html = "";
    var weekNo = 1;
    for (var w = first; w <= last; w = shiftKey(w, 7)) {
      var days = [];
      for (var i = 0; i < 7; i++) {
        var k = shiftKey(w, i);
        if (k >= start && k <= end) days.push(k);
      }
      if (!days.length) continue;
      html += '<div class="plan-week-block">' +
        '<div class="plan-week-head">Неделя ' + weekNo + ' · ' + fmtShort(days[0]) + ' — ' + fmtShort(days[days.length - 1]) + '</div>' +
        days.map(function (k) { return planDayCard(buildDayPlan(k)); }).join("") +
      '</div>';
      weekNo++;
    }
    return html;
  }
  function allergyBanner() {
    var list = profileAllergies();
    if (!list.length) return "";
    return '<div class="card allergy-banner">' +
      '<span class="ico">' + icon("alert") + '</span>' +
      '<div class="grow"><b>Аллергии: ' + esc(allergenNames(list)) + '</b><span>Блюда с этими аллергенами скрыты или помечены. Настроить можно в профиле.</span></div>' +
      '<button class="icon-btn plain" data-action="open-allergies" aria-label="Настроить аллергии">' + icon("edit") + '</button>' +
    '</div>';
  }
  function menuRecipeRow(entry) {
    var r = entry.recipe, t = recipeTotals(r), blocked = recipeBlocked(r);
    return '<button class="menu-meal-row' + (blocked ? " blocked" : "") + '" data-action="open-recipe" data-id="' + esc(r.id) + '">' +
      '<span class="mm-meal">' + esc(entry.meal.name) + '</span>' +
      '<span class="grow"><span class="mm-name">' + esc(r.name) + '</span><span class="mm-meta">' + t.kcal + ' ккал · Б ' + t.p + ' · Ж ' + t.f + ' · У ' + t.c + '</span></span>' +
      (blocked ? '<span class="allergen-tag">' + icon("alert") + esc(allergenNames(recipeAllergenIds(r))) + '</span>' : '<span class="mm-kcal mono">' + t.kcal + '</span>') +
    '</button>';
  }
  function menuCard(menu, date) {
    var entries = menuRecipeEntries(menu);
    var totals = menuTotals(menu);
    var blocked = entries.filter(function (e) { return recipeBlocked(e.recipe); }).length;
    var cuisine = CUISINE_INDEX[menu.cuisine];
    return '<div class="card cuisine-card">' +
      '<div class="cuisine-head"><div class="grow"><div class="plan-kicker">' + esc(cuisine ? cuisine.name : "") + '</div><div class="cuisine-name">' + esc(menu.name) + '</div><div class="cuisine-desc">' + esc(menu.desc || "") + '</div></div><span class="pill">' + totals.kcal + ' ккал</span></div>' +
      planMacroLine(totals) +
      '<div class="menu-meals">' + entries.map(menuRecipeRow).join("") + '</div>' +
      '<div class="menu-actions"><button class="btn btn-sm btn-primary" data-action="plan-add-menu" data-menu="' + esc(menu.id) + '" data-date="' + date + '">' + icon("plus") + 'Добавить меню</button>' +
      '<button class="btn btn-sm" data-action="open-menu" data-id="' + esc(menu.id) + '">' + icon("guide") + 'Рецепты</button></div>' +
      (blocked ? '<p class="allergy-note">' + icon("alert") + ' ' + blocked + ' блюд(а) содержат твои аллергены и не будут добавлены.</p>' : '') +
    '</div>';
  }
  function cuisineBody(c, anchor) {
    var cuisineId = ui.planCuisine || "central-asia";
    var cuisine = CUISINE_INDEX[cuisineId] || DB.cuisines[0];
    var menus = DB.menus.filter(function (m) { return m.cuisine === cuisineId; });
    var chips = DB.cuisines.map(function (x) {
      return '<button class="chip' + (x.id === cuisineId ? " on" : "") + '" data-action="plan-cuisine" data-cuisine="' + esc(x.id) + '">' + esc(x.name) + '</button>';
    }).join("");
    var recipeCount = DB.recipes.filter(function (r) { return r.cuisine === cuisineId; }).length;
    return '<div class="chips cuisine-chips">' + chips + '</div>' +
      '<div class="card cuisine-intro"><div class="plan-kicker">' + esc(cuisine.name) + '</div><p>' + esc(cuisine.note) + '</p>' +
        '<div class="badge-row"><span class="pill gray">' + menus.length + ' меню</span><span class="pill gray">' + recipeCount + ' рецептов</span></div></div>' +
      '<div class="section-title"><h2>Меню</h2><button data-action="open-recipes">Все рецепты</button></div>' +
      menus.map(function (m) { return menuCard(m, anchor); }).join("") +
      '<p class="note" style="margin-top:14px">Порции рассчитаны на одного человека. Добавляй меню в дневник и правь граммы под свою цель. Блюда с аллергенами помечены и не добавляются.</p>';
  }
  function recipeCatalogButton() {
    return '<div class="spacer-16"></div><button class="btn btn-block" data-action="open-recipes">' + icon("guide") + 'Каталог рецептов и кухонь</button>';
  }
  function viewPlan() {
    var c = calcTargets();
    if (!c) return '<div class="empty-line">Сначала заполни профиль</div>';
    var mode = ui.planMode || "day";
    var anchor = ui.planAnchor || dkey();
    var seg = '<div class="seg plan-seg">' +
      '<button class="' + (mode === "day" ? "on" : "") + '" data-action="plan-mode" data-mode="day">День</button>' +
      '<button class="' + (mode === "week" ? "on" : "") + '" data-action="plan-mode" data-mode="week">Неделя</button>' +
      '<button class="' + (mode === "month" ? "on" : "") + '" data-action="plan-mode" data-mode="month">Месяц</button>' +
      '<button class="' + (mode === "cuisine" ? "on" : "") + '" data-action="plan-mode" data-mode="cuisine">Кухни</button>' +
    '</div>';
    var nav, body;
    if (mode === "cuisine") {
      nav = planDateNav(fmtDate(anchor), "кухни · порции на 1 человека");
      body = cuisineBody(c, anchor);
    } else if (mode === "day") {
      var plan = buildDayPlan(anchor);
      nav = planDateNav(fmtDate(anchor), "план питания · цель " + c.target + " ккал");
      body = planSummaryCard(plan, "day", 1) +
        '<div class="section-title"><h2>Приёмы пищи</h2><span class="plan-theme">' + esc(plan.theme) + '</span></div>' +
        plan.meals.map(function (m) { return planMealCard(m, anchor); }).join("") +
        '<p class="note" style="margin-top:14px">Порции — ориентир под твои калории и БЖУ. Добавляй в дневник и меняй граммы под себя.</p>';
    } else if (mode === "week") {
      var start = startOfWeek(anchor);
      var plans = [];
      for (var i = 0; i < 7; i++) plans.push(buildDayPlan(shiftKey(start, i)));
      var totals = planPeriodTotals(plans);
      nav = planDateNav(weekLabel(start), "7 дней · цель " + c.target + " ккал/день");
      body = planSummaryCard({ target: c, totals: totals, date: start }, "week", 7) +
        '<div class="section-title"><h2>Дни недели</h2><button data-action="plan-add-week" data-date="' + start + '">Вся неделя</button></div>' +
        plans.map(planDayCard).join("");
    } else {
      var mstart = monthStart(anchor), mend = monthEnd(anchor);
      var mplans = [];
      var cursor = mstart;
      while (cursor <= mend) { mplans.push(buildDayPlan(cursor)); cursor = shiftKey(cursor, 1); }
      var mtotals = planPeriodTotals(mplans);
      nav = planDateNav(monthTitle(anchor), monthDays(anchor) + " дней · цель " + c.target + " ккал/день");
      body = planSummaryCard({ target: c, totals: mtotals, date: mstart }, "month", mplans.length) +
        '<div class="section-title"><h2>Дни месяца</h2><button data-action="plan-add-month" data-date="' + mstart + '">Весь месяц</button></div>' +
        monthWeeks(mstart, mend);
    }
    return nav + seg + (mode === "cuisine" ? "" : allergyBanner()) + body + (mode === "cuisine" ? "" : recipeCatalogButton());
  }

  function appendPlanMeal(dateKey, mealId) {
    var plan = buildDayPlan(dateKey);
    if (!plan) return 0;
    var meal = plan.meals.filter(function (m) { return m.id === mealId; })[0];
    if (!meal) return 0;
    var day = getDay(dateKey);
    var added = 0;
    meal.items.forEach(function (it) {
      var planId = dateKey + "|" + mealId + "|" + it.food.id;
      var exists = (day.food || []).some(function (e) { return e.planId === planId; });
      if (exists) return;
      day.food.push({
        id: "f" + nowMs() + Math.random().toString(36).slice(2, 5),
        name: it.food.name,
        grams: it.grams,
        kcal: it.food.kcal,
        p: it.food.p,
        f: it.food.f,
        c: it.food.c,
        fiber: it.food.fiber || 0,
        meal: mealId,
        planId: planId,
        foodId: it.food.id,
        allergens: foodAllergens(it.food).slice()
      });
      added++;
    });
    return added;
  }
  function addPlanMeal(dateKey, mealId) {
    var n = appendPlanMeal(dateKey, mealId);
    save(); render();
    var meta = DB.meals.filter(function (m) { return m.id === mealId; })[0];
    toast(n ? "Добавлено: " + (meta ? meta.name : "приём") + " · " + n + " прод." : "Этот приём уже в дневнике");
  }
  function addPlanDay(dateKey) {
    var plan = buildDayPlan(dateKey);
    if (!plan) return;
    var n = 0;
    plan.meals.forEach(function (m) { n += appendPlanMeal(dateKey, m.id); });
    save(); render();
    toast(n ? "День добавлен в дневник: " + n + " продуктов" : "Этот день уже в дневнике");
  }
  function addPlanRange(startKey, count, label) {
    if (count > 7 && !window.confirm("Добавить " + label + " (" + count + " дней) в дневник? Появится много записей.")) return;
    var n = 0;
    for (var i = 0; i < count; i++) {
      var k = shiftKey(startKey, i);
      var plan = buildDayPlan(k);
      if (!plan) continue;
      plan.meals.forEach(function (m) { n += appendPlanMeal(k, m.id); });
    }
    save(); render();
    toast(n ? "Добавлено " + n + " продуктов на " + count + " дн." : "Эти дни уже в дневнике");
  }

  /* ---------------- recipes / menus ---------------- */
  function cuisineName(id) {
    var c = CUISINE_INDEX[id];
    return c ? c.name : "";
  }
  function recipeTagLabel(t) {
    var map = {
      quick: "быстро", vegetarian: "вегетарианское", "high-protein": "много белка",
      "low-carb": "мало углеводов", fiber: "клетчатка", budget: "бюджетно",
      batch: "на несколько порций", soup: "суп", "omega-3": "омега-3", lean: "лёгкое"
    };
    return map[t] || t;
  }
  function recipeTagsHtml(r) {
    return (r.tags || []).map(function (t) {
      return '<span class="pill gray">' + esc(recipeTagLabel(t)) + "</span>";
    }).join("");
  }
  function allergyToggleHtml(kind) {
    if (!profileAllergies().length) return "";
    return '<button class="allergy-toggle' + (ui.showAllergens ? " on" : "") + '" data-action="toggle-allergens" data-kind="' + esc(kind) + '">' +
      icon("alert") + '<span>' + (ui.showAllergens ? "Скрыть " : "Показать ") + esc(kind) + ' с аллергенами</span></button>';
  }
  function recipeFilteredList() {
    var q = ui.recipeQuery.trim().toLowerCase();
    return (DB.recipes || []).filter(function (r) {
      if (ui.recipeCuisine !== "all" && r.cuisine !== ui.recipeCuisine) return false;
      if (ui.recipeMeal !== "all" && r.meal !== ui.recipeMeal) return false;
      if (q && r.name.toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }
  function recipeResultsHtml() {
    var all = recipeFilteredList();
    var list = all.filter(function (r) { return ui.showAllergens || !recipeBlocked(r); });
    var hidden = all.length - list.length;
    if (!list.length) {
      return '<div class="empty-line">' + (hidden ? "Все найденные рецепты содержат твои аллергены" : "Ничего не найдено") + "</div>";
    }
    var html = list.map(function (r) {
      var t = recipeTotals(r), blocked = recipeBlocked(r);
      return '<button class="pick-row recipe-pick" data-action="open-recipe" data-id="' + esc(r.id) + '">' +
        '<div class="grow"><div class="pn">' + esc(r.name) + '</div>' +
          '<div class="pm">' + esc(cuisineName(r.cuisine)) + " · " + esc(mealName(r.meal)) + " · " + r.time + " мин</div>" +
          (blocked ? '<span class="allergen-tag">' + icon("alert") + esc(allergenNames(recipeAllergenIds(r))) + "</span>" : "") +
        "</div>" +
        '<div class="pk">' + t.kcal + '<span> ккал</span></div>' +
      "</button>";
    }).join("");
    if (hidden) html = '<p class="allergy-note">' + icon("alert") + " Скрыто " + hidden + " рецепт(ов) с твоими аллергенами.</p>" + html;
    return html;
  }
  function openRecipeCatalog() {
    var cuisines = [{ id: "all", name: "Все кухни" }].concat(DB.cuisines || []);
    var meals = [
      { id: "all", name: "Все" }, { id: "breakfast", name: "Завтрак" },
      { id: "lunch", name: "Обед / ужин" }, { id: "snack", name: "Перекус" }
    ];
    ui.recipeQuery = "";
    openSheet(
      sheetHead("Рецепты и кухни", "Готовые блюда из базы продуктов — с граммовками и шагами") +
      '<div class="search-wrap">' + icon("search") + '<input class="input" id="recipe-search" placeholder="Найти рецепт…" autocomplete="off"></div>' +
      '<div class="chips" id="recipe-cuisines">' + cuisines.map(function (c) {
        return '<button class="chip' + (c.id === ui.recipeCuisine ? " on" : "") + '" data-action="recipe-cuisine" data-cuisine="' + esc(c.id) + '">' + esc(c.name) + "</button>";
      }).join("") + "</div>" +
      '<div class="chips" id="recipe-meals">' + meals.map(function (m) {
        return '<button class="chip' + (m.id === ui.recipeMeal ? " on" : "") + '" data-action="recipe-meal" data-meal="' + esc(m.id) + '">' + esc(m.name) + "</button>";
      }).join("") + "</div>" +
      allergyToggleHtml("рецепты") +
      '<div class="recipe-results" id="recipe-results">' + recipeResultsHtml() + "</div>"
    );
    var inp = $("#recipe-search");
    if (inp) inp.addEventListener("input", function (e) {
      ui.recipeQuery = e.target.value;
      $("#recipe-results").innerHTML = recipeResultsHtml();
    });
  }
  function openRecipe(id) {
    var r = RECIPE_INDEX[id];
    if (!r) return;
    var t = recipeTotals(r);
    var blocked = recipeBlocked(r);
    var items = recipeFoodItems(r);
    var ingredients = items.map(function (it) {
      var m = it.grams / 100;
      var conflict = hasAllergenConflict(foodAllergens(it.food));
      return '<div class="recipe-ing' + (conflict ? " blocked" : "") + '">' +
        '<span class="ri-name">' + esc(it.food.name) + (conflict ? ' <span class="allergen-mini">' + esc(allergenNames(foodAllergens(it.food))) + "</span>" : "") + "</span>" +
        '<span class="ri-grams mono">' + it.grams + " г</span>" +
        '<span class="ri-kcal mono">' + Math.round(Number(it.food.kcal) * m) + "</span>" +
      "</div>";
    }).join("");
    var steps = (r.steps || []).map(function (s, i) {
      return '<div class="recipe-step"><span class="rs-num">' + (i + 1) + "</span><p>" + esc(s) + "</p></div>";
    }).join("");
    openSheet(
      sheetHead(r.name, cuisineName(r.cuisine) + " · " + mealName(r.meal) + " · " + r.time + " мин") +
      '<div class="card recipe-summary">' +
        '<div class="recipe-kcal"><b class="mono">' + t.kcal + '</b><span> ккал</span></div>' +
        planMacroLine(t) +
        (r.tags && r.tags.length ? '<div class="badge-row" style="margin-top:10px">' + recipeTagsHtml(r) + "</div>" : "") +
      "</div>" +
      (blocked ? '<div class="allergy-warning">' + icon("alert") + '<div><b>В рецепте есть твои аллергены: ' + esc(allergenNames(recipeAllergenIds(r))) + '.</b><span>Добавление в дневник заблокировано. Можно посмотреть состав и заменить продукты.</span></div></div>' : "") +
      '<div class="section-title"><h2>Ингредиенты</h2><span class="plan-theme">' + items.length + " шт.</span></div>" +
      '<div class="card tight recipe-ingredients">' + ingredients + "</div>" +
      '<div class="section-title"><h2>Как готовить</h2><span class="plan-theme">' + r.time + " мин</span></div>" +
      '<div class="recipe-steps">' + steps + "</div>" +
      (r.tip ? '<div class="recipe-tip">' + icon("info") + "<span>" + esc(r.tip) + "</span></div>" : "") +
      '<div class="field" style="margin-top:14px"><label>Приём пищи</label><select class="input" id="recipe-meal-select">' +
        DB.meals.map(function (m) {
          var selected = r.meal === "breakfast" ? "breakfast" : r.meal === "snack" ? "snack" : (m.id === "lunch" ? "lunch" : "");
          return '<option value="' + m.id + '"' + (m.id === selected ? " selected" : "") + ">" + m.name + "</option>";
        }).join("") +
      "</select></div>" +
      '<button class="btn btn-primary btn-block" data-action="add-recipe" data-id="' + esc(r.id) + '"' + (blocked ? " disabled" : "") + ">" + icon("plus") + (blocked ? "Нельзя добавить: аллергены" : "Добавить в дневник") + "</button>"
    );
  }
  function openMenuDetail(id) {
    var menu = MENU_INDEX[id];
    if (!menu) return;
    var entries = menuRecipeEntries(menu);
    var totals = menuTotals(menu);
    var blocked = entries.filter(function (e) { return recipeBlocked(e.recipe); }).length;
    openSheet(
      sheetHead(menu.name, cuisineName(menu.cuisine) + " · меню на день") +
      '<div class="card recipe-summary">' +
        '<div class="recipe-kcal"><b class="mono">' + totals.kcal + '</b><span> ккал</span></div>' +
        planMacroLine(totals) +
        '<p class="note" style="margin-top:10px">' + esc(menu.desc || "") + "</p>" +
      "</div>" +
      '<div class="menu-meals">' + entries.map(menuRecipeRow).join("") + "</div>" +
      (blocked ? '<p class="allergy-note">' + icon("alert") + " " + blocked + " блюд(а) содержат твои аллергены и не будут добавлены.</p>" : "") +
      '<button class="btn btn-primary btn-block" style="margin-top:12px" data-action="add-menu" data-id="' + esc(menu.id) + '" data-date="' + esc(ui.planMode === "cuisine" ? (ui.planAnchor || dkey()) : ui.date) + '">' + icon("plus") + "Добавить меню в дневник</button>" +
      '<p class="hint">Порции на одного человека. После добавления граммы можно изменить в дневнике.</p>'
    );
  }
  function appendRecipeToDay(recipe, dateKey, mealId, planPrefix) {
    var day = getDay(dateKey);
    var added = 0;
    recipeFoodItems(recipe).forEach(function (it) {
      var planId = planPrefix + "|" + it.food.id;
      var exists = (day.food || []).some(function (e) { return e.planId === planId; });
      if (exists) return;
      day.food.push({
        id: "f" + nowMs() + Math.random().toString(36).slice(2, 5),
        name: it.food.name,
        grams: it.grams,
        kcal: it.food.kcal,
        p: it.food.p,
        f: it.food.f,
        c: it.food.c,
        fiber: it.food.fiber || 0,
        meal: mealId,
        planId: planId,
        foodId: it.food.id,
        allergens: foodAllergens(it.food).slice()
      });
      added++;
    });
    return added;
  }
  function addRecipeToDiary(id) {
    var r = RECIPE_INDEX[id];
    if (!r) return;
    if (recipeBlocked(r)) return toast("В рецепте есть твои аллергены");
    var sel = $("#recipe-meal-select");
    var meal = sel ? sel.value : (r.meal === "breakfast" ? "breakfast" : r.meal === "snack" ? "snack" : "lunch");
    var n = appendRecipeToDay(r, ui.date, meal, ui.date + "|r:" + r.id + "|" + meal);
    save(); closeSheet(); render();
    toast(n ? "Рецепт добавлен: " + r.name : "Этот рецепт уже в дневнике");
  }
  function addMenuToDiary(id, dateKey) {
    var menu = MENU_INDEX[id];
    if (!menu) return;
    var date = dateKey || ui.date;
    var n = 0, skipped = 0;
    menuRecipeEntries(menu).forEach(function (e) {
      if (recipeBlocked(e.recipe)) { skipped++; return; }
      n += appendRecipeToDay(e.recipe, date, e.meal.id, date + "|m:" + menu.id + "|" + e.meal.id);
    });
    save(); closeSheet(); render();
    if (n) toast("Меню добавлено: " + menu.name + (skipped ? " · пропущено " + skipped : ""));
    else if (skipped) toast("Все блюда меню содержат аллергены");
    else toast("Это меню уже в дневнике");
  }

  /* ---------------- water ---------------- */
  function waterFor(k) { return clamp(Number(getDay(k).water) || 0, 0, 20000); }
  function waterCard(dateKey) {
    var ml = waterFor(dateKey);
    var norm = waterNorm();
    var pct = norm > 0 ? clamp(ml / norm * 100, 0, 100) : 0;
    var left = Math.max(0, norm - ml);
    return '<div class="card water-card" style="margin-top:12px">' +
      '<div class="water-head">' +
        '<span class="ico">' + icon("water") + "</span>" +
        '<div class="grow"><div class="n mono">' + ml.toLocaleString("ru-RU") + " / " + norm.toLocaleString("ru-RU") + ' мл</div>' +
        '<div class="h">' + (ml >= norm ? "норма выполнена" : "осталось " + left.toLocaleString("ru-RU") + " мл") + " · " + waterGoalSource() + "</div></div>" +
        '<button class="icon-btn plain" data-action="open-water" aria-label="Вода">' + icon("edit") + "</button>" +
      "</div>" +
      '<div class="water-bar"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
      '<div class="water-actions">' +
        '<button data-action="add-water" data-ml="250">+250</button>' +
        '<button data-action="add-water" data-ml="500">+500</button>' +
        '<button data-action="add-water" data-ml="1000">+1 л</button>' +
      "</div>" +
    "</div>";
  }
  function openWater() {
    var ml = waterFor(ui.date);
    var norm = waterNorm();
    var pct = norm > 0 ? clamp(ml / norm * 100, 0, 100) : 0;
    openSheet(
      sheetHead("Вода", fmtDate(ui.date) + " · норма " + norm.toLocaleString("ru-RU") + " мл") +
      '<div class="water-preview"><div><b class="mono">' + ml.toLocaleString("ru-RU") + '</b><span> / ' + norm.toLocaleString("ru-RU") + ' мл</span></div>' +
        '<div class="water-bar big"><i style="width:' + pct.toFixed(1) + '%"></i></div></div>' +
      '<div class="field"><label>Выпито, мл</label><input class="input" id="water-input" type="number" inputmode="numeric" value="' + ml + '" placeholder="0"></div>' +
      '<p class="hint">Норма: 30 мл/кг + поправка на активность, ограничение 1500–4500 мл. Ручную цель можно задать отдельно.</p>' +
      '<button class="btn btn-primary btn-block" data-action="save-water">Сохранить</button>' +
      '<div class="spacer-8"></div>' +
      '<button class="btn btn-block" data-action="open-water-goal">' + icon("target") + "Норма и цель</button>"
    );
  }
  function addWater(ml) {
    var day = getDay(ui.date);
    day.water = clamp((Number(day.water) || 0) + (Number(ml) || 0), 0, 20000);
    save(); render();
    toast("+" + Number(ml) + " мл · всего " + day.water.toLocaleString("ru-RU") + " мл");
  }
  function saveWater() {
    var v = clamp(Math.round(Number($("#water-input").value) || 0), 0, 20000);
    getDay(ui.date).water = v;
    save(); closeSheet(); render(); toast("Вода сохранена: " + v.toLocaleString("ru-RU") + " мл");
  }
  function openWaterGoal() {
    var auto = autoWaterNorm();
    var manual = Number(state.settings.waterGoalMl) || 0;
    openSheet(
      sheetHead("Норма воды", "Расчёт по весу и активности") +
      '<div class="water-norm-card"><div><b class="mono">' + waterNorm().toLocaleString("ru-RU") + '</b><span> мл/день</span></div>' +
        '<p>Сейчас: ' + waterGoalSource() + '. Авто-норма для твоего профиля — ' + auto.toLocaleString("ru-RU") + ' мл.</p></div>' +
      '<div class="field"><label>Своя норма, мл (пусто — авто)</label><input class="input" id="water-goal-input" type="number" inputmode="numeric" value="' + (manual || "") + '" placeholder="' + auto + '"></div>' +
      '<p class="hint">Формула: 30 мл × вес + поправка на активность (0/150/300/450 мл). Авто ограничена 1500–4500 мл и округлена до 50. Ручная — 500–6000 мл.</p>' +
      '<button class="btn btn-primary btn-block" data-action="save-water-goal">Сохранить</button>' +
      '<div class="spacer-8"></div>' +
      '<button class="btn btn-block" data-action="reset-water-goal">Вернуть авто-норму</button>'
    );
  }
  function saveWaterGoal() {
    var raw = ($("#water-goal-input") || {}).value || "";
    raw = String(raw).trim();
    var v = raw === "" ? 0 : clamp(Math.round(Number(raw) || 0), 500, 6000);
    state.settings.waterGoalMl = v;
    save(); closeSheet(); render();
    toast(v ? "Норма воды: " + v.toLocaleString("ru-RU") + " мл" : "Норма воды: авто " + autoWaterNorm().toLocaleString("ru-RU") + " мл");
  }
  function resetWaterGoal() {
    state.settings.waterGoalMl = 0;
    save(); closeSheet(); render();
    toast("Норма воды: авто " + autoWaterNorm().toLocaleString("ru-RU") + " мл");
  }

  /* ---------------- step sensors ---------------- */
  function nativeSensorBridge() {
    return !!(window.CUTTRACKAndroid && typeof window.CUTTRACKAndroid.startStepTracking === "function");
  }
  function motionSupported() { return typeof window.DeviceMotionEvent !== "undefined"; }
  function sensorSupported() { return nativeSensorBridge() || motionSupported(); }
  function sensorModeLabel(mode) {
    if (mode === "step-counter") return "Шагомер Android";
    if (mode === "step-detector") return "Детектор шагов Android";
    if (mode === "accelerometer") return "Акселерометр Android";
    if (mode === "device-motion") return "Акселерометр + гироскоп";
    return mode || "";
  }
  function sensorShortStatus() {
    if (ui.sensor.active) return "Вкл";
    return sensorSupported() ? "Датчик" : "Нет";
  }
  function requestMotionPermission() {
    return new Promise(function (resolve) {
      if (typeof window.DeviceMotionEvent !== "undefined" && typeof window.DeviceMotionEvent.requestPermission === "function") {
        window.DeviceMotionEvent.requestPermission().then(function (r) {
          resolve(r === "granted");
        }).catch(function () { resolve(false); });
      } else {
        resolve(true);
      }
    });
  }
  function refreshSensorUI() {
    var s = ui.sensor;
    var today = Number(getDay(dkey()).steps) || 0;
    function set(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
    set("sensor-today", today.toLocaleString("ru-RU"));
    set("sensor-session", String(s.session));
    set("sensor-accel", s.accel ? round(s.accel, 1) + " м/с²" : "—");
    set("sensor-gyro", s.gyro ? Math.round(s.gyro) + " °/с" : "—");
    set("sensor-state", s.active ? "Датчик активен" : "Датчик выключен");
    set("sensor-source", sensorModeLabel(s.mode) || (sensorSupported() ? "Готов к включению" : "Недоступно"));
    var dot = document.getElementById("sensor-dot");
    if (dot) dot.classList.toggle("on", s.active);
    var btn = document.getElementById("sensor-btn");
    if (btn) btn.textContent = s.active ? "Остановить" : "Включить датчик";
    var err = document.getElementById("sensor-error");
    if (err) { err.textContent = s.error || ""; err.style.display = s.error ? "block" : "none"; }
    var sv = document.getElementById("steps-value");
    if (sv) sv.textContent = today ? today.toLocaleString("ru-RU") : "—";
    var ss = document.getElementById("steps-sub");
    if (ss) ss.textContent = today ? "шагов · ≈ " + stepKcal(today, state.profile ? state.profile.weightKg : 80) + " ккал" : "цель " + state.settings.stepsGoal.toLocaleString("ru-RU");
  }
  function applySensorSteps() {
    var s = ui.sensor;
    var today = dkey();
    if (s.day !== today) {
      s.day = today;
      s.baseSteps = Number(getDay(today).steps) || 0;
      s.session = 0;
    }
    var day = getDay(today);
    day.steps = Math.max(0, Math.round(s.baseSteps + s.session));
    if (s.saveTimer) clearTimeout(s.saveTimer);
    s.saveTimer = setTimeout(function () {
      s.saveTimer = null;
      save();
    }, 1200);
    refreshSensorUI();
  }
  function startMotionFallback() {
    var s = ui.sensor;
    requestMotionPermission().then(function (granted) {
      if (!granted) {
        s.error = "Нет разрешения на движение. Разреши его в настройках Safari.";
        refreshSensorUI();
        return;
      }
      s.active = true;
      s.native = false;
      s.mode = "device-motion";
      window.addEventListener("devicemotion", handleMotion, { passive: true });
      save();
      refreshSensorUI();
      toast("Датчики включены");
    });
  }
  function startSensors() {
    var s = ui.sensor;
    if (s.active) { stopSensors(); return; }
    s.error = "";
    s.session = 0;
    s.accel = 0;
    s.gyro = 0;
    s.mode = "";
    s.gravity = 0;
    s.inPeak = false;
    s.lastStepAt = 0;
    s.lastGyroAt = 0;
    s.lastUiAt = 0;
    s.gyroSeen = false;
    s.gyroActive = false;
    s.day = dkey();
    s.baseSteps = Number(getDay(s.day).steps) || 0;
    if (nativeSensorBridge()) {
      s.native = true;
      try {
        var res = JSON.parse(window.CUTTRACKAndroid.startStepTracking() || "{}");
        if (res.permission === "requested") {
          s.error = "Разреши доступ к физической активности в системном окне и нажми «Включить» ещё раз.";
          refreshSensorUI();
          return;
        }
        if (!res.ok) {
          s.native = false;
          if (motionSupported()) { startMotionFallback(); return; }
          s.error = res.error || "Датчик недоступен на этом устройстве.";
          refreshSensorUI();
          return;
        }
        s.active = true;
        s.mode = res.sensor || "step-counter";
        s.poll = setInterval(pollNativeSensors, 1000);
        save();
        refreshSensorUI();
        toast("Датчик включён: " + sensorModeLabel(s.mode));
        return;
      } catch (e) {
        s.native = false;
        if (motionSupported()) { startMotionFallback(); return; }
        s.error = "Не удалось запустить датчик.";
        refreshSensorUI();
        return;
      }
    }
    if (!motionSupported()) {
      s.error = "На этом устройстве нет доступа к датчикам движения.";
      refreshSensorUI();
      return;
    }
    startMotionFallback();
  }
  function stopSensors(silent) {
    var s = ui.sensor;
    if (s.poll) { clearInterval(s.poll); s.poll = null; }
    if (s.saveTimer) { clearTimeout(s.saveTimer); s.saveTimer = null; }
    if (s.native && window.CUTTRACKAndroid && typeof window.CUTTRACKAndroid.stopStepTracking === "function") {
      try { window.CUTTRACKAndroid.stopStepTracking(); } catch (e) {}
    } else {
      window.removeEventListener("devicemotion", handleMotion);
    }
    if (s.active) {
      save();
      if (!silent) toast("Датчик остановлен");
    }
    s.active = false;
    refreshSensorUI();
  }
  function pollNativeSensors() {
    var s = ui.sensor;
    if (!s.active || !s.native) return;
    try {
      var d = JSON.parse(window.CUTTRACKAndroid.getStepData() || "{}");
      if (d.permission === "denied") {
        s.error = "Доступ к физической активности запрещён в настройках Android.";
        stopSensors(true);
        return;
      }
      if (d.ok === false && d.tracking === false) {
        s.error = d.error || "Датчик остановлен системой.";
        stopSensors(true);
        return;
      }
      s.accel = Number(d.accel) || 0;
      s.gyro = Number(d.gyro) || 0;
      s.mode = d.sensor || s.mode;
      var session = Number(d.session) || 0;
      if (session !== s.session) {
        s.session = session;
        applySensorSteps();
      }
      refreshSensorUI();
    } catch (e) {}
  }
  function handleMotion(ev) {
    var s = ui.sensor;
    if (!s.active || s.native) return;
    var now = nowMs();
    var acc = ev.accelerationIncludingGravity || ev.acceleration;
    if (acc && typeof acc.x === "number") {
      var mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (!s.gravity) s.gravity = mag;
      s.gravity = s.gravity * 0.82 + mag * 0.18;
      var lin = mag - s.gravity;
      s.accel = Math.abs(lin);
      if (lin > 1.15 && !s.inPeak) {
        s.inPeak = true;
        var interval = now - s.lastStepAt;
        if (interval > 260 && interval < 2000) {
          if (!s.gyroSeen || s.gyroActive || lin > 2.8) {
            s.lastStepAt = now;
            s.session++;
            applySensorSteps();
          }
        } else if (interval >= 2000) {
          s.lastStepAt = now;
          s.session++;
          applySensorSteps();
        }
      } else if (lin < 0.35) {
        s.inPeak = false;
      }
    }
    var rr = ev.rotationRate;
    if (rr && (rr.alpha != null || rr.beta != null || rr.gamma != null)) {
      var gx = Number(rr.alpha) || 0, gy = Number(rr.beta) || 0, gz = Number(rr.gamma) || 0;
      s.gyro = Math.sqrt(gx * gx + gy * gy + gz * gz);
      s.gyroSeen = true;
      if (s.gyro > 18) {
        s.gyroActive = true;
        s.lastGyroAt = now;
      }
      if (now - s.lastGyroAt > 1500) s.gyroActive = false;
    }
    if (now - s.lastUiAt > 250) {
      s.lastUiAt = now;
      refreshSensorUI();
    }
  }
  function resetSensorSession() {
    var s = ui.sensor;
    s.baseSteps = Number(getDay(dkey()).steps) || 0;
    s.session = 0;
    if (s.native && window.CUTTRACKAndroid && typeof window.CUTTRACKAndroid.resetStepSession === "function") {
      try { window.CUTTRACKAndroid.resetStepSession(); } catch (e) {}
    }
    applySensorSteps();
    toast("Сессия сброшена");
  }
  function openSensors() {
    var s = ui.sensor;
    var today = Number(getDay(dkey()).steps) || 0;
    openSheet(
      sheetHead("Шагомер и датчики", "Акселерометр считает шаги, гироскоп помогает отсечь лишние движения") +
      '<div class="sensor-panel">' +
        '<div class="sensor-top"><span class="sensor-dot' + (s.active ? " on" : "") + '" id="sensor-dot"></span>' +
          '<div class="grow"><b id="sensor-state">' + (s.active ? "Датчик активен" : "Датчик выключен") + '</b>' +
          '<span id="sensor-source">' + esc(sensorModeLabel(s.mode) || (sensorSupported() ? "Готов к включению" : "Недоступно")) + '</span></div></div>' +
        '<div class="sensor-live">' +
          '<div><b class="mono" id="sensor-today">' + today.toLocaleString("ru-RU") + '</b><span>шагов сегодня</span></div>' +
          '<div><b class="mono" id="sensor-session">' + s.session + '</b><span>за сессию</span></div>' +
        '</div>' +
        '<div class="sensor-readout">' +
          '<span>Акселерометр <b id="sensor-accel">' + (s.accel ? round(s.accel, 1) + " м/с²" : "—") + '</b></span>' +
          '<span>Гироскоп <b id="sensor-gyro">' + (s.gyro ? Math.round(s.gyro) + " °/с" : "—") + '</b></span>' +
        '</div>' +
        '<p class="sensor-error" id="sensor-error" style="display:' + (s.error ? "block" : "none") + '">' + esc(s.error || "") + '</p>' +
        '<button class="btn btn-primary btn-block" id="sensor-btn" data-action="toggle-sensors">' + (s.active ? "Остановить" : "Включить датчик") + '</button>' +
      '</div>' +
      '<p class="hint">Пройди 10–15 шагов — счётчик должен расти. ' +
        (nativeSensorBridge()
          ? "В APK используется аппаратный шагомер Android (TYPE_STEP_COUNTER / TYPE_STEP_DETECTOR); если его нет — акселерометр с проверкой по гироскопу."
          : "В PWA шаги считаются по акселерометру, гироскоп помогает отсечь ложные движения. На iPhone счёт идёт только пока приложение открыто.") +
      "</p>" +
      '<div class="spacer-8"></div>' +
      '<button class="btn btn-block" data-action="edit-steps">' + icon("edit") + 'Ввести шаги вручную</button>' +
      '<button class="btn btn-block" style="margin-top:8px" data-action="reset-sensor-session">Сбросить сессию</button>'
    );
    refreshSensorUI();
  }

  function weekStats() {
    var to = dkey();
    var from = shiftKey(to, -6);
    var list = state.workouts.filter(function (w) { return w.date >= from && w.date <= to; });
    var vol = 0, sets = 0;
    list.forEach(function (w) {
      (w.exercises || []).forEach(function (ex) {
        (ex.sets || []).forEach(function (s) {
          vol += (Number(s.w) || 0) * (Number(s.r) || 0);
          sets++;
        });
      });
    });
    return { count: list.length, volume: Math.round(vol), sets: sets };
  }

  /* ---------------- render ---------------- */
  function render() {
    var has = !!state.profile;
    document.body.classList.toggle("onboarding", !has);
    var view = $("#view");
    if (!has) {
      view.innerHTML = '<div class="view">' + onboardingView() + "</div>";
      return;
    }
    renderTopbar();
    var html = "";
    if (ui.tab === "food") html = viewFood();
    else if (ui.tab === "plan") html = viewPlan();
    else if (ui.tab === "train") html = state.activeWorkout ? viewActive() : viewTrain();
    else if (ui.tab === "progress") html = viewProgress();
    else if (ui.tab === "guide") html = viewGuide();
    else html = viewProfile();
    view.innerHTML = '<div class="view">' + html + "</div>";
    enhanceLabels(view);
    updateTabs();
    renderRestBar();
    manageIntervals();
    if (ui.tab === "train" && state.activeWorkout) keepAwake();
  }

  function renderTopbar() {
    $("#brand-mark").innerHTML = icon("dumbbell");
    var action = $("#top-action");
    var label = ui.tab === "profile" ? "Настройки профиля" : "Профиль";
    action.innerHTML = icon(ui.tab === "profile" ? "settings" : "profile");
    action.setAttribute("aria-label", label);
    var d = new Date();
    $("#top-date").textContent = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", weekday: "short" }).format(d);
  }

  function updateTabs() {
    $$("#tabbar .tab").forEach(function (b) {
      b.classList.toggle("active", b.dataset.tab === ui.tab);
    });
  }

  function initStaticUi() {
    $$("[data-icon]").forEach(function (el) {
      el.innerHTML = icon(el.dataset.icon);
    });
    var ver = $("#top-version");
    if (ver) ver.textContent = DB.appVersion || "0.1v";
  }

  /* ---------------- onboarding ---------------- */
  function onboardingView() {
    var acts = DB.activityLevels.map(function (a, i) {
      return '<button class="chip' + (a.id === "mid" ? " on" : "") + '" data-action="onb-pick" data-group="activity" data-val="' + a.id + '">' + a.label + "</button>";
    }).join("");
    return '' +
      '<div class="onboard">' +
        '<div class="logo"><span class="brand-mark">' + icon("dumbbell") + '</span><div><b>CUTTRACK</b><span>трекер сушки и зала</span></div></div>' +
        "<h1>Считай <em>калории</em>.<br>Веди <em>зал</em>.<br>Худей без хаоса.</h1>" +
        '<p class="lead">План по гайду bigpro427: дефицит, макросы, шаги и тренировки — в одном приложении. Данные хранятся только на твоём устройстве.</p>' +

        '<div class="step-label">1. О тебе</div>' +
        '<div class="card tight">' +
          '<div class="field"><label>Имя (необязательно)</label><input class="input" id="onb-name" placeholder="Как тебя звать" autocomplete="nickname"></div>' +
          '<div class="field"><label>Пол</label><div class="seg" id="onb-sex">' +
            '<button class="on" data-action="onb-pick" data-group="sex" data-val="m">Мужской</button>' +
            '<button data-action="onb-pick" data-group="sex" data-val="f">Женский</button>' +
          "</div></div>" +
          '<div class="field-row">' +
            '<div class="field"><label>Возраст</label><input class="input" id="onb-age" type="number" inputmode="numeric" placeholder="25"></div>' +
            '<div class="field"><label>Рост, см</label><input class="input" id="onb-height" type="number" inputmode="numeric" placeholder="180"></div>' +
          "</div>" +
          '<div class="field-row">' +
            '<div class="field"><label>Вес, ' + units() + '</label><input class="input" id="onb-weight" type="number" inputmode="decimal" placeholder="80"></div>' +
            '<div class="field"><label>% жира (если знаешь)</label><input class="input" id="onb-bf" type="number" inputmode="decimal" placeholder="—"></div>' +
          "</div>" +
          '<p class="hint">Без % жира приложение не сможет посчитать максимальный безопасный дефицит, но всё остальное будет работать.</p>' +
        "</div>" +

        '<div class="step-label">2. Активность</div>' +
        '<div class="chips" id="onb-activity">' + acts + "</div>" +
        '<p class="hint" style="margin-top:-4px;margin-bottom:14px" id="onb-act-hint">6–10 тыс. шагов в день</p>' +

        '<div class="step-label">3. Цель</div>' +
        '<div class="card tight">' +
          '<div class="seg" id="onb-goal">' +
            '<button class="on" data-action="onb-pick" data-group="goal" data-val="cut">Сушка</button>' +
            '<button data-action="onb-pick" data-group="goal" data-val="maintain">Поддержание</button>' +
          "</div>" +
          '<div id="onb-deficit" style="margin-top:12px">' +
            '<div class="seg" id="onb-mode">' +
              '<button class="on" data-action="onb-pick" data-group="mode" data-val="moderate">Умеренный</button>' +
              '<button data-action="onb-pick" data-group="mode" data-val="aggressive">Агрессивный</button>' +
            "</div>" +
            '<p class="hint" id="onb-mode-hint">~500 ккал/день · примерно 0,45 кг в неделю</p>' +
          "</div>" +
        "</div>" +

        '<div class="step-label">4. Аллергии</div>' +
        '<div class="chips allergy-chips" id="onb-allergies">' + (DB.allergens || []).map(function (a) {
          return '<button class="chip" data-action="toggle-allergy" data-allergen="' + esc(a.id) + '">' + esc(a.name) + "</button>";
        }).join("") + "</div>" +
        '<p class="hint" style="margin-top:-4px;margin-bottom:14px">Отметь, чего избегать. Продукты и меню с этими аллергенами будут скрыты или помечены. Можно изменить в профиле.</p>' +

        '<div class="spacer-16"></div>' +
        '<button class="btn btn-primary btn-block" data-action="start-app">' + icon("arrow") + "Начать</button>" +
        '<p class="note" style="margin-top:12px">Это не медицинская рекомендация. При проблемах со здоровьем, подросткам и людям с РПП — сначала к специалисту.</p>' +
      "</div>";
  }

  /* ---------------- food view ---------------- */
  function viewFood() {
    var c = calcTargets();
    var t = totals(ui.date);
    var day = state.days[ui.date] || { food: [], steps: 0, water: 0 };
    var left = c.target - t.kcal;
    var pct = c.target > 0 ? clamp(t.kcal / c.target, 0, 1) : 0;
    var radius = 58;
    var circ = 2 * Math.PI * radius;
    var offset = circ * (1 - pct);

    var mealsHtml = DB.meals.map(function (m) {
      var items = (day.food || []).filter(function (e) { return e.meal === m.id; });
      var mk = items.reduce(function (a, e) { return a + Number(e.kcal) * Number(e.grams) / 100; }, 0);
      var rows = items.length ? items.map(function (e) {
        var conflict = entryBlocked(e);
        return '<div class="food-row">' +
          '<button class="grow" style="text-align:left" data-action="edit-food" data-id="' + esc(e.id) + '">' +
            '<div class="fname">' + esc(e.name) + "</div>" +
            '<div class="fmeta">' + round(e.grams) + " г · Б " + round(Number(e.p) * e.grams / 100) + " · Ж " + round(Number(e.f) * e.grams / 100) + " · У " + round(Number(e.c) * e.grams / 100) +
              (conflict ? ' · <span class="allergen-mini">аллерген: ' + esc(allergenNames(entryAllergens(e))) + "</span>" : "") + "</div>" +
          "</button>" +
          '<div class="fkcal mono">' + round(Number(e.kcal) * e.grams / 100) + "</div>" +
          '<button class="icon-btn plain del" data-action="delete-food" data-id="' + esc(e.id) + '" aria-label="Удалить">' + icon("x") + "</button>" +
        "</div>";
      }).join("") : '<div class="empty-line">Пока пусто — добавь продукт</div>';
      return '<div class="card meal" style="margin-top:10px">' +
        '<div class="meal-head">' +
          '<span class="meal-ico">' + icon(m.icon) + "</span>" +
          '<div class="grow"><div class="name">' + m.name + '</div><div class="kcal">' + Math.round(mk) + " ккал</div></div>" +
          '<button class="icon-btn add" data-action="add-food" data-meal="' + m.id + '" aria-label="Добавить">' + icon("plus") + "</button>" +
        "</div>" +
        '<div class="meal-items">' + rows + "</div>" +
      "</div>";
    }).join("");

    var steps = Number(day.steps) || 0;
    return '' +
      '<div class="date-nav">' +
        '<div class="date-label">' + fmtDate(ui.date) + "<span>" + (ui.date === dkey() ? "сегодняшний день" : "дневник") + "</span></div>" +
        '<div class="nav-btns">' +
          '<button class="icon-btn" data-action="prev-day" aria-label="Назад">' + icon("left") + "</button>" +
          '<button class="icon-btn" data-action="next-day" aria-label="Вперёд">' + icon("right") + "</button>" +
        "</div>" +
      "</div>" +

      '<div class="card summary">' +
        '<div class="summary-top">' +
          '<div class="ring-wrap">' +
            '<svg viewBox="0 0 138 138">' +
              '<circle class="ring-track" cx="69" cy="69" r="' + radius + '"></circle>' +
              '<circle class="ring-bar" cx="69" cy="69" r="' + radius + '" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"' + (left < 0 ? ' style="stroke:var(--danger)"' : "") + "></circle>" +
            "</svg>" +
            '<div class="ring-center"><b class="mono">' + t.kcal + "</b><span>съедено</span></div>" +
          "</div>" +
          '<div class="summary-side">' +
            '<div class="big">' + (left >= 0 ? "Осталось" : "Перебор") + "</div>" +
            '<div class="sub">цель ' + c.target + " ккал · " + units() + "</div>" +
            '<div class="left mono">' + Math.abs(left) + ' <small>ккал</small></div>' +
            '<div class="badge-row" style="margin-top:10px">' +
              '<span class="pill">' + (c.deficit ? "дефицит " + c.deficit : "поддержание") + "</span>" +
              '<span class="pill gray">' + round(toDisp(c.rateKg), 2) + " " + units() + "/нед</span>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="macros">' +
          macroBar("Белки", t.p, c.protein, "i-p") +
          macroBar("Жиры", t.f, c.fat, "i-f") +
          macroBar("Углеводы", t.c, c.carbs, "i-c") +
        "</div>" +
      "</div>" +

      '<div class="card steps-card" style="margin-top:12px">' +
        '<span class="ico">' + icon("steps") + "</span>" +
        '<div class="grow"><div class="n mono" id="steps-value">' + (steps ? steps.toLocaleString("ru-RU") : "—") + '</div><div class="h" id="steps-sub">' + (steps ? "шагов · ≈ " + stepKcal(steps, state.profile.weightKg) + " ккал" : "цель " + state.settings.stepsGoal.toLocaleString("ru-RU")) + "</div></div>" +
        '<button class="icon-btn plain" data-action="open-sensors" aria-label="Датчики шагов">' + icon("phone") + "</button>" +
        '<button class="btn btn-sm edit" data-action="edit-steps">' + (steps ? "Изменить" : "Добавить") + "</button>" +
      "</div>" +

      waterCard(ui.date) +
      allergyBanner() +
      mealsHtml +
      '<p class="note" style="margin-top:14px">Норма — оценка по формуле Миффлина и уровню активности. Следи за средним весом за неделю и корректируй.</p>' +
      '<div class="spacer-16"></div>' +
      '<button class="btn btn-block" data-action="open-recipes">' + icon("guide") + "Каталог рецептов и кухонь</button>";
  }

  function macroBar(name, val, target, cls) {
    var pct = target > 0 ? clamp(val / target * 100, 0, 100) : 0;
    return '<div><div class="macro-head"><span>' + name + "</span><b class=\"mono\">" + val + " / " + target + " г</b></div>" +
      '<div class="bar ' + cls + '"><i style="width:' + pct.toFixed(1) + '%"></i></div></div>';
  }

  /* ---------------- train view ---------------- */
  function viewTrain() {
    var ws = weekStats();
    var recent = state.workouts.slice(0, 5);
    var history = recent.length ? recent.map(historyRow).join("") : '<div class="empty-line">Пока нет тренировок. Начни первую — она появится здесь.</div>';

    var templates = DB.templates.map(function (tpl) {
      return '<div class="template-group"><h4>' + esc(tpl.name) + "</h4>" +
        tpl.days.map(function (d) {
          return '<button class="template-row" data-action="start-day" data-day="' + d.id + '">' +
            '<div class="grow"><div class="tn">' + esc(d.name) + '</div><div class="tm">' + d.exercises.length + " упражнений · ~60 мин</div></div>" +
            '<span class="go">' + icon("arrow") + "</span></button>";
        }).join("") + "</div>";
    }).join("");

    return '' +
      '<div class="card hero-card">' +
        '<span class="hero-badge">' + icon("dumbbell") + "</span>" +
        "<h3>Тренировка</h3>" +
        "<p>Шаблон или пустая сессия. Сплит не меняй — меняй только объём, если выжат.</p>" +
        '<button class="btn btn-primary" data-action="open-templates">' + icon("play") + "Начать тренировку</button>" +
      "</div>" +

      '<div class="stat-grid" style="margin-top:12px">' +
        '<div class="stat"><div class="k">за 7 дней</div><div class="v mono">' + ws.count + ' <small>трен.</small></div><div class="d">' + ws.sets + " подходов</div></div>" +
        '<div class="stat"><div class="k">объём</div><div class="v mono">' + ws.volume.toLocaleString("ru-RU") + ' <small>' + units() + '</small></div><div class="d">сумма вес × повторы</div></div>' +
      "</div>" +

      '<div class="section-title"><h2>Последние тренировки</h2><button data-action="open-history">Все</button></div>' +
      '<div class="card tight" style="padding:0">' + history + "</div>" +

      '<div class="section-title"><h2>Шаблоны</h2></div>' +
      templates;
  }

  function historyRow(w) {
    var vol = 0, sets = 0;
    (w.exercises || []).forEach(function (ex) {
      (ex.sets || []).forEach(function (s) { vol += (s.w || 0) * (s.r || 0); sets++; });
    });
    return '<button class="history-row" data-action="open-workout" data-id="' + esc(w.id) + '" style="width:100%">' +
      '<span class="h-ico">' + icon("dumbbell") + "</span>" +
      '<div class="h-main grow"><div class="h-name">' + esc(w.name) + '</div><div class="h-meta">' + fmtShort(w.date || dkey()) + " · " + Math.round((w.duration || 0) / 60) + " мин · " + sets + " подходов</div></div>" +
      '<div class="h-vol"><b class="mono">' + Math.round(vol).toLocaleString("ru-RU") + '</b><span>объём, ' + units() + '</span></div>' +
    "</button>";
  }

  function viewActive() {
    var w = state.activeWorkout;
    var elapsed = Math.round((nowMs() - w.startedAt) / 1000);
    var exs = w.exercises.map(function (ex, i) { return exerciseCard(ex, i); }).join("");
    return '' +
      '<div class="workout-head">' +
        '<div class="grow"><h2>' + esc(w.name) + '</h2><div class="timer mono" id="wo-elapsed">' + fmtClock(elapsed) + " · идёт тренировка</div></div>" +
        '<button class="btn btn-sm btn-primary" data-action="finish-workout">' + icon("check") + "Завершить</button>" +
      "</div>" +
      (exs || '<div class="card center muted" style="padding:30px 14px">Добавь первое упражнение</div>') +
      '<button class="btn btn-block" style="margin-top:12px" data-action="add-exercise">' + icon("plus") + "Добавить упражнение</button>" +
      '<div class="workout-actions">' +
        '<button class="btn btn-danger" data-action="cancel-workout">Отменить</button>' +
        '<button class="btn btn-primary" data-action="finish-workout">Завершить</button>' +
      "</div>" +
      '<p class="note" style="margin-top:10px">Отмечай подход галочкой — запустится таймер отдыха.</p>';
  }

  function exerciseCard(ex, i) {
    var sets = ex.sets.map(function (s, j) {
      return '<div class="set-row ' + (s.done ? "done" : "") + '">' +
        '<span class="idx">' + (j + 1) + "</span>" +
        '<input class="set-input" type="number" inputmode="decimal" placeholder="—" value="' + esc(s.w) + '" data-wf="w" data-i="' + i + '" data-j="' + j + '">' +
        '<input class="set-input" type="number" inputmode="numeric" placeholder="—" value="' + esc(s.r) + '" data-wf="r" data-i="' + i + '" data-j="' + j + '">' +
        '<input class="set-input" type="number" inputmode="numeric" placeholder="—" value="' + esc(s.rir) + '" data-wf="rir" data-i="' + i + '" data-j="' + j + '">' +
        '<button class="set-check ' + (s.done ? "done" : "") + '" data-action="toggle-set" data-i="' + i + '" data-j="' + j + '" aria-label="Готово">' + icon("check") + "</button>" +
      "</div>";
    }).join("");
    return '<div class="card exercise">' +
      '<div class="exercise-head">' +
        '<div class="grow"><div class="name">' + esc(ex.name) + '</div><div class="group">' + esc(ex.group || "") + "</div></div>" +
        '<button class="icon-btn plain danger" data-action="remove-exercise" data-i="' + i + '" aria-label="Убрать">' + icon("trash") + "</button>" +
      "</div>" +
      '<div class="set-head"><span>#</span><span>вес, ' + units() + "</span><span>повт.</span><span>RIR</span><span></span></div>" +
      sets +
      '<button class="add-set" data-action="add-set" data-i="' + i + '">+ подход</button>' +
    "</div>";
  }

  /* ---------------- progress view ---------------- */
  function viewProgress() {
    var c = calcTargets();
    var ws = state.weights.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
    var latest = ws[ws.length - 1];
    var avg = weekAvg(0), prev = weekAvg(7);
    var delta = avg != null && prev != null ? avg - prev : null;
    var pct = delta != null && avg ? delta / avg * 100 : null;
    var chartWs = ws.slice(-30);
    var steps7 = [];
    for (var i = 6; i >= 0; i--) {
      var k = shiftKey(dkey(), -i);
      steps7.push({ k: k, v: Number((state.days[k] || {}).steps) || 0 });
    }
    var maxSteps = Math.max.apply(null, steps7.map(function (x) { return x.v; }).concat([1]));
    var water7 = [];
    for (var wi = 6; wi >= 0; wi--) {
      var wk = shiftKey(dkey(), -wi);
      water7.push({ k: wk, v: waterFor(wk) });
    }
    var maxWater = Math.max.apply(null, water7.map(function (x) { return x.v; }).concat([waterNorm(), 1]));
    var wsStats = weekStats();
    var totalVol = state.workouts.reduce(function (a, w) {
      var v = 0;
      (w.exercises || []).forEach(function (ex) { (ex.sets || []).forEach(function (s) { v += (s.w || 0) * (s.r || 0); }); });
      return a + v;
    }, 0);

    return '' +
      '<div class="section-title" style="margin-top:2px"><h2>Вес</h2><button data-action="add-weight">+ Записать</button></div>' +
      '<div class="card chart-card">' +
        '<div class="chart-head"><div><b class="mono">' + (latest ? fmtW(latest.kg) : "—") + '</b><div class="tiny muted">' + (latest ? "последняя запись · " + fmtShort(latest.date) : "добавь первый вес") + "</div></div>" +
          (delta != null ? '<span class="pill ' + (delta <= 0 ? "" : "danger") + '">' + (delta > 0 ? "+" : "") + round(toDisp(delta), 2) + " " + units() + "/нед</span>" : '<span class="pill gray">нет динамики</span>') +
        "</div>" +
        weightChart(chartWs) +
        '<div class="stat-grid" style="margin-top:10px">' +
          '<div class="stat"><div class="k">среднее 7 дней</div><div class="v mono">' + (avg != null ? fmtW(avg) : "—") + '</div><div class="d">по взвешиваниям</div></div>' +
          '<div class="stat"><div class="k">темп</div><div class="v mono">' + (pct != null ? round(pct, 2) + "%" : "—") + '</div><div class="d ' + (pct != null && (pct > 0 || pct < -1.5) ? "up" : "good") + '">цель 1–1,5% в неделю</div></div>' +
        "</div>" +
      "</div>" +

      '<div class="section-title"><h2>Шаги за 7 дней</h2><button data-action="edit-steps">+ Сегодня</button></div>' +
      '<div class="card">' +
        '<div class="bars">' + steps7.map(function (x) {
          var h = Math.max(3, Math.round(x.v / maxSteps * 78));
          return '<div class="b"><b>' + (x.v ? Math.round(x.v / 1000) + "k" : "") + '</b><i style="height:' + h + 'px;opacity:' + (x.v ? 1 : .25) + '"></i><span>' + new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(parseKey(x.k)) + "</span></div>";
        }).join("") + "</div>" +
        '<p class="note" style="margin-top:8px">10 тыс. ≈ 300–500 ккал, 20 тыс. ≈ 600–800 ккал. Выше 25 тыс. — смысл падает (constrained TDEE).</p>' +
      "</div>" +

      '<div class="section-title"><h2>Вода за 7 дней</h2><button data-action="open-water">+ Сегодня</button></div>' +
      '<div class="card">' +
        '<div class="bars water-bars">' + water7.map(function (x) {
          var h = Math.max(3, Math.round(x.v / maxWater * 78));
          return '<div class="b"><b>' + (x.v ? round(x.v / 1000, 1) + "л" : "") + '</b><i style="height:' + h + 'px;opacity:' + (x.v ? 1 : .25) + '"></i><span>' + new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(parseKey(x.k)) + "</span></div>";
        }).join("") + "</div>" +
        '<p class="note" style="margin-top:8px">Норма ' + waterNorm().toLocaleString("ru-RU") + ' мл/день · источник: ' + waterGoalSource() + '. Вода — ориентир, а не жёсткое правило.</p>' +
      "</div>" +

      '<div class="stat-grid" style="margin-top:12px">' +
        '<div class="stat"><div class="k">тренировок всего</div><div class="v mono">' + state.workouts.length + '</div><div class="d">за всё время</div></div>' +
        '<div class="stat"><div class="k">общий объём</div><div class="v mono">' + Math.round(totalVol).toLocaleString("ru-RU") + '</div><div class="d">' + units() + ' · вес × повторы</div></div>' +
        '<div class="stat"><div class="k">за 7 дней</div><div class="v mono">' + wsStats.count + ' <small>трен.</small></div><div class="d">' + wsStats.sets + " подходов</div></div>" +
        '<div class="stat"><div class="k">поддержка</div><div class="v mono">' + c.tdee + '</div><div class="d">ккал · оценка TDEE</div></div>' +
      "</div>" +

      '<div class="section-title"><h2>Цель</h2></div>' +
      '<div class="card">' +
        '<div class="row between"><span class="muted tiny">Калории</span><b class="mono">' + c.target + " ккал</b></div>" +
        '<div class="divider"></div>' +
        '<div class="row between"><span class="muted tiny">Дефицит</span><b class="mono">' + c.deficit + " ккал</b></div>" +
        '<div class="divider"></div>' +
        '<div class="row between"><span class="muted tiny">Темп</span><b class="mono">' + round(toDisp(c.rateKg), 2) + " " + units() + "/нед · " + round(c.ratePct, 2) + "%</b></div>" +
        '<div class="divider"></div>' +
        '<div class="row between"><span class="muted tiny">Макс. дефицит по % жира</span><b class="mono">' + (c.maxDef != null ? c.maxDef + " ккал" : "—") + "</b></div>" +
      "</div>";
  }

  function weekAvg(offset) {
    var to = shiftKey(dkey(), -offset);
    var from = shiftKey(to, -6);
    var arr = state.weights.filter(function (w) { return w.date >= from && w.date <= to; });
    if (!arr.length) return null;
    return arr.reduce(function (a, w) { return a + Number(w.kg); }, 0) / arr.length;
  }

  function weightChart(ws) {
    if (!ws.length) {
      return '<div class="center muted" style="height:148px;display:flex;align-items:center;justify-content:center;font-size:12.5px">Здесь появится график веса</div>';
    }
    var W = 320, H = 142, padX = 10, padY = 16;
    var vals = ws.map(function (w) { return Number(w.kg); });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (max - min < 0.8) { max += 0.4; min -= 0.4; }
    var pts = ws.map(function (w, i) {
      var x = ws.length === 1 ? W / 2 : padX + (W - padX * 2) * i / (ws.length - 1);
      var y = H - padY - (H - padY * 2) * (Number(w.kg) - min) / (max - min);
      return [x, y];
    });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var area = line + " L " + pts[pts.length - 1][0].toFixed(1) + " " + H + " L " + pts[0][0].toFixed(1) + " " + H + " Z";
    var grid = [0.25, 0.5, 0.75].map(function (g) {
      var y = padY + (H - padY * 2) * g;
      return '<line class="grid" x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '"></line>';
    }).join("");
    var dots = pts.length < 40 ? pts.map(function (p) { return '<circle class="dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.6"></circle>'; }).join("") : "";
    return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9ff4d" stop-opacity=".28"></stop><stop offset="100%" stop-color="#c9ff4d" stop-opacity="0"></stop></linearGradient></defs>' +
      grid +
      '<path class="area" d="' + area + '"></path>' +
      '<path class="line" d="' + line + '"></path>' + dots +
    "</svg>";
  }

  /* ---------------- guide view ---------------- */
  function viewGuide() {
    var cards = DB.guide.map(function (s) {
      var open = !!ui.guideOpen[s.id];
      return '<div class="guide-card ' + (open ? "open" : "") + '">' +
        '<button class="guide-toggle" data-action="guide-toggle" data-id="' + s.id + '">' +
          '<span class="gi">' + icon(s.icon) + '</span><span class="gt">' + esc(s.title) + '</span><span class="chev">' + icon("chevron") + "</span>" +
        "</button>" +
        (open ? '<div class="guide-body">' + s.items.map(function (i) { return "<p>• " + i + "</p>"; }).join("") + (s.tip ? '<div class="tip">' + s.tip + "</div>" : "") + "</div>" : "") +
      "</div>";
    }).join("");

    return '' +
      '<div class="card guide-intro">' +
        '<span class="pill">гайд bigpro427</span>' +
        '<h2 style="margin-top:10px">Всё, что нужно знать о сушке</h2>' +
        '<p>Короткие правила из видео: дефицит, макросы, углеводы, шаги, сытость и выход из диеты. Полный конспект — в файле рядом.</p>' +
      "</div>" +
      '<div class="spacer-16"></div>' + cards +
      '<p class="source">Источник: <a href="https://www.youtube.com/watch?v=fSfhQebFiHk" target="_blank" rel="noopener">YouTube · bigpro427</a><br>«EVERYTHING YOU WILL EVER NEED TO KNOW ABOUT DIETING»</p>';
  }

  /* ---------------- profile view ---------------- */
  function viewProfile() {
    var p = state.profile, c = calcTargets();
    var initial = (p.name || "C").trim().charAt(0).toUpperCase();
    var bf = p.bodyFat ? p.bodyFat + "% жира" : "% жира не указан";
    return '' +
      '<div class="card profile-card" style="margin-top:2px">' +
        '<div class="row">' +
          '<div class="avatar">' + esc(initial) + "</div>" +
          '<div class="grow" style="margin-left:12px"><div class="pname">' + esc(p.name || "Атлет") + '</div><div class="pmeta">' + p.age + " лет · " + p.heightCm + " см · " + fmtW(p.weightKg) + " · " + bf + "</div></div>" +
          '<button class="icon-btn" data-action="edit-profile" aria-label="Изменить">' + icon("edit") + "</button>" +
        "</div>" +
        '<div class="divider"></div>' +
        '<div class="targets">' +
          '<div class="target"><b class="mono">' + c.target + '</b><span>ккал</span></div>' +
          '<div class="target"><b class="mono">' + c.protein + '</b><span>белок, г</span></div>' +
          '<div class="target"><b class="mono">' + c.fat + '</b><span>жиры, г</span></div>' +
          '<div class="target"><b class="mono">' + c.carbs + '</b><span>углеводы, г</span></div>' +
          '<div class="target"><b class="mono">' + c.deficit + '</b><span>дефицит</span></div>' +
          '<div class="target"><b class="mono">' + round(toDisp(c.rateKg), 2) + '</b><span>' + units() + '/нед</span></div>' +
        "</div>" +
      "</div>" +

      (c.capped ? '<div class="card" style="margin-top:10px;border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.06)"><p class="tiny" style="color:#d9c48c">Дефицит ограничен по проценту жира: максимум <b>' + c.maxDef + " ккал</b>. Это ориентир из расчёта 41 ккал на фунт жира.</p></div>" : "") +
      (c.floorHit ? '<div class="card" style="margin-top:10px;border-color:rgba(255,107,107,.3);background:rgba(255,107,107,.06)"><p class="tiny" style="color:#ffb3b3">Калории подняты до безопасного минимума. Дефицит получился меньше выбранного.</p></div>' : "") +

      '<div class="section-title"><h2>Расчёт</h2></div>' +
      '<div class="list">' +
        listRow("bolt", "BMR", "базальный метаболизм", c.bmr + " ккал") +
        listRow("flame", "TDEE", "с учётом активности", c.tdee + " ккал") +
        listRow("target", "Цель", p.goal === "maintain" ? "поддержание" : "дефицит", c.target + " ккал") +
        listRow("steps", "Макс. дефицит", p.bodyFat ? "по % жира" : "укажи % жира", c.maxDef != null ? c.maxDef + " ккал" : "—") +
      "</div>" +

      '<div class="section-title"><h2>Настройки</h2></div>' +
      '<div class="list">' +
        '<div class="list-row"><span class="li">' + icon("scale") + '</span><span class="lt">Единицы<small>вес и объём</small></span>' +
          '<div class="seg" style="width:120px"><button class="' + (state.settings.units === "kg" ? "on" : "") + '" data-action="set-units" data-u="kg">кг</button><button class="' + (state.settings.units === "lb" ? "on" : "") + '" data-action="set-units" data-u="lb">lb</button></div></div>' +
        '<button class="list-row" data-action="edit-steps-goal"><span class="li">' + icon("steps") + '</span><span class="lt">Шаги<small>дневная цель</small></span><span class="lv mono">' + state.settings.stepsGoal.toLocaleString("ru-RU") + "</span></button>" +
        '<button class="list-row" data-action="open-water-goal"><span class="li">' + icon("water") + '</span><span class="lt">Вода<small>дневная норма</small></span><span class="lv mono">' + waterNorm().toLocaleString("ru-RU") + " мл</span></button>" +
        '<button class="list-row" data-action="open-allergies"><span class="li">' + icon("alert") + '</span><span class="lt">Аллергии<small>фильтр продуктов и меню</small></span><span class="lv">' + esc(allergyShort()) + "</span></button>" +
        '<button class="list-row" data-action="open-sensors"><span class="li">' + icon("phone") + '</span><span class="lt">Шагомер и датчики<small>акселерометр и гироскоп</small></span><span class="lv">' + sensorShortStatus() + "</span></button>" +
        '<button class="list-row" data-action="edit-rest"><span class="li">' + icon("timer") + '</span><span class="lt">Отдых<small>таймер между подходами</small></span><span class="lv mono">' + state.settings.restSec + " сек</span></button>" +
        '<button class="list-row" data-action="toggle-sound"><span class="li">' + icon("bolt") + '</span><span class="lt">Звук таймера<small>сигнал в конце отдыха</small></span><span class="lv">' + (state.settings.sound ? "Вкл" : "Выкл") + "</span></button>" +
      "</div>" +

      '<div class="section-title"><h2>Данные</h2></div>' +
      '<div class="list">' +
        '<button class="list-row" data-action="export"><span class="li">' + icon("download") + '</span><span class="lt">Экспорт<small>сохранить JSON</small></span></button>' +
        '<button class="list-row" data-action="import"><span class="li">' + icon("upload") + '</span><span class="lt">Импорт<small>восстановить из JSON</small></span></button>' +
        '<button class="list-row danger" data-action="reset"><span class="li">' + icon("reset") + '</span><span class="lt">Сбросить всё<small>удалить данные приложения</small></span></button>' +
      "</div>" +
      '<input type="file" id="import-file" accept="application/json,.json" style="display:none">' +

      '<div class="spacer-16"></div>' +
      '<div class="disclaimer">Приложение считает ориентиры, а не ставит диагноз. Это не медицинская рекомендация. При проблемах со здоровьем, подросткам, беременным и людям с расстройствами пищевого поведения нужен специалист.</div>' +
      '<p class="source">CUTTRACK · данные только на устройстве<br>по мотивам видео bigpro427</p>';
  }

  function listRow(ico, title, sub, val) {
    return '<div class="list-row"><span class="li">' + icon(ico) + '</span><span class="lt">' + esc(title) + "<small>" + esc(sub) + '</small></span><span class="lv mono">' + esc(val) + "</span></div>";
  }

  /* ---------------- sheets ---------------- */
  function openSheet(html) {
    var sheet = $("#sheet");
    sheet.innerHTML = html;
    sheet.setAttribute("aria-hidden", "false");
    $("#sheet-backdrop").classList.add("show");
    sheet.classList.add("show");
    sheet.scrollTop = 0;
    ui.sheetOpen = true;
    document.body.style.overflow = "hidden";
    enhanceLabels(sheet);
  }
  function closeSheet() {
    var sheet = $("#sheet");
    $("#sheet-backdrop").classList.remove("show");
    sheet.classList.remove("show");
    sheet.setAttribute("aria-hidden", "true");
    ui.sheetOpen = false;
    document.body.style.overflow = "";
    setTimeout(function () {
      if (!ui.sheetOpen) sheet.innerHTML = "";
    }, 340);
  }
  function enhanceLabels(root) {
    $$(".field", root).forEach(function (field) {
      var label = field.querySelector("label");
      var control = field.querySelector("input, select, textarea");
      if (!label || !control || control.getAttribute("aria-label")) return;
      if (control.id) label.setAttribute("for", control.id);
      else control.setAttribute("aria-label", label.textContent.trim());
    });
  }
  function sheetHead(title, sub) {
    return '<div class="sheet-head"><h3>' + esc(title) + '</h3><button class="icon-btn" data-action="close-sheet" aria-label="Закрыть">' + icon("x") + "</button></div>" +
      (sub ? '<p class="sheet-sub">' + sub + "</p>" : "");
  }

  function openFoodPicker(meal) {
    ui.pendingMeal = meal || "breakfast";
    ui.foodQuery = "";
    ui.foodCat = "all";
    openSheet(
      sheetHead("Добавить еду", "Выбери продукт или добавь своё блюдо") +
      '<div class="search-wrap">' + icon("search") + '<input class="input" id="food-search" placeholder="Найти продукт…" autocomplete="off"></div>' +
      '<div class="chips" id="food-cats">' + DB.foodCats.map(function (c) {
        return '<button class="chip ' + (c.id === "all" ? "on" : "") + '" data-action="food-cat" data-cat="' + c.id + '">' + c.name + "</button>";
      }).join("") + "</div>" +
      allergyToggleHtml("продукты") +
      '<div class="food-results" id="food-results">' + foodResultsHtml() + "</div>" +
      '<div class="spacer-16"></div>' +
      '<button class="btn btn-block" data-action="open-custom-food">' + icon("plus") + "Своё блюдо / вручную</button>"
    );
    var inp = $("#food-search");
    if (inp) inp.addEventListener("input", function (e) {
      ui.foodQuery = e.target.value;
      $("#food-results").innerHTML = foodResultsHtml();
    });
  }

  function allFoods() { return (state.customFoods || []).slice().reverse().concat(DB.foods); }

  function foodResultsHtml() {
    var q = ui.foodQuery.trim().toLowerCase();
    var all = allFoods().filter(function (f) {
      if (ui.foodCat !== "all" && f.cat !== ui.foodCat) return false;
      if (q && f.name.toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var hidden = 0;
    var list = all;
    if (!ui.showAllergens && profileAllergies().length) {
      list = all.filter(foodAllowed);
      hidden = all.length - list.length;
    }
    list = list.slice(0, 80);
    if (!list.length) {
      return '<div class="empty-line">' + (hidden ? "Все найденные продукты содержат твои аллергены" : "Ничего не найдено") + "</div>";
    }
    var html = list.map(function (f) {
      var conflict = !foodAllowed(f);
      return '<button class="pick-row" data-action="pick-food" data-id="' + esc(f.id) + '">' +
        '<div class="grow"><div class="pn">' + esc(f.name) + '</div><div class="pm">Б ' + round(f.p) + " · Ж " + round(f.f) + " · У " + round(f.c) + (f.fiber ? " · клетчатка " + round(f.fiber) : "") + ' / 100 г' +
          (conflict ? ' · <span class="allergen-mini">' + esc(allergenNames(foodAllergens(f))) + "</span>" : "") + "</div></div>" +
        '<div class="pk">' + Math.round(f.kcal) + '<span> ккал</span></div>' +
      "</button>";
    }).join("");
    if (hidden) html = '<p class="allergy-note">' + icon("alert") + " Скрыто " + hidden + " продукт(ов) с твоими аллергенами.</p>" + html;
    return html;
  }

  function openPortion(food) {
    var conflict = hasAllergenConflict(foodAllergens(food));
    openSheet(
      sheetHead(food.name, "Порция и приём пищи") +
      '<div class="portion-preview"><div><b class="mono" id="pv-kcal">' + Math.round(food.kcal * food.portion / 100) + '</b><span> ккал</span></div><span id="pv-per">на 100 г: ' + Math.round(food.kcal) + " ккал</span></div>" +
      (conflict ? '<div class="allergy-warning">' + icon("alert") + '<div><b>Содержит: ' + esc(allergenNames(foodAllergens(food))) + '.</b><span>У тебя отмечена аллергия на этот аллерген. Добавляй только если уверен, что продукт безопасен.</span></div></div>' : "") +
      '<div class="field"><label>Граммы</label><input class="input" id="portion-grams" type="number" inputmode="decimal" value="' + food.portion + '"></div>' +
      '<div class="macro-line" id="pv-macros"></div>' +
      '<p class="hint" id="pv-src"></p>' +
      '<div class="field" style="margin-top:14px"><label>Приём пищи</label><select class="input" id="portion-meal">' +
        DB.meals.map(function (m) { return '<option value="' + m.id + '"' + (m.id === ui.pendingMeal ? " selected" : "") + ">" + m.name + "</option>"; }).join("") +
      "</select></div>" +
      '<button class="btn btn-primary btn-block" data-action="confirm-portion" data-id="' + esc(food.id) + '">' + (conflict ? "Добавить всё равно" : "Добавить") + "</button>"
    );
    updatePortion(food, food.portion);
    var g = $("#portion-grams");
    if (g) g.addEventListener("input", function (e) { updatePortion(food, Number(e.target.value) || 0); });
  }

  function updatePortion(food, grams) {
    var m = grams / 100;
    var kcal = Math.round(food.kcal * m);
    var el = $("#pv-kcal"); if (el) el.textContent = kcal;
    var per = $("#pv-per"); if (per) per.textContent = "на 100 г: " + Math.round(food.kcal) + " ккал";
    var mac = $("#pv-macros");
    if (mac) mac.innerHTML =
      '<div><b class="mono">' + round(food.p * m) + '</b><span>белки</span></div>' +
      '<div><b class="mono">' + round(food.f * m) + '</b><span>жиры</span></div>' +
      '<div><b class="mono">' + round(food.c * m) + '</b><span>углеводы</span></div>' +
      '<div><b class="mono">' + round((food.fiber || 0) * m) + '</b><span>клетчатка</span></div>';
    var src = $("#pv-src");
    if (src) src.textContent = food.src
      ? "Источник: " + food.src + (food.fdcId ? " · FDC " + food.fdcId : "")
      : "Своё блюдо: значения пересчитаны на 100 г";
  }

  function openCustomFood() {
    openSheet(
      sheetHead("Своё блюдо", "Введи значения на всю порцию — приложение пересчитает на 100 г") +
      '<div class="field"><label>Название</label><input class="input" id="cf-name" placeholder="Например, мой обед"></div>' +
      '<div class="field"><label>Вес порции, г</label><input class="input" id="cf-grams" type="number" inputmode="decimal" value="100"></div>' +
      '<div class="field-row">' +
        '<div class="field"><label>Калории</label><input class="input" id="cf-kcal" type="number" inputmode="numeric" placeholder="0"></div>' +
        '<div class="field"><label>Белки, г</label><input class="input" id="cf-p" type="number" inputmode="decimal" placeholder="0"></div>' +
      "</div>" +
      '<div class="field-row">' +
        '<div class="field"><label>Жиры, г</label><input class="input" id="cf-f" type="number" inputmode="decimal" placeholder="0"></div>' +
        '<div class="field"><label>Углеводы, г</label><input class="input" id="cf-c" type="number" inputmode="decimal" placeholder="0"></div>' +
      "</div>" +
      '<div class="field"><label>Приём пищи</label><select class="input" id="cf-meal">' +
        DB.meals.map(function (m) { return '<option value="' + m.id + '"' + (m.id === ui.pendingMeal ? " selected" : "") + ">" + m.name + "</option>"; }).join("") +
      "</select></div>" +
      '<button class="btn btn-primary btn-block" data-action="confirm-custom-food">Добавить</button>'
    );
  }

  function openEditFood(id) {
    var day = state.days[ui.date];
    var e = day && (day.food || []).filter(function (x) { return x.id === id; })[0];
    if (!e) return;
    openSheet(
      sheetHead(e.name, "Изменить порцию") +
      '<div class="field"><label>Граммы</label><input class="input" id="ef-grams" type="number" inputmode="decimal" value="' + e.grams + '"></div>' +
      '<button class="btn btn-primary btn-block" data-action="save-food" data-id="' + esc(id) + '">Сохранить</button>' +
      '<div class="spacer-8"></div>' +
      '<button class="btn btn-danger btn-block" data-action="delete-food" data-id="' + esc(id) + '">' + icon("trash") + "Удалить</button>"
    );
  }

  function openSteps() {
    var day = state.days[ui.date] || {};
    openSheet(
      sheetHead("Шаги", "За " + fmtDate(ui.date).toLowerCase()) +
      '<div class="field"><label>Количество шагов</label><input class="input" id="steps-input" type="number" inputmode="numeric" value="' + (day.steps || "") + '" placeholder="10000"></div>' +
      '<p class="hint">Ориентир: 10–20 тыс. в день, максимум 25 тыс. 10 тыс. ≈ 300–500 ккал.</p>' +
      '<div class="spacer-16"></div>' +
      '<button class="btn btn-primary btn-block" data-action="save-steps">Сохранить</button>' +
      '<button class="btn btn-block" style="margin-top:8px" data-action="open-sensors">' + icon("phone") + 'Шагомер и датчики</button>'
    );
  }

  function openTemplates() {
    var groups = DB.templates.map(function (tpl) {
      return '<div class="template-group"><h4>' + esc(tpl.name) + "</h4>" +
        tpl.days.map(function (d) {
          return '<button class="template-row" data-action="start-day" data-day="' + d.id + '">' +
            '<div class="grow"><div class="tn">' + esc(d.name) + '</div><div class="tm">' + d.exercises.length + " упражнений</div></div>" +
            '<span class="go">' + icon("arrow") + "</span></button>";
        }).join("") + "</div>";
    }).join("");
    openSheet(
      sheetHead("Начать тренировку", "Выбери день или начни с пустой") +
      groups +
      '<button class="btn btn-block" data-action="start-empty">' + icon("plus") + "Пустая тренировка</button>"
    );
  }

  function openHistory() {
    var rows = state.workouts.length
      ? state.workouts.map(historyRow).join("")
      : '<div class="empty-line">Пока нет тренировок</div>';
    openSheet(
      sheetHead("Все тренировки", "Нажми на тренировку, чтобы открыть детали") +
      '<div class="card tight" style="padding:0">' + rows + "</div>"
    );
  }

  function openExercisePicker() {
    ui.exQuery = ""; ui.exGroup = "Все";
    openSheet(
      sheetHead("Добавить упражнение") +
      '<div class="search-wrap">' + icon("search") + '<input class="input" id="ex-search" placeholder="Найти упражнение…" autocomplete="off"></div>' +
      '<div class="chips" id="ex-chips">' + DB.exerciseGroups.map(function (g) {
        return '<button class="chip ' + (g === "Все" ? "on" : "") + '" data-action="ex-group" data-g="' + g + '">' + g + "</button>";
      }).join("") + "</div>" +
      '<div id="ex-results">' + exResultsHtml() + "</div>"
    );
    var inp = $("#ex-search");
    if (inp) inp.addEventListener("input", function (e) { ui.exQuery = e.target.value; $("#ex-results").innerHTML = exResultsHtml(); });
  }

  function exResultsHtml() {
    var q = ui.exQuery.trim().toLowerCase();
    var list = DB.exercises.filter(function (e) {
      if (ui.exGroup !== "Все" && e.group !== ui.exGroup) return false;
      if (q && e.name.toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).slice(0, 80);
    if (!list.length) return '<div class="empty-line">Ничего не найдено</div>';
    return list.map(function (e) {
      return '<button class="pick-row" data-action="pick-exercise" data-id="' + e.id + '">' +
        '<div class="grow"><div class="pn">' + esc(e.name) + '</div><div class="pm">' + esc(e.group) + " · " + esc(e.eq) + "</div></div>" +
        '<span class="pick-check">' + icon("plus") + "</span></button>";
    }).join("");
  }

  function openWorkout(id) {
    var w = state.workouts.filter(function (x) { return x.id === id; })[0];
    if (!w) return;
    var vol = 0;
    var body = (w.exercises || []).map(function (ex) {
      var sets = (ex.sets || []).map(function (s) {
        vol += (s.w || 0) * (s.r || 0);
        return (s.w || 0) + "×" + (s.r || 0) + (s.rir ? " @RIR " + s.rir : "");
      }).join(" · ");
      return '<div class="wd-ex"><div class="wd-name">' + esc(ex.name) + '</div><div class="wd-sets">' + sets + "</div></div>";
    }).join("");
    openSheet(
      sheetHead(w.name, fmtShort(w.date || dkey()) + " · " + Math.round((w.duration || 0) / 60) + " мин · объём " + Math.round(vol).toLocaleString("ru-RU") + " " + units()) +
      '<div class="workout-detail">' + (body || '<div class="empty-line">Нет данных</div>') + "</div>" +
      '<div class="spacer-16"></div>' +
      '<button class="btn btn-danger btn-block" data-action="delete-workout" data-id="' + esc(w.id) + '">' + icon("trash") + "Удалить тренировку</button>"
    );
  }

  function openWeight() {
    var last = state.weights.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).pop();
    var val = last ? round(toDisp(last.kg), 1) : round(toDisp(state.profile.weightKg), 1);
    openSheet(
      sheetHead("Записать вес", "Взвешивайся утром, натощак, в одинаковых условиях") +
      '<div class="field"><label>Вес, ' + units() + "</label><input class=\"input\" id=\"weight-input\" type=\"number\" inputmode=\"decimal\" value=\"" + val + '"></div>' +
      '<div class="field"><label>Дата</label><input class="input" id="weight-date" type="date" value="' + dkey() + '" max="' + dkey() + '"></div>' +
      '<button class="btn btn-primary btn-block" data-action="save-weight">Сохранить</button>' +
      '<div class="spacer-8"></div>' +
      '<button class="btn btn-danger btn-block" data-action="delete-weight">' + icon("trash") + "Удалить запись за эту дату</button>"
    );
  }

  function openProfileEdit() {
    var p = state.profile;
    openSheet(
      sheetHead("Профиль", "Данные нужны для расчёта калорий и макросов") +
      '<div class="field"><label>Имя</label><input class="input" id="pf-name" value="' + esc(p.name || "") + '" placeholder="Имя"></div>' +
      '<div class="field-row">' +
        '<div class="field"><label>Возраст</label><input class="input" id="pf-age" type="number" inputmode="numeric" value="' + p.age + '"></div>' +
        '<div class="field"><label>Рост, см</label><input class="input" id="pf-height" type="number" inputmode="numeric" value="' + p.heightCm + '"></div>' +
      "</div>" +
      '<div class="field-row">' +
        '<div class="field"><label>Вес, ' + units() + '</label><input class="input" id="pf-weight" type="number" inputmode="decimal" value="' + round(toDisp(p.weightKg), 1) + '"></div>' +
        '<div class="field"><label>% жира</label><input class="input" id="pf-bf" type="number" inputmode="decimal" value="' + (p.bodyFat || "") + '" placeholder="—"></div>' +
      "</div>" +
      '<div class="field"><label>Пол</label><select class="input" id="pf-sex"><option value="m"' + (p.sex === "m" ? " selected" : "") + '>Мужской</option><option value="f"' + (p.sex === "f" ? " selected" : "") + '>Женский</option></select></div>' +
      '<div class="field"><label>Активность</label><select class="input" id="pf-activity">' +
        DB.activityLevels.map(function (a) { return '<option value="' + a.id + '"' + (p.activity === a.id ? " selected" : "") + ">" + a.label + " · " + a.hint + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="field"><label>Цель</label><select class="input" id="pf-goal"><option value="cut"' + (p.goal === "cut" ? " selected" : "") + '>Сушка</option><option value="maintain"' + (p.goal === "maintain" ? " selected" : "") + ">Поддержание</option></select></div>" +
      '<div class="field"><label>Режим дефицита</label><select class="input" id="pf-mode"><option value="moderate"' + (p.deficitMode === "moderate" ? " selected" : "") + ">Умеренный · ~500 ккал</option><option value=\"aggressive\"" + (p.deficitMode === "aggressive" ? " selected" : "") + ">Агрессивный · ~1000 ккал</option><option value=\"custom\"" + (p.deficitMode === "custom" ? " selected" : "") + ">Свой дефицит</option></select></div>" +
      '<div class="field"><label>Свой дефицит, ккал</label><input class="input" id="pf-custom" type="number" inputmode="numeric" value="' + (p.customDeficit || "") + '" placeholder="например, 700"></div>' +
      '<button class="btn btn-primary btn-block" data-action="save-profile">Сохранить</button>'
    );
  }

  function openStepsGoal() {
    openSheet(
      sheetHead("Цель по шагам", "10–20 тыс. — рабочий диапазон") +
      '<div class="field"><label>Шагов в день</label><input class="input" id="steps-goal-input" type="number" inputmode="numeric" value="' + state.settings.stepsGoal + '"></div>' +
      '<button class="btn btn-primary btn-block" data-action="save-steps-goal">Сохранить</button>'
    );
  }

  function openAllergies() {
    var mine = profileAllergies();
    openSheet(
      sheetHead("Аллергии и непереносимости", "Отметь всё, чего нужно избегать") +
      '<div class="chips allergy-chips" id="allergy-list">' + (DB.allergens || []).map(function (a) {
        return '<button class="chip' + (mine.indexOf(a.id) >= 0 ? " on" : "") + '" data-action="toggle-allergy" data-allergen="' + esc(a.id) + '">' + esc(a.name) + "</button>";
      }).join("") + "</div>" +
      '<p class="hint">Продукты, рецепты и меню с выбранными аллергенами будут скрыты из подбора или помечены предупреждением. Это не медицинская диагностика — при тяжёлой аллергии проверяй состав на упаковке.</p>' +
      '<button class="btn btn-primary btn-block" data-action="save-allergies">Сохранить</button>'
    );
  }
  function saveAllergies() {
    if (!state.profile) return;
    state.profile.allergies = selectedAllergies("#allergy-list");
    save(); closeSheet(); render();
    toast(state.profile.allergies.length ? "Аллергии сохранены" : "Аллергии отключены");
  }

  function openRest() {
    openSheet(
      sheetHead("Таймер отдыха", "Сколько отдыхать между подходами") +
      '<div class="chips" style="flex-wrap:wrap">' + [60, 90, 120, 150, 180, 240].map(function (s) {
        return '<button class="chip ' + (state.settings.restSec === s ? "on" : "") + '" data-action="set-rest" data-sec="' + s + '">' + s + " сек</button>";
      }).join("") + "</div>" +
      '<p class="hint">По умолчанию 120 секунд. Для тяжёлых базовых можно 180–240.</p>' +
      '<button class="btn btn-primary btn-block" data-action="save-rest">Готово</button>'
    );
  }

  /* ---------------- rest timer ---------------- */
  function ensureRestBar() {
    if ($("#restbar")) return;
    var el = document.createElement("div");
    el.id = "restbar";
    el.innerHTML = '<div class="rt mono" id="rest-time">0</div>' +
      '<div class="rl"><b>Отдых</b><span id="rest-label">восстановись</span></div>' +
      '<button data-action="rest-add">+30</button>' +
      '<button data-action="rest-skip">Пропустить</button>';
    document.body.appendChild(el);
  }
  function startRest(sec) {
    ensureRestBar();
    primeAudio();
    if (ui.restHideTimer) { clearTimeout(ui.restHideTimer); ui.restHideTimer = null; }
    ui.rest = { endsAt: nowMs() + sec * 1000, total: sec };
    if (ui.restInterval) clearInterval(ui.restInterval);
    ui.restInterval = setInterval(tickRest, 250);
    renderRestBar();
    tickRest();
  }
  function tickRest() {
    if (!ui.rest) return;
    var thisRest = ui.rest;
    var left = Math.max(0, Math.ceil((ui.rest.endsAt - nowMs()) / 1000));
    var el = $("#rest-time");
    if (el) el.textContent = left;
    if (left <= 0) {
      clearInterval(ui.restInterval);
      ui.restInterval = null;
      beep();
      if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
      var lab = $("#rest-label");
      if (lab) lab.textContent = "готово, следующий подход";
      if (ui.restHideTimer) clearTimeout(ui.restHideTimer);
      ui.restHideTimer = setTimeout(function () {
        ui.restHideTimer = null;
        if (ui.rest === thisRest) { ui.rest = null; renderRestBar(); }
      }, 2200);
    }
  }
  function renderRestBar() {
    ensureRestBar();
    var el = $("#restbar");
    if (!el) return;
    if (!ui.rest) { el.classList.remove("show"); return; }
    var left = Math.max(0, Math.ceil((ui.rest.endsAt - nowMs()) / 1000));
    $("#rest-time").textContent = left;
    $("#rest-label").textContent = "следующий подход";
    el.classList.add("show");
  }
  function stopRest() {
    if (ui.restInterval) clearInterval(ui.restInterval);
    if (ui.restHideTimer) clearTimeout(ui.restHideTimer);
    ui.restInterval = null;
    ui.restHideTimer = null;
    ui.rest = null;
    renderRestBar();
  }
  var audioCtx = null;
  function primeAudio() {
    if (!state.settings.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
    } catch (e) {}
  }
  function beep() {
    if (!state.settings.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = "sine"; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
      o.start(); o.stop(audioCtx.currentTime + 0.26);
    } catch (e) {}
  }

  /* ---------------- workout logic ---------------- */
  function findDayTemplate(id) {
    for (var i = 0; i < DB.templates.length; i++) {
      for (var j = 0; j < DB.templates[i].days.length; j++) {
        if (DB.templates[i].days[j].id === id) return DB.templates[i].days[j];
      }
    }
    return null;
  }
  function startDay(id) {
    var d = findDayTemplate(id);
    if (!d) return;
    state.activeWorkout = {
      id: "w" + nowMs(),
      name: d.name,
      startedAt: nowMs(),
      exercises: d.exercises.map(function (exId) {
        var ex = DB.exercises.filter(function (x) { return x.id === exId; })[0];
        return { exId: exId, name: ex ? ex.name : exId, group: ex ? ex.group : "", sets: [emptySet(), emptySet(), emptySet()] };
      })
    };
    save();
    closeSheet();
    ui.tab = "train";
    render();
    keepAwake();
  }
  function emptySet() { return { w: "", r: "", rir: "", done: false }; }
  var wakeLock = null;
  function keepAwake() {
    if (!("wakeLock" in navigator) || wakeLock) return;
    try {
      navigator.wakeLock.request("screen").then(function (lock) {
        wakeLock = lock;
        lock.addEventListener("release", function () { wakeLock = null; });
      }).catch(function () {});
    } catch (e) {}
  }
  function releaseWake() {
    if (!wakeLock) return;
    try { wakeLock.release(); } catch (e) {}
    wakeLock = null;
  }
  function startEmpty() {
    state.activeWorkout = { id: "w" + nowMs(), name: "Тренировка", startedAt: nowMs(), exercises: [] };
    save(); closeSheet(); ui.tab = "train"; render(); keepAwake();
  }
  function addExercise(exId) {
    var ex = DB.exercises.filter(function (x) { return x.id === exId; })[0];
    if (!ex || !state.activeWorkout) return;
    var last = lastSetsFor(ex.name);
    state.activeWorkout.exercises.push({
      exId: exId, name: ex.name, group: ex.group,
      sets: last && last.length ? last.map(function (s) { return { w: s.w, r: s.r, rir: "", done: false, auto: true }; }) : [emptySet(), emptySet(), emptySet()]
    });
    save(); closeSheet(); render();
    toast("Добавлено: " + ex.name);
  }
  function lastSetsFor(name) {
    for (var i = 0; i < state.workouts.length; i++) {
      var exs = state.workouts[i].exercises || [];
      for (var j = 0; j < exs.length; j++) {
        if (exs[j].name === name && exs[j].sets && exs[j].sets.length) return exs[j].sets;
      }
    }
    return null;
  }
  function collectedSets(w, includeUnmarked) {
    return w.exercises.map(function (ex) {
      return {
        name: ex.name,
        sets: ex.sets.filter(function (s) {
          var hasData = String(s.w).trim() !== "" && String(s.r).trim() !== "";
          if (s.done) return true;
          return includeUnmarked && hasData && !s.auto;
        }).map(function (s) {
          return { w: Number(s.w) || 0, r: Number(s.r) || 0, rir: Number(s.rir) || 0 };
        })
      };
    }).filter(function (ex) { return ex.sets.length; });
  }
  function finishWorkout() {
    var w = state.activeWorkout;
    if (!w) return;
    var unmarked = 0;
    w.exercises.forEach(function (ex) {
      ex.sets.forEach(function (s) {
        var hasData = String(s.w).trim() !== "" && String(s.r).trim() !== "";
        if (!s.done && hasData && !s.auto) unmarked++;
      });
    });
    var exercises;
    if (unmarked) {
      if (!window.confirm("Есть заполненные подходы без галочки (" + unmarked + "). Включить их в тренировку?")) return;
      exercises = collectedSets(w, true);
    } else {
      exercises = collectedSets(w, false);
    }
    if (!exercises.length) {
      if (!window.confirm("В тренировке нет отмеченных подходов. Выйти без сохранения?")) return;
      state.activeWorkout = null;
      save(); stopWorkoutTimer(); stopRest(); releaseWake(); render();
      toast("Тренировка не сохранена");
      return;
    }
    state.workouts.unshift({
      id: w.id, date: dkey(), name: w.name, startedAt: w.startedAt,
      duration: Math.max(0, Math.round((nowMs() - w.startedAt) / 1000)),
      exercises: exercises
    });
    state.activeWorkout = null;
    save(); stopWorkoutTimer(); stopRest(); releaseWake(); render();
    toast("Тренировка сохранена");
  }
  function cancelWorkout() {
    if (!state.activeWorkout) return;
    if (!window.confirm("Отменить тренировку? Данные не сохранятся.")) return;
    state.activeWorkout = null;
    save(); stopWorkoutTimer(); stopRest(); releaseWake(); render();
    toast("Тренировка отменена");
  }
  function stopWorkoutTimer() {
    if (ui.workoutInterval) clearInterval(ui.workoutInterval);
    ui.workoutInterval = null;
  }
  function manageIntervals() {
    if (state.activeWorkout && !ui.workoutInterval) {
      ui.workoutInterval = setInterval(function () {
        var el = $("#wo-elapsed");
        if (!el || !state.activeWorkout) return;
        el.textContent = fmtClock((nowMs() - state.activeWorkout.startedAt) / 1000) + " · идёт тренировка";
      }, 1000);
    }
    if (!state.activeWorkout) stopWorkoutTimer();
  }

  /* ---------------- toast ---------------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------------- actions ---------------- */
  function pickOnb(group, val, btn) {
    var parent = btn.parentElement;
    $$("button", parent).forEach(function (b) { b.classList.remove("on"); });
    btn.classList.add("on");
    if (group === "activity") {
      var a = DB.activityLevels.filter(function (x) { return x.id === val; })[0];
      var hint = $("#onb-act-hint");
      if (hint && a) hint.textContent = a.label + " · " + a.hint;
    }
    if (group === "goal") {
      var block = $("#onb-deficit");
      if (block) block.style.display = val === "maintain" ? "none" : "block";
    }
    if (group === "mode") {
      var mh = $("#onb-mode-hint");
      if (mh) mh.textContent = val === "aggressive" ? "~1000 ккал/день · примерно 0,7+ кг в неделю" : "~500 ккал/день · примерно 0,45 кг в неделю";
    }
  }
  function onbValue(group) {
    var wrap = $("#onb-" + group);
    if (!wrap) return null;
    var on = $(".on", wrap);
    return on ? on.dataset.val : null;
  }
  function startApp() {
    var name = ($("#onb-name") || {}).value || "";
    var age = Number(($("#onb-age") || {}).value);
    var height = Number(($("#onb-height") || {}).value);
    var weight = Number(($("#onb-weight") || {}).value);
    var weightKg = fromDisp(weight);
    var bfRaw = ($("#onb-bf") || {}).value;
    var bf = bfRaw === "" ? 0 : Number(bfRaw);
    if (!age || age < 14 || age > 90) return toast("Укажи возраст 14–90");
    if (!height || height < 120 || height > 230) return toast("Укажи рост 120–230 см");
    if (!weight || weightKg < 35 || weightKg > 300) return toast("Укажи вес " + Math.round(toDisp(35)) + "–" + Math.round(toDisp(300)) + " " + units());
    if (bfRaw !== "" && !isFinite(bf)) return toast("% жира должен быть 3–60");
    if (bf && (bf < 3 || bf > 60)) return toast("% жира должен быть 3–60");
    state.profile = {
      name: name.trim(), sex: onbValue("sex") || "m", age: age, heightCm: height,
      weightKg: weightKg, bodyFat: bf,
      activity: onbValue("activity") || "mid",
      goal: onbValue("goal") || "cut",
      deficitMode: onbValue("mode") || "moderate",
      customDeficit: 500,
      allergies: selectedAllergies("#onb-allergies")
    };
    state.weights.push({ date: dkey(), kg: state.profile.weightKg });
    save(); ui.tab = "food"; ui.date = dkey(); render(); toast("Погнали. План готов");
  }
  function saveProfile() {
    var p = state.profile;
    var age = Number($("#pf-age").value), height = Number($("#pf-height").value);
    var weight = Number($("#pf-weight").value), weightKg = fromDisp(weight), bfRaw = $("#pf-bf").value;
    var bf = bfRaw === "" ? 0 : Number(bfRaw);
    if (!age || age < 14 || age > 90) return toast("Возраст 14–90");
    if (!height || height < 120 || height > 230) return toast("Рост 120–230 см");
    if (!weight || weightKg < 35 || weightKg > 300) return toast("Вес " + Math.round(toDisp(35)) + "–" + Math.round(toDisp(300)) + " " + units());
    if (bfRaw !== "" && !isFinite(bf)) return toast("% жира 3–60");
    if (bf && (bf < 3 || bf > 60)) return toast("% жира 3–60");
    var oldWeight = Number(p.weightKg) || 0;
    p.name = $("#pf-name").value.trim();
    p.age = age; p.heightCm = height; p.weightKg = weightKg; p.bodyFat = bf;
    p.sex = $("#pf-sex").value;
    p.activity = $("#pf-activity").value;
    p.goal = $("#pf-goal").value;
    p.deficitMode = $("#pf-mode").value;
    p.customDeficit = Number($("#pf-custom").value) || 500;
    if (Math.abs(weightKg - oldWeight) > 0.01) {
      var today = dkey();
      var log = state.weights.filter(function (w) { return w.date === today; })[0];
      if (log) log.kg = weightKg; else state.weights.push({ date: today, kg: weightKg });
      state.weights.sort(function (a, b) { return a.date.localeCompare(b.date); });
      if (state.weights.length) p.weightKg = state.weights[state.weights.length - 1].kg;
    }
    save(); closeSheet(); render(); toast("Профиль обновлён");
  }
  function addFoodEntry(food) {
    var g = Number($("#portion-grams").value) || 0;
    if (g <= 0) return toast("Укажи граммы");
    var meal = $("#portion-meal").value;
    getDay(ui.date).food.push({
      id: "f" + nowMs() + Math.random().toString(36).slice(2, 5),
      name: food.name, grams: g,
      kcal: food.kcal, p: food.p, f: food.f, c: food.c, fiber: food.fiber || 0, meal: meal,
      foodId: food.id, allergens: foodAllergens(food).slice()
    });
    save(); closeSheet(); render(); toast("Добавлено: " + food.name);
  }
  function saveWeightLog() {
    var v = Number($("#weight-input").value);
    var date = $("#weight-date").value || dkey();
    var kg = fromDisp(v);
    if (!v || kg < 30 || kg > 300) return toast("Вес " + Math.round(toDisp(30)) + "–" + Math.round(toDisp(300)) + " " + units());
    if (date > dkey()) return toast("Дата не может быть в будущем");
    var ex = state.weights.filter(function (w) { return w.date === date; })[0];
    if (ex) ex.kg = kg; else state.weights.push({ date: date, kg: kg });
    state.weights.sort(function (a, b) { return a.date.localeCompare(b.date); });
    state.profile.weightKg = state.weights[state.weights.length - 1].kg;
    save(); closeSheet(); render(); toast("Вес записан");
  }

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-action]");
    if (!el) return;
    var a = el.dataset.action;

    if (a === "onb-pick") { pickOnb(el.dataset.group, el.dataset.val, el); return; }
    if (a === "start-app") { startApp(); return; }

    if (a === "prev-day") { ui.date = shiftKey(ui.date, -1); render(); return; }
    if (a === "next-day") { ui.date = shiftKey(ui.date, 1); render(); return; }
    if (a === "add-food") { openFoodPicker(el.dataset.meal); return; }
    if (a === "food-cat") {
      ui.foodCat = el.dataset.cat;
      $$("#food-cats .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.cat === ui.foodCat); });
      $("#food-results").innerHTML = foodResultsHtml();
      return;
    }
    if (a === "pick-food") {
      var f = allFoods().filter(function (x) { return x.id === el.dataset.id; })[0];
      if (f) openPortion(f);
      return;
    }
    if (a === "confirm-portion") {
      var ff = allFoods().filter(function (x) { return x.id === el.dataset.id; })[0];
      if (ff) addFoodEntry(ff);
      return;
    }
    if (a === "open-custom-food") { openCustomFood(); return; }
    if (a === "confirm-custom-food") {
      var name = $("#cf-name").value.trim() || "Своё блюдо";
      var grams = Number($("#cf-grams").value) || 0;
      var kcal = Number($("#cf-kcal").value) || 0;
      var p = Number($("#cf-p").value) || 0;
      var fat = Number($("#cf-f").value) || 0;
      var carb = Number($("#cf-c").value) || 0;
      var meal = $("#cf-meal").value;
      if (grams <= 0 || grams > 5000) return toast("Укажи вес порции 1–5000 г");
      if (kcal < 0 || p < 0 || fat < 0 || carb < 0) return toast("Значения не могут быть отрицательными");
      if (kcal <= 0 && p + fat + carb <= 0) return toast("Укажи калории или БЖУ");
      var food = {
        id: "c" + nowMs(), name: name, cat: "other", custom: true,
        kcal: kcal / grams * 100, p: p / grams * 100, f: fat / grams * 100, c: carb / grams * 100, portion: 100
      };
      state.customFoods = state.customFoods || [];
      state.customFoods.push(food);
      getDay(ui.date).food.push({
        id: "f" + nowMs(), name: name, grams: grams, kcal: food.kcal, p: food.p, f: food.f, c: food.c, meal: meal
      });
      save(); closeSheet(); render(); toast("Добавлено: " + name);
      return;
    }
    if (a === "edit-food") { openEditFood(el.dataset.id); return; }
    if (a === "save-food") {
      var eid = el.dataset.id;
      var g = Number($("#ef-grams").value) || 0;
      if (g <= 0) return toast("Укажи граммы");
      var day = state.days[ui.date];
      var ent = day && day.food.filter(function (x) { return x.id === eid; })[0];
      if (ent) ent.grams = g;
      save(); closeSheet(); render(); toast("Порция обновлена");
      return;
    }
    if (a === "delete-food") {
      ev.stopPropagation();
      var day2 = state.days[ui.date];
      if (day2) day2.food = day2.food.filter(function (x) { return x.id !== el.dataset.id; });
      save(); closeSheet(); render(); return;
    }
    if (a === "edit-steps") { openSteps(); return; }
    if (a === "save-steps") {
      if (ui.sensor.active) stopSensors(true);
      var s = clamp(Math.round(Number($("#steps-input").value) || 0), 0, 100000);
      getDay(ui.date).steps = s;
      save(); closeSheet(); render(); toast("Шаги сохранены");
      return;
    }
    if (a === "open-templates") { openTemplates(); return; }
    if (a === "plan-mode") { ui.planMode = el.dataset.mode; render(); return; }
    if (a === "plan-today") { ui.planAnchor = dkey(); render(); return; }
    if (a === "plan-prev" || a === "plan-next") {
      var dir = a === "plan-prev" ? -1 : 1;
      if (ui.planMode === "day" || ui.planMode === "cuisine") ui.planAnchor = shiftKey(ui.planAnchor || dkey(), dir);
      else if (ui.planMode === "week") ui.planAnchor = shiftKey(ui.planAnchor || dkey(), 7 * dir);
      else ui.planAnchor = shiftMonth(ui.planAnchor || dkey(), dir);
      render();
      return;
    }
    if (a === "plan-add-meal") { addPlanMeal(el.dataset.date, el.dataset.meal); return; }
    if (a === "plan-add-day") { addPlanDay(el.dataset.date); return; }
    if (a === "plan-add-week") { addPlanRange(el.dataset.date, 7, "неделю"); return; }
    if (a === "plan-add-month") { addPlanRange(el.dataset.date, monthDays(el.dataset.date), "месяц"); return; }
    if (a === "plan-cuisine") { ui.planCuisine = el.dataset.cuisine; render(); return; }
    if (a === "plan-add-menu") { addMenuToDiary(el.dataset.menu, el.dataset.date); return; }
    if (a === "open-recipes") { openRecipeCatalog(); return; }
    if (a === "open-recipe") { openRecipe(el.dataset.id); return; }
    if (a === "open-menu") { openMenuDetail(el.dataset.id); return; }
    if (a === "add-recipe") { addRecipeToDiary(el.dataset.id); return; }
    if (a === "add-menu") { addMenuToDiary(el.dataset.id, el.dataset.date); return; }
    if (a === "recipe-cuisine") {
      ui.recipeCuisine = el.dataset.cuisine;
      $$("#recipe-cuisines .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.cuisine === ui.recipeCuisine); });
      $("#recipe-results").innerHTML = recipeResultsHtml();
      return;
    }
    if (a === "recipe-meal") {
      ui.recipeMeal = el.dataset.meal;
      $$("#recipe-meals .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.meal === ui.recipeMeal); });
      $("#recipe-results").innerHTML = recipeResultsHtml();
      return;
    }
    if (a === "toggle-allergens") {
      ui.showAllergens = !ui.showAllergens;
      $$(".allergy-toggle").forEach(function (b) {
        b.classList.toggle("on", ui.showAllergens);
        var kind = b.dataset.kind || "продукты";
        b.innerHTML = icon("alert") + "<span>" + (ui.showAllergens ? "Скрыть " : "Показать ") + esc(kind) + " с аллергенами</span>";
      });
      if ($("#food-results")) $("#food-results").innerHTML = foodResultsHtml();
      if ($("#recipe-results")) $("#recipe-results").innerHTML = recipeResultsHtml();
      return;
    }
    if (a === "toggle-allergy") { el.classList.toggle("on"); return; }
    if (a === "open-allergies") { openAllergies(); return; }
    if (a === "save-allergies") { saveAllergies(); return; }
    if (a === "open-water") { openWater(); return; }
    if (a === "add-water") { addWater(Number(el.dataset.ml) || 250); return; }
    if (a === "save-water") { saveWater(); return; }
    if (a === "open-water-goal") { openWaterGoal(); return; }
    if (a === "save-water-goal") { saveWaterGoal(); return; }
    if (a === "reset-water-goal") { resetWaterGoal(); return; }
    if (a === "open-sensors") { openSensors(); return; }
    if (a === "toggle-sensors") { startSensors(); return; }
    if (a === "reset-sensor-session") { resetSensorSession(); return; }
    if (a === "open-history") { openHistory(); return; }
    if (a === "start-day") { startDay(el.dataset.day); return; }
    if (a === "start-empty") { startEmpty(); return; }
    if (a === "add-exercise") { openExercisePicker(); return; }
    if (a === "ex-group") {
      ui.exGroup = el.dataset.g;
      $$("#ex-chips .chip").forEach(function (b) { b.classList.toggle("on", b.dataset.g === ui.exGroup); });
      $("#ex-results").innerHTML = exResultsHtml();
      return;
    }
    if (a === "pick-exercise") { addExercise(el.dataset.id); return; }
    if (a === "add-set") {
      var ei = Number(el.dataset.i);
      var ex = state.activeWorkout && state.activeWorkout.exercises[ei];
      if (ex) {
        var last = emptySet();
        for (var k = ex.sets.length - 1; k >= 0; k--) {
          if (String(ex.sets[k].w).trim() !== "" || String(ex.sets[k].r).trim() !== "") { last = ex.sets[k]; break; }
        }
        ex.sets.push({ w: last.w, r: last.r, rir: "", done: false, auto: true });
        save(); render();
      }
      return;
    }
    if (a === "toggle-set") {
      var i = Number(el.dataset.i), j = Number(el.dataset.j);
      var exx = state.activeWorkout && state.activeWorkout.exercises[i];
      if (!exx) return;
      var st = exx.sets[j];
      st.done = !st.done;
      st.auto = false;
      save(); render();
      if (st.done) startRest(state.settings.restSec);
      return;
    }
    if (a === "remove-exercise") {
      var ri = Number(el.dataset.i);
      if (!state.activeWorkout) return;
      if (!window.confirm("Убрать упражнение?")) return;
      state.activeWorkout.exercises.splice(ri, 1);
      save(); render(); return;
    }
    if (a === "finish-workout") { finishWorkout(); return; }
    if (a === "cancel-workout") { cancelWorkout(); return; }
    if (a === "open-workout") { openWorkout(el.dataset.id); return; }
    if (a === "delete-workout") {
      if (!window.confirm("Удалить тренировку? Это необратимо.")) return;
      state.workouts = state.workouts.filter(function (w) { return w.id !== el.dataset.id; });
      save(); closeSheet(); render(); toast("Тренировка удалена");
      return;
    }
    if (a === "rest-add") {
      if (ui.rest) {
        if (ui.restHideTimer) { clearTimeout(ui.restHideTimer); ui.restHideTimer = null; }
        ui.rest.endsAt += 30000;
        if (!ui.restInterval) ui.restInterval = setInterval(tickRest, 250);
        renderRestBar();
      }
      return;
    }
    if (a === "rest-skip") { stopRest(); return; }
    if (a === "add-weight") { openWeight(); return; }
    if (a === "save-weight") { saveWeightLog(); return; }
    if (a === "delete-weight") {
      var wd = $("#weight-date").value || dkey();
      var before = state.weights.length;
      state.weights = state.weights.filter(function (w) { return w.date !== wd; });
      if (state.weights.length === before) return toast("Записи за эту дату нет");
      if (state.weights.length) {
        state.weights.sort(function (a, b) { return a.date.localeCompare(b.date); });
        state.profile.weightKg = state.weights[state.weights.length - 1].kg;
      }
      save(); closeSheet(); render(); toast("Запись веса удалена");
      return;
    }
    if (a === "guide-toggle") {
      var gid = el.dataset.id;
      ui.guideOpen[gid] = !ui.guideOpen[gid];
      render(); return;
    }
    if (a === "edit-profile") { if (state.profile) openProfileEdit(); return; }
    if (a === "save-profile") { saveProfile(); return; }
    if (a === "set-units") {
      state.settings.units = el.dataset.u;
      save(); render(); return;
    }
    if (a === "edit-steps-goal") { openStepsGoal(); return; }
    if (a === "save-steps-goal") {
      state.settings.stepsGoal = clamp(Math.round(Number($("#steps-goal-input").value) || 12000), 1000, 50000);
      save(); closeSheet(); render(); return;
    }
    if (a === "edit-rest") { openRest(); return; }
    if (a === "set-rest") {
      state.settings.restSec = Number(el.dataset.sec) || 120;
      save();
      $$("#sheet .chip").forEach(function (b) { b.classList.toggle("on", Number(b.dataset.sec) === state.settings.restSec); });
      return;
    }
    if (a === "save-rest") { closeSheet(); render(); return; }
    if (a === "toggle-sound") { state.settings.sound = !state.settings.sound; save(); render(); return; }
    if (a === "export") { exportData(); return; }
    if (a === "import") { var inp = $("#import-file"); if (inp) inp.click(); return; }
    if (a === "reset") {
      if (!window.confirm("Удалить все данные? Это необратимо.")) return;
      localStorage.removeItem(LS);
      window.location.reload();
      return;
    }
    if (a === "close-sheet") { closeSheet(); return; }
  });

  document.addEventListener("input", function (ev) {
    var el = ev.target.closest("[data-wf]");
    if (!el || !state.activeWorkout) return;
    var i = Number(el.dataset.i), j = Number(el.dataset.j);
    var ex = state.activeWorkout.exercises[i];
    if (!ex || !ex.sets[j]) return;
    ex.sets[j][el.dataset.wf] = el.value;
    ex.sets[j].auto = false;
    save();
  });

  document.addEventListener("change", function (ev) {
    if (ev.target.closest("[data-wf]")) { save(); return; }
    if (ev.target.id === "import-file") {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          if (!data || !data.profile || !Number(data.profile.weightKg) || !Number(data.profile.heightCm) || !Number(data.profile.age)) throw new Error("bad");
          state = normalizeState(data);
          save(); render(); toast("Данные восстановлены");
        } catch (e) { toast("Не удалось прочитать файл"); }
      };
      reader.readAsText(file);
    }
  });

  function exportData() {
    try {
      var json = JSON.stringify(state, null, 2);
      if (window.CUTTRACKAndroid && window.CUTTRACKAndroid.saveExport) {
        var saved = window.CUTTRACKAndroid.saveExport("cuttrack-" + dkey() + ".json", json);
        if (saved && saved.indexOf("ERR:") === 0) toast(saved.slice(4));
        else toast("Сохранено: " + (saved || "файл"));
        return;
      }
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "cuttrack-" + dkey() + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast("Файл экспортирован");
    } catch (e) { toast("Экспорт не удался"); }
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-tab]");
    if (!t) return;
    ui.tab = t.dataset.tab;
    if (ui.tab === "food") ui.date = ui.date || dkey();
    if (ui.tab !== "train") releaseWake();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && ui.sheetOpen) closeSheet();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && state.activeWorkout) keepAwake();
  });

  /* ---------------- PWA ---------------- */
  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  initStaticUi();
  render();
})();
