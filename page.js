"use client";
import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─── PLATFORMS ───────────────────────────────────────────────
const PLATFORMS = {
  fifaCollect: { name: "FIFA Collect", short: "Collect", color: "#818cf8", sellerFee: 0.05, buyerFee: 0.15, auto: true, risk: "low", note: "5% creator fee + 15% buyer fee. Official blockchain marketplace." },
  fifaResale: { name: "FIFA Resale", short: "FIFA", color: "#4ade80", sellerFee: 0.15, buyerFee: 0.15, auto: false, risk: "low", note: "15% seller + 15% buyer. Closed Feb 22–Apr 2." },
  stubHub: { name: "StubHub", short: "StubHub", color: "#f97316", sellerFee: 0.15, buyerFee: 0.17, auto: false, risk: "medium", note: "~15% seller + ~17% buyer. Largest US market." },
  seatGeek: { name: "SeatGeek", short: "SeatGeek", color: "#22d3ee", sellerFee: 0.10, buyerFee: 0.20, auto: false, risk: "medium", note: "10% seller. ~20% buyer (included in price)." },
  viagogo: { name: "Viagogo", short: "Viagogo", color: "#a78bfa", sellerFee: 0.15, buyerFee: 0.27, auto: false, risk: "high", note: "~15% seller + ~27% buyer. Global. Highest risk." },
};
const PK = Object.keys(PLATFORMS);

// ─── MATCH-SPECIFIC LINKS ────────────────────────────────────
const MATCH_LINKS = {
  10: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m10",
    stubHub: "https://www.stubhub.com/world-cup-houston-tickets-6-14-2026/event/153020800/",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/houston",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/germany-vs-curacao-world-cup-2026-tickets",
    wc26: "https://wc26ticketprices.com",
  },
  18: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m18",
    stubHub: "https://www.stubhub.com/world-cup-foxborough-tickets-6-16-2026/event/153020858/",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/boston",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/world-cup-tickets",
    wc26: "https://wc26ticketprices.com",
  },
  22: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m22",
    stubHub: "https://www.stubhub.com/world-cup-arlington-tickets-6-17-2026/event/153021378/",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/international-soccer/2026-06-17-3-pm/17385142",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/england-vs-croatia-world-cup-2026-tickets/event/445950",
    wc26: "https://wc26ticketprices.com",
  },
  41: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m41",
    stubHub: "https://www.stubhub.com/world-cup-east-rutherford-tickets-6-22-2026/event/153020930/",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/new-york",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/world-cup-tickets",
    wc26: "https://wc26ticketprices.com",
  },
  78: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m78",
    stubHub: "https://www.stubhub.com/world-cup-arlington-tickets-6-30-2026/event/153020934/",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/international-soccer/2026-06-30-12-pm/17385183",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/world-cup-tickets",
    wc26: "https://wc26ticketprices.com",
  },
  88: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m88",
    stubHub: "https://www.stubhub.com/world-cup-arlington-tickets-7-3-2026/event/153020936/",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/international-soccer/2026-07-03-1-pm/17385193",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/world-cup-tickets",
    wc26: "https://wc26ticketprices.com",
  },
  93: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m93",
    stubHub: "https://www.stubhub.com/soccer-world-cup-round-of-16-tickets/category/138308813",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/international-soccer/2026-07-06-2-pm/17385198",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/world-cup-tickets",
    wc26: "https://wc26ticketprices.com",
  },
  101: {
    fifaCollect: "https://collect.fifa.com/marketplace?tags=cat1-m101",
    stubHub: "https://www.stubhub.com/soccer-world-cup-arlington-tickets-7-14-2026/event/153020938/",
    seatGeek: "https://seatgeek.com/fifa-world-cup-tickets/international-soccer/2026-07-14-2-pm/17385204",
    viagogo: "https://www.viagogo.com/Sports-Tickets/Soccer/Soccer-Tournament/World-Cup-Tickets",
    seatPick: "https://seatpick.com/world-cup-tickets",
    wc26: "https://wc26ticketprices.com",
  },
};

// ─── MATCHES ─────────────────────────────────────────────────
const INIT_MATCHES = [
  { id: 10, teams: "Germany vs. Curaçao", date: "2026-06-14", city: "Houston", cat: 1, tickets: 2, origPairPrice: 1000, likelyMatchup: null, round: "Group" },
  { id: 18, teams: "Play-off 2 vs. Norway", date: "2026-06-16", city: "Boston", cat: 1, tickets: 2, origPairPrice: 1000, likelyMatchup: null, round: "Group" },
  { id: 22, teams: "England vs. Croatia", date: "2026-06-17", city: "Dallas", cat: 1, tickets: 2, origPairPrice: 1400, likelyMatchup: null, round: "Group" },
  { id: 41, teams: "Norway vs. Senegal", date: "2026-06-22", city: "New York/NJ", cat: 1, tickets: 2, origPairPrice: 1240, likelyMatchup: null, round: "Group" },
  { id: 78, teams: "2E vs. 2I", date: "2026-06-30", city: "Dallas", cat: 1, tickets: 4, origPairPrice: 1010, likelyMatchup: "Ecuador vs. Norway", round: "R32" },
  { id: 88, teams: "2D vs. 2G", date: "2026-07-03", city: "Dallas", cat: 1, tickets: 4, origPairPrice: 1080, likelyMatchup: "Türkiye vs. Iran", round: "R32" },
  { id: 93, teams: "W83 vs. W84", date: "2026-07-06", city: "Dallas", cat: 1, tickets: 2, origPairPrice: 1280, likelyMatchup: "Portugal vs. Colombia", round: "R16" },
  { id: 101, teams: "W97 vs. W98", date: "2026-07-14", city: "Dallas", cat: 1, tickets: 2, origPairPrice: 6590, likelyMatchup: "Spain vs. Argentina", round: "Semi" },
];

// Decision per individual ticket: { matchId: [ "keep" | "sell", ... ] }
// Tickets are sold in pairs, so toggle flips 2 at a time.
const INIT_TICKET_DECISIONS = {
  10: ["keep", "keep"],
  18: ["keep", "keep"],
  22: ["sell", "sell"],
  41: ["keep", "keep"],
  78: ["keep", "keep", "sell", "sell"],
  88: ["keep", "keep", "sell", "sell"],
  93: ["sell", "sell"],
  101: ["sell", "sell"],
};

const TOTAL_ORIG = 16690;
const RC = { Group: "#4ade80", R32: "#60a5fa", R16: "#a78bfa", Semi: "#f472b6" };
const MC = { 10: "#22d3ee", 18: "#34d399", 22: "#f97316", 41: "#a78bfa", 78: "#3b82f6", 88: "#ef4444", 93: "#eab308", 101: "#ec4899" };

// ─── SEED HISTORY ────────────────────────────────────────────
const SEED = [
  { date: "2026-02-01", prices: { 10: { fifaCollect: 2100 }, 18: { fifaCollect: 2200 }, 22: { fifaCollect: 4200 }, 41: { fifaCollect: 2500 }, 78: { fifaCollect: 2800 }, 88: { fifaCollect: 3200 }, 93: { fifaCollect: 4500 }, 101: { fifaCollect: 15000 } } },
  { date: "2026-02-07", prices: { 10: { fifaCollect: 1950 }, 18: { fifaCollect: 2050 }, 22: { fifaCollect: 3800 }, 41: { fifaCollect: 2350 }, 78: { fifaCollect: 2600 }, 88: { fifaCollect: 3000 }, 93: { fifaCollect: 4100 }, 101: { fifaCollect: 13000 } } },
  { date: "2026-02-14", prices: { 10: { fifaCollect: 1850 }, 18: { fifaCollect: 1950 }, 22: { fifaCollect: 3500 }, 41: { fifaCollect: 2200 }, 78: { fifaCollect: 2400 }, 88: { fifaCollect: 2800 }, 93: { fifaCollect: 3800 }, 101: { fifaCollect: 11500 } } },
  { date: "2026-02-21", prices: { 10: { fifaCollect: 1768 }, 18: { fifaCollect: 1865 }, 22: { fifaCollect: 3363 }, 41: { fifaCollect: 2118 }, 78: { fifaCollect: 2225 }, 88: { fifaCollect: 2650 }, 93: { fifaCollect: 3500 }, 101: { fifaCollect: 10500 } } },
];

// ─── HELPERS ─────────────────────────────────────────────────
const fmt = n => "$" + Math.round(n).toLocaleString("en-US");
const fmtK = n => n >= 1000 ? "$" + (n / 1000).toFixed(1) + "k" : "$" + n;
const fD = d => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fMD = d => new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

function getL(h, mid, pk) { for (let i = h.length - 1; i >= 0; i--) { const p = h[i]?.prices?.[mid]?.[pk]; if (p != null) return p; } return null; }
function bestP(h, mid) { let b = null, bp = null; PK.forEach(pk => { const p = getL(h, mid, pk); if (p != null && (b === null || p > b)) { b = p; bp = pk; } }); return { price: b, platform: bp }; }
function netPay(price, pk) { return price * (1 - PLATFORMS[pk].sellerFee); }
function bestNet(h, mid) { let best = 0; PK.forEach(pk => { const p = getL(h, mid, pk); if (p) { const n = netPay(p, pk); if (n > best) best = n; } }); return best; }

// ─── SMALL COMPONENTS ────────────────────────────────────────
const Pill = ({ children, color = "#4ade80", s = {} }) => <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 9, fontWeight: 700, letterSpacing: 0.5, background: color + "1a", color, border: `1px solid ${color}33`, ...s }}>{children}</span>;
const Stat = ({ label, value, sub, accent = "#4ade80" }) => (
  <div style={{ background: "#0e1017", borderRadius: 12, padding: "14px 16px", border: "1px solid #1a1d28", flex: "1 1 150px", minWidth: 140 }}>
    <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3, fontWeight: 700 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: accent, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{sub}</div>}
  </div>
);

// ─── TICKET TOGGLE ───────────────────────────────────────────
function TicketToggle({ decisions, matchId, onChange, color }) {
  // Group tickets into pairs (0-1, 2-3, etc.) and toggle both at once
  const pairs = [];
  for (let i = 0; i < decisions.length; i += 2) {
    pairs.push({ idx: i, status: decisions[i] }); // pair status from first ticket
  }
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
      {pairs.map((pair, pi) => {
        const isSell = pair.status === "sell";
        const newVal = isSell ? "keep" : "sell";
        return (
          <button key={pi} onClick={(e) => { e.stopPropagation(); onChange(matchId, pair.idx, newVal); onChange(matchId, pair.idx + 1, newVal); }}
            style={{
              padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer",
              border: isSell ? "1px solid #f59e0b55" : `1px solid ${color}44`,
              background: isSell ? "#f59e0b15" : `${color}10`,
              color: isSell ? "#f59e0b" : color,
              transition: "all 0.15s",
            }}>
            {pairs.length > 1 ? `Pair ${pi + 1}: ` : ""}{isSell ? "SELL 2 tickets" : "KEEP 2 tickets"}
          </button>
        );
      })}
    </div>
  );
}

// ─── MATCH LINKS BAR ─────────────────────────────────────────
function MatchLinks({ matchId }) {
  const links = MATCH_LINKS[matchId];
  if (!links) return null;
  const items = [
    { key: "fifaCollect", label: "FIFA Collect", url: links.fifaCollect },
    { key: "stubHub", label: "StubHub", url: links.stubHub },
    { key: "seatGeek", label: "SeatGeek", url: links.seatGeek },
    { key: "seatPick", label: "SeatPick", url: links.seatPick },
    { key: "viagogo", label: "Viagogo", url: links.viagogo },
    { key: "wc26", label: "WC26 Prices", url: links.wc26 },
  ];
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8, paddingTop: 8, borderTop: "1px solid #1a1d2833" }}>
      <span style={{ fontSize: 9, color: "#4b5563", lineHeight: "22px", marginRight: 2 }}>CHECK PRICES →</span>
      {items.map(it => (
        <a key={it.key} href={it.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
          style={{
            fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
            background: (PLATFORMS[it.key]?.color || "#60a5fa") + "15",
            color: PLATFORMS[it.key]?.color || "#60a5fa",
            border: `1px solid ${(PLATFORMS[it.key]?.color || "#60a5fa")}22`,
            textDecoration: "none", transition: "opacity 0.15s",
          }}>{it.label} ↗</a>
      ))}
    </div>
  );
}

// ─── FEE COMPARISON ──────────────────────────────────────────
function FeeComp({ matchId, history }) {
  const m = INIT_MATCHES.find(x => x.id === matchId);
  const data = PK.map(pk => {
    const price = getL(history, matchId, pk);
    if (!price) return null;
    const fee = price * PLATFORMS[pk].sellerFee;
    return { pk, price, fee: Math.round(fee), net: Math.round(price - fee), buyerPays: Math.round(price * (1 + PLATFORMS[pk].buyerFee)), profit: Math.round(price - fee - m.origPairPrice), ...PLATFORMS[pk] };
  }).filter(Boolean);
  if (!data.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(125px, 1fr))", gap: 6, marginTop: 10 }}>
      {data.map(d => (
        <div key={d.pk} style={{ background: "#0e1017", borderRadius: 8, padding: "8px 10px", border: `1px solid ${d.color}15` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color }} /><span style={{ fontSize: 10, fontWeight: 700, color: d.color }}>{d.short}</span></div>
          <div style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>List: <span style={{ color: "#e2e8f0" }}>{fmt(d.price)}</span></div>
            <div>Fee: <span style={{ color: "#ef4444" }}>−{fmt(d.fee)}</span></div>
            <div>Net: <span style={{ color: "#4ade80", fontWeight: 700 }}>{fmt(d.net)}</span></div>
            <div style={{ borderTop: "1px solid #1a1d28", marginTop: 3, paddingTop: 3 }}>
              Profit: <span style={{ color: d.profit >= 0 ? "#4ade80" : "#ef4444", fontWeight: 700 }}>{d.profit >= 0 ? "+" : ""}{fmt(d.profit)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MATCH ROW ───────────────────────────────────────────────
function MatchRow({ match, history, isSelected, onClick, decisions, onDecisionChange }) {
  const platforms = PK.map(pk => ({ key: pk, price: getL(history, match.id, pk), ...PLATFORMS[pk] })).filter(p => p.price);
  const best = bestP(history, match.id);
  const sellTix = decisions.filter(d => d === "sell").length;
  const keepTix = decisions.filter(d => d === "keep").length;

  return (
    <div onClick={onClick} style={{
      background: isSelected ? "#141722" : "#0e1017", borderRadius: 12, padding: "12px 16px",
      cursor: "pointer", border: isSelected ? `1px solid ${MC[match.id]}44` : "1px solid #1a1d28", transition: "all 0.15s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>M{match.id}</span>
            <Pill color={RC[match.round]}>{match.round}</Pill>
            {keepTix > 0 && <Pill color="#818cf8">KEEP {keepTix} tix</Pill>}
            {sellTix > 0 && <Pill color="#f59e0b">SELL {sellTix} tix</Pill>}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 1 }}>{match.teams}</div>
          {match.likelyMatchup && <div style={{ fontSize: 9, color: "#6b7280", fontStyle: "italic" }}>Likely: {match.likelyMatchup}</div>}
          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>{fMD(match.date)} · {match.city} · Face: {fmt(match.origPairPrice)}/pr</div>
          <TicketToggle decisions={decisions} matchId={match.id} onChange={onDecisionChange} color={MC[match.id]} />
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {platforms.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {platforms.map(p => (
                <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color }} />
                  <span style={{ fontSize: 9, color: "#6b7280", width: 48, textAlign: "left" }}>{p.short}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: p.key === best.platform ? p.color : "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(p.price)}</span>
                </div>
              ))}
            </div>
          ) : <span style={{ color: "#4b5563", fontSize: 11 }}>No data</span>}
        </div>
      </div>
      {isSelected && <>
        <FeeComp matchId={match.id} history={history} />
        <MatchLinks matchId={match.id} />
      </>}
    </div>
  );
}

// ─── CHART ───────────────────────────────────────────────────
function PriceChart({ history, matchId }) {
  const data = history.map(h => {
    const e = { date: fD(h.date) };
    PK.forEach(pk => { e[pk] = h.prices?.[matchId]?.[pk] || null; });
    return e;
  });
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
        <defs>{PK.map(pk => <linearGradient key={pk} id={`g-${pk}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PLATFORMS[pk].color} stopOpacity={0.3} /><stop offset="100%" stopColor={PLATFORMS[pk].color} stopOpacity={0} /></linearGradient>)}</defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1d28" />
        <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} stroke="#1a1d28" />
        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} stroke="#1a1d28" tickFormatter={fmtK} />
        <Tooltip contentStyle={{ background: "#141722", border: "1px solid #2e3040", borderRadius: 8, fontSize: 10, color: "#e2e8f0" }} formatter={(v, n) => [fmt(v), PLATFORMS[n]?.name || n]} />
        {PK.map(pk => <Area key={pk} type="monotone" dataKey={pk} stroke={PLATFORMS[pk].color} fill={`url(#g-${pk})`} strokeWidth={2.5} dot={{ r: 3, fill: PLATFORMS[pk].color }} connectNulls />)}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── ADD MODAL ───────────────────────────────────────────────
function AddModal({ onClose, onSave }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [platform, setPlatform] = useState("stubHub");
  const [prices, setPrices] = useState(Object.fromEntries(INIT_MATCHES.map(m => [m.id, ""])));
  const is = { background: "#0e1017", border: "1px solid #1a1d28", borderRadius: 8, padding: "7px 10px", color: "#f1f5f9", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111520", borderRadius: 16, padding: 22, width: 440, border: "1px solid #2e3040", maxHeight: "85vh", overflowY: "auto" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#f1f5f9" }}>Add Manual Price Data</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: 9, color: "#6b7280", display: "block", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...is, width: "100%" }} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: 9, color: "#6b7280", display: "block", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>Platform</label><select value={platform} onChange={e => setPlatform(e.target.value)} style={{ ...is, width: "100%", cursor: "pointer" }}>{PK.filter(pk => !PLATFORMS[pk].auto).map(pk => <option key={pk} value={pk}>{PLATFORMS[pk].name}</option>)}</select></div>
        </div>
        <div style={{ background: PLATFORMS[platform].color + "11", borderRadius: 8, padding: "6px 10px", marginBottom: 12, fontSize: 10, color: PLATFORMS[platform].color, border: `1px solid ${PLATFORMS[platform].color}22` }}>
          Seller fee: {(PLATFORMS[platform].sellerFee * 100)}% · Buyer fee: ~{(PLATFORMS[platform].buyerFee * 100)}% · Risk: {PLATFORMS[platform].risk}
        </div>
        {INIT_MATCHES.map(m => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
            <span style={{ fontSize: 9, color: MC[m.id], fontWeight: 800, width: 28, fontFamily: "'JetBrains Mono', monospace" }}>M{m.id}</span>
            <span style={{ fontSize: 10, color: "#9ca3af", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.teams}</span>
            <div style={{ position: "relative" }}><span style={{ position: "absolute", left: 8, top: 6, fontSize: 11, color: "#4b5563" }}>$</span><input type="number" placeholder="—" value={prices[m.id]} onChange={e => setPrices({ ...prices, [m.id]: e.target.value })} style={{ ...is, width: 95, paddingLeft: 18, textAlign: "right" }} /></div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1px solid #2e3040", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: 11 }}>Cancel</button>
          <button onClick={() => { const e = { date, platform }; let ok = false; INIT_MATCHES.forEach(m => { const v = parseFloat(prices[m.id]); if (!isNaN(v) && v > 0) { e[m.id] = v; ok = true; } }); if (ok) onSave(e); }} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: PLATFORMS[platform].color, color: "#0a0c10", cursor: "pointer", fontSize: 11, fontWeight: 800 }}>Save to {PLATFORMS[platform].short}</button>
        </div>
      </div>
    </div>
  );
}

// ─── FEE MATRIX ──────────────────────────────────────────────
function FeeMatrix() {
  return (
    <div style={{ background: "#0e1017", borderRadius: 12, padding: 16, border: "1px solid #1a1d28" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Platform Fee Structure</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
        <thead><tr style={{ borderBottom: "1px solid #1a1d28" }}>{["Platform", "Seller", "Buyer", "Total", "Net/$1k", "Risk"].map(h => <th key={h} style={{ padding: "5px 6px", textAlign: "left", color: "#6b7280", fontWeight: 700, fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>)}</tr></thead>
        <tbody>{PK.map(pk => { const p = PLATFORMS[pk]; const rc = p.risk === "low" ? "#4ade80" : p.risk === "medium" ? "#f59e0b" : "#ef4444"; return (
          <tr key={pk} style={{ borderBottom: "1px solid #1a1d2811" }}>
            <td style={{ padding: "7px 6px" }}><span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color }} /><span style={{ color: p.color, fontWeight: 700, fontSize: 11 }}>{p.name}</span>{p.auto && <Pill color="#818cf8">AUTO</Pill>}</span></td>
            <td style={{ padding: "7px 6px", color: "#ef4444", fontFamily: "'JetBrains Mono', monospace" }}>{(p.sellerFee * 100)}%</td>
            <td style={{ padding: "7px 6px", color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace" }}>{(p.buyerFee * 100)}%</td>
            <td style={{ padding: "7px 6px", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{((p.sellerFee + p.buyerFee) * 100)}%</td>
            <td style={{ padding: "7px 6px", color: "#4ade80", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{fmt(1000 * (1 - p.sellerFee))}</td>
            <td style={{ padding: "7px 6px" }}><Pill color={rc}>{p.risk.toUpperCase()}</Pill></td>
          </tr>); })}</tbody>
      </table>
      <div style={{ fontSize: 9, color: "#4b5563", marginTop: 8, lineHeight: 1.5 }}>⚠ FIFA warns selling on StubHub/SeatGeek/Viagogo violates Terms of Use. Tickets may be invalidated. Factor risk into decisions.</div>
    </div>
  );
}

// ─── DATA SOURCES (match-specific) ───────────────────────────
function SourcesTab() {
  return (<>
    <div style={{ background: "#0e1017", borderRadius: 12, padding: 16, border: "1px solid #1a1d28", marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 3 }}>How Pricing Updates Work</div>
      <div style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.7, marginBottom: 12 }}>
        <strong style={{ color: "#818cf8" }}>Automatic (FIFA Collect):</strong> Vercel cron job runs daily at 8am CT, querying FIFA Collect marketplace for Cat 1 floor prices on your 8 matches.
        <br /><strong style={{ color: "#f97316" }}>Manual:</strong> Click "Add Manual Prices" → select platform → enter median pair prices. Takes ~3 min/day.
      </div>
      <div style={{ background: "#141722", borderRadius: 8, padding: "8px 12px", fontSize: 10, color: "#818cf8", border: "1px solid #818cf822" }}>
        🔔 FIFA Resale closed Feb 22 – Apr 2. FIFA Collect is the only marketplace during this window.
      </div>
    </div>
    <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>Direct Links By Match</div>
    {INIT_MATCHES.map(m => (
      <div key={m.id} style={{ background: "#0e1017", borderRadius: 10, padding: "10px 14px", border: "1px solid #1a1d28", marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MC[m.id], marginBottom: 6 }}>M{m.id} · {m.teams} · {fMD(m.date)} · {m.city}</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {Object.entries(MATCH_LINKS[m.id]).map(([key, url]) => {
            const label = key === "fifaCollect" ? "FIFA Collect" : key === "stubHub" ? "StubHub" : key === "seatGeek" ? "SeatGeek" : key === "seatPick" ? "SeatPick" : key === "viagogo" ? "Viagogo" : "WC26 Prices";
            const color = PLATFORMS[key]?.color || "#60a5fa";
            return <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: color + "15", color, border: `1px solid ${color}22`, textDecoration: "none" }}>{label} ↗</a>;
          })}
        </div>
      </div>
    ))}
  </>);
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function WC26Dashboard() {
  const [history, setHistory] = useState(SEED);
  const [decisions, setDecisions] = useState(INIT_TICKET_DECISIONS);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState("dashboard");

  const handleDecision = useCallback((matchId, pairIdx, newVal) => {
    setDecisions(prev => {
      const next = { ...prev, [matchId]: [...prev[matchId]] };
      next[matchId][pairIdx] = newVal;
      return next;
    });
  }, []);

  const handleAddPrice = useCallback((entry) => {
    setHistory(prev => {
      const next = [...prev];
      const di = next.findIndex(h => h.date === entry.date);
      const t = di >= 0 ? { ...next[di], prices: { ...next[di].prices } } : { date: entry.date, prices: {} };
      INIT_MATCHES.forEach(m => { const v = entry[m.id]; if (v) t.prices[m.id] = { ...(t.prices[m.id] || {}), [entry.platform]: v }; });
      if (di >= 0) next[di] = t; else next.push(t);
      next.sort((a, b) => a.date.localeCompare(b.date));
      return next;
    });
    setShowAdd(false);
  }, []);

  // Compute totals based on decisions (per ticket)
  const sellTix = INIT_MATCHES.reduce((sum, m) => sum + decisions[m.id].filter(d => d === "sell").length, 0);
  const keepTix = INIT_MATCHES.reduce((sum, m) => sum + decisions[m.id].filter(d => d === "keep").length, 0);
  const totalResale = INIT_MATCHES.reduce((sum, m) => {
    const sellPairs = decisions[m.id].filter(d => d === "sell").length / 2;
    return sum + bestNet(history, m.id) * sellPairs;
  }, 0);
  const keepCost = INIT_MATCHES.reduce((sum, m) => {
    const keepPairs = decisions[m.id].filter(d => d === "keep").length / 2;
    return sum + m.origPairPrice * keepPairs;
  }, 0);
  const netProfit = totalResale - TOTAL_ORIG;
  const lastDate = history[history.length - 1]?.date;

  return (
    <div style={{ background: "#090b10", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Instrument Sans', -apple-system, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#090b10}::-webkit-scrollbar-thumb{background:#2e3040;border-radius:3px}input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}select{-webkit-appearance:none}`}</style>

      {/* HEADER */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #1a1d28", background: "linear-gradient(180deg, #0d0f16 0%, #090b10 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>⚽ WC26 TRACKER</span><Pill color="#818cf8">MULTI-PLATFORM</Pill></div>
            <div style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>Cat 1 · {keepTix + sellTix} tickets · Selling {sellTix} / Keeping {keepTix} · Updated {fD(lastDate)}</div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #4ade8044", background: "#4ade8012", color: "#4ade80", cursor: "pointer", fontSize: 10, fontWeight: 700 }}>+ Add Prices</button>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 10 }}>
          {[["dashboard", "Dashboard"], ["fees", "Fee Analysis"], ["sources", "Data Sources"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: tab === k ? "1px solid #818cf833" : "1px solid transparent", background: tab === k ? "#141722" : "transparent", color: tab === k ? "#818cf8" : "#6b7280" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 36px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "dashboard" && (<>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Stat label="Total Invested" value={fmt(TOTAL_ORIG)} sub={`20 tickets, 8 matches`} accent="#60a5fa" />
            <Stat label="Projected Net Payout" value={fmt(totalResale)} sub={`From ${sellTix} tickets (${sellTix / 2} pairs) marked SELL`} accent="#4ade80" />
            <Stat label="Net Profit / Loss" value={netProfit >= 0 ? `+${fmt(netProfit)}` : fmt(netProfit)} sub={`${((netProfit / TOTAL_ORIG) * 100).toFixed(0)}% ROI after fees`} accent={netProfit >= 0 ? "#4ade80" : "#ef4444"} />
            <Stat label="Keeping" value={`${keepTix} tickets`} sub={`Cost: ${fmt(keepCost)} face value`} accent="#818cf8" />
          </div>

          {selectedMatch && (
            <div style={{ background: "#0e1017", borderRadius: 12, padding: "14px 16px 6px", border: "1px solid #1a1d28", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div><span style={{ fontSize: 13, fontWeight: 700, color: MC[selectedMatch] }}>M{selectedMatch}</span><span style={{ fontSize: 12, color: "#f1f5f9", marginLeft: 8 }}>{INIT_MATCHES.find(m => m.id === selectedMatch)?.teams}</span></div>
                <button onClick={() => setSelectedMatch(null)} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #2e3040", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: 9 }}>✕</button>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>{PK.map(pk => <span key={pk} style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 3, opacity: getL(history, selectedMatch, pk) ? 1 : 0.25 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: PLATFORMS[pk].color }} /><span style={{ color: "#9ca3af" }}>{PLATFORMS[pk].short}</span></span>)}</div>
              <PriceChart history={history} matchId={selectedMatch} />
            </div>
          )}

          <div style={{ display: "grid", gap: 6 }}>
            {INIT_MATCHES.map(m => <MatchRow key={m.id} match={m} history={history} isSelected={selectedMatch === m.id} onClick={() => setSelectedMatch(selectedMatch === m.id ? null : m.id)} decisions={decisions[m.id]} onDecisionChange={handleDecision} />)}
          </div>
        </>)}

        {tab === "fees" && (<>
          <div style={{ marginBottom: 16 }}><FeeMatrix /></div>
          <div style={{ background: "#0e1017", borderRadius: 12, padding: 16, border: "1px solid #1a1d28" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>⚖️ Key Tradeoffs</div>
            <div style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.8 }}>
              <strong style={{ color: "#818cf8" }}>FIFA Collect (5%):</strong> Lowest seller fee. Official. Zero invalidation risk. Smaller buyer pool.
              <br /><strong style={{ color: "#22d3ee" }}>SeatGeek (10%):</strong> Best third-party rate. Large US audience. Smart Pricing. Invalidation risk.
              <br /><strong style={{ color: "#f97316" }}>StubHub (15%):</strong> Most liquidity. Often highest listed prices. Same seller fee as FIFA Resale but with risk.
              <br /><strong style={{ color: "#4ade80" }}>FIFA Resale (15%):</strong> Official and safe. Reopens April 2. Zero risk.
              <br /><strong style={{ color: "#a78bfa" }}>Viagogo (15% sell / 27% buy):</strong> Global reach. Highest buyer friction. FIFA has filed complaints — highest risk.
              <br /><br /><strong style={{ color: "#f59e0b" }}>💡 Bottom line:</strong> On a $3,000 pair → Collect nets $2,850, SeatGeek $2,700, StubHub $2,550. The $300 gap on Collect adds up. Use Collect for safety + best net, StubHub only if price premium exceeds the fee delta.
            </div>
          </div>
        </>)}

        {tab === "sources" && <SourcesTab />}

        <div style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid #1a1d28", textAlign: "center", fontSize: 9, color: "#3b4252" }}>
          WC26 Ticket Tracker · FIFA Collect auto-fetch + manual entries · Click any match to expand price links + fee breakdown
        </div>
      </div>
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={handleAddPrice} />}
    </div>
  );
}