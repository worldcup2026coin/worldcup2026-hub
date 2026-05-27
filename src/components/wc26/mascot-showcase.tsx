import Image from "next/image";

const mascots = [
  {
    name: "Maple the Moose",
    country: "Canada-inspired hype engine",
    image: "/wc26/wc26-maple.png",
    text: "The loud, lovable underdog energy of the crew — built for hype, flags, goals and cold-blooded matchday banter.",
  },
  {
    name: "Zayu the Jaguar",
    country: "Mexico-inspired chaos striker",
    image: "/wc26/wc26-zayu.png",
    text: "Fast, sharp and unpredictable — the mascot for upsets, pressure games, dark horses and tournament danger.",
  },
  {
    name: "Clutch the Bald Eagle",
    country: "USA-inspired main character energy",
    image: "/wc26/wc26-clutch.png",
    text: "Bold, loud and dramatic — the mascot for late winners, comeback noise and clutch-moment memes.",
  },
];

export function MascotShowcase() {
  return (
    <section className="mt-8 grid gap-6">
      <div className="neon-panel overflow-hidden rounded-[2rem] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="neon-kicker">$WC26 chaos crew</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white sm:text-4xl">
              Meet the fan-made mascots
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Maple, Zayu and Clutch are the $WC26 community mascots — three
              host-nation-inspired characters built for memes, fan battles,
              matchday chaos and tournament banter.
            </p>
          </div>
          <span className="neon-badge neon-badge-pink">
            Unofficial fan art
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-lime-300/20 bg-black/40 shadow-[0_0_34px_rgba(163,255,18,0.12)]">
          <Image
            src="/wc26/wc26-mascot-banner.png"
            alt="$WC26 fan-made mascot banner featuring Maple the Moose, Zayu the Jaguar and Clutch the Bald Eagle"
            width={1536}
            height={488}
            className="hidden h-auto w-full sm:block"
            priority={false}
          />
          <Image
            src="/wc26/wc26-mobile-hero.png"
            alt="$WC26 fan-made mascot mobile banner"
            width={309}
            height={299}
            className="block h-auto w-full sm:hidden"
            priority={false}
          />
        </div>

        <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">
          These are fan-made $WC26 community mascots. They are not official
          tournament mascots and are not affiliated with FIFA, World Cup,
          national teams, players, sponsors or governing bodies.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {mascots.map((mascot) => (
          <article key={mascot.name} className="neon-card rounded-[2rem] p-5">
            <div className="flex min-h-[260px] items-end justify-center rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
              <Image
                src={mascot.image}
                alt={mascot.name}
                width={220}
                height={330}
                className="h-auto max-h-[250px] w-auto object-contain drop-shadow-[0_0_22px_rgba(163,255,18,0.18)]"
              />
            </div>

            <p className="neon-kicker mt-5">{mascot.country}</p>
            <h3 className="mt-3 text-2xl font-black uppercase text-white">
              {mascot.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {mascot.text}
            </p>
          </article>
        ))}
      </div>

      <div className="neon-panel overflow-hidden rounded-[2rem] p-5">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="neon-kicker">Sticker energy</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white">
              Built for memes, replies and raids
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Use the mascot crew for daily prompts, Telegram stickers, X reply
              memes, matchday missions and community posts.
            </p>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-fuchsia-300/20 bg-black/40">
            <Image
              src="/wc26/wc26-sticker-pack.png"
              alt="$WC26 sticker and emote pack previews"
              width={1283}
              height={166}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
