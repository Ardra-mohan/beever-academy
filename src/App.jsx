import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Award, Users, Shield, Globe, BookOpen, GraduationCap, 
  Monitor, Briefcase, ChevronLeft, ChevronRight, 
  MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, 
  Quote, Sparkles, Menu, X, ArrowRight, CheckCircle2
} from 'lucide-react';

// Import local logo from assets
import logo from './assets/logo.png';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeAdmissionsStep, setActiveAdmissionsStep] = useState(1);
  const [formStatus, setFormStatus] = useState({ loading: false, submitted: false });
  const [activeNavSection, setActiveNavSection] = useState('home');

  // Testimonial Autoplay Ref
  const autoplayRef = useRef(null);

  // Testimonials data
  const testimonials = [
    {
      text: "My time at Beever Academy redefined my career. The holistic focus on leadership and ethics gave me the confidence to head global teams at Fortune 500 companies.",
      name: "Charles Harrison",
      meta: "Class of 2021 • Executive MBA",
      initials: "CH"
    },
    {
      text: "The faculty at Beever do not just lecture; they inspire. The hands-on innovation labs allowed me to patent a fintech model while finishing my undergraduate thesis.",
      name: "Victoria Kincaid",
      meta: "Class of 2023 • BS Computer Science",
      initials: "VK"
    },
    {
      text: "A truly elite and global environment. The connections I formed here with fellow students and visiting scholars are my single most valuable professional assets.",
      name: "Aravind Sharma",
      meta: "Class of 2020 • PhD Economics",
      initials: "AS"
    }
  ];

  // ==========================================
  // EFFECT HOOKS
  // ==========================================

  // Loading Screen Timer
  useEffect(() => {
    const handleLoadComplete = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Luxury branding delay
    };

    if (document.readyState === 'complete') {
      handleLoadComplete();
    } else {
      window.addEventListener('load', handleLoadComplete);
      return () => window.removeEventListener('load', handleLoadComplete);
    }
  }, []);

  // Navbar Scroll Trigger
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Track active section for navbar highlighting
      const sections = ['home', 'about', 'programs', 'admissions', 'blog', 'contact'];
      const scrollY = window.pageYOffset;
      
      for (const sectionId of sections) {
        const current = document.getElementById(sectionId);
        if (current) {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 150;
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            setActiveNavSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Animations once loader is gone
  useEffect(() => {
    if (!isLoading) {
      // 1. Hero Load Animations
      const heroTl = gsap.timeline();
      heroTl.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
            .from('.hero-heading', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
            .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .from('.hero-btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, '-=0.6')
            .from('.hero-img-box', { scale: 0.95, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.2')
            .from('.hero-logo-badge', { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4');

      // 2. Features entrance
      gsap.from('.feature-card-el', {
        scrollTrigger: {
          trigger: '.features-grid-el',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // 3. About animations
      gsap.from('.about-img-box-el', {
        scrollTrigger: { trigger: '.about-grid-el', start: 'top 75%' },
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });

      gsap.from('.about-glass-card-el', {
        scrollTrigger: { trigger: '.about-grid-el', start: 'top 70%' },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'back.out(1.2)'
      });

      gsap.from('.about-text-el > *', {
        scrollTrigger: { trigger: '.about-text-el', start: 'top 75%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // 4. Statistics Counters
      const statsSection = document.querySelector('.stats-grid-el');
      if (statsSection) {
        const statsData = [
          { target: 1000, suffix: '+' },
          { target: 50, suffix: '+' },
          { target: 25, suffix: '+' },
          { target: 98, suffix: '%' }
        ];
        
        const statNumbers = document.querySelectorAll('.stat-number-el');
        statNumbers.forEach((el, index) => {
          const data = statsData[index];
          if (!data) return;
          
          const obj = { val: 0 };
          gsap.to(obj, {
            scrollTrigger: {
              trigger: statsSection,
              start: 'top 80%',
            },
            val: data.target,
            duration: 2.2,
            ease: 'power1.out',
            onUpdate: function() {
              el.innerText = Math.floor(obj.val) + data.suffix;
            }
          });
        });
      }

      // 5. Programs Cards Stagger
      gsap.from('.program-card-el', {
        scrollTrigger: { trigger: '.programs-grid-el', start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });

      // 6. Admissions timeline progress triggers
      const timelineSteps = document.querySelectorAll('.timeline-step-el');
      timelineSteps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 65%',
          end: 'bottom 65%',
          onEnter: () => setActiveAdmissionsStep(index + 1),
          onLeaveBack: () => setActiveAdmissionsStep(index)
        });
      });

      // 8. Blog posts stagger
      gsap.from('.blog-card-el', {
        scrollTrigger: { trigger: '.blog-grid-el', start: 'top 85%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }
  }, [isLoading]);

  // Testimonials slide autoplay loops
  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [currentTestimonial]);

  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
  };

  const handleTestimonialNav = (dir) => {
    setCurrentTestimonial(prev => (prev + dir + testimonials.length) % testimonials.length);
    startAutoplay();
  };

  // Form submission handler
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, submitted: false });
    
    setTimeout(() => {
      setFormStatus({ loading: false, submitted: true });
      alert('Thank you for your interest in Beever Academy. A senior admissions ambassador will review your profile and contact you within 24 business hours.');
      e.target.reset();
    }, 1500);
  };

  // Timeline Progress percentage
  const getTimelineProgressHeight = () => {
    const totalSteps = 5;
    const activeIndex = activeAdmissionsStep - 1;
    return `${(activeIndex / (totalSteps - 1)) * 100}%`;
  };

  return (
    <div className="min-h-screen text-charcoal font-sans bg-white relative">
      {/* ==========================================
         PAGE LOADER
         ========================================== */}
      {isLoading && (
        <div className="fixed inset-0 bg-burgundy-dark flex justify-center items-center z-[9999] transition-opacity duration-800">
          <div className="text-center">
            {/* Logo used here */}
            <img src={logo} alt="Beever Academy Emblem" className="w-[130px] h-auto mx-auto animate-logo-pulse" />
            <div className="w-[180px] h-[2px] bg-white/10 mx-auto my-6 relative overflow-hidden">
              <div className="h-full bg-gold-gradient w-full animate-bar-fill"></div>
            </div>
            <span className="font-serif text-gold-light tracking-[0.3em] text-sm font-medium block">
              BEEVER ACADEMY
            </span>
          </div>
        </div>
      )}

      {/* ==========================================
         STICKY HEADER NAVBAR
         ========================================== */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 navbar-glass shadow-md' : 'py-6 bg-transparent'}`}>
        <div className="max-w-[1300px] mx-auto px-8 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3">
            {/* Logo used here */}
            <img src={logo} alt="Beever Academy Logo" className="w-[64px] h-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
            <span className="font-serif text-white text-xl md:text-2xl font-semibold tracking-wider">
              BEEVER <span className="text-gold">ACADEMY</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex gap-7">
            {['home', 'about', 'programs', 'admissions', 'blog', 'contact'].map(sec => (
              <li key={sec}>
                <a 
                  href={`#${sec}`} 
                  className={`font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-200 relative py-2 ${activeNavSection === sec ? 'text-gold-light after:w-full' : 'text-white/80 hover:text-gold-light after:w-0'} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-gold-gradient hover:after:w-full after:transition-all after:duration-300`}
                >
                  {sec.replace('-', ' ')}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a href="#admissions" className="hidden sm:inline-flex btn btn-gold text-xs px-6 py-3 font-semibold shadow-gold gold-gradient-bg text-burgundy-dark hover:shadow-[0_15px_30px_rgba(212,175,55,0.5)] hover:-translate-y-[2px] transition-all duration-300 uppercase tracking-widest">
              Enroll Now
            </a>
            {/* Mobile Hamburger toggle */}
            <button 
              className="lg:hidden text-white flex flex-col gap-[6px] cursor-pointer z-[1100]" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <>
                  <span className="w-6 h-[2px] bg-white block"></span>
                  <span className="w-6 h-[2px] bg-white block"></span>
                  <span className="w-6 h-[2px] bg-white block"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-burgundy-dark z-[990] flex justify-center items-center transition-all duration-500">
          <ul className="flex flex-col items-center gap-8">
            {['home', 'about', 'programs', 'admissions', 'blog', 'contact'].map(sec => (
              <li key={sec} onClick={() => setMobileMenuOpen(false)}>
                <a href={`#${sec}`} className="font-serif text-white text-3xl tracking-wide hover:text-gold transition-colors duration-200 capitalize">
                  {sec.replace('-', ' ')}
                </a>
              </li>
            ))}
            <li onClick={() => setMobileMenuOpen(false)} className="mt-4">
              <a href="#admissions" className="btn btn-gold text-sm px-10 py-4 shadow-gold gold-gradient-bg text-burgundy-dark uppercase tracking-widest font-semibold block text-center">
                Enroll Now
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* ==========================================
         HERO SECTION
         ========================================== */}
      <section id="home" className="relative min-h-screen bg-burgundy-dark flex items-center overflow-hidden pt-32">
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark/95 to-burgundy-dark/70 z-10"></div>
        
        <div className="relative max-w-[1300px] w-full mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-16 z-20">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-white text-left">
            <div className="hero-badge mb-6 inline-block">
              <span className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-gold border border-gold/30 px-4 py-2 bg-gold/5 backdrop-blur-[5px]">
                Est. 1918 &bull; Institution of Excellence
              </span>
            </div>
            <h1 className="hero-heading text-5xl md:text-7xl font-serif leading-[1.1] mb-8">
              LEARN TODAY,<br/>
              <span className="gold-gradient-text font-bold">LEAD TOMORROW</span>
            </h1>
            <p className="hero-desc text-base md:text-lg font-light text-text-light mb-12 max-w-[580px] leading-relaxed">
              Empowering minds. Building character. Shaping future leaders. Experience the highest standard of academic excellence and luxury campus life.
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="#programs" className="hero-btn btn btn-gold gold-gradient-bg text-burgundy-dark px-9 py-4 font-semibold uppercase tracking-widest shadow-gold hover:shadow-[0_15px_30px_rgba(212,175,55,0.5)] hover:-translate-y-[3px] transition-all duration-300">
                Explore Programs
              </a>
              <a href="#contact" className="hero-btn btn border border-white/30 text-white hover:bg-white hover:text-burgundy hover:border-white px-9 py-4 font-semibold uppercase tracking-widest hover:-translate-y-[3px] transition-all duration-300">
                Schedule Campus Visit
              </a>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="hero-img-box relative w-full max-w-[450px] border border-gold/20 p-3 bg-white/5 shadow-2xl">
              <img src="/hero_building.png" alt="Grand Academy Building" className="w-full h-[520px] object-cover transition-transform duration-500 hover:scale-105" />
              
              {/* Emblem Overlay - Logo used here */}
              <div className="hero-logo-badge absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] bg-burgundy-dark/85 border border-gold rounded-full flex justify-center items-center shadow-[0_10px_40px_rgba(0,0,0,0.5),_0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-[8px]">
                <img src={logo} alt="Beever Academy Shield" className="w-[96px] h-auto drop-shadow-md animate-[spin_20s_linear_infinite]" />
              </div>
              
              {/* Parallax Light Flares */}
              <div className="absolute w-[300px] h-[300px] -top-[50px] -right-[50px] bg-radial from-gold/20 to-transparent z-[-1] animate-glow-float-1"></div>
              <div className="absolute w-[250px] h-[250px] -bottom-[30px] -left-[60px] bg-radial from-gold/20 to-transparent z-[-1] animate-glow-float-2"></div>
            </div>
          </div>
        </div>

        {/* Mouse scroll down indicator */}
        <a href="#why-choose-us" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex justify-center" aria-label="Scroll Down">
          <span className="w-[26px] h-[44px] border-2 border-white/40 rounded-[12px] relative block">
            <span className="w-[4px] h-[8px] bg-gold rounded-[2px] absolute top-2 left-1/2 -translate-x-1/2 animate-mouse-scroll"></span>
          </span>
        </a>
      </section>

      {/* ==========================================
         WHY CHOOSE US SECTION
         ========================================== */}
      <section id="why-choose-us" className="py-32 bg-white text-center">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="mb-20">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Heritage of Distinction
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
              Why Choose Beever Academy
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
          </div>

          <div className="features-grid-el grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Feature 1 */}
            <div className="feature-card-el bg-white p-10 border border-black/5 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-gold/30 transition-all duration-300 group relative overflow-hidden z-10">
              <div className="w-[65px] h-[65px] bg-ivory border border-burgundy/8 flex justify-center items-center mb-8 mx-auto group-hover:bg-burgundy group-hover:border-burgundy transition-all duration-300">
                <Award className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-serif text-burgundy mb-4">Academic Excellence</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Rigorous curriculum, state-of-the-art resources, and exceptional academic standards recognized globally.</p>
              <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-40 shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 z-[-1]"></div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card-el bg-white p-10 border border-black/5 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-gold/30 transition-all duration-300 group relative overflow-hidden z-10">
              <div className="w-[65px] h-[65px] bg-ivory border border-burgundy/8 flex justify-center items-center mb-8 mx-auto group-hover:bg-burgundy group-hover:border-burgundy transition-all duration-300">
                <Users className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-serif text-burgundy mb-4">Experienced Faculty</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Learn from distinguished scholars, industry pioneers, and internationally acclaimed Ivy League educators.</p>
              <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-40 shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 z-[-1]"></div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card-el bg-white p-10 border border-black/5 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-gold/30 transition-all duration-300 group relative overflow-hidden z-10">
              <div className="w-[65px] h-[65px] bg-ivory border border-burgundy/8 flex justify-center items-center mb-8 mx-auto group-hover:bg-burgundy group-hover:border-burgundy transition-all duration-300">
                <Shield className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-serif text-burgundy mb-4">Character Building</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Fostering integrity, resilience, ethical leadership, and a deep commitment to positive societal impact.</p>
              <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-40 shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 z-[-1]"></div>
            </div>

            {/* Feature 4 */}
            <div className="feature-card-el bg-white p-10 border border-black/5 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-gold/30 transition-all duration-300 group relative overflow-hidden z-10">
              <div className="w-[65px] h-[65px] bg-ivory border border-burgundy/8 flex justify-center items-center mb-8 mx-auto group-hover:bg-burgundy group-hover:border-burgundy transition-all duration-300">
                <Globe className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-serif text-burgundy mb-4">Global Perspective</h3>
              <p className="text-sm text-text-secondary leading-relaxed">International study opportunities, global networking events, and an inclusive, diverse student body.</p>
              <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-40 shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         ABOUT SECTION
         ========================================== */}
      <section id="about" className="py-32 bg-ivory">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="about-grid-el grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Visual Column */}
            <div className="about-img-box-el relative border border-burgundy/10 p-[15px] bg-white shadow-md">
              <img src="/library_students.png" alt="Students in Library" className="w-full h-[480px] object-cover" />
              
              {/* Overlay Glass Card */}
              <div className="about-glass-card-el absolute -bottom-10 -right-10 w-[280px] bg-burgundy/90 backdrop-blur-[12px] border border-gold/30 p-8 shadow-2xl text-white hidden sm:block">
                <div className="relative">
                  <h4 className="font-serif text-2xl text-gold mb-3">Education For Life</h4>
                  <p className="text-xs text-text-light leading-relaxed">Enriching minds, nurturing spirits, and preparing global citizens since 1918.</p>
                  <Sparkles className="absolute -top-[10px] -right-[10px] w-[35px] h-[35px] text-gold/20" />
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="about-text-el">
              <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
                Since 1918
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
                About Beever Academy
              </h2>
              <div className="w-[80px] h-[2px] bg-gold-gradient mb-8"></div>
              
              <p className="font-serif text-2xl text-burgundy italic mb-8 leading-relaxed">
                Beever Academy stands as a beacon of luxury educational excellence. We believe in providing an environment that is as inspiring as it is intellectually challenging.
              </p>
              
              <ul className="flex flex-col gap-6 mb-12">
                {[
                  { title: "Holistic Education", desc: "Cultivating intellectual, emotional, and social development." },
                  { title: "Leadership Development", desc: "Programs built specifically to shape tomorrow's chief executives and statesmen." },
                  { title: "Academic Excellence", desc: "Consistently ranked among the top elite academic institutions worldwide." },
                  { title: "Personal Growth", desc: "Dedicated mentorship, individualized feedback, and wellness coaching." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-gold-dark mt-[3px] flex-shrink-0" />
                    <span className="text-sm text-text-secondary">
                      <strong className="text-charcoal font-semibold">{item.title}</strong> - {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
              
              <a href="#contact" className="btn btn-burgundy bg-burgundy hover:bg-burgundy-light text-white px-9 py-4 font-semibold uppercase tracking-widest shadow-burgundy hover:-translate-y-[3px] transition-all duration-300">
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         STATISTICS COUNTERS
         ========================================== */}
      <section className="relative py-32 bg-burgundy-dark text-white overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute w-[500px] h-[500px] -top-[200px] -left-[200px] rounded-full bg-radial from-gold/5 to-transparent"></div>
          <div className="absolute w-[400px] h-[400px] -bottom-[150px] -right-[100px] rounded-full bg-radial from-gold/5 to-transparent"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 relative z-20">
          <div className="stats-grid-el grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { icon: <Users className="w-full h-full" />, target: 1000, label: "Students Enrolled", display: "1000+" },
              { icon: <GraduationCap className="w-full h-full" />, target: 50, label: "Expert Faculty", display: "50+" },
              { icon: <BookOpen className="w-full h-full" />, target: 25, label: "Programs Offered", display: "25+" },
              { icon: <Award className="w-full h-full" />, target: 98, label: "Success Rate", display: "98%" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-[50px] h-[50px] text-gold mb-6 opacity-85">
                  {stat.icon}
                </div>
                <div className="stat-number-el font-serif text-5xl md:text-6xl font-bold text-gold-light mb-3" data-target={stat.target}>
                  {stat.display}
                </div>
                <div className="font-sans text-xs uppercase tracking-widest text-text-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
         PROGRAMS SECTION
         ========================================== */}
      <section id="programs" className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-20">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Academic Pathways
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
              Programs of Distinction
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
            <p className="text-lg text-text-secondary italic font-serif max-w-[650px] mx-auto mt-6">
              Explore our diverse selection of rigorous, world-class curricula tailored for global leaders.
            </p>
          </div>

          <div className="programs-grid-el grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "Undergraduate Studies", icon: <BookOpen className="w-full h-full" />, desc: "A foundational journey offering robust core knowledge, flexible majors, and comprehensive liberal arts components." },
              { title: "Postgraduate Programs", icon: <GraduationCap className="w-full h-full" />, desc: "Advanced master's and doctoral degrees focusing on deep research, critical inquiry, and industrial application." },
              { title: "Professional Certifications", icon: <Award className="w-full h-full" />, desc: "Targeted, high-impact training designed to keep working professionals at the peak of their industries." },
              { title: "Leadership Development", icon: <Users className="w-full h-full" />, desc: "Signature courses focusing on strategic decision-making, team synergy, and systemic global change." },
              { title: "Online Learning", icon: <Monitor className="w-full h-full" />, desc: "Flexible digital instruction leveraging cutting-edge technology, accessible from anywhere in the world." },
              { title: "Executive Education", icon: <Briefcase className="w-full h-full" />, desc: "Bespoke management masterclasses designed exclusively for elite senior business directors and C-suite leaders." }
            ].map((program, i) => (
              <div key={i} className="program-card-el bg-white p-10 border border-black/5 shadow-sm relative z-10 hover:-translate-y-2 hover:shadow-2xl hover:border-transparent transition-all duration-300 flex flex-col justify-between group min-h-[300px]">
                <div>
                  <div className="w-[60px] h-[60px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300 mb-8">
                    {program.icon}
                  </div>
                  <h3 className="text-2xl font-serif text-burgundy mb-4">{program.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-8">{program.desc}</p>
                </div>
                <a href="#contact" className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider font-semibold text-burgundy hover:text-gold-dark transition-colors duration-200">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                
                {/* Custom glowing background on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-burgundy/1 to-burgundy/5 border border-gold opacity-0 group-hover:opacity-100 transition-all duration-300 z-[-1]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ==========================================
         TESTIMONIALS SECTION
         ========================================== */}
      <section className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Alumni Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
              Voices of Excellence
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
          </div>

          <div className="max-w-[850px] mx-auto relative px-8 sm:px-16">
            <div className="relative h-[420px] sm:h-[350px] overflow-hidden">
              {testimonials.map((test, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 flex flex-col justify-center items-center text-center transition-all duration-600 ${index === currentTestimonial ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-5'}`}
                >
                  <div className="relative pt-14 mb-8">
                    <Quote className="absolute top-0 left-1/2 -translate-x-1/2 w-[50px] h-[50px] text-gold-light/45" />
                    <p className="font-serif text-2xl md:text-3xl text-burgundy-dark italic leading-relaxed">
                      "{test.text}"
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-[60px] h-[60px] bg-radial from-gold to-gold-dark rounded-full flex justify-center items-center shadow-md">
                      <span className="font-sans text-burgundy-dark font-bold text-sm tracking-wide">
                        {test.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg text-burgundy font-serif font-medium">{test.name}</h4>
                      <span className="font-sans text-[11px] uppercase tracking-wider text-text-secondary block">
                        {test.meta}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Arrow Buttons */}
            <button 
              onClick={() => handleTestimonialNav(-1)} 
              className="absolute left-0 top-1/2 -translate-y-1/2 border border-burgundy/15 rounded-full w-12 h-12 flex justify-center items-center text-burgundy hover:bg-burgundy hover:text-white hover:border-burgundy hover:shadow-burgundy transition-all duration-300 cursor-pointer hidden md:flex"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleTestimonialNav(1)} 
              className="absolute right-0 top-1/2 -translate-y-1/2 border border-burgundy/15 rounded-full w-12 h-12 flex justify-center items-center text-burgundy hover:bg-burgundy hover:text-white hover:border-burgundy hover:shadow-burgundy transition-all duration-300 cursor-pointer hidden md:flex"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => { setCurrentTestimonial(index); startAutoplay(); }} 
                  className={`border-none h-2 cursor-pointer transition-all duration-300 rounded-full ${index === currentTestimonial ? 'bg-gold-dark w-6' : 'bg-burgundy/15 w-2'}`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ==========================================
         ADMISSIONS TIMELINE
         ========================================== */}
      <section id="admissions" className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-20">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Enrollment Gateway
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
              Admissions Process
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
            <p className="text-lg text-text-secondary italic font-serif max-w-[650px] mx-auto mt-6">
              Our steps to guide elite candidates toward successful matriculation.
            </p>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative max-w-[900px] mx-auto py-16">
            
            {/* Center connector line */}
            <div className="timeline-line absolute top-0 left-8 lg:left-1/2 -translate-x-1/2 w-[2px] h-full bg-burgundy/10 z-10">
              <div 
                className="timeline-progress-line absolute top-0 left-0 w-full bg-gold-gradient" 
                style={{ height: getTimelineProgressHeight() }}
              ></div>
            </div>

            {[
              { step: 1, title: "Submit Application", desc: "Complete the digital profile and submit academic transcripts, references, and your personal statement statement." },
              { step: 2, title: "Review Process", desc: "Our admissions board conducts a comprehensive, holistic review of every candidate's profiles." },
              { step: 3, title: "Interview", desc: "Shortlisted candidates are invited for a panel interview, either in-person on campus or online." },
              { step: 4, title: "Admission Decision", desc: "Formal decisions are sent out via email, providing comprehensive feedback and financial aid outlines." },
              { step: 5, title: "Enrollment", desc: "Secure your place, complete deposit, attend orientation sessions, and select academic modules." }
            ].map((item, index) => {
              const isActive = activeAdmissionsStep >= item.step;
              return (
                <div 
                  key={index} 
                  className={`timeline-step-el relative flex flex-col lg:flex-row mb-20 last:mb-0 z-20 ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'}`}
                >
                  {/* Step point marker */}
                  <div className={`absolute left-8 lg:left-1/2 -translate-x-1/2 w-[50px] h-[50px] rounded-full border-2 bg-white flex justify-center items-center transition-all duration-300 ${isActive ? 'bg-burgundy border-gold shadow-gold ring-6 ring-burgundy/15' : 'border-burgundy/15'}`}>
                    <span className={`font-sans font-bold transition-all duration-300 ${isActive ? 'text-gold' : 'text-burgundy'}`}>
                      {item.step}
                    </span>
                  </div>

                  {/* Step Description Card */}
                  <div className={`w-[calc(100%-5rem)] ml-20 lg:ml-0 lg:w-[45%] bg-white p-8 border border-black/5 shadow-sm transition-all duration-300 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} ${isActive ? 'border-gold/20 shadow-md scale-[1.02]' : ''}`}>
                    <h3 className="text-2xl font-serif text-burgundy mb-2">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
         BLOG SECTION
         ========================================== */}
      <section id="blog" className="py-32 bg-ivory">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-20">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Academic Insights
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
              The Academy Journal
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
          </div>

          <div className="blog-grid-el grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { cat: "Academics", title: "The Future of Global Business Leadership", date: "May 28, 2026", img: "/library_students.png", summary: "Dr. Julian Vance discusses the integration of quantum computing and business ethics in modern MBA courses." },
              { cat: "Innovation", title: "Pioneering AI in Higher Education", date: "May 15, 2026", img: "/campus_innovation.png", summary: "Exploring how Beever's quantum innovation labs are deploying tailored student teaching AI assistants." },
              { cat: "Student Life", title: "Spring Convocation & Gala Highlights", date: "Apr 30, 2026", img: "/campus_events.png", summary: "A visual recap of this year's convocation ceremony, featuring keynote addresses from global ambassadors." }
            ].map((post, i) => (
              <article key={i} className="blog-card-el bg-white border border-black/5 shadow-sm overflow-hidden hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="relative w-full h-[230px] overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute top-6 left-6 bg-burgundy text-white font-sans text-[10px] font-semibold uppercase tracking-wider px-4 py-2 shadow-md">
                    {post.date}
                  </div>
                </div>
                <div className="p-8 text-left">
                  <span className="font-sans text-[10px] font-semibold text-gold-dark uppercase tracking-wider block mb-2">{post.cat}</span>
                  <h3 className="text-xl font-serif text-burgundy-dark mb-4 leading-snug">
                    <a href="#blog" className="hover:text-gold-dark transition-colors">{post.title}</a>
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">{post.summary}</p>
                  <a href="#blog" className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider font-semibold text-burgundy hover:text-gold-dark">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
         CALL TO ACTION PARALLAX BANNER
         ========================================== */}
      <section className="relative py-40 overflow-hidden text-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 z-10" 
          style={{ backgroundImage: "url('/campus_events.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy/90 to-charcoal/90 z-20"></div>

        <div className="max-w-[1200px] mx-auto px-8 relative z-30 flex flex-col items-center">
          <h2 className="text-5xl font-serif mb-6 leading-tight max-w-[800px] drop-shadow-md">
            Begin Your Journey Toward Excellence
          </h2>
          <p className="text-base md:text-lg text-text-light font-light max-w-[600px] mb-12 leading-relaxed">
            Admissions for the upcoming academic year are now open. Secure your legacy at Beever Academy.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <a href="#admissions" className="btn btn-gold gold-gradient-bg text-burgundy-dark px-10 py-4 font-semibold uppercase tracking-widest shadow-gold hover:shadow-[0_15px_30px_rgba(212,175,55,0.5)] hover:-translate-y-1 transition-all duration-300">
              Apply Now
            </a>
            <a href="#contact" className="btn border border-white/30 text-white hover:bg-white hover:text-burgundy hover:border-white px-10 py-4 font-semibold uppercase tracking-widest hover:-translate-y-1 transition-all duration-300">
              Request Information
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
         CONTACT SECTION & FORM
         ========================================== */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-20">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Reach Out
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
              Schedule A Visit & Inquiry
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Form Wrap */}
            <div className="lg:col-span-7 bg-ivory p-10 sm:p-14 border border-black/5 shadow-sm text-left">
              <form onSubmit={handleInquirySubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Full Name</label>
                    <input type="text" id="name" placeholder="John Doe" required className="font-sans text-sm p-4 border border-burgundy/10 bg-white focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Email Address</label>
                    <input type="email" id="email" placeholder="john@example.com" required className="font-sans text-sm p-4 border border-burgundy/10 bg-white focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="program" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Program of Interest</label>
                    <select id="program" className="font-sans text-sm p-4 border border-burgundy/10 bg-white focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200">
                      <option value="undergraduate">Undergraduate Studies</option>
                      <option value="postgraduate">Postgraduate Programs</option>
                      <option value="executive">Executive Education</option>
                      <option value="other">Other / General Inquiry</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Preferred Visit Date</label>
                    <input type="date" id="date" className="font-sans text-sm p-4 border border-burgundy/10 bg-white focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="msg" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Your Message</label>
                  <textarea id="msg" rows="5" placeholder="Tell us about your academic goals..." required className="font-sans text-sm p-4 border border-burgundy/10 bg-white focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus.loading}
                  className="btn btn-burgundy bg-burgundy hover:bg-burgundy-light text-white font-semibold uppercase tracking-widest py-4 w-full cursor-pointer disabled:opacity-75 transition-all"
                >
                  {formStatus.loading ? 'PROCESSING INQUIRY...' : 'SUBMIT INQUIRY'}
                </button>
              </form>
            </div>

            {/* Info Cards Wrap */}
            <div className="lg:col-span-5 flex flex-col gap-8 text-left">
              {[
                { icon: <MapPin className="w-5.5 h-5.5" />, title: "Academy Campus", desc: "100 Academic Circle, Royal Estates, NY 10021" },
                { icon: <Phone className="w-5.5 h-5.5" />, title: "Admissions Office", desc: "+1 (800) 555-BEEV • +1 (212) 555-0198" },
                { icon: <Mail className="w-5.5 h-5.5" />, title: "Electronic Mail", desc: "admissions@beeveracademy.edu • info@beeveracademy.edu" }
              ].map((card, i) => (
                <div key={i} className="flex gap-6 items-start bg-white p-8 border border-black/3 shadow-sm">
                  <div className="w-[48px] h-[48px] bg-ivory border border-burgundy/5 flex justify-center items-center text-burgundy flex-shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-serif text-burgundy font-medium mb-1">{card.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}

              <div className="h-[220px] bg-cover bg-center border border-black/5 shadow-sm relative" style={{ backgroundImage: "url('/hero_building.png')" }}>
                <div className="absolute inset-0 bg-burgundy/30 flex justify-center items-center">
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-gold text-[10px] font-semibold tracking-wider gold-gradient-bg text-burgundy-dark px-5 py-3 uppercase flex items-center gap-2">
                    <Globe className="w-4 h-4" /> View Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         FOOTER SECTION
         ========================================== */}
      <footer className="bg-burgundy-dark text-white border-t-2 border-gold">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 py-28 text-left">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <a href="#home" className="flex items-center gap-3">
              {/* Logo used here */}
              <img src={logo} alt="Beever Academy Logo" className="w-[68px] h-auto" />
              <span className="font-serif text-white text-xl font-semibold tracking-wider">
                BEEVER ACADEMY
              </span>
            </a>
            <p className="font-sans text-[10px] font-semibold text-gold uppercase tracking-wider">
              Empowering Minds. Building Character. Shaping Future Leaders.
            </p>
            <p className="text-xs text-text-light leading-relaxed">
              An elite world-class educational institution dedicated to intellectual brilliance, elite leadership preparation, and ethical foundation.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
                { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                { icon: <Youtube className="w-4 h-4" />, label: "YouTube" }
              ].map((soc, i) => (
                <a key={i} href="#" className="w-[38px] h-[38px] bg-white/5 border border-white/10 rounded-none flex justify-center items-center text-white hover:bg-gold-gradient hover:text-burgundy-dark hover:border-transparent hover:-translate-y-1 transition-all duration-300" aria-label={soc.label}>
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg text-gold font-serif font-semibold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:h-[1px] after:bg-gold">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4 text-xs text-text-light">
              {['about', 'programs', 'admissions', 'blog', 'contact'].map(link => (
                <li key={link}>
                  <a href={`#${link}`} className="hover:text-gold-light hover:pl-1 transition-all duration-200 capitalize">
                    {link.replace('-', ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg text-gold font-serif font-semibold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:h-[1px] after:bg-gold">
              Programs
            </h4>
            <ul className="flex flex-col gap-4 text-xs text-text-light">
              {['Undergraduate', 'Postgraduate', 'Professional Courses', 'Online Learning', 'Executive Education'].map(prog => (
                <li key={prog}>
                  <a href="#programs" className="hover:text-gold-light hover:pl-1 transition-all duration-200">
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg text-gold font-serif font-semibold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:h-[1px] after:bg-gold">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-5 text-xs text-text-light">
              <li className="flex gap-4 items-start">
                <MapPin className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>100 Academic Circle, Royal Estates, NY 10021</span>
              </li>
              <li className="flex gap-4 items-start">
                <Phone className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>+1 (800) 555-BEEV</span>
              </li>
              <li className="flex gap-4 items-start">
                <Mail className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>admissions@beeveracademy.edu</span>
              </li>
              <li className="flex gap-4 items-start">
                <Globe className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>www.beeveracademy.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#240000] border-t border-white/5 py-8">
          <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>&copy; 2026 Beever Academy. All Rights Reserved. Designed for Luxury Educational Institutions.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
