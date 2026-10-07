import { useState, useEffect, FormEvent } from "react";
import {
  Beer, Phone, MapPin, Camera, Star, Clock, Truck, ShoppingBag, Menu as MenuIcon, X,
  Tv, Utensils, Users, CalendarCheck, ChevronRight, Quote, CheckCircle2, Play,
} from "lucide-react";

/* ───────────────────────── ДАНІ ───────────────────────── */

const INFO = {
  name: "Kruzhka Pyvbar",
  address: "проспект Металургів, 15А, Запоріжжя, 69001",
  phone: "+380 97 470 6195",
  tel: "tel:+380974706195",
  insta: "@pivbarkrujka",
  instaUrl: "https://instagram.com/pivbarkrujka",
  rating: "4.4",
  closes: "23:00",
};

const MAP_QUERY = encodeURIComponent("проспект Металургів 15А, Запоріжжя, 69001");
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

const NAV = [
  { href: "#about", label: "Про нас" },
  { href: "#menu", label: "Меню & Бар" },
  { href: "#promo", label: "Акції" },
  { href: "#reviews", label: "Відгуки" },
  { href: "#contacts", label: "Контакти" },
];

type Item = { name: string; desc: string; price: number; hot?: boolean };

// ⚠️ Ціни та позиції — приклад. Замініть на актуальне меню закладу.
const MENU: Record<string, Item[]> = {
  "Розливне пиво": [
    { name: "Світле лагер", desc: "Класичне, чисте, освіжаюче · 0,5 л", price: 65, hot: true },
    { name: "Нефільтроване", desc: "М'яке, з дріжджовим тілом · 0,5 л", price: 75 },
    { name: "Темне", desc: "Карамельні та горіхові ноти · 0,5 л", price: 70 },
    { name: "Пшеничне", desc: "Банан, коріандр, легка кислинка · 0,5 л", price: 80 },
    { name: "Сезонний сорт", desc: "Питайте у бармена · 0,5 л", price: 85 },
    { name: "Пінта на двох", desc: "Два келихи улюбленого розливного · 2×0,5 л", price: 120 },
  ],
  "Закуски до пива": [
    { name: "Оселедець по-норвезьки", desc: "Деруни, філе оселедця, цибулька, лимон", price: 180, hot: true },
    { name: "Гренки з часником", desc: "Хрусткі, з соусом на вибір · 200 г", price: 85 },
    { name: "Крильця BBQ", desc: "Гостро-солодкий соус · 400 г", price: 190 },
    { name: "Картопля фрі", desc: "З сирним або часниковим соусом · 200 г", price: 80 },
    { name: "Сирні палички", desc: "Моцарела в золотистій панірці · 8 шт", price: 140 },
    { name: "Мисливські ковбаски", desc: "Підсмажені, з гірчицею · 250 г", price: 160 },
  ],
  "Гарячі страви": [
    { name: "Курячий стейк з фрі", desc: "Гриль, медово-гірчичний соус", price: 210, hot: true },
    { name: "Свинячі реберця", desc: "Запечені в медово-соєвій глазурі · 450 г", price: 290 },
    { name: "Бургер «Кружка»", desc: "Яловичий патті, чедер, фірмовий соус", price: 220 },
    { name: "Шніцель з пюре", desc: "Золотиста скоринка, вершкове пюре", price: 195 },
    { name: "Вареники з картоплею", desc: "Домашні, зі шкварками та цибулею", price: 130 },
    { name: "Деруни зі сметаною", desc: "Гарячі, хрусткі · 6 шт", price: 120 },
  ],
  "Сети для компаній": [
    { name: "Сет «Пивний» на 2", desc: "Крильця, гренки, сирні палички, фрі", price: 420, hot: true },
    { name: "Сет «Компанія» на 4", desc: "Реберця, ковбаски, крильця, гренки, фрі, соуси", price: 790 },
    { name: "Сет «Футбол» на 6", desc: "Великий мікс закусок на трансляцію матчу", price: 1190 },
    { name: "Рибний сет", desc: "Оселедець, вобла, креветки, гренки", price: 560 },
    { name: "Пивна вежа 3 л", desc: "Розливне на вибір з краном на столі", price: 520 },
    { name: "М'ясна дошка", desc: "Стейк, ковбаски, реберця, овочі гриль", price: 880 },
  ],
};

const REVIEWS = [
  // ⚠️ Приклади відгуків. Замініть на реальні відгуки з Google Maps.
  { name: "Андрій К.", tag: "Атмосфера", text: "Дуже затишно: темне дерево, тепле світло, лофт-інтер'єр. Ідеальне місце, щоб зустрітися з друзями на проспекті Металургів." },
  { name: "Олена М.", tag: "Холодне пиво", text: "Пиво завжди свіже й справді холодне, великий вибір розливного. Закуски смачні, оселедець по-норвезьки — окремий хіт." },
  { name: "Дмитро С.", tag: "Сервіс", text: "Привітний персонал, швидко принесли замовлення. Дивились матч на великому екрані — звук і картинка на висоті." },
];

const GALLERY = [
  { src: "/videos/beer.mp4", poster: "/videos/beer.jpg", title: "Свіже розливне", sub: "Охолоджене до ідеалу" },
  { src: "/videos/herring.mp4", poster: "/videos/herring.jpg", title: "Оселедець по-норвезьки", sub: "Фірмова закуска" },
  { src: "/videos/steak.mp4", poster: "/videos/steak.jpg", title: "Курячий стейк", sub: "Гриль + фрі та соус" },
];

/* ───────────────────────── ДОПОМІЖНІ ───────────────────────── */

const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`scroll-mt-20 px-4 py-20 sm:px-6 md:py-28 ${className}`}>
    <div className="mx-auto max-w-6xl">{children}</div>
  </section>
);

const Heading = ({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) => (
  <div className="mb-12 max-w-2xl">
    <div className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
      <span className="h-px w-10 bg-amber-500" />{kicker}
    </div>
    <h2 className="font-display text-4xl font-bold uppercase leading-tight text-stone-100 sm:text-5xl">{title}</h2>
    {sub && <p className="mt-4 text-stone-400">{sub}</p>}
  </div>
);

const Stars = ({ n = 5, size = 16 }: { n?: number; size?: number }) => (
  <div className="flex gap-0.5 text-amber-400">
    {Array.from({ length: n }).map((_, i) => <Star key={i} size={size} fill="currentColor" />)}
  </div>
);

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-stone-600 px-6 py-3 font-semibold text-stone-100 transition hover:border-amber-500 hover:text-amber-400 active:scale-95";

const CSS = `
@keyframes kz-up{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes kz-down{from{transform:translateY(-50%)}to{transform:translateY(0)}}
@keyframes kz-bubble{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:1}100%{transform:translateY(-110vh) scale(1.2);opacity:0}}
@keyframes kz-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes kz-marquee{to{transform:translateX(-50%)}}
@keyframes kz-shine{to{background-position:200% center}}
.kz-up{animation:kz-up 50s linear infinite}.kz-down{animation:kz-down 58s linear infinite}
.kz-bubble{animation:kz-bubble 12s ease-in infinite}.kz-float{animation:kz-float 6s ease-in-out infinite}
.kz-marquee{animation:kz-marquee 35s linear infinite}.kz-shine{animation:kz-shine 5s linear infinite}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){.kz-up,.kz-down,.kz-bubble,.kz-float,.kz-marquee,.kz-shine{animation:none}}
`;

/* ───────────────────────── ЗАСТОСУНОК ───────────────────────── */

export default function App() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tab, setTab] = useState(Object.keys(MENU)[0]);
  const [sent, setSent] = useState(false);
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [form, setForm] = useState({ name: "", phone: "", guests: "2", time: "" });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // Заявка відкривається у листі та дублюється дзвінком; підключіть свій бекенд/месенджер за потреби.
    const body = `Ім'я: ${form.name}\nТелефон: ${form.phone}\nГостей: ${form.guests}\nЧас: ${form.time}`;
    console.info("Booking request", form);
    window.location.href = `mailto:?subject=${encodeURIComponent("Бронь столу — Kruzhka")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const input =
    "w-full rounded-xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-200 antialiased selection:bg-amber-500 selection:text-stone-950">
      <style>{CSS}</style>
      {/* HEADER */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled || open ? "border-b border-stone-800 bg-stone-950/90 backdrop-blur-md" : "bg-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <Beer className="text-amber-500" size={26} />
            <span className="font-display text-xl font-bold uppercase tracking-wider text-stone-100">
              Kruzhka <span className="text-amber-500">Pyvbar</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-stone-300 transition hover:text-amber-400">{n.label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={INFO.tel} className="inline-flex items-center gap-2 rounded-full border border-stone-600 px-4 py-2 text-sm font-semibold hover:border-amber-500 hover:text-amber-400">
              <Phone size={15} /> Зателефонувати
            </a>
            <a href="#contacts" className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400">Забронювати стіл</a>
          </div>

          <button aria-label="Меню" className="p-2 text-stone-100 lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <MenuIcon />}
          </button>
        </div>

        {open && (
          <div className="border-t border-stone-800 px-4 pb-6 pt-3 lg:hidden">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-stone-800/60 py-3 text-lg font-medium">{n.label}</a>
            ))}
            <div className="mt-5 grid gap-3">
              <a href="#contacts" onClick={() => setOpen(false)} className={btnPrimary}><CalendarCheck size={18} /> Забронювати стіл</a>
              <a href={INFO.tel} className={btnGhost}><Phone size={18} /> Зателефонувати</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="top"
        onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY - e.currentTarget.getBoundingClientRect().top })}
        className="relative flex min-h-screen flex-col overflow-hidden"
      >
        {/* Стіна відео: похилі колонки, що їдуть у різні боки */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 grid w-[150vw] max-w-[1800px] -translate-x-1/2 -translate-y-1/2 -rotate-12 grid-cols-2 gap-4 md:grid-cols-3">
            {[0, 1, 2].map((col) => (
              <div key={col} className={`flex flex-col gap-4 ${col === 2 ? "hidden md:flex" : ""} ${col === 1 ? "kz-down" : "kz-up"}`} style={{ animationDuration: `${50 + col * 8}s` }}>
                {[...Array(4)].map((_, i) => {
                  const g = GALLERY[(i + col) % GALLERY.length];
                  return (
                    <video key={i} src={g.src} poster={g.poster} autoPlay muted loop playsInline preload="metadata"
                      className="aspect-[9/14] w-full rounded-3xl object-cover" />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Затемнення, віньєтка та підсвітка за курсором */}
        <div aria-hidden className="absolute inset-0 bg-stone-950/75" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0c0a09_85%)]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950" />
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ background: `radial-gradient(420px circle at ${mouse.x}px ${mouse.y}px, rgba(245,158,11,0.22), transparent 70%)` }} />

        {/* Бульбашки пива */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <span key={i} className="kz-bubble absolute bottom-[-30px] rounded-full border border-amber-300/40 bg-amber-300/10"
              style={{ left: `${(i * 37) % 100}%`, width: 6 + ((i * 7) % 14), height: 6 + ((i * 7) % 14), animationDelay: `${(i * 1.3) % 9}s`, animationDuration: `${9 + (i % 5) * 2}s` }} />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pb-10 pt-28 sm:px-6">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-stone-950/60 px-4 py-1.5 text-sm text-amber-400 backdrop-blur">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span>
                Відчинено до {INFO.closes} · Запоріжжя
              </div>
              <h1 className="font-display text-5xl font-bold uppercase leading-[1.02] text-stone-50 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] sm:text-6xl lg:text-7xl">
                Твоє ідеальне місце для відпочинку та <span className="kz-shine bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 bg-[length:200%_auto] bg-clip-text text-transparent">холодного пива</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-stone-300">
                Атмосферний пивбар у центрі Запоріжжя (пр. Металургів, 15А). Свіже пиво, смачні закуски та живі трансляції.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { i: <Star size={15} fill="currentColor" className="text-amber-400" />, t: `Рейтинг ${INFO.rating}★ (500+ відгуків)` },
                  { i: <Truck size={15} className="text-amber-400" />, t: "Безконтактна доставка" },
                  { i: <Clock size={15} className="text-amber-400" />, t: `Працюємо до ${INFO.closes}` },
                ].map((b) => (
                  <span key={b.t} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-md">{b.i}{b.t}</span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href="#menu" className={btnPrimary}>Переглянути Меню <ChevronRight size={18} /></a>
                <a href={ROUTE_URL} target="_blank" rel="noreferrer" className={`${btnGhost} bg-stone-950/40 backdrop-blur`}><MapPin size={18} /> Прокласти маршрут</a>
              </div>
            </div>

            {/* Скляні плаваючі картки */}
            <div className="relative mx-auto hidden h-[420px] w-full max-w-sm lg:block">
              <div className="kz-float absolute left-0 top-0 w-64 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="font-display text-6xl font-bold text-amber-400">{INFO.rating}</div>
                <Stars n={4} size={18} />
                <div className="mt-2 text-sm text-stone-300">515+ відгуків на Google Maps</div>
              </div>
              <div className="kz-float absolute right-0 top-40 w-60 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-2xl backdrop-blur-xl" style={{ animationDelay: "-2s" }}>
                <Beer className="text-amber-400" size={30} />
                <div className="mt-3 font-display text-2xl uppercase text-stone-50">Свіже розливне</div>
                <div className="text-sm text-stone-300">Холодне, як треба</div>
              </div>
              <div className="kz-float absolute bottom-0 left-8 w-64 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl" style={{ animationDelay: "-4s" }}>
                <div className="flex items-center gap-3"><Tv className="text-amber-400" size={26} /><div><div className="font-semibold text-stone-100">Live-трансляції</div><div className="text-sm text-stone-400">Великі екрани</div></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Біжучий рядок */}
        <div className="relative z-10 overflow-hidden border-y border-amber-500/20 bg-stone-950/70 py-3 backdrop-blur">
          <div className="kz-marquee flex w-max gap-10 whitespace-nowrap font-display text-lg uppercase tracking-[0.3em] text-amber-500/80">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-10">
                {["Свіже пиво", "Смачні закуски", "Сети для компаній", "Живі трансляції", "На винос", "Безконтактна доставка"].map((w) => (
                  <span key={w + k} className="flex items-center gap-10">{w}<Beer size={16} /></span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" className="bg-stone-900/40">
        <Heading kicker="Про нас" title="Філософія «Кружки»" sub="Лофт-інтер'єр, темне дерево, тепле світло й усе, що потрібно для вдалого вечора з друзями." />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { i: <Beer size={28} />, t: "Великий вибір свіжого пива", d: "Розливне світле, темне, нефільтроване та сезонні сорти — завжди охолоджене й наливається як належить." },
            { i: <Utensils size={28} />, t: "Соковиті закуски та сети для компаній", d: "Від гренок і крилець до великих м'ясних дощок та сетів на всю компанію." },
            { i: <Tv size={28} />, t: "Спортивні трансляції на великих екранах", d: "Футбол, бокс, UFC — дивіться разом із друзями, з гучним звуком і холодною кружкою." },
          ].map((c) => (
            <div key={c.t} className="group rounded-2xl border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 p-8 transition hover:-translate-y-1 hover:border-amber-500/50">
              <div className="mb-5 inline-flex rounded-xl bg-amber-500/10 p-3 text-amber-500 transition group-hover:bg-amber-500 group-hover:text-stone-950">{c.i}</div>
              <h3 className="font-display text-2xl uppercase text-stone-100">{c.t}</h3>
              <p className="mt-3 text-stone-400">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { i: <Users size={20} />, t: "Посиденьки в закладі" },
            { i: <ShoppingBag size={20} />, t: "Їжа на винос" },
            { i: <Truck size={20} />, t: "Безконтактна доставка" },
          ].map((s) => (
            <div key={s.t} className="flex items-center gap-3 rounded-xl border border-stone-800 px-5 py-4 text-stone-300">
              <span className="text-amber-500">{s.i}</span>{s.t}
            </div>
          ))}
        </div>
      </Section>

      {/* MENU */}
      <Section id="menu">
        <Heading kicker="Меню & Бар" title="Що наливаємо та подаємо" sub="Ціни вказані в гривнях. Актуальність позицій уточнюйте у бармена." />
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {Object.keys(MENU).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${tab === k ? "border-amber-500 bg-amber-500 text-stone-950" : "border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-400"}`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {MENU[tab].map((it) => (
            <div key={it.name} className="flex items-start justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-900/60 p-5 transition hover:border-amber-500/40">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl uppercase text-stone-100">{it.name}</h3>
                  {it.hot && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase text-amber-400">Хіт</span>}
                </div>
                <p className="mt-1 text-sm text-stone-400">{it.desc}</p>
              </div>
              <div className="whitespace-nowrap font-display text-2xl text-amber-500">{it.price} <span className="text-sm text-amber-600">грн</span></div>
            </div>
          ))}
        </div>
      </Section>

      {/* GALLERY / PROMO */}
      <Section id="promo" className="bg-stone-900/40">
        <Heading kicker="Акції та новинки" title="Зі стрічки «Кружки»" sub="Свіжі позиції й акції публікуємо в Instagram — дивіться, що зараз на столах." />
        <div className="grid gap-6 md:grid-cols-3">
          {GALLERY.map((g) => (
            <div key={g.title} className="group relative aspect-[9/14] overflow-hidden rounded-2xl border border-stone-800">
              <video className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={g.src} poster={g.poster} autoPlay muted loop playsInline preload="metadata" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-5">
                <div className="mb-1 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-amber-400"><Play size={12} fill="currentColor" /> Відео</div>
                <div className="font-display text-2xl uppercase text-stone-50">{g.title}</div>
                <div className="text-sm text-stone-300">{g.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href={INFO.instaUrl} target="_blank" rel="noreferrer" className={btnGhost}><Camera size={18} /> Більше в {INFO.insta}</a>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="reviews">
        <Heading kicker="Відгуки" title="Що кажуть гості" />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-8 text-center">
            <div className="font-display text-7xl font-bold text-amber-400">{INFO.rating}</div>
            <div className="my-3"><Stars n={4} size={22} /></div>
            <div className="text-stone-300">на основі <b>515+</b> відгуків</div>
            <div className="mt-1 text-sm text-stone-500">Google Maps</div>
            <a href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`} target="_blank" rel="noreferrer" className="mt-6 text-sm font-semibold text-amber-400 hover:underline">Читати на Google Maps →</a>
          </div>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="relative flex flex-col rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
                <Quote className="absolute right-5 top-5 text-amber-500/20" size={36} />
                <span className="mb-3 w-fit rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase text-amber-400">{r.tag}</span>
                <Stars />
                <blockquote className="mt-3 flex-1 text-stone-300">«{r.text}»</blockquote>
                <figcaption className="mt-5 font-semibold text-stone-100">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACTS */}
      <Section id="contacts" className="bg-stone-900/40">
        <Heading kicker="Контакти" title="Забронюй стіл" sub="Залиште заявку — ми передзвонимо для підтвердження. Або просто зателефонуйте." />
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={submit} className="rounded-2xl border border-stone-800 bg-stone-950 p-6 sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 size={56} className="text-amber-500" />
                <h3 className="mt-4 font-display text-3xl uppercase text-stone-100">Дякуємо!</h3>
                <p className="mt-2 text-stone-400">Заявку прийнято. Для швидкого підтвердження можете ще й зателефонувати.</p>
                <a href={INFO.tel} className={`${btnPrimary} mt-6`}><Phone size={18} /> {INFO.phone}</a>
                <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm text-stone-500 hover:text-amber-400">Нова заявка</button>
              </div>
            ) : (
              <div className="grid gap-4">
                <label className="grid gap-1.5 text-sm text-stone-400">Ім'я
                  <input required className={input} placeholder="Як до вас звертатись" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="grid gap-1.5 text-sm text-stone-400">Телефон
                  <input required type="tel" className={input} placeholder="+380 __ ___ ____" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm text-stone-400">Кількість гостей
                    <select className={input} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9–12", "13+"].map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm text-stone-400">Дата та час
                    <input required type="datetime-local" className={`${input} [color-scheme:dark]`} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </label>
                </div>
                <button type="submit" className={`${btnPrimary} mt-2`}><CalendarCheck size={18} /> Забронювати стіл</button>
              </div>
            )}
          </form>

          <div className="flex flex-col gap-4">
            <div className="grid gap-3 rounded-2xl border border-stone-800 bg-stone-950 p-6">
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0 text-amber-500" size={20} /><span>{INFO.address}</span></div>
              <a href={INFO.tel} className="flex items-center gap-3 hover:text-amber-400"><Phone className="shrink-0 text-amber-500" size={20} />{INFO.phone}</a>
              <a href={INFO.instaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-amber-400"><Camera className="shrink-0 text-amber-500" size={20} />{INFO.insta}</a>
              <div className="flex items-center gap-3"><Clock className="shrink-0 text-amber-500" size={20} />Відчинено до {INFO.closes}</div>
            </div>
            <div className="min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-stone-800">
              <iframe
                title="Kruzhka Pyvbar на мапі"
                src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                className="h-full min-h-[300px] w-full [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.7)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-stone-800 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-stone-500 md:flex-row">
          <div className="flex items-center gap-2 font-display text-lg uppercase tracking-wider text-stone-300">
            <Beer className="text-amber-500" size={20} /> Kruzhka <span className="text-amber-500">Pyvbar</span>
          </div>
          <a href={INFO.instaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-400"><Camera size={16} /> {INFO.insta}</a>
          <div>© {new Date().getFullYear()} "Kruzhka" Pyvbar. Усі права захищено.</div>
          <div className="rounded-full border border-red-500/50 px-4 py-1.5 font-semibold text-red-400">18+ Запивайте відповідально</div>
        </div>
      </footer>

      {/* Mobile sticky call */}
      <a href={INFO.tel} aria-label="Зателефонувати" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-stone-950 shadow-xl shadow-amber-500/30 lg:hidden">
        <Phone />
      </a>
    </div>
  );
}
