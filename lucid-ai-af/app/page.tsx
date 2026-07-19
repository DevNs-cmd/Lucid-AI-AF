'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Bot, ChevronDown, Clapperboard, Crown, ImagePlus, Map, Menu, Sparkles, Users, WandSparkles, X } from 'lucide-react';

const frames = Array.from({ length: 300 }, (_, i) => `/frames/frame_${String(i + 1).padStart(5, '0')}.png`);

function ScrollCinema() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    images.current = frames.map((src) => { const image = new Image(); image.src = src; return image; });
    const first = images.current[0];
    first.onload = () => setReady(true);
  }, []);

  useEffect(() => {
    const draw = (index: number) => {
      const canvas = canvasRef.current; const image = images.current[index];
      if (!canvas || !image?.complete || !image.naturalWidth) return;
      const rect = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
      const width = image.naturalWidth * scale; const height = image.naturalHeight * scale;
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(image, (rect.width - width) / 2, (rect.height - height) / 2, width, height);
    };
    const onScroll = () => {
      const scene = sceneRef.current; if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      draw(Math.min(frames.length - 1, Math.floor(progress * (frames.length - 1))));
    };
    const onResize = () => onScroll();
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, [ready]);

  return <section ref={sceneRef} className="cinema-section" aria-label="A cinematic journey through a Lucid AI world">
    <div className="cinema-sticky"><canvas ref={canvasRef} className={`cinema-canvas ${ready ? 'is-ready' : ''}`} />
      <div className="cinema-shade" />
      <motion.div className="cinema-copy" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.6, once: true }}>
        <span className="eyebrow"><Sparkles size={14} /> YOUR NEXT WORLD IS WAITING</span>
        <h2>Every choice<br /><em>changes everything.</em></h2>
        <p>Scroll to step through a world that is watching, remembering, and evolving with you.</p>
      </motion.div>
      <div className="scroll-status"><span /> SCROLL TO EXPLORE</div>
    </div>
  </section>;
}

const features = [
  [Bot, 'Dynamic AI Characters', 'Meet characters with motives, memories, and their own plans.'],
  [Map, 'World Simulation', 'Living worlds that move forward—whether you are there or not.'],
  [Clapperboard, 'AI Cinematics', 'Your best moments become scenes worth remembering.'],
  [Users, 'Multiplayer', 'Invite friends into a shared story that belongs to all of you.'],
  [ImagePlus, 'AI Image Generator', 'See your hero, your kingdom, and your choices brought to life.'],
  [WandSparkles, 'Creator Studio', 'Build worlds, shape lore, and publish your own adventures.']
] as const;

const faqs = [
  ['How does the AI remember my choices?', 'LUCID AI uses a long-term memory system that tracks every decision and relationship change. The AI recalls these past events so your actions have permanent consequences in the story.'],
  ['Can I play stories together with my friends?', 'Yes! The multiplayer feature lets you invite friends into the same world to merge your stories, take on shared missions, and build guilds.'],
  ['What happens when I hit the 10-chapter daily limit?', 'On the Free Plan, your 10 chapters reset automatically every 24 hours. To remove the limit and get infinite daily chapters, you can upgrade to the PRO plan at any time.'],
  ['Can I create my own characters and worlds?', 'Absolutely. You can use the Creator Studio to build and customize your own worlds, NPCs, voices, and quests, which you can keep private or share with the community.'],
  ['How is this different from a normal AI chatbot?', 'Standard chatbots just reply to text line-by-line. LUCID AI simulates a whole living world—complete with moving economies, weather, NPC routines, and automatic cinematic videos.']
] as const;

export default function Home() {
  const [open, setOpen] = useState(false); const [openFaq, setOpenFaq] = useState<number | null>(0); const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '26%']);
  return <main>
    <nav className="nav"><a className="brand" href="#top"><img src="/lucid-ai-logo.jpeg" alt="LUCID AI" /><span>LUCID <b>AI</b></span></a>
      <div className={`nav-links ${open ? 'open' : ''}`}><a href="#features" onClick={() => setOpen(false)}>Features</a><a href="#gallery" onClick={() => setOpen(false)}>Gallery</a><a href="#pricing" onClick={() => setOpen(false)}>Pricing</a><a href="#faq" onClick={() => setOpen(false)}>FAQ</a></div>
      <div className="nav-actions"><Link href="/login" className="login">Log In</Link><a className="nav-cta" href="#journey">Play for Free <ArrowRight size={15} /></a></div>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
    </nav>

    <section ref={hero} id="top" className="hero"><motion.div className="hero-orb" style={{ y: glowY }} /><div className="hero-noise" />
      <motion.div className="hero-content" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } } }}>
        <motion.p variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="eyebrow"><Sparkles size={14} /> IMAGINE · INTERACT · INFINITE</motion.p>
        <motion.h1 variants={{ hidden: { opacity: 0, y: 35 }, show: { opacity: 1, y: 0 } }}>You don’t just read the story.<br /><span>You live it.</span> Shape it. Become the legend.</motion.h1>
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="hero-sub">Infinite worlds. Infinite stories. Infinite you.</motion.p>
        <motion.a variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="primary-button" href="#journey">Start Your Journey <ArrowRight size={18} /></motion.a>
      </motion.div>
      <div className="hero-star star-one">✦</div><div className="hero-star star-two">✧</div><div className="hero-star star-three">✦</div>
    </section>

    <ScrollCinema />

    <section id="journey" className="comparison wrap"><motion.div className="section-intro" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><span className="eyebrow">THE DIFFERENCE</span><h2>Stop consuming worlds.<br /><span>Start inhabiting them.</span></h2></motion.div>
      <div className="compare-grid"><motion.article className="compare-card muted-card" initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><div className="card-icon"><Clapperboard /></div><span className="label">PASSIVE ENTERTAINMENT</span><h3>The story is already written.</h3><p>Netflix and scripted games give you beautiful worlds—but you are only ever passing through them.</p><ul><li>A fixed plot</li><li>Characters forget you</li><li>One ending, every time</li></ul></motion.article>
        <motion.article className="compare-card lucid-card" initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><div className="card-icon"><Sparkles /></div><span className="label">THE LUCID AI EXPERIENCE</span><h3>The world is yours to change.</h3><p>Your decisions become canon. Every conversation, alliance, and mistake shapes what happens next.</p><ul><li>Evolving worlds</li><li>NPCs with memory</li><li>Endless possibilities</li></ul><div className="card-glow" /></motion.article></div>
    </section>

    <section id="features" className="features wrap"><div className="section-intro"><span className="eyebrow">ONE PLATFORM · INFINITE POSSIBILITIES</span><h2>Built for stories that<br /><span>refuse to stand still.</span></h2></div><div className="feature-grid">{features.map(([Icon, title, copy], i) => <motion.article key={title} className="feature-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}><div className="feature-icon"><Icon size={22} /></div><h3>{title}</h3><p>{copy}</p><span className="feature-number">0{i + 1}</span></motion.article>)}</div></section>

    <section id="gallery" className="gallery wrap"><div className="section-intro center"><span className="eyebrow">A GLIMPSE BEYOND THE PAGE</span><h2>Every world has a<br /><span>way of calling you.</span></h2></div><div className="gallery-stage"><motion.figure className="gallery-card gallery-city" animate={{ y: [0, -16, 0], rotate: [-2, -1, -2] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><img src="/gallery-city.jpg" alt="A neon city in the rain" /><figcaption>Neon Horizons</figcaption></motion.figure><motion.figure className="gallery-card gallery-castle" animate={{ y: [-9, 11, -9], rotate: [2, 3, 2] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><img src="/gallery-castle.jpg" alt="A grand fantasy castle at twilight" /><figcaption>Kingdoms Unwritten</figcaption></motion.figure><motion.figure className="gallery-card gallery-knight" animate={{ y: [10, -10, 10], rotate: [-1, 1, -1] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}><img src="/gallery-knight.jpg" alt="A silver-haired knight in dark armor" /><figcaption>Heroes Remembered</figcaption></motion.figure></div></section>

    <section id="pricing" className="pricing wrap"><div className="section-intro center"><span className="eyebrow">CHOOSE YOUR ADVENTURE</span><h2>Begin with a chapter.<br /><span>Stay for the legend.</span></h2></div><div className="price-grid"><article className="price-card"><div><span className="label">FREE</span><h3>Explore the impossible.</h3></div><div className="price"><b>$0</b><span>/ forever</span></div><a href="#" className="outline-button">Begin for free <ArrowRight size={16} /></a><ul><li><b>10 chapters</b> every day</li><li><b>3 active worlds</b></li><li>Core AI models</li><li>Community worlds</li></ul></article><article className="price-card pro"><div className="popular"><Crown size={14} /> MOST POPULAR</div><div><span className="label">PRO</span><h3>Live without limits.</h3></div><div className="price"><b>$19</b><span>/ month</span></div><a href="#" className="primary-button full">Become Pro <ArrowRight size={16} /></a><ul><li><b>Unlimited</b> chapters & worlds</li><li><b>Premium AI</b> models</li><li>Advanced image generation</li><li>Early access to everything</li></ul></article><motion.article className="price-card future-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><div><span className="label">FUTURE</span><h3>Coming soon.</h3></div><a href="#" className="outline-button">Join waitlist <ArrowRight size={16} /></a><ul><li>Creator Marketplace</li><li>World Subscriptions</li><li>Premium Story Packs</li><li>Character Skins</li><li>Visual Themes</li></ul></motion.article></div>
    </section>

    <section id="faq" className="faq wrap"><div className="section-intro center"><span className="eyebrow">QUESTIONS, ANSWERED</span><h2>Before you enter<br /><span>the story.</span></h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item ${openFaq === index ? 'active' : ''}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} /></button>{openFaq === index && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }}>{answer}</motion.p>}</article>)}</div></section>

    <footer><div className="footer-brand"><img src="/lucid-ai-logo.jpeg" alt="" /><span>LUCID <b>AI</b></span></div><p>© 2025 Lucid AI. The story begins with you.</p><div className="footer-links"><a href="#">Terms of Service</a><a href="#">Privacy Policy</a><a href="#">Contact</a></div></footer>
  </main>;
}
