import { useState } from "react";

const CONSIDERATIONS = {
  "reveal-pro": [
    "What are the possible benefits of revealing?",
    "Might sharing strengthen trust, as opposed to threatening it?",
    "Could revealing lead to support, solutions, or relief?",
  ],
  "reveal-con": [
    "What are the possible downsides of revealing?",
    "How important are these downsides — lasting or short-lived?",
    "Could revealing damage a relationship or my reputation?",
  ],
  "conceal-pro": [
    "What are the possible benefits of holding back?",
    "How important are these benefits — lasting or short-lived?",
    "Would I be withholding because it's the best choice, or because it feels easiest?",
  ],
  "conceal-con": [
    "What are the possible downsides of holding back?",
    "Will keeping it to myself be burdensome or painful?",
    "Will I ruminate?",
    "Ten years from now, will I regret having held back?",
  ],
};

function ScalesSVG({ tilt = 0 }) {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none">
      <line x1="36" y1="4" x2="36" y2="18" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="52" x2="48" y2="52" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="40" x2="36" y2="52" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      <g style={{ transformOrigin: "36px 18px", transform: `rotate(${tilt}deg)`, transition: "transform 0.6s cubic-bezier(.34,1.56,.64,1)" }}>
        <line x1="8" y1="18" x2="64" y2="18" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="18" x2="12" y2="30" stroke="#111" strokeWidth="1.5" />
        <line x1="4" y1="30" x2="20" y2="30" stroke="#111" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="18" x2="60" y2="30" stroke="#111" strokeWidth="1.5" />
        <line x1="52" y1="30" x2="68" y2="30" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function ItemList({ items, onDelete }) {
  if (!items.length) return null;
  return (
    <ul style={{ listStyle: "none", marginBottom: 10 }}>
      {items.map((text, i) => (
        <li key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 8,
          padding: "10px 0", borderBottom: "1px dotted #d0d0d0",
          fontSize: 15, lineHeight: 1.5, color: "#111",
          fontFamily: "'Georgia', serif",
        }}>
          <span style={{ color: "#888", flexShrink: 0, marginTop: 2, fontSize: 12 }}>—</span>
          <span style={{ flex: 1 }}>{text}</span>
          <button onClick={() => onDelete(i)} style={{
            background: "none", border: "none", color: "#aaa",
            cursor: "pointer", fontSize: 11, flexShrink: 0, padding: 0,
            lineHeight: 1, marginTop: 3,
          }}>✕</button>
        </li>
      ))}
    </ul>
  );
}

function AddRow({ value, onChange, onAdd, placeholder }) {
  return (
    <div style={{ display: "flex", border: "1px solid #555" }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
        placeholder={placeholder}
        style={{
          flex: 1, border: "none", padding: "9px 12px",
          fontFamily: "'Georgia', serif", fontSize: 14,
          fontStyle: "italic", color: "#111", background: "#fff",
          outline: "none", minWidth: 0,
        }}
      />
      <button onClick={onAdd} style={{
        background: "#111", border: "none", color: "#fff",
        width: 38, fontSize: 20, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>+</button>
    </div>
  );
}

function Considerations({ questions }) {
  return (
    <div style={{
      background: "#f7f7f7", borderLeft: "3px solid #555",
      padding: "10px 14px", marginBottom: 14,
    }}>
      <div style={{
        fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
        fontWeight: 700, color: "#888", marginBottom: 8,
      }}>Questions to consider</div>
      {questions.map((q, i) => (
        <div key={i} style={{
          fontFamily: "'Georgia', serif", fontStyle: "italic",
          fontSize: 13, color: "#555", lineHeight: 1.5,
          padding: "5px 0",
          borderBottom: i < questions.length - 1 ? "1px dotted #ccc" : "none",
        }}>{q}</div>
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [dilemma, setDilemma] = useState("");
  const [tab, setTab] = useState("reveal");
  const [inputs, setInputs] = useState({ "reveal-pro": "", "reveal-con": "", "conceal-pro": "", "conceal-con": "" });
  const [items, setItems] = useState({ "reveal-pro": [], "reveal-con": [], "conceal-pro": [], "conceal-con": [] });
  const [notes, setNotes] = useState("");
  const [tilt, setTilt] = useState(-8);

  // animate scales on intro
  useState(() => {
    const id = setInterval(() => setTilt(t => t === -8 ? 8 : -8), 2200);
    return () => clearInterval(id);
  }, []);

  const addItem = (key) => {
    const text = inputs[key].trim();
    if (!text) return;
    setItems(prev => ({ ...prev, [key]: [...prev[key], text] }));
    setInputs(prev => ({ ...prev, [key]: "" }));
  };

  const deleteItem = (key, i) => {
    setItems(prev => ({ ...prev, [key]: prev[key].filter((_, idx) => idx !== i) }));
  };

  const rPro = items["reveal-pro"].length;
  const rCon = items["reveal-con"].length;
  const cPro = items["conceal-pro"].length;
  const cCon = items["conceal-con"].length;
  const revealScore = rPro + cCon;
  const concealScore = cPro + rCon;
  const total = revealScore + concealScore;

  let balanceLeft = "50%", balanceWidth = "0%", verdictLabel = "Add items to weigh";
  if (total > 0) {
    if (revealScore > concealScore) {
      balanceLeft = "0%"; balanceWidth = `${(revealScore / total) * 100}%`; verdictLabel = "Leans Reveal";
    } else if (concealScore > revealScore) {
      const pct = (concealScore / total) * 100;
      balanceLeft = `${100 - pct}%`; balanceWidth = `${pct}%`; verdictLabel = "Leans Conceal";
    } else {
      balanceLeft = "25%"; balanceWidth = "50%"; verdictLabel = "Evenly Balanced";
    }
  }

  const S = { fontFamily: "'Inter', 'Helvetica Neue', sans-serif" };

  if (screen === "intro") return (
    <div style={{
      ...S, minHeight: "100dvh", background: "#fff", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2.5rem 1.5rem", gap: "1.6rem",
    }}>
      {/* Masthead */}
      <div style={{
        textAlign: "center", borderTop: "3px solid #000",
        borderBottom: "1px solid #000", padding: "1.2rem 0 1rem",
        width: "100%", maxWidth: 420,
      }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
          A psychological decision framework
        </div>
        <div style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "clamp(2.2rem, 9vw, 3rem)", fontWeight: 700,
          lineHeight: 1.05, color: "#000",
        }}>Disclosure<br />Dilemma</div>
        <div style={{ width: 36, height: 2, background: "#000", margin: "10px auto 8px" }} />
        <div style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
          Weigh the cost of speaking up<br />against the cost of staying silent.
        </div>
      </div>

      <ScalesSVG tilt={tilt} />

      {/* Input */}
      <div style={{ width: "100%", maxWidth: 420 }}>
        <label style={{
          display: "block", fontSize: 10, letterSpacing: "0.18em",
          textTransform: "uppercase", fontWeight: 600, color: "#888", marginBottom: 8,
        }}>What disclosure dilemma do you have?</label>
        <textarea
          value={dilemma}
          onChange={e => setDilemma(e.target.value)}
          placeholder="e.g. Should I tell my manager about the tension between two team members?"
          rows={3}
          style={{
            width: "100%", background: "#f7f7f7", border: "1.5px solid #555",
            borderRadius: 0, padding: "12px 14px", color: "#111",
            fontFamily: "'Georgia', serif", fontStyle: "italic",
            fontSize: 15, lineHeight: 1.55, resize: "none", outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <button
        disabled={dilemma.trim().length < 5}
        onClick={() => setScreen("analysis")}
        style={{
          width: "100%", maxWidth: 420, padding: "13px 20px",
          background: dilemma.trim().length < 5 ? "#ccc" : "#000",
          color: "#fff", border: "none", borderRadius: 0,
          fontFamily: "'Inter', sans-serif", fontSize: 12,
          fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          cursor: dilemma.trim().length < 5 ? "default" : "pointer",
          transition: "background 0.2s",
        }}
      >Begin Analysis</button>
    </div>
  );

  // Analysis screen
  const sections = tab === "reveal"
    ? [{ key: "reveal-pro", title: "Benefits of Revealing" }, { key: "reveal-con", title: "Downsides of Revealing" }]
    : [{ key: "conceal-pro", title: "Benefits of Concealing" }, { key: "conceal-con", title: "Downsides of Concealing" }];

  return (
    <div style={{ ...S, minHeight: "100dvh", background: "#fff", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "2px solid #000",
        padding: "10px 14px", display: "flex", alignItems: "center",
        gap: 10, position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => setScreen("intro")} style={{
          background: "none", border: "1px solid #555", color: "#111",
          padding: "4px 10px", fontSize: 11, letterSpacing: "0.05em",
          cursor: "pointer", fontFamily: "'Inter', sans-serif",
        }}>← Back</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999" }}>Your Dilemma</div>
          <div style={{
            fontFamily: "'Georgia', serif", fontStyle: "italic",
            fontSize: 13, color: "#111", whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>{dilemma}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #d0d0d0" }}>
        {["reveal", "conceal"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "12px 0", background: tab === t ? "#fff" : "#f7f7f7",
            border: "none", borderBottom: tab === t ? "3px solid #000" : "3px solid transparent",
            fontFamily: "'Georgia', serif", fontSize: 15, fontWeight: 700,
            color: tab === t ? "#000" : "#888", cursor: "pointer",
            borderRight: t === "reveal" ? "1px solid #d0d0d0" : "none",
            transition: "all 0.15s",
          }}>
            {t === "reveal" ? "Reveal" : "Conceal"}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        {sections.map(({ key, title }) => (
          <div key={key} style={{ padding: "18px 16px", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              fontWeight: 700, color: "#888", marginBottom: 14,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {title}
              <div style={{ flex: 1, height: 1, background: "#d0d0d0" }} />
            </div>
            <Considerations questions={CONSIDERATIONS[key]} />
            <ItemList items={items[key]} onDelete={(i) => deleteItem(key, i)} />
            <AddRow
              value={inputs[key]}
              onChange={v => setInputs(prev => ({ ...prev, [key]: v }))}
              onAdd={() => addItem(key)}
              placeholder={key.includes("pro") ? "Add a benefit…" : "Add a downside…"}
            />
          </div>
        ))}

        {/* Notes */}
        <div style={{ padding: "16px", borderTop: "2px solid #000" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "#888", marginBottom: 8 }}>
            Reflection — gut feelings, values, what remains unspoken
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Write freely. What does your gut say? What would you tell a friend in this situation?"
            rows={4}
            style={{
              width: "100%", background: "#f7f7f7", border: "1px solid #555",
              borderRadius: 0, padding: "10px 12px", color: "#111",
              fontFamily: "'Georgia', serif", fontStyle: "italic",
              fontSize: 14, lineHeight: 1.55, resize: "none", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Verdict bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "2px solid #000",
        padding: "10px 16px 16px",
      }}>
        <div style={{
          height: 5, background: "#f0f0f0", border: "1px solid #d0d0d0",
          position: "relative", overflow: "hidden", marginBottom: 6,
        }}>
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: balanceLeft, width: balanceWidth,
            background: "#000", transition: "all 0.4s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
          <span style={{ color: "#888", letterSpacing: "0.05em" }}>Reveal</span>
          <span style={{ fontWeight: 700, color: "#111", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 11 }}>
            {verdictLabel}
          </span>
          <span style={{ color: "#888", letterSpacing: "0.05em" }}>Conceal</span>
        </div>
      </div>
    </div>
  );
}
