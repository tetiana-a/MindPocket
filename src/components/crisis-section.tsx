'use client';

import {
  Phone,
  AlertTriangle,
  Heart,
  Globe,
  MessageCircle,
  Shield,
  ExternalLink,
} from 'lucide-react';

const crisisLines = [
  {
    name: 'Linka první psychické pomoci',
    phone: '116 123',
    description: 'Bezplatná nonstop krizová pomoc pro dospělé.',
    icon: Phone,
  },
  {
    name: 'Linka bezpečí',
    phone: '116 111',
    description: 'Pomoc pro děti a mladé lidi v těžké situaci.',
    icon: Heart,
  },
  {
    name: 'RIAPS',
    phone: '222 586 768',
    description: 'Psychologická krizová pomoc a podpora.',
    icon: Shield,
  },
  {
    name: 'Modrá linka',
    phone: '608 902 410',
    description: 'Krizová intervence a psychologická podpora.',
    icon: MessageCircle,
  },
];

const onlineResources = [
  {
    name: 'Linka první psychické pomoci',
    url: 'https://linkapsychickepomoci.cz/',
    description: 'Nonstop krizová pomoc pro dospělé.',
  },
  {
    name: 'Linka bezpečí',
    url: 'https://www.linkabezpeci.cz/',
    description: 'Pomoc pro děti, mládež a studenty do 26 let.',
  },
  {
    name: 'Nevypusť duši',
    url: 'https://nevypustdusi.cz/kde-hledat-pomoc/',
    description: 'Kde hledat psychickou pomoc v ČR.',
  },
  {
    name: 'Psyhelp',
    url: 'https://psyhelp.cz/',
    description: 'Databáze psychologů a terapeutů v Česku.',
  },
];

const selfHelpTips = [
  {
    title: 'Promluvte si s někým',
    description:
      'Sdílení pocitů s blízkým člověkem může výrazně ulevit.',
  },
  {
    title: 'Dechové cvičení',
    description:
      'Nádech na 4 sekundy, zadržet dech, pomalý výdech.',
  },
  {
    title: 'Krátká procházka',
    description:
      'I pár minut pohybu pomáhá snížit napětí a stres.',
  },
  {
    title: 'Zapište si myšlenky',
    description:
      'Deník pomáhá uspořádat emoce a uklidnit mysl.',
  },
  {
    title: 'Omezte sociální sítě',
    description:
      'Příliš informací může zvyšovat úzkost a přetížení.',
  },
  {
    title: 'Vyhledejte odborníka',
    description:
      'Psycholog nebo terapeut může pomoci zvládnout těžké období.',
  },
];

export function CrisisSection() {
  return (
    <div className="space-y-6">

      {/* WARNING */}
      <div className="rounded-3xl border border-red-500/10 bg-red-500/5 backdrop-blur-xl p-5">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-300" />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-1">
              Potřebujete okamžitou pomoc?
            </h3>

            <p className="text-sm text-white/60 leading-relaxed">
              Pokud jste v krizové situaci nebo máte pocit, že situaci
              nezvládáte, kontaktujte odbornou pomoc.
            </p>
          </div>
        </div>
      </div>

      {/* HOTLINES */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
          Krizové linky
        </p>

        {crisisLines.map((line, i) => {
          const Icon = line.icon;

          return (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white/60" />
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-medium">
                    {line.name}
                  </h3>

                  <p className="text-sm text-white/45 mt-1 leading-relaxed">
                    {line.description}
                  </p>

                  <a
                    href={`tel:${line.phone.replace(/\s/g, '')}`}
                    className="inline-block mt-3 text-white font-semibold hover:text-white/70 transition-colors"
                  >
                    {line.phone}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ONLINE RESOURCES */}
      <div className="space-y-3">

        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
          Online zdroje
        </p>

        <div className="space-y-3">

          {onlineResources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-white/50" />
                  </div>

                  <div>
                    <h3 className="text-white font-medium">
                      {resource.name}
                    </h3>

                    <p className="text-sm text-white/45 mt-1 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-white/30 flex-shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* SELF HELP */}
      <div className="space-y-3">

        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
          Sebepomoc
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {selfHelpTips.map((tip, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4"
            >
              <h4 className="text-white font-medium mb-2">
                {tip.title}
              </h4>

              <p className="text-sm text-white/45 leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-white/20 leading-relaxed">
          MindPocket nenahrazuje odbornou psychologickou nebo psychiatrickou péči.
        </p>
      </div>
    </div>
  );
}
