'use client';

import { Phone, AlertTriangle, Heart, Globe, MessageCircle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const crisisLines = [
  {
    name: 'Единый телефон доверия',
    phone: '8-800-333-44-34',
    description: 'Бесплатная психологическая помощь по всей России, круглосуточно',
    icon: Phone,
    color: 'from-red-400 to-rose-500',
  },
  {
    name: 'Телефон доверия для детей и подростков',
    phone: '8-800-2000-122',
    description: 'Бесплатная, анонимная помощь для детей, подростков и их родителей',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
  },
  {
    name: 'Московский телефон доверия',
    phone: '+7 (495) 051',
    description: 'Круглосуточная психологическая помощь, бесплатный номер',
    icon: Phone,
    color: 'from-orange-400 to-amber-500',
  },
  {
    name: 'Горячая линия психологической помощи МЧС',
    phone: '+7 (495) 989-50-50',
    description: 'Психологическая помощь в чрезвычайных ситуациях',
    icon: Shield,
    color: 'from-amber-400 to-yellow-500',
  },
];

const onlineResources = [
  {
    name: 'b17.ru',
    url: 'https://www.b17.ru',
    description: 'Крупнейший портал психологической помощи в России. Поиск психолога, статьи, форум.',
    icon: Globe,
  },
    {
    name: 'Я Психолог',
    url: 'https://ipsy.ru',
    description: 'Онлайн-консультации с психологами. Первый сеанс бесплатно.',
    icon: MessageCircle,
  },
  {
    name: 'Alter',
    url: 'https://alter-psych.ru',
    description: 'Подбор психолога по параметрам. Очные и онлайн-сессии.',
    icon: Heart,
  },
];

const selfHelpTips = [
  {
    title: 'Поговорите с кем-нибудь',
    description: 'Расскажите близкому человеку о том, что чувствуете. Даже простой разговор может помочь.',
  },
  {
    title: 'Дыхательные упражнения',
    description: 'Попробуйте медленное дыхание: вдох 4 секунды, задержка 7 секунд, выдох 8 секунд.',
  },
  {
    title: 'Физическая активность',
    description: 'Даже короткая прогулка может улучшить настроение. Движение снимает напряжение.',
  },
  {
    title: 'Запишите мысли',
    description: 'Выпишите всё, что вас беспокоит. Это помогает структурировать мысли и снизить тревогу.',
  },
  {
    title: 'Ограничьте информацию',
    description: 'Сделайте перерыв от новостей и соцсетей. Информационный шум усиливает тревогу.',
  },
  {
    title: 'Обратитесь к специалисту',
    description: 'Если вы чувствуете, что не справляетесь, обратитесь к психологу или психотерапевту.',
  },
];

export function CrisisSection() {
  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-destructive">Если вам нужна срочная помощь</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Если вы или кто-то из ваших близких находится в кризисной ситуации, пожалуйста, обратитесь за профессиональной помощью. Вы не одни.
          </p>
        </div>
      </div>

      {/* Hotlines */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" />
          Горячие линии
        </h2>
        {crisisLines.map((line, i) => {
          const Icon = line.icon;
          return (
            <Card key={i} className="border-border/50 overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${line.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{line.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{line.description}</p>
                  <a
                    href={`tel:${line.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-sm font-bold text-primary hover:underline mt-1 inline-block"
                  >
                    {line.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Online Resources */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Онлайн-ресурсы
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {onlineResources.map((resource, i) => {
            const Icon = resource.icon;
            return (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{resource.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Self Help Tips */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Советы по самопомощи
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selfHelpTips.map((tip, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
            >
              <h4 className="text-sm font-medium text-foreground">{tip.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center py-4 px-4 rounded-xl bg-muted/50">
        <p className="text-xs text-muted-foreground">
          Это приложение не является медицинской услугой и не заменяет профессиональную психологическую или психиатрическую помощь. Если у вас серьёзные проблемы со здоровьем, обратитесь к специалисту.
        </p>
      </div>
    </div>
  );
}
