'use client';

import { Phone, AlertTriangle, Heart, Globe, MessageCircle, Shield } from 'lucide-react';

const crisisLines = [
  {
    name: 'Linka první psychické pomoci',
    phone: '116 123',
    description: 'Bezplatná, anonymní krizová linka pro dospělé. Nonstop.',
    icon: Phone,
  },
  {
    name: 'Linka bezpečí (děti a dospívající)',
    phone: '116 111',
    description: 'Nonstop bezplatná linka pro děti a mládež v krizi.',
    icon: Heart,
  },
  {
    name: 'Linka psychické pomoci RIAPS',
    phone: '284 016 666',
    description: 'Konzultace s psychologem, denně 8:00–24:00.',
    icon: Shield,
  },
  {
    name: 'Modrá linka',
    phone: '284 016 667',
    description: 'Krizová intervence pro děti, rodinu a vztahy.',
    icon: MessageCircle,
  },
];

const onlineResources = [
  {
    name: 'Dobré ráno',
    url: 'https://www.doberano.cz',
    description: 'Online poradenství a psychoterapie. Čeští psychologové.',
  },
  {
    name: 'Nevčnímej',
    url: 'https://www.nevdimej.cz',
    description: 'Prevence suicidů. Online chat a podpora v krizi.',
  },
  {
    name: 'Psyhelp',
    url: 'https://www.psyhelp.cz',
    description: 'Databáze psychologů a psychoterapeutů v ČR.',
  },
];

const selfHelpTips = [
  { title: 'Promluvte si s někým', description: 'Řekněte blízkému, co cítíte. I jednoduchý rozhovor může pomoci.' },
  { title: 'Dechová cvičení', description: 'Zkuste pomalé dýchání: nádech 4s, zadržet 7s, výdech 8s.' },
  { title: 'Pohyb', description: 'I krátká procházka může zlepšit náladu. Pohyb uvolňuje napětí.' },
  { title: 'Zapište si myšlenky', description: 'Napište vše, co vás trápí. Pomáhá to strukturovat myšlenky.' },
  { title: 'Omezte informace', description: 'Udělejte si pauzu od zpráv a sítí. Informační šum zvyšuje úzkost.' },
  { title: 'Vyhledejte odborníka', description: 'Pokud si neporadíte, kontaktujte psychologa nebo psychoterapeuta.' },
];

export function CrisisSection() {
  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="rounded-2xl p-4 border border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-white/70">Potřebujete okamžitou pomoc?</h3>
            <p className="text-xs text-white/30 mt-1 leading-relaxed">
              Pokud vy nebo někdo blízký jste v krizové situaci, kontaktujte odbornou pomoc. Nejdete sami.
            </p>
          </div>
        </div>
      </div>

      {/* Hotlines */}
      <div className="space-y-3">
        <p className="text-[9px] text-white/30 tracking-widest uppercase">Krizové linky ČR</p>
        {crisisLines.map((line, i) => {
          const Icon = line.icon;
          return (
            <div key={i} className="glass rounded-2xl p-4 hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/40" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white/70">{line.name}</h3>
                  <p className="text-xs text-white/25 mt-0.5">{line.description}</p>
                  <a
                    href={`tel:${line.phone.replace(/\s/g, '')}`}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors mt-2 inline-block tracking-wide"
                  >
                    {line.phone}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Online */}
      <div className="space-y-3">
        <p className="text-[9px] text-white/30 tracking-widest uppercase">Online zdroje</p>
        <div className="grid grid-cols-1 gap-2">
          {onlineResources.map((r, i) => (
            <div key={i} className="glass rounded-xl p-4 hover-lift">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-3 h-3 text-white/20" />
                <h4 className="text-sm text-white/60">{r.name}</h4>
              </div>
              <p className="text-xs text-white/25">{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-3">
        <p className="text-[9px] text-white/30 tracking-widest uppercase">Sebepomoc</p>
        <div className="grid grid-cols-2 gap-2 stagger-children">
          {selfHelpTips.map((tip, i) => (
            <div key={i} className="glass rounded-xl p-3">
              <h4 className="text-xs font-medium text-white/50 mb-1">{tip.title}</h4>
              <p className="text-[10px] text-white/20 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center py-4">
        <p className="text-[9px] text-white/10 tracking-wider">
          Tato aplikace nenahrazuje odbornou psychologickou nebo psychiatrickou péči.
        </p>
      </div>
    </div>
  );
}
