import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  CalendarBlank,
  Coffee,
  CreditCard,
  Drop,
  Fire,
  Lightning,
  MapPin,
  PawPrint,
  ShieldCheck,
  Star,
  TreeEvergreen,
  Users,
  Wallet,
} from '@phosphor-icons/react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Reveal from '../components/Reveal.jsx'
import Rating from '../components/Rating.jsx'
import { zonas } from '../data/campings.js'

const heroImg = 'https://picsum.photos/seed/campi-hero/1200/1400'
const bentoImgA = 'https://picsum.photos/seed/campi-bento-a/1200/900'
const bentoImgB = 'https://picsum.photos/seed/campi-bento-b/1000/560'

const serviceIcons = {
  'Agua potable': Drop,
  Baños: Users,
  'Baños con ducha': Users,
  Fogata: Fire,
  Luz: Lightning,
  Estacionamiento: MapPin,
  Mascotas: PawPrint,
  Desayuno: Coffee,
}

const steps = [
  {
    n: '01',
    icon: MapPin,
    title: 'Busca por zona y servicios',
    text: 'Filtra por región, fechas, fogata, mascotas y lo que necesites para acampar cómodo.',
  },
  {
    n: '02',
    icon: CalendarBlank,
    title: 'Reserva tus fechas',
    text: 'Elige las noches y la cantidad de personas. Ves el precio total antes de pagar.',
  },
  {
    n: '03',
    icon: TreeEvergreen,
    title: 'Llega y acampa',
    text: 'Recibes la confirmación, la ubicación y las reglas. Solo te queda armar la carpa.',
  },
]

const ownerBenefits = [
  {
    icon: Wallet,
    title: 'Publicas gratis',
    text: 'Sin costo de inscripción. Sube tu camping y empieza a recibir reservas.',
  },
  {
    icon: CalendarBlank,
    title: 'Calendario de disponibilidad',
    text: 'Marca las fechas libres y bloqueadas. El precio puede cambiar por temporada.',
  },
  {
    icon: ShieldCheck,
    title: 'Pagos protegidos',
    text: 'Cobras por adelantado. Liberamos tu dinero 24 a 48 horas después del check-in.',
  },
  {
    icon: Star,
    title: 'Llega a más viajeros',
    text: 'Tus reseñas construyen confianza y te posicionan mejor en tu zona.',
  },
]

const testimonials = [
  {
    quote: 'Encontré un camping que no había visto en Instagram, con reserva confirmada en dos minutos.',
    name: 'Camila R.',
    role: 'Acampó en Cajón del Maipo',
    featured: true,
  },
  {
    quote: 'Como dueño dejé de responder mensajes a las once de la noche. La reserva se cierra sola.',
    name: 'Felipe A.',
    role: 'Dueño en Pucón',
  },
  {
    quote: 'Sé exactamente qué servicios tiene cada parcela antes de llegar, y el pago es seguro.',
    name: 'Javiera M.',
    role: 'Viajera frecuente',
  },
]

function SectionHeading({ eyebrow, title, sub, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600 dark:text-forest-300">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-fog">{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-muted dark:text-fogmuted">{sub}</p>}
    </div>
  )
}

export default function Landing() {
  const reduce = useReducedMotion()

  return (
    <div className="min-h-[100dvh] bg-bone text-ink dark:bg-night dark:text-fog">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600 dark:text-forest-300">
              Marketplace de campings
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl dark:text-fog">
              Tu lugar para <span className="text-forest-600 dark:text-forest-300">acampar</span>, reservado en línea
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted dark:text-fogmuted">
              Campings y glampings verificados en todo Chile. Compara servicios, elige fechas y paga seguro, sin
              llamadas ni mensajes.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/explorar"
                className="inline-flex items-center gap-2 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-700 active:translate-y-px"
              >
                Explorar campings
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                to="/#dueños"
                className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-forest-600 hover:text-forest-700 dark:border-white/15 dark:text-fog dark:hover:border-forest-300 dark:hover:text-forest-300"
              >
                Soy dueño
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-forest-900/10 shadow-xl shadow-forest-900/10 dark:border-white/10">
              <img
                src={heroImg}
                alt="Camping entre árboles al atardecer"
                className="aspect-[5/6] w-full object-cover sm:aspect-[4/5]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Zonas */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Explora por zona"
            sub="Desde la cordillera hasta el desierto, encuentra campings cerca de donde quieres estar."
          />
        </Reveal>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {zonas.map((zona) => (
            <Link
              key={zona.nombre}
              to={`/explorar?zona=${encodeURIComponent(zona.nombre)}`}
              className="group relative h-56 w-60 shrink-0 snap-start overflow-hidden rounded-2xl sm:w-64"
            >
              <img
                src={`https://picsum.photos/seed/${zona.seed}/640/520`}
                alt={zona.nombre}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-lg font-semibold text-white">{zona.nombre}</p>
                <p className="text-sm text-white/75">{zona.cantidad} campings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Cómo funciona"
            sub="Tres pasos entre tú y la próxima fogata. Sin llamadas, sin vueltas."
          />
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <Reveal key={step.n} delay={i * 0.08} className="border-t border-forest-900/15 pt-6 dark:border-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-forest-300 dark:text-forest-600">{step.n}</span>
                  <Icon size={26} weight="duotone" className="text-forest-600 dark:text-forest-300" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink dark:text-fog">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted dark:text-fogmuted">{step.text}</p>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Por qué Campi (bento) */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Por qué Campi"
            title="Acampar debería ser fácil"
            sub="Verificamos cada camping para que sepas qué te vas a encontrar antes de pagar."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="h-full overflow-hidden rounded-2xl">
              <img
                src={bentoImgA}
                alt="Vista panorámica de un terreno de camping"
                loading="lazy"
                className="h-full min-h-[280px] w-full object-cover md:min-h-full"
              />
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-forest-900/8 bg-white p-6 dark:border-white/8 dark:bg-night2">
              <ShieldCheck size={28} weight="duotone" className="text-forest-600 dark:text-forest-300" />
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-ink dark:text-fog">Campings verificados</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted dark:text-fogmuted">
                  Identidad del dueño y geolocalización real antes de publicar.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-2xl bg-forest-50 p-6 dark:bg-forest-900/30">
              <CreditCard size={28} weight="duotone" className="text-forest-600 dark:text-forest-300" />
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-ink dark:text-fog">Pago seguro</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted dark:text-fogmuted">
                  Pagas con Webpay y liberamos el dinero al dueño después del check-in.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="md:col-span-2">
            <div className="grid h-full items-center gap-4 overflow-hidden rounded-2xl border border-forest-900/8 bg-white p-6 sm:grid-cols-[1fr_auto] dark:border-white/8 dark:bg-night2">
              <div>
                <h3 className="text-lg font-semibold text-ink dark:text-fog">Servicios claros</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted dark:text-fogmuted">
                  Agua, baños, luz, fogata, mascotas. Todo declarado antes de reservar, sin sorpresas al llegar.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(serviceIcons).map(([label, Icon]) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-700 dark:bg-forest-900/40 dark:text-forest-200"
                    >
                      <Icon size={14} weight="fill" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <img
                src={bentoImgB}
                alt="Detalle de servicios del camping"
                loading="lazy"
                className="hidden h-36 w-48 rounded-xl object-cover sm:block"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Para dueños */}
      <section id="dueños" className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Para dueños de camping"
            sub="Convierte tu terreno en ingresos, sin pagar comisión por publicarlo."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-3xl bg-forest-800 p-8 text-white dark:bg-forest-900">
              <div>
                <p className="text-sm font-medium text-forest-200">Al publicar tu camping</p>
                <p className="mt-3 text-6xl font-semibold tracking-tight">0%</p>
                <p className="mt-2 text-lg font-medium text-forest-100">de comisión para el dueño</p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-forest-100/80">
                  Tú cobras el 100% de tu noche. Nuestra comisión la paga el viajero al reservar.
                </p>
              </div>
              <Link
                to="/explorar"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest-800 transition hover:bg-forest-50 active:translate-y-px"
              >
                Soy dueño
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {ownerBenefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <Reveal key={benefit.title} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-forest-900/8 bg-white p-6 dark:border-white/8 dark:bg-night2">
                    <Icon size={24} weight="duotone" className="text-forest-600 dark:text-forest-300" />
                    <h3 className="mt-4 text-base font-semibold text-ink dark:text-fog">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted dark:text-fogmuted">{benefit.text}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title="Lo que dicen los viajeros" sub="Reseñas de personas que ya encontraron su lugar." />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 0.05}
              className={t.featured ? 'lg:col-span-2' : ''}
            >
              <figure className="h-full rounded-2xl border border-forest-900/8 bg-white p-6 sm:p-8 dark:border-white/8 dark:bg-night2">
                <Rating value={5} />
                <blockquote
                  className={`mt-4 font-medium leading-snug text-ink dark:text-fog ${
                    t.featured ? 'text-xl sm:text-2xl' : 'text-base'
                  }`}
                >
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted dark:text-fogmuted">
                  <span className="font-semibold text-ink dark:text-fog">{t.name}</span>
                  <span className="text-forest-600 dark:text-forest-300">, </span>
                  {t.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-forest-800 px-6 py-16 text-center sm:px-12 dark:bg-forest-900">
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              ¿Listo para tu próxima noche al aire libre?
            </h2>
            <p className="max-w-xl text-forest-100/85">
              Explora campings verificados y reserva en minutos. Tu lugar te está esperando.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/explorar"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest-800 transition hover:bg-forest-50 active:translate-y-px"
              >
                Explorar campings
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}
