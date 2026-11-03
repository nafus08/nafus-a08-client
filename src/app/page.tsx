"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Aperture, ChevronLeft, ChevronRight, Shield, Sparkles } from "lucide-react";
import { Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { api, type Studio } from "@/lib/api";
import { StudioCard } from "@/components/studio-card";
import { toast } from "sonner";

const slides = [
  {
    eyebrow: "THE CREATIVE SPACE YOU'VE BEEN LOOKING FOR",
    title: <>Make room for<br /><em>your next big idea.</em></>,
    copy: "Find the space, the gear, and the people that bring your vision to life.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85",
  },
  {
    eyebrow: "FIND YOUR PERFECT SOUND",
    title: <>A better place<br /><em>to make some noise.</em></>,
    copy: "From first takes to final mixes, find a room that sounds like you.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2200&q=85",
  },
  {
    eyebrow: "YOUR VISION. YOUR STAGE.",
    title: <>Lights up.<br /><em>Creativity on.</em></>,
    copy: "Book a film-ready production space, minus the production headaches.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2200&q=85",
  },
];

const categories = [
  { name: "Photo Studios", slug: "Photo Studio", number: "01", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80" },
  { name: "Sound Stages", slug: "Film Stage", number: "02", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80" },
  { name: "Podcast Rooms", slug: "Podcast Lounge", number: "03", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80" },
  { name: "Music Suites", slug: "Music Suite", number: "04", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=80" },
  { name: "Art Workshops", slug: "Workshop", number: "05", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80" },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [featured, setFeatured] = useState<Studio[]>([]);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  useEffect(() => {
    api<Studio[]>("/api/studios/featured").then(setFeatured).catch((error: Error) => toast.error(error.message));
  }, []);

  return (
    <>
      <section className="hero">
        <Swiper modules={[Autoplay, A11y]} onSwiper={setSwiper} onSlideChange={(instance) => setActive(instance.realIndex)} autoplay={{ delay: 6500, disableOnInteraction: false }} loop className="hero-swiper">
          {slides.map((slide) => <SwiperSlide key={slide.eyebrow}><div className="hero-slide" style={{ backgroundImage: `linear-gradient(90deg,rgba(18,23,20,.75),rgba(18,23,20,.12)),url("${slide.image}")` }}><div className="hero-inner wrap"><div className="hero-copy"><p className="eyebrow light"><span />{slide.eyebrow}</p><h1>{slide.title}</h1><p className="hero-lede">{slide.copy}</p><div className="hero-actions"><Link className="button button-lime" href="/studios">Explore studios <ArrowRight size={17} /></Link><Link className="button button-ghost" href="/add-studio">Host your space</Link></div></div><a className="hero-scroll" href="#featured">Scroll to explore <ArrowDown size={15} /></a></div></div></SwiperSlide>)}
        </Swiper>
        <div className="hero-controls">
          <button aria-label="Previous slide" onClick={() => swiper?.slidePrev()}><ChevronLeft /></button>
          {slides.map((slide, i) => <button key={slide.eyebrow} aria-label={`Go to slide ${i + 1}`} className={`slide-dot ${i === active ? "selected" : ""}`} onClick={() => swiper?.slideToLoop(i)} />)}
          <button aria-label="Next slide" onClick={() => swiper?.slideNext()}><ChevronRight /></button>
        </div>
      </section>

      <section className="section wrap" id="featured">
        <div className="section-heading">
          <div><p className="eyebrow">GOOD SPACES, GOOD THINGS</p><h2>Spaces worth <em>showing up for.</em></h2></div>
          <Link className="text-link" href="/studios">Explore all spaces <ArrowRight size={16} /></Link>
        </div>
        {featured.length ? <div className="studio-grid">{featured.map((studio) => <StudioCard key={studio.id} studio={studio} />)}</div> : <div className="empty-featured"><Aperture size={28} /><p>Fresh creative spaces are coming soon.</p><Link className="text-link" href="/studios">Be the first to explore <ArrowRight size={16} /></Link></div>}
      </section>

      <section className="section categories-section">
        <div className="wrap">
          <div className="section-heading">
            <div><p className="eyebrow">A SPACE FOR EVERY KIND OF MAKER</p><h2>What are you <em>making today?</em></h2></div>
            <p className="section-aside">Big ideas need the right kind of room.<br />Find yours, and get to making.</p>
          </div>
          <div className="category-grid">{categories.map((category) => <Link className="category-card" href={`/studios?category=${encodeURIComponent(category.slug)}`} key={category.slug} style={{ backgroundImage: `linear-gradient(0deg,rgba(15,21,17,.75),transparent 80%),url("${category.image}")` }}><span>{category.number}</span><strong>{category.name}</strong><ArrowRight size={19} /></Link>)}</div>
        </div>
      </section>

      <section className="section wrap process-section">
        <div className="process-title"><p className="eyebrow">LESS SCROLLING, MORE CREATING</p><h2>From <em>“what if”</em><br />to <em>“it’s a wrap.”</em></h2><Link className="button button-dark" href="/studios">Find your space <ArrowRight size={17} /></Link></div>
        <div className="process-steps">{[
          ["01", "Discover spaces", "Find a creative space built for the work you want to make."],
          ["02", "Pick your hours", "Choose a time that works for your crew and your calendar."],
          ["03", "Book with ease", "Send a booking request and get the details sorted."],
          ["04", "Make something", "Show up, settle in, and make something worth sharing."],
        ].map(([n, title, copy]) => <div className="process-step" key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </section>

      <section className="trust-band">
        <div className="wrap trust-inner"><div className="trust-icon"><Shield size={25} /></div><div><p className="eyebrow">GOOD PEOPLE. GOOD SPACES. GOOD WORK.</p><h2>Feel good about where you create.</h2><p>Verified profiles, clear booking details, equipment safety, and creator support when you need a hand.</p></div><Link className="button button-light" href="/how-it-works">How it works <ArrowRight size={16} /></Link><Sparkles className="trust-sparkle" size={24} /></div>
      </section>
    </>
  );
}
