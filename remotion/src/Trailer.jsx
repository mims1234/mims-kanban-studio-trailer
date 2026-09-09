import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img} from "remotion";
import {loadFont as loadFraunces} from "@remotion/google-fonts/Fraunces";
import {loadFont as loadCormorant} from "@remotion/google-fonts/CormorantGaramond";
import {loadFont as loadSchibsted} from "@remotion/google-fonts/SchibstedGrotesk";

const {fontFamily: fraunces} = loadFraunces("normal", {weights: ["500", "600"], styles: ["normal", "italic"], subsets: ["latin"]});
const {fontFamily: cormorant} = loadCormorant("normal", {weights: ["600", "700"], styles: ["normal"], subsets: ["latin"]});
const {fontFamily: schibsted} = loadSchibsted("normal", {weights: ["400", "500", "600"], subsets: ["latin"]});

const C = {paper: "#d8d0c2", cream: "#f7f2e8", surface: "#ebe4d6", ink: "#1a1713", muted: "#6f6860", rust: "#9f3d32", line: "rgba(26,23,19,0.12)"};
const typeChars = (text, frame, start, cps = 1.7) => text.slice(0, Math.max(0, Math.floor((frame - start) / cps)));

const Slip = ({title, meta, blocked, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 120}});
  return (
    <div style={{marginTop: 8, background: C.cream, borderRadius: 8, padding: "9px 10px 9px 14px", position: "relative", boxShadow: `0 0 0 1px ${C.line}`, transform: `translateY(${(1 - s) * 12}px)`, opacity: s}}>
      <div style={{position: "absolute", left: 0, top: 7, bottom: 7, width: 3, borderRadius: 2, background: blocked ? C.rust : C.ink}} />
      <div style={{fontFamily: fraunces, fontSize: 15, fontWeight: 500}}>{title}</div>
      {meta ? <div style={{fontFamily: schibsted, fontSize: 11, color: C.muted, marginTop: 3}}>{meta}</div> : null}
    </div>
  );
};

const Col = ({num, title, children, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 16}});
  return (
    <div style={{background: C.surface, borderRadius: 14, padding: 12, transform: `translateY(${(1 - s) * 18}px)`, opacity: s, minWidth: 0}}>
      <div style={{fontFamily: fraunces, fontStyle: "italic", fontSize: 11, letterSpacing: "0.16em", color: C.muted}}>{num}</div>
      <div style={{fontFamily: fraunces, fontSize: 20, fontWeight: 500, lineHeight: 1.1}}>{title}</div>
      {children}
    </div>
  );
};

const Drawer = ({credits, prompt, working, allow, applied}) => (
  <aside style={{background: C.surface, borderRadius: 16, padding: "20px 18px", boxShadow: "-16px 0 36px rgba(26,23,19,0.08)", display: "flex", flexDirection: "column", minWidth: 0}}>
    <div style={{fontFamily: schibsted, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.muted}}>Studio kit</div>
    <div style={{fontFamily: fraunces, fontStyle: "italic", fontSize: 34, lineHeight: 1}}>Operator</div>
    <div style={{fontFamily: schibsted, fontSize: 13, color: C.muted, margin: "6px 0 8px"}}>Turns cost 1–12 credits from tokens used.</div>
    <div><span style={{fontFamily: fraunces, fontStyle: "italic", fontSize: 24}}>{credits}</span><span style={{fontFamily: schibsted, fontSize: 13, color: C.muted}}> credits left</span></div>
    <div style={{display: "flex", background: "#e0d8c9", borderRadius: 7, padding: 3, margin: "10px 0"}}>
      <div style={{flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 5, background: C.cream, boxShadow: `0 0 0 1px ${C.line}`, fontSize: 14}}>Ask</div>
      <div style={{flex: 1, textAlign: "center", padding: "8px 0", fontSize: 14, color: C.muted}}>Allow session</div>
    </div>
    <div style={{background: C.cream, borderRadius: 10, padding: 14, boxShadow: `0 0 0 1px ${C.line}`, minHeight: 110, fontFamily: schibsted, fontSize: 15, lineHeight: 1.45}}>
      {allow ? (
        <>
          <div style={{fontWeight: 600, marginBottom: 8}}>Allow these tools?</div>
          <div style={{color: C.muted, fontSize: 13, marginBottom: 10}}>Build or rebuild a board<br />Add many cards</div>
          <div style={{background: C.ink, color: C.cream, borderRadius: 6, textAlign: "center", padding: "8px 0", fontSize: 14}}>Allow</div>
          {applied ? <div style={{fontFamily: fraunces, fontStyle: "italic", marginTop: 8}}>Applied.</div> : null}
        </>
      ) : (
        <>
          {prompt}
          <span style={{display: "inline-block", width: 8, height: 16, background: C.ink, marginLeft: 2, verticalAlign: -2, opacity: prompt.length % 2 === 0 ? 1 : 0.15}} />
        </>
      )}
    </div>
    {!allow ? <div style={{marginTop: 8, background: C.ink, color: C.cream, borderRadius: 6, textAlign: "center", padding: "8px 0", fontSize: 14}}>Send</div> : null}
    {working ? <div style={{fontFamily: fraunces, fontStyle: "italic", color: C.muted, marginTop: 10}}>Setting type…</div> : null}
  </aside>
);

const Brand = ({title, meta}) => (
  <div>
    <div style={{fontFamily: cormorant, fontWeight: 600, fontSize: 26}}>MiMs<div style={{fontFamily: schibsted, letterSpacing: "0.22em", fontSize: 10, color: C.muted}}>KANBAN STUDIO</div></div>
    <div style={{fontFamily: fraunces, fontStyle: "italic", fontSize: 42, lineHeight: 0.95, marginTop: 6}}>{title}</div>
    <div style={{fontFamily: schibsted, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted}}>{meta}</div>
  </div>
);

const ASK_A = "Create a weekly editorial kanban with To Commission, Writing, Edit, Proof, and Published, plus a few cards.";
const ASK_B = "Build a hiring board. Columns Applied, Screen, Interview limit 2, Offer, Hired. Add Maya Chen in Interview, blocked on take-home.";

export const Trailer = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fade = (from, to) => interpolate(frame, [from, from + 8, to - 8, to], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const typedA = typeChars(ASK_A, frame, 75, 1.7);
  const typedB = typeChars(ASK_B, frame, 475, 1.6);
  const allowA = frame >= 230;
  const allowB = frame >= 640;
  return (
    <AbsoluteFill style={{background: "#111", fontFamily: schibsted, color: C.ink}}>
      <AbsoluteFill style={{background: C.paper, overflow: "hidden"}}>
        <AbsoluteFill style={{opacity: fade(0, 70)}}>
          <Img src="https://kanban-studio.genxmims.org/og.jpg" style={{width: "100%", height: "100%", objectFit: "cover"}} />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: fade(60, 300), padding: "48px 56px 90px", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 22}}>
          <div>
            <Brand title="A new press" meta="Ask to create or customize" />
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 22}}>
              <Col num="01" title="To Do" delay={70} />
              <Col num="02 · limit 3" title="Doing" delay={78} />
              <Col num="03" title="Done" delay={86} />
            </div>
          </div>
          <Drawer credits={12} prompt={typedA} working={frame >= 210 && frame < 230} allow={allowA} applied={false} />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: fade(290, 470), padding: "48px 56px 90px", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 22}}>
          <div>
            <Brand title="Weekly editorial" meta="Studio kit applied · 9 credits left" />
            <div style={{display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginTop: 18}}>
              <Col num="01" title="To Commission" delay={300}><Slip title="Pitch spring features" meta="Make-ready" delay={310} /><Slip title="Assign culture column" delay={318} /></Col>
              <Col num="02 · limit 3" title="Writing" delay={308}><Slip title="Draft city council recap" meta="Rush · Sam" delay={320} /><Slip title="Profile local bakery" meta="Lee" delay={328} /></Col>
              <Col num="03 · limit 2" title="Edit" delay={316}><Slip title="Line-edit weekend guide" meta="Ava" delay={330} /></Col>
              <Col num="04 · limit 2" title="Proof" delay={324}><Slip title="Fact-check op-ed" meta="Rush" delay={336} /></Col>
              <Col num="05" title="Published" delay={332}><Slip title="Ship Monday newsletter" delay={344} /></Col>
            </div>
          </div>
          <Drawer credits={9} prompt="" allow applied />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: fade(460, 700), padding: "48px 56px 90px", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 22}}>
          <div>
            <Brand title="Hiring desk" meta="Reshape what is already on press" />
            <div style={{display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginTop: 18}}>
              <Col num="01" title="Applied" delay={470}><Slip title="Sam Okoye" meta="Press operator" delay={480} /></Col>
              <Col num="02" title="Screen" delay={478} />
              <Col num="03 · limit 2" title="Interview" delay={486}><Slip title="Maya Chen" meta="Blocked on take-home" blocked delay={496} /></Col>
              <Col num="04" title="Offer" delay={494} />
              <Col num="05" title="Hired" delay={502} />
            </div>
          </div>
          <Drawer credits={9} prompt={typedB} working={frame >= 620 && frame < 640} allow={allowB} applied={allowB} />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: fade(690, 820), padding: "48px 56px 90px", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 22}}>
          <div>
            <Brand title="Product launch" meta="Add three rush cards · due Friday" />
            <div style={{display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginTop: 18}}>
              <Col num="01" title="Spec" delay={700}><Slip title="Cut the billing webhook" meta="Rush · Jules" delay={710} /></Col>
              <Col num="02" title="Build" delay={708}><Slip title="Fix login timeout" meta="Rush · today" delay={718} /></Col>
              <Col num="03 · limit 3" title="QA" delay={716}><Slip title="Write onboarding email" meta="Rush · today" delay={726} /></Col>
              <Col num="04" title="Launch" delay={724} />
              <Col num="05" title="Retro" delay={732} />
            </div>
          </div>
          <Drawer credits={6} prompt="" allow applied />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: fade(810, durationInFrames)}}>
          <Img src="https://kanban-studio.genxmims.org/og.jpg" style={{width: "100%", height: "100%", objectFit: "cover"}} />
        </AbsoluteFill>
        <div style={{position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 48px 28px", background: "linear-gradient(transparent, rgba(26,23,19,0.88))", color: C.cream, fontFamily: fraunces, fontStyle: "italic", fontSize: 28}}>
          {frame < 70 ? "" : frame < 300 ? "Type it. Create a board the way you talk." : frame < 470 ? "Allow the tools. The galley is set." : frame < 700 ? "Or reshape one you already have." : frame < 820 ? "Sprint, hire, launch, publish — same operator." : "Twelve guest credits. Type the board you need."}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
