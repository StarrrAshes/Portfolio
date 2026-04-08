import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const PROJECTS = [
  { id: "001", name: "NEDN", subtitle: "Co-Founder - National Environmental Data Network", type: "ESG Data", year: "2025-26",
    desc: "Crowdsourced environmental reporting platform with interactive mapping and admin verification. Built to give researchers and policymakers open-access microplastics data. Solo DECA CAPM campaign vehicle targeting ICDC.",
    tags: ["Leaflet.js", "Apps Script", "Sheets API", "DECA CAPM"],
    url: "https://starrrashes.github.io/NEDS/", accent: "#D4412B" },
  { id: "002", name: "MathBuddys", subtitle: "Co-Founder - Free K-8 Tutoring Platform", type: "Education", year: "2025-26",
    desc: "Full curriculum website for a free tutoring initiative at North Bellmore Public Library. 222+ interactive lessons and 1,100+ practice problems across K-8. Partnership with six local elementary schools.",
    tags: ["Curriculum Design", "Web Platform", "Community Impact"],
    url: "https://mathbuddys.com", accent: "#C9A96E" },
  { id: "003", name: "Spotify Stats", subtitle: "Personal Analytics Dashboard", type: "Data Viz", year: "2026",
    desc: "PKCE OAuth flow, genre mapping, top tracks and artists across time ranges. Single static HTML file with zero backend, entirely client-side.",
    tags: ["Spotify API", "OAuth PKCE", "Static Site"],
    url: "https://starrrashes.github.io/Spotify/", accent: "#1DB954" },
  { id: "004", name: "Lexicon", subtitle: "NYT Spelling Bee Solver", type: "Tool", year: "2026",
    desc: "Vite + React solver with a fully offline dictionary. No API calls, no server. Instant word generation with center-letter filtering.",
    tags: ["React", "Vite", "Offline-first"],
    url: "https://starrrashes.github.io/SpellingBeeNYTT/", accent: "#E8C547" },
  { id: "005", name: "Mepham DECA", subtitle: "Chapter Website - Secretary", type: "Organization", year: "2025-26",
    desc: "Official website for the Mepham High School DECA chapter with event info, membership resources, and chapter identity. Top 10 placement at State Qualifiers.",
    tags: ["HTML/CSS/JS", "GitHub Pages", "Brand Identity"],
    url: "https://starrrashes.github.io/DECA/", accent: "#3A5AE8" },
];

const ROLES = [
  { title: "Co-Founder", org: "NEDN" },
  { title: "Co-Founder", org: "MathBuddys" },
  { title: "Secretary", org: "DECA Chapter" },
  { title: "President", org: "Coding Club" },
  { title: "Vice President", org: "Computer Club" },
  { title: "Captain", org: "Varsity Bowling" },
  { title: "Captain", org: "Varsity Badminton" },
];

const FONT_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Libre+Franklin:ital,wght@0,200;0,300;0,400;0,500;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap";

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Libre Franklin', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', monospace";

function useInView(threshold) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: threshold || 0.15, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => { const d = document.documentElement.scrollHeight - window.innerHeight; setP(d > 0 ? window.scrollY / d : 0); };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return p;
}

function Counter({ end, suffix }) {
  const [count, setCount] = useState(0);
  const [ref, vis] = useInView(0.3);
  const started = useRef(false);
  useEffect(() => {
    if (!vis || started.current) return;
    started.current = true;
    const num = parseInt(String(end).replace(/,/g, ""));
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / 1800, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * num));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix || ""}</span>;
}

function ProjectPreview({ project, hovered }) {
  const ac = project.accent;
  return (
    <div style={{
      width: "100%", paddingBottom: "56.25%", borderRadius: 6, position: "relative", overflow: "hidden",
      border: "1px solid " + (hovered ? ac + "40" : "rgba(240,237,230,0.08)"),
      background: "#0D0D0D",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      transform: hovered ? "scale(1.01)" : "scale(1)", transformOrigin: "top left",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: hovered ? 0.06 : 0.03, transition: "opacity 0.5s",
        backgroundImage: "linear-gradient(" + ac + "20 1px, transparent 1px), linear-gradient(90deg, " + ac + "20 1px, transparent 1px)",
        backgroundSize: "24px 24px" }} />
      <div style={{ position: "absolute", top: "-30%", right: "-20%", width: "60%", height: "80%",
        background: "radial-gradient(ellipse, " + ac + "15 0%, transparent 70%)",
        opacity: hovered ? 1 : 0.5, transition: "opacity 0.5s" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 22,
        background: "rgba(240,237,230,0.03)", borderBottom: "1px solid rgba(240,237,230,0.05)",
        display: "flex", alignItems: "center", padding: "0 10px", gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF5F57", opacity: 0.6 }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FEBC2E", opacity: 0.6 }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#28C840", opacity: 0.6 }} />
        <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: "0.42rem", color: "#4A4744", letterSpacing: "0.03em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {project.url}
        </span>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 22 }}>
        <div style={{ fontFamily: SERIF, fontSize: "4rem", fontWeight: 300, fontStyle: "italic", color: ac, opacity: hovered ? 0.35 : 0.2, lineHeight: 1, transition: "opacity 0.4s", userSelect: "none" }}>{project.name.charAt(0)}</div>
        <div style={{ fontFamily: MONO, fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: ac, opacity: hovered ? 0.5 : 0.3, marginTop: "0.5rem", transition: "opacity 0.4s" }}>{project.type}</div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 28, background: "rgba(10,10,10,0.6)", borderTop: "1px solid " + ac + "15", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
        <span style={{ fontFamily: MONO, fontSize: "0.45rem", color: "#5A5751", letterSpacing: "0.06em" }}>{project.year}</span>
        <span style={{ fontFamily: MONO, fontSize: "0.45rem", color: ac, opacity: 0.6, letterSpacing: "0.06em" }}>LIVE</span>
      </div>
    </div>
  );
}

function SectionTitle({ number, label, inverted }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "1rem", paddingBottom: "1.25rem", borderBottom: "1px solid " + (inverted ? "rgba(10,10,10,0.08)" : "rgba(240,237,230,0.06)"), opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
      <span style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, fontStyle: "italic", lineHeight: 1, color: "#D4412B", opacity: 0.35 }}>{number}</span>
      <span style={{ fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: inverted ? "#6B6860" : "#5A5751", alignSelf: "flex-end", marginBottom: "0.4rem" }}>{label}</span>
    </div>
  );
}

function StatItem({ number, suffix, label, index, accent }) {
  const [ref, vis] = useInView(0.2);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) " + (index * 0.08) + "s" }}>
      <div style={{ fontFamily: SERIF, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 300, fontStyle: "italic", color: accent || "#F0EDE6", lineHeight: 1 }}><Counter end={number} suffix={suffix} /></div>
      <div style={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4A4744", marginTop: "0.4rem" }}>{label}</div>
    </div>
  );
}

function RoleRow({ role, delay, inverted }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView();
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", paddingLeft: hov ? "0.6rem" : 0, borderBottom: "1px solid " + (inverted ? "rgba(10,10,10,0.08)" : "rgba(240,237,230,0.06)"), transition: "all 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.6s " + delay + "s, transform 0.6s " + delay + "s", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(15px)", cursor: "default" }}>
      <span style={{ fontFamily: SANS, fontSize: "0.88rem", fontWeight: 400, color: inverted ? "#1A1A18" : "#F0EDE6", display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: hov ? "#D4412B" : (inverted ? "#C4C0B8" : "#3A3834"), transition: "all 0.3s", display: "inline-block", flexShrink: 0 }} />
        {role.title}
      </span>
      <span style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: inverted ? "#8A8680" : "#3A3834" }}>{role.org}</span>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [ref, isVisible] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(50px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) " + (index * 0.06) + "s" }}>
      <a href={project.url} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ display: "block", position: "relative", padding: "3rem 0", borderBottom: "1px solid " + (hovered ? project.accent + "40" : "rgba(240,237,230,0.06)"), textDecoration: "none", color: "inherit", cursor: "pointer", transition: "border-color 0.5s", overflow: "hidden" }}>
        <div className="js-card-grid" style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "0.45fr 0.55fr", gap: "2rem", alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.12em", color: "#4A4744" }}>{project.id}</span>
              <div style={{ width: hovered ? 28 : 14, height: 2, background: project.accent, borderRadius: 1, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
              <span style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: project.accent }}>{project.type}</span>
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 3.5vw, 3.2rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, margin: 0, color: hovered ? project.accent : "#F0EDE6", transition: "color 0.3s" }}>{project.name}</h3>
            <p style={{ fontFamily: SANS, fontSize: "0.78rem", fontWeight: 400, color: "#6B6860", margin: "0.4rem 0 0", fontStyle: "italic" }}>{project.subtitle}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.25rem" }}>
              <span style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.06em", color: "#4A4744" }}>{project.year}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontFamily: SANS, fontSize: "0.88rem", fontWeight: 300, lineHeight: 1.75, color: "#8A8680", margin: 0 }}>{project.desc}</p>
            <ProjectPreview project={project} hovered={hovered} />
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {project.tags.map(tag => <span key={tag} style={{ fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.06em", textTransform: "uppercase", color: hovered ? "#8A8680" : "#5A5751", border: "1px solid " + (hovered ? project.accent + "30" : "rgba(240,237,230,0.08)"), padding: "0.3rem 0.65rem", borderRadius: 2, transition: "border-color 0.3s, color 0.3s" }}>{tag}</span>)}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

function ContactLink({ label, value, href, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", padding: "1.1rem 1.25rem", border: "1px solid " + (hov ? (accent || "#D4412B") + "40" : "rgba(240,237,230,0.08)"), borderRadius: 3, transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", paddingLeft: hov ? "1.75rem" : "1.25rem", background: hov ? "rgba(240,237,230,0.02)" : "transparent" }}>
      <span style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accent || "#D4412B", flexShrink: 0, minWidth: 48 }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: "0.82rem", color: hov ? "#F0EDE6" : "#6B6860", transition: "color 0.3s" }}>{value}</span>
    </a>
  );
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const scrollProgress = useScrollProgress();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = "Joshua Sat";
    const timer = setTimeout(() => setLoaded(true), 2000);
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", h); };
  }, []);

  return (
    <div style={{ background: "#0A0A0A", color: "#F0EDE6", minHeight: "100vh", fontFamily: SANS, WebkitFontSmoothing: "antialiased", overflowX: "hidden" }}>
      <style>{`
        @import url('${FONT_URL}');
        @keyframes termIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .hero-mobile-terminal { display: none; }
        .hero-terminal-wrapper { display: block; }
        .js-nav-burger { display: none !important; }
        @media (max-width: 768px) {
          .js-nav-desktop { display: none !important; }
          .js-nav-burger { display: flex !important; }
          .hero-terminal-wrapper { display: none !important; }
          .hero-mobile-terminal { display: block !important; }
          .js-card-grid, .js-about-grid, .js-contact-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .js-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .js-footer-inner { flex-direction: column !important; gap: 2rem !important; }
          .js-footer-inner > div:last-child { text-align: left !important; }
        }
      `}</style>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1000 }}>
        <div style={{ height: "100%", width: (scrollProgress * 100) + "%", background: "#D4412B", transition: "width 0.1s linear" }} />
      </div>

      {/* Loader */}
      {!loaded && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 300, fontStyle: "italic", color: "#F0EDE6", letterSpacing: "-0.02em" }}>Joshua Sat</div>
          <div style={{ width: 60, height: 1, background: "#D4412B", marginTop: "1.25rem" }} />
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 900, padding: scrolled ? "0.9rem 3rem" : "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? "rgba(10,10,10,0.92)" : "transparent", borderBottom: scrolled ? "1px solid rgba(240,237,230,0.06)" : "none", transition: "all 0.4s", opacity: loaded ? 1 : 0 }}>
        <a href="#" style={{ fontFamily: SERIF, fontSize: "1.1rem", fontWeight: 300, fontStyle: "italic", color: "#F0EDE6", textDecoration: "none" }}>JS</a>
        <div className="js-nav-desktop" style={{ display: "flex", gap: "2.5rem" }}>
          {["Work", "About", "Contact"].map(l => <a key={l} href={"#" + l.toLowerCase()} style={{ fontFamily: SANS, fontSize: "0.68rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B6860", textDecoration: "none" }}>{l}</a>)}
          <a href="https://github.com/StarrrAshes" target="_blank" rel="noopener noreferrer" style={{ fontFamily: SANS, fontSize: "0.68rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B6860", textDecoration: "none" }}>GitHub</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 3rem 5rem", position: "relative", overflow: "hidden" }}>
        <div className="hero-mobile-terminal" style={{ fontFamily: MONO, fontSize: "0.6rem", lineHeight: 1.8, color: "#4A4744", marginBottom: "2rem", opacity: 0.5 }}>
          <div>$ bat --profile</div>
          <div style={{ color: "#D4412B" }}>  sector: finance and esg data</div>
          <div style={{ color: "#F0EDE6" }}>  status: building</div>
        </div>
        <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", opacity: loaded ? 1 : 0, transition: "opacity 0.8s 0.4s" }}>
            <div style={{ width: 28, height: 2, background: "#D4412B", borderRadius: 1 }} />
            <span style={{ fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5A5751" }}>Finance / ESG Data / Real Estate / New York</span>
          </div>
          <h1 style={{ margin: 0, padding: 0 }}>
            <span style={{ display: "block", overflow: "hidden", lineHeight: 1.05, paddingBottom: "0.06em" }}>
              <span style={{ display: "block", fontFamily: SERIF, fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, letterSpacing: "-0.035em", color: "#F0EDE6", transform: loaded ? "translateY(0)" : "translateY(110%)", transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.5s" }}>Joshua</span>
            </span>
            <span style={{ display: "block", overflow: "hidden", lineHeight: 1.05 }}>
              <span style={{ display: "block", fontFamily: SERIF, fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.035em", color: "transparent", background: "linear-gradient(90deg, #D4412B, #C9A96E)", WebkitBackgroundClip: "text", backgroundClip: "text", transform: loaded ? "translateY(0)" : "translateY(110%)", transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.6s" }}>Sat</span>
            </span>
          </h1>
          <p style={{ fontFamily: SANS, fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.8, color: "#6B6860", maxWidth: 440, margin: "2.5rem 0 0", opacity: loaded ? 1 : 0, transition: "opacity 0.8s 1s" }}>
            Aspiring finance professional building at the intersection of economics, environmental data, and technology. DECA competitor, nonprofit co-founder, real estate analyst.
          </p>
        </div>
      </section>

      {/* Work */}
      <section id="work" style={{ maxWidth: 1400, margin: "0 auto", padding: "6rem 3rem 0" }}>
        <SectionTitle number="01" label="Selected Work" />
        {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        <div className="js-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", padding: "3rem 0", marginTop: "1rem", borderTop: "1px solid rgba(240,237,230,0.04)" }}>
          <StatItem number="5" label="Shipped Projects" index={0} accent="#D4412B" />
          <StatItem number="1273" suffix="+" label="Excel Formulas (RE Model)" index={1} />
          <StatItem number="222" suffix="+" label="Lessons Authored" index={2} />
          <StatItem number="2" label="Nonprofits Co-Founded" index={3} accent="#C9A96E" />
        </div>
      </section>

      {/* About */}
      <div style={{ height: "8rem", background: "linear-gradient(to bottom, #0A0A0A, #F0EDE6)" }} />
      <section id="about" style={{ background: "#F0EDE6", color: "#0A0A0A", padding: "4rem 3rem 6rem" }}>
        <AboutInner />
      </section>
      <div style={{ height: "8rem", background: "linear-gradient(to bottom, #F0EDE6, #0A0A0A)" }} />

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

function AboutInner() {
  const [ref, vis] = useInView(0.08);
  return (
    <div ref={ref} className="js-about-grid" style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "5rem" }}>
      <div>
        <SectionTitle number="02" label="About" inverted />
        <p style={{ fontFamily: SERIF, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "2rem 0 1.25rem", color: "#1A1A18", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
          Markets are information systems. Environmental policy is an incentive problem. Real estate is underwriting a thesis against replacement cost. I study how capital flows shape outcomes and where the inefficiencies are.
        </p>
        <p style={{ fontFamily: SANS, fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.8, color: "#4A4744", margin: 0, opacity: vis ? 1 : 0, transition: "opacity 0.7s 0.3s" }}>
          Sophomore at Wellington C. Mepham High School, North Bellmore, NY. Targeting finance through DECA competitions, real estate financial modeling, ESG data infrastructure, and microplastics filtration research in the Science Research Program. Also studying Mandarin and captaining two varsity teams.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {ROLES.map((r, i) => <RoleRow key={r.org + r.title} role={r} delay={i * 0.05} inverted />)}
      </div>
    </div>
  );
}

function ContactSection() {
  const [ref, vis] = useInView(0.1);
  return (
    <section id="contact" ref={ref} style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 3rem 6rem" }}>
      <SectionTitle number="03" label="Contact" />
      <div className="js-contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginTop: "2rem", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>
        <div>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 1.25rem", color: "#F0EDE6" }}>
            Open to research mentorship, investment competition teams, and <span style={{ fontStyle: "italic", color: "#C9A96E" }}>collaboration.</span>
          </h3>
          <p style={{ fontFamily: SANS, fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.75, color: "#6B6860", margin: 0, maxWidth: 360 }}>
            Particularly interested in microplastics filtration mentorship, Wharton KWHS investment competition teams, and ESG data tools.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.75rem" }}>
          <ContactLink label="Email" value="wxbluexberryxw@gmail.com" href="mailto:wxbluexberryxw@gmail.com" />
          <ContactLink label="GitHub" value="StarrrAshes" href="https://github.com/StarrrAshes" accent="#6B6860" />
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  const [ref, vis] = useInView(0.1);
  return (
    <footer ref={ref} style={{ maxWidth: 1400, margin: "0 auto", padding: "4rem 3rem 3rem", borderTop: "1px solid rgba(240,237,230,0.06)" }}>
      <div className="js-footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: vis ? 1 : 0, transition: "opacity 0.6s 0.1s" }}>
        <div>
          <p style={{ fontFamily: SERIF, fontSize: "1.2rem", fontWeight: 300, fontStyle: "italic", color: "#3A3834", margin: 0, lineHeight: 1.4, maxWidth: 400 }}>
            The four most dangerous words in investing are: "This time it's different."
          </p>
          <p style={{ fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.08em", color: "#2A2A28", marginTop: "0.6rem" }}>- Sir John Templeton</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: SERIF, fontSize: "1rem", fontWeight: 300, fontStyle: "italic", color: "#3A3834" }}>Joshua Sat</span><br />
          <span style={{ fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.1em", color: "#2A2A28" }}>2026</span>
        </div>
      </div>
    </footer>
  );
}
