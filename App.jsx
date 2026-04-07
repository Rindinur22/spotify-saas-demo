import React, { useState, useRef, useEffect } from "react";

const CLIENT_ID = "seu_client_id_aqui"; // will be replaced

// ── Data demo lagu (pakai preview Spotify yang public) ──
const DEMO_SONGS = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    preview: "https://p.scdn.co/mp3-preview/5a379601a5f5618d6ef08c5d35f6b97aa5e12060",
    tier: "free",
  },
  {
    id: 2,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:54",
    cover: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    preview: "https://p.scdn.co/mp3-preview/84da3b9d5c77b7aba1beb1ad49b95b4ff3d0d49f",
    tier: "free",
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    cover: "https://i.scdn.co/image/ab67616d0000b2734bc66095f018de8c4065b9c0",
    preview: "https://p.scdn.co/mp3-preview/b7efcd14bc1ccfc55aee61d32f33b4caba25e8d5",
    tier: "premium",
  },
  {
    id: 4,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3",
    duration: "2:21",
    cover: "https://i.scdn.co/image/ab67616d0000b273e8107e6d9214baa81bb79bba",
    preview: "https://p.scdn.co/mp3-preview/f9dbb30d5c6c0b0b5d3a3b9f51a9c1a1a1a1a1a1",
    tier: "premium",
  },
  {
    id: 5,
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:37",
    cover: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
    preview: "https://p.scdn.co/mp3-preview/a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1",
    tier: "free",
  },
  {
    id: 6,
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    duration: "3:20",
    cover: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5",
    preview: null,
    tier: "premium",
  },
];

const PLAYLISTS = [
  { id: 1, name: "Top Hits 2024", songs: 6, cover: "🎵" },
  { id: 2, name: "Workout Mix", songs: 12, cover: "💪" },
  { id: 3, name: "Chill Vibes", songs: 8, cover: "🌙" },
  { id: 4, name: "Study Mode", songs: 15, cover: "📚" },
];

const USERS = [
  { id: 1, email: "user@gmail.com", password: "123456", name: "Rindi Antika", plan: "free" },
  { id: 2, email: "premium@gmail.com", password: "123456", name: "Premium User", plan: "premium" },
];

// ── Styles ──
const S = {
  app: { display: "flex", height: "100vh", flexDirection: "column", fontFamily: "'Inter', sans-serif", background: "#000", color: "#fff", overflow: "hidden" },
  main: { display: "flex", flex: 1, overflow: "hidden" },
  sidebar: { width: 240, background: "#000", display: "flex", flexDirection: "column", padding: "8px", gap: 8, overflowY: "auto" },
  sideCard: { background: "#121212", borderRadius: 8, padding: 16 },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 6, cursor: "pointer", color: active ? "#fff" : "#b3b3b3", background: active ? "#333" : "transparent", fontWeight: active ? 600 : 400, fontSize: 14, border: "none", width: "100%", textAlign: "left" }),
  content: { flex: 1, background: "linear-gradient(180deg,#1a1a2e 0%,#121212 30%)", overflowY: "auto", padding: 24 },
  heading: { fontSize: 28, fontWeight: 700, marginBottom: 24, margin: "0 0 24px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 },
  card: (hover) => ({ background: hover ? "#282828" : "#181818", borderRadius: 8, padding: 16, cursor: "pointer", transition: "background .2s" }),
  songRow: (active, hover) => ({ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 6, cursor: "pointer", background: active ? "#333" : hover ? "#1a1a1a" : "transparent" }),
  badge: (tier) => ({ background: tier === "premium" ? "#FFD700" : "#1DB954", color: "#000", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, textTransform: "uppercase" }),
  player: { height: 90, background: "#181818", borderTop: "1px solid #282828", display: "flex", alignItems: "center", padding: "0 24px", gap: 24 },
  btn: (color) => ({ background: color || "#1DB954", border: "none", borderRadius: 24, padding: "12px 32px", color: color ? "#fff" : "#000", fontWeight: 700, fontSize: 14, cursor: "pointer" }),
  input: { background: "#333", border: "none", borderRadius: 6, padding: "10px 14px", color: "#fff", fontSize: 14, width: "100%", outline: "none" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#121212", borderRadius: 12, padding: 40, width: 400, maxWidth: "90vw" },
  tag: { display: "inline-flex", alignItems: "center", gap: 6, background: "#1DB954", color: "#000", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 },
  tagPurple: { display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 },
};

// ── Icons ──
const Icon = {
  home: "⊞", search: "🔍", library: "📚", heart: "♥", add: "+", play: "▶", pause: "⏸", prev: "⏮", next: "⏭", vol: "🔊", lock: "🔒", crown: "👑", user: "👤", cloud: "☁️", check: "✓",
};

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [users, setUsers] = useState(USERS);
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const audioRef = useRef(null);

  const isPremium = user?.plan === "premium";

  // ── Audio ──
  const playSong = (song) => {
    if (song.tier === "premium" && !isPremium) { setShowPremiumPrompt(true); return; }
    setCurrentSong(song);
    setPlaying(true);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing && currentSong?.preview) {
      audioRef.current.src = currentSong.preview;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing, currentSong]);

  // ── Auth ──
  const handleLogin = () => {
    const found = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (found) { setUser(found); setShowLogin(false); setLoginError(""); }
    else setLoginError("Email atau password salah!");
  };

  const handleRegister = () => {
    if (!regForm.name || !regForm.email || !regForm.password) { setLoginError("Isi semua field!"); return; }
    if (users.find(u => u.email === regForm.email)) { setLoginError("Email sudah terdaftar!"); return; }
    const newUser = { id: users.length + 1, ...regForm, plan: "free" };
    setUsers([...users, newUser]);
    setUser(newUser);
    setShowLogin(false);
    setLoginError("");
  };

  const filteredSongs = searchQ ? DEMO_SONGS.filter(s =>
    s.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQ.toLowerCase())
  ) : DEMO_SONGS;

  // ── Pages ──
  const renderHome = () => (
    <div>
      {/* Cloud SaaS Info Banner */}
      <div style={{ background: "linear-gradient(135deg,#1DB954,#0d7a3a)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={S.tag}>{Icon.cloud} SaaS Demo</span>
          <span style={S.tagPurple}>☁️ Hosted on Cloud</span>
        </div>
        <h2 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 700 }}>Spotify sebagai SaaS — Cloud Computing Demo</h2>
        <p style={{ margin: 0, color: "#d4f5e3", fontSize: 14 }}>
          Aplikasi ini berjalan 100% di cloud · Multi-user · Subscription tier · No install needed
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          {["Multi-tenancy", "Subscription Model", "Cloud Hosting", "Auto-scaling", "SaaS Architecture"].map(f => (
            <span key={f} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>✓ {f}</span>
          ))}
        </div>
      </div>

      <h2 style={S.heading}>Selamat datang{user ? `, ${user.name.split(" ")[0]}` : ""}!</h2>

      {/* Playlists */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8, marginBottom: 32 }}>
        {PLAYLISTS.map(p => (
          <div key={p.id} style={{ background: "#282828", borderRadius: 6, padding: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            onMouseEnter={() => setHovered("pl" + p.id)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: 48, height: 48, background: "#333", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p.cover}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
              <div style={{ color: "#b3b3b3", fontSize: 12 }}>{p.songs} lagu</div>
            </div>
          </div>
        ))}
      </div>

      {/* Songs */}
      <h3 style={{ marginBottom: 16 }}>🎵 Lagu Tersedia</h3>
      <SongList songs={DEMO_SONGS} currentSong={currentSong} playSong={playSong} isPremium={isPremium} />
    </div>
  );

  const renderSearch = () => (
    <div>
      <h2 style={S.heading}>Cari Lagu</h2>
      <input style={{ ...S.input, marginBottom: 24, fontSize: 16, padding: "14px 18px" }}
        placeholder="Cari artis, lagu, album..." value={searchQ} onChange={e => setSearchQ(e.target.value)} autoFocus />
      {searchQ && <SongList songs={filteredSongs} currentSong={currentSong} playSong={playSong} isPremium={isPremium} />}
      {!searchQ && (
        <div style={S.grid}>
          {["Pop","Hip-Hop","EDM","R&B","Rock","Jazz","K-Pop","Indie"].map(g => (
            <div key={g} style={{ ...S.card(false), background: ["#1a237e","#4a148c","#006064","#1b5e20","#bf360c","#f57f17","#880e4f","#37474f"][["Pop","Hip-Hop","EDM","R&B","Rock","Jazz","K-Pop","Indie"].indexOf(g)], height: 120, display: "flex", alignItems: "flex-end" }}
              onClick={() => setSearchQ(g)}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>{g}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPremium = () => (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ ...S.heading, textAlign: "center", fontSize: 36 }}>Pilih Plan Kamu</h2>
      <p style={{ textAlign: "center", color: "#b3b3b3", marginBottom: 40 }}>
        Ini adalah implementasi <strong>Subscription Model SaaS</strong> — inti dari model bisnis Spotify
      </p>

      {/* SaaS Concept Box */}
      <div style={{ background: "#282828", borderRadius: 12, padding: 20, marginBottom: 32, border: "1px solid #7c3aed" }}>
        <div style={{ ...S.tagPurple, marginBottom: 12 }}>💡 Konsep SaaS</div>
        <p style={{ margin: 0, color: "#ccc", fontSize: 14, lineHeight: 1.7 }}>
          Spotify menggunakan model <strong>freemium SaaS</strong>: semua user pakai infrastruktur cloud yang sama (multi-tenancy), 
          tapi fiturnya dibatasi berdasarkan tier berlangganan. Ini adalah cara SaaS memonetisasi layanannya.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Free Plan */}
        <div style={{ background: "#181818", borderRadius: 12, padding: 32, border: "1px solid #333" }}>
          <div style={{ marginBottom: 8, color: "#b3b3b3", fontWeight: 600 }}>FREE</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 4 }}>Rp 0</div>
          <div style={{ color: "#b3b3b3", marginBottom: 24 }}>Selamanya gratis</div>
          {["✓ Akses musik terbatas","✓ Kualitas audio standar","✓ Iklan setiap 30 menit","✗ Tidak bisa skip bebas","✗ Tidak bisa download","✗ Hanya 2 lagu pertama"].map(f => (
            <div key={f} style={{ marginBottom: 8, fontSize: 14, color: f.startsWith("✗") ? "#666" : "#fff" }}>{f}</div>
          ))}
          {!user ? <button style={{ ...S.btn("#333"), marginTop: 24, width: "100%", color: "#fff" }} onClick={() => setShowLogin(true)}>Daftar Gratis</button>
            : user.plan === "free" ? <div style={{ ...S.tag, marginTop: 24, justifyContent: "center" }}>✓ Plan Kamu Sekarang</div>
            : null}
        </div>

        {/* Premium Plan */}
        <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", borderRadius: 12, padding: 32, border: "2px solid #1DB954", position: "relative" }}>
          <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#1DB954", color: "#000", fontWeight: 700, fontSize: 12, padding: "4px 16px", borderRadius: 20 }}>REKOMENDASI</div>
          <div style={{ marginBottom: 8, color: "#1DB954", fontWeight: 600 }}>{Icon.crown} PREMIUM</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 4 }}>Rp 54.990</div>
          <div style={{ color: "#b3b3b3", marginBottom: 24 }}>per bulan</div>
          {["✓ Akses semua lagu","✓ Kualitas audio HiFi","✓ Tanpa iklan","✓ Skip bebas","✓ Download offline","✓ Semua lagu tersedia"].map(f => (
            <div key={f} style={{ marginBottom: 8, fontSize: 14, color: "#1DB954" }}>{f}</div>
          ))}
          {!user ? <button style={{ ...S.btn(), marginTop: 24, width: "100%" }} onClick={() => setShowLogin(true)}>Mulai Premium</button>
            : user.plan === "premium" ? <div style={{ ...S.tag, marginTop: 24, justifyContent: "center" }}>✓ Plan Kamu Sekarang</div>
            : <button style={{ ...S.btn(), marginTop: 24, width: "100%" }} onClick={() => { setUser({ ...user, plan: "premium" }); setUsers(users.map(u => u.id === user.id ? { ...u, plan: "premium" } : u)); }}>Upgrade ke Premium</button>}
        </div>
      </div>

      {/* Multi-tenancy info */}
      <div style={{ background: "#282828", borderRadius: 12, padding: 20, marginTop: 32 }}>
        <h4 style={{ margin: "0 0 12px", color: "#1DB954" }}>☁️ Bukti Cloud SaaS di Aplikasi Ini</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {[
            { icon: "👥", label: "Multi-tenancy", desc: "Semua user pakai server yang sama" },
            { icon: "💳", label: "Subscription Tier", desc: "Free vs Premium — model bisnis SaaS" },
            { icon: "☁️", label: "Cloud Hosted", desc: "Deploy di Vercel — bisa diakses global" },
            { icon: "🔒", label: "Data di Cloud", desc: "Tidak ada data tersimpan di device" },
          ].map(i => (
            <div key={i.label} style={{ background: "#333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{i.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{i.label}</div>
              <div style={{ color: "#b3b3b3", fontSize: 12 }}>{i.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.app}>
      <audio ref={audioRef} />

      {/* Login Modal */}
      {showLogin && (
        <div style={S.overlay} onClick={() => setShowLogin(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 8px", textAlign: "center" }}>
              {isRegister ? "Daftar Akun Baru" : "Masuk ke Spotify"}
            </h2>
            <p style={{ color: "#b3b3b3", textAlign: "center", margin: "0 0 24px", fontSize: 13 }}>
              {isRegister ? "Buat akun — ini demo multi-user SaaS!" : "Demo: gunakan user@gmail.com / 123456"}
            </p>
            {isRegister && (
              <input style={{ ...S.input, marginBottom: 12 }} placeholder="Nama lengkap"
                value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} />
            )}
            <input style={{ ...S.input, marginBottom: 12 }} placeholder="Email" type="email"
              value={isRegister ? regForm.email : loginForm.email}
              onChange={e => isRegister ? setRegForm({ ...regForm, email: e.target.value }) : setLoginForm({ ...loginForm, email: e.target.value })} />
            <input style={{ ...S.input, marginBottom: 16 }} placeholder="Password" type="password"
              value={isRegister ? regForm.password : loginForm.password}
              onChange={e => isRegister ? setRegForm({ ...regForm, password: e.target.value }) : setLoginForm({ ...loginForm, password: e.target.value })} />
            {loginError && <p style={{ color: "#f44", margin: "0 0 12px", fontSize: 13, textAlign: "center" }}>{loginError}</p>}
            <button style={{ ...S.btn(), width: "100%", marginBottom: 12, padding: 14 }}
              onClick={isRegister ? handleRegister : handleLogin}>
              {isRegister ? "Daftar" : "Masuk"}
            </button>
            <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", width: "100%", fontSize: 13 }}
              onClick={() => { setIsRegister(!isRegister); setLoginError(""); }}>
              {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
            </button>
          </div>
        </div>
      )}

      {/* Premium Prompt */}
      {showPremiumPrompt && (
        <div style={S.overlay} onClick={() => setShowPremiumPrompt(false)}>
          <div style={{ ...S.modal, textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ margin: "0 0 8px" }}>Fitur Premium</h2>
            <p style={{ color: "#b3b3b3", marginBottom: 24 }}>Lagu ini hanya tersedia untuk pengguna Premium. Ini adalah implementasi <strong>subscription tier SaaS</strong>.</p>
            <button style={{ ...S.btn(), marginBottom: 12, width: "100%" }} onClick={() => { setPage("premium"); setShowPremiumPrompt(false); }}>Lihat Plan Premium</button>
            <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer" }} onClick={() => setShowPremiumPrompt(false)}>Nanti saja</button>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div style={S.main}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.sideCard}>
            <button style={S.navItem(page === "home")} onClick={() => setPage("home")}>🏠 Beranda</button>
            <button style={S.navItem(page === "search")} onClick={() => setPage("search")}>🔍 Cari</button>
          </div>
          <div style={{ ...S.sideCard, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#b3b3b3" }}>📚 Library</span>
            </div>
            {PLAYLISTS.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, background: "#333", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.cover}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#b3b3b3" }}>Playlist · {p.songs} lagu</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={S.content}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24, gap: 12 }}>
            <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 14, padding: "8px 16px" }} onClick={() => setPage("premium")}>
              {Icon.crown} Upgrade ke Premium
            </button>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {user.plan === "premium" && <span style={S.badge("premium")}>{Icon.crown} Premium</span>}
                <div style={{ background: "#1DB954", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#000" }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name.split(" ")[0]}</span>
                <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 12 }} onClick={() => setUser(null)}>Keluar</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...S.btn("#333"), color: "#fff", padding: "8px 20px" }} onClick={() => { setIsRegister(false); setShowLogin(true); }}>Masuk</button>
                <button style={{ ...S.btn(), padding: "8px 20px" }} onClick={() => { setIsRegister(true); setShowLogin(true); }}>Daftar</button>
              </div>
            )}
          </div>

          {page === "home" && renderHome()}
          {page === "search" && renderSearch()}
          {page === "premium" && renderPremium()}
        </div>
      </div>

      {/* Player */}
      <div style={S.player}>
        {currentSong ? (
          <>
            <img src={currentSong.cover} alt="" style={{ width: 56, height: 56, borderRadius: 4 }} onError={e => { e.target.style.display = "none"; }} />
            <div style={{ minWidth: 0, flex: "0 0 200px" }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentSong.title}</div>
              <div style={{ color: "#b3b3b3", fontSize: 12 }}>{currentSong.artist}</div>
            </div>
          </>
        ) : (
          <div style={{ color: "#b3b3b3", fontSize: 13 }}>Pilih lagu untuk diputar...</div>
        )}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 20 }}>{Icon.prev}</button>
          <button style={{ background: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16 }}
            onClick={() => setPlaying(!playing)}>
            {playing ? "⏸" : "▶"}
          </button>
          <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 20 }}>{Icon.next}</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b3b3b3", fontSize: 13 }}>
          {Icon.vol}
          <input type="range" defaultValue={80} style={{ width: 80 }} />
        </div>
      </div>
    </div>
  );
}

function SongList({ songs, currentSong, playSong, isPremium }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div>
      {songs.map((song, i) => (
        <div key={song.id}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 6, cursor: "pointer", background: currentSong?.id === song.id ? "#333" : hovered === song.id ? "#1a1a1a" : "transparent" }}
          onMouseEnter={() => setHovered(song.id)} onMouseLeave={() => setHovered(null)}
          onClick={() => playSong(song)}>
          <div style={{ width: 20, textAlign: "center", color: currentSong?.id === song.id ? "#1DB954" : "#b3b3b3", fontSize: 13 }}>
            {currentSong?.id === song.id ? "♫" : i + 1}
          </div>
          <img src={song.cover} alt="" style={{ width: 40, height: 40, borderRadius: 4 }} onError={e => { e.target.style.background = "#333"; e.target.src = ""; }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: currentSong?.id === song.id ? "#1DB954" : "#fff" }}>
              {song.title}
              {song.tier === "premium" && !isPremium && <span style={{ marginLeft: 8, fontSize: 10, background: "#FFD700", color: "#000", padding: "1px 5px", borderRadius: 10, fontWeight: 700 }}>PREMIUM</span>}
            </div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>{song.artist}</div>
          </div>
          <div style={{ color: "#b3b3b3", fontSize: 13 }}>{song.duration}</div>
          {song.tier === "premium" && !isPremium && <span style={{ fontSize: 16 }}>🔒</span>}
        </div>
      ))}
    </div>
  );
}
