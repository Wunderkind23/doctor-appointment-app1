'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Grid3X3, Heart, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useRef, useState } from 'react';

const useScrollDirectionAnimation = (offset = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 1 : -1;
      lastScrollY = currentScrollY;

      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * (1 - offset);
      const isInView = rect.top < triggerPoint && rect.bottom > 0;

      if (isInView && direction === 1) {
        // Scrolling down, animate in
        setIsVisible(true);
      } else if (!isInView && direction === -1) {
        // Scrolling up and element left viewport, animate out
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset]);

  return { ref, isVisible };
};

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => {
  const { ref, isVisible } = useScrollDirectionAnimation(0.2);
  return (
    <div
      ref={ref}
      className="group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
    >
      <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 border border-brand-200 dark:border-brand-900/30 hover:border-brand-400 dark:hover:border-brand-600 transition-all duration-300 h-full">
        <div className="inline-block p-3 rounded-xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: { content: string; avatar: string; name: string; role: string };
}) => {
  const { ref, isVisible } = useScrollDirectionAnimation(0.3);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
    >
      <div className="h-full p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-brand-500">
              ★
            </span>
          ))}
        </div>
        <p className="text-slate-700 dark:text-slate-300 mb-6 flex-grow italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center text-white font-semibold">
            {testimonial.avatar}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WaveDivider = ({ flip = false }) => (
  <svg
    className={`w-full h-24 ${flip ? 'rotate-180' : ''}`}
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
  >
    <path
      d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
      fill="currentColor"
      className="text-slate-50 dark:text-slate-900"
    ></path>
  </svg>
);

export default function Home() {
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollDirectionAnimation(0.2);
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollDirectionAnimation(0.2);
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollDirectionAnimation(0.2);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollDirectionAnimation(0.2);
  return (
    <div className="relative bg-white dark:bg-slate-950 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl dark:bg-brand-500/20"
          style={{
            animation: 'float 20s ease-in-out infinite',
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl dark:bg-teal-600/20"
          style={{
            animation: 'float 15s ease-in-out infinite',
            animationDelay: '-5s',
          }}
        ></div>
      </div>

      <section className="relative z-10 min-h-screen  flex flex-col items-center justify-center py-20 border pt-24">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                  opacity: 0,
                }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 border border-brand-300 dark:border-brand-700">
                  <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400"></div>
                  <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                    Your Health, Your Way
                  </span>
                </div>
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards`,
                  opacity: 0,
                }}
              >
                Connect with{' '}
                <span className="text-brand-600 dark:text-brand-400">Your Perfect</span> Doctor
              </h1>

              <div
                className="space-y-3"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards`,
                  opacity: 0,
                }}
              >
                {[
                  'Lightning-fast appointment booking',
                  'Verified specialists across all fields',
                  'Secure consultations anytime',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards`,
                  opacity: 0,
                }}
              >
                <Button
                  asChild
                  className="group relative px-8 py-6 text-base font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-600/50"
                >
                  <Link href="/sign-in">
                    <span className="flex items-center gap-2">
                      APPLY NOW{' '}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold rounded-xl border-2 border-slate-900 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>

              <div
                className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards`,
                  opacity: 0,
                }}
              >
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">10K+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Verified Doctors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">50K+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Happy Patients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">12M+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Consultations</div>
                </div>
              </div>
            </div>

            <div
              className="relative"
              style={{
                animation: `scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards`,
                opacity: 0,
              }}
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-brand-200 dark:border-brand-900/50 shadow-2xl">
                <Image
                  src="/banner2.png"
                  alt="Doctor Consultation"
                  width={600}
                  height={700}
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider 1 */}
      <div className="relative z-10 bg-white dark:bg-slate-950">
        <WaveDivider />
      </div>

      {/* Services Section */}
      <section
        ref={servicesRef}
        className="relative z-10 py-24 bg-slate-50 dark:bg-slate-900/50"
        style={{
          opacity: servicesVisible ? 1 : 0,
          transform: servicesVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white"
              style={{
                animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                opacity: 0,
              }}
            >
              Comprehensive Healthcare{' '}
              <span className="text-brand-600 dark:text-brand-400">Solutions</span>
            </h2>
            <p
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
              style={{
                animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards`,
                opacity: 0,
              }}
            >
              Find the perfect specialist for your healthcare needs
            </p>
          </div>

          <Tabs defaultValue="specialists" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300">
              <TabsTrigger
                value="specialists"
                className="relative rounded-md transition-all duration-300 data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-600/50"
              >
                <span className="relative z-10">Find Specialists</span>
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="relative rounded-md transition-all duration-300 data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-600/50"
              >
                <span className="relative z-10">Book Appointments</span>
              </TabsTrigger>
              <TabsTrigger
                value="consultations"
                className="relative rounded-md transition-all duration-300 data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-600/50"
              >
                <span className="relative z-10">Get Consultation</span>
              </TabsTrigger>
            </TabsList>

            <div className="overflow-hidden">
              <TabsContent
                value="specialists"
                className="grid lg:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8"
              >
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Find Specialists
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Browse our network of verified doctors and find the perfect match.
                  </p>
                  <div className="space-y-4">
                    {[
                      'Filter by specialty',
                      'Check credentials',
                      'Read reviews',
                      'Access profiles',
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
                    <Link href="/doctors">Explore Doctors</Link>
                  </Button>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-96 shadow-lg">
                  <Image src="/banner2.png" alt="Specialists" fill className="object-cover" />
                </div>
              </TabsContent>

              <TabsContent
                value="appointments"
                className="grid lg:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8"
              >
                <div className="relative rounded-2xl overflow-hidden h-96 shadow-lg order-2 lg:order-1">
                  <Image src="/banner2.png" alt="Appointments" fill className="object-cover" />
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Book Appointments
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Schedule at your convenience with instant confirmation.
                  </p>
                  <div className="space-y-4">
                    {[
                      'Instant confirmation',
                      'Flexible rescheduling',
                      'Secure payment',
                      'Reminders',
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
                    <Link href="/appointments">View Appointments</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="consultations"
                className="grid lg:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8"
              >
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Professional Consultations
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Connect one on one from comfort of your home.
                  </p>
                  <div className="space-y-4">
                    {['Swift Response', '15 Minute Sessions', 'Privacy', 'Professionalism'].map(
                      (feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                      )
                    )}
                  </div>
                  <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
                    <Link href="/doctors">Start Consultation</Link>
                  </Button>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-96 shadow-lg">
                  <Image src="/banner2.png" alt="Video Calls" fill className="object-cover" />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Wave Divider 2 */}
      <div className="relative z-10 bg-slate-50 dark:bg-slate-900/50">
        <WaveDivider flip={true} />
      </div>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative z-10 py-24 px-4 bg-white dark:bg-slate-950"
        style={{
          opacity: featuresVisible ? 1 : 0,
          transform: featuresVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white"
              style={{
                animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                opacity: 0,
              }}
            >
              Cutting-Edge <span className="text-brand-600 dark:text-brand-400">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Easy Booking',
                desc: 'Book in seconds',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '24/7 Access',
                desc: 'Anytime, anywhere',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Confirmation',
                desc: 'Immediate details',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Expert Network',
                desc: 'Thousands of professionals',
              },
              {
                icon: <Grid3X3 className="w-8 h-8" />,
                title: 'Smart Matching',
                desc: 'AI recommendations',
              },
              {
                icon: <Check className="w-8 h-8" />,
                title: 'Secure & Private',
                desc: 'Enterprise encryption',
              },
            ].map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider 3 */}
      <div className="relative z-10 bg-white dark:bg-slate-950">
        <WaveDivider />
      </div>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        className="relative z-10 py-24 px-4 bg-slate-50 dark:bg-slate-900/50"
        style={{
          opacity: testimonialsVisible ? 1 : 0,
          transform: testimonialsVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4"
              style={{
                animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                opacity: 0,
              }}
            >
              Real Stories, Real Results
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah M.',
                role: 'Patient',
                content: 'Found the perfect cardiologist within minutes.',
                avatar: 'SM',
              },
              {
                name: 'Dr. James L.',
                role: 'Doctor',
                content: 'Transformed how I connect with patients.',
                avatar: 'JL',
              },
              {
                name: 'Alex T.',
                role: 'Patient',
                content: 'Excellent video quality and saved time.',
                avatar: 'AT',
              },
            ].map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider 4 */}
      <div className="relative z-10 bg-slate-50 dark:bg-slate-900/50">
        <WaveDivider flip={true} />
      </div>

      {/* Final CTA */}
      <section
        ref={ctaRef}
        className="relative z-10 py-32 px-4 bg-white dark:bg-slate-950"
        style={{
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              animation: `fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
              opacity: 0,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-teal-600 opacity-90"></div>
            <div className="relative p-12 sm:p-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6">
                Your Health Matters
              </h2>
              <p className="text-white/90 text-center text-lg mb-10 max-w-2xl mx-auto">
                Start your wellness journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* TODO: REVAMP THIS */}
                {/* <Button
                  asChild
                  className="bg-white hover:bg-slate-100 text-brand-600 font-semibold px-10 py-6 rounded-lg"
                >
                  <Link href="/">Get Started Now</Link>
                </Button> */}
                <Button
                  asChild
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-10 py-6 rounded-lg border border-white/40"
                >
                  <Link href="/doctors">Browse Doctors</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
        }
        * { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
