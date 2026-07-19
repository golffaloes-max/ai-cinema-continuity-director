"use client";

import { useMemo, useState } from "react";

type Pack = {
  dramaticBeat: string;
  shotBrief: string;
  startPose: string;
  videoPrompt: string;
  voiceDirection: string;
  continuityChecklist: string[];
  engine?: string;
};

const cowCase = {
  title: "SC43 — The owner accuses the thief",
  story:
    "A hot-tempered but honest herdsman accuses a calm, well-dressed thief of stealing his cow. The thief appears credible because witnesses only saw him arrive with the cow. The ministers are beginning to trust appearances over truth.",
  dialogue: "True owner: ‘He stole my cow from the middle of the field!’",
  bible:
    "CAM-65A-QMR01, Arri Alexa 65, 65mm anamorphic, f/2.4, eye-level medium-wide, T02-DY Bright Sacred Day. Owner: male 35–40, curly untidy hair, beige sleeveless shirt, honest and hot-tempered. Senaka: stern minister, controlled authority. Thief: male 30–35, refined, calm and persuasive. Landscape 16:9. Preserve approved roadside pavilion, crowd, costumes and character identities.",
};

const emptyPack: Pack = {
  dramaticBeat: "",
  shotBrief: "",
  startPose: "",
  videoPrompt: "",
  voiceDirection: "",
  continuityChecklist: [],
};

const tabs: Array<[keyof Omit<Pack, "continuityChecklist" | "engine"> | "continuityChecklist", string]> = [
  ["shotBrief", "Shot Brief"],
  ["startPose", "Start Pose"],
  ["videoPrompt", "Video Prompt"],
  ["voiceDirection", "Voice Lock"],
  ["continuityChecklist", "Continuity QC"],
];

function markdown(pack: Pack, title: string) {
  return `# ${title}\n\n## Dramatic Beat\n${pack.dramaticBeat}\n\n## Shot Brief\n${pack.shotBrief}\n\n## Start Pose Prompt\n${pack.startPose}\n\n## Video Prompt\n${pack.videoPrompt}\n\n## Voice Direction\n${pack.voiceDirection}\n\n## Continuity Checklist\n${pack.continuityChecklist.map((item) => `- [ ] ${item}`).join("\n")}\n`;
}

export default function Home() {
  const [title, setTitle] = useState(cowCase.title);
  const [story, setStory] = useState(cowCase.story);
  const [dialogue, setDialogue] = useState(cowCase.dialogue);
  const [bible, setBible] = useState(cowCase.bible);
  const [pack, setPack] = useState<Pack>(emptyPack);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number][0]>("shotBrief");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeText = useMemo(() => {
    if (activeTab === "continuityChecklist") {
      return pack.continuityChecklist.map((item) => `☐ ${item}`).join("\n");
    }
    return pack[activeTab] || "Your generated production instructions will appear here.";
  }, [activeTab, pack]);

  async function generate() {
    setLoading(true);
    setCopied(false);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, story, dialogue, bible }),
      });
      if (!response.ok) throw new Error("Generation failed");
      setPack(await response.json());
      setActiveTab("shotBrief");
    } catch {
      setPack({
        dramaticBeat: "Turn emotional accusation into readable evidence while preserving the audience’s uncertainty.",
        shotBrief: "Stable eye-level medium-wide three-character composition. Owner at frame left in side profile, Senaka centered, thief as a soft back-view foreground shape at frame right. The owner must complete a full-body turn before pointing and speaking.",
        startPose: "LANDSCAPE 16:9 — CREATE A CINEMATIC START POSE. Preserve the approved background, lighting, character identities, costume materials, crowd placement and depth of field. Owner stands at frame left in side profile facing Senaka, both arms lowered, mouth closed. Senaka remains centered and still. The thief is a soft back-view foreground figure at frame right. CAM-65A-QMR01, T02-DY Bright Sacred Day. No redesign, no camera movement, no duplicated characters, no distorted anatomy.",
        videoPrompt: "0.0–0.4s: Hold the exact start frame. 0.4–1.3s: Without speaking, the owner performs one natural full-body turn in place toward the thief. 1.3–1.8s: He stops at front three-quarter and raises only his right arm to point. 1.8–6.0s: Only after the pose is established, he delivers the approved line with restrained anger. Camera remains completely locked. Senaka, thief and citizens remain silent with closed mouths.",
        voiceDirection: "TRUE OWNER ONLY — Thai male, age 35–40, medium-low rural voice; blunt, sincere and hot-tempered, with restrained anger and helpless frustration. No shouting distortion. All other mouths remain closed. Dialogue: ‘He stole my cow from the middle of the field!’",
        continuityChecklist: ["Owner begins with both arms lowered and mouth closed", "Full-body turn completes before the pointing gesture", "Only the owner’s right arm points at the thief", "Owner is the sole speaking character", "Senaka, thief and crowd keep mouths closed", "CAM-65A-QMR01 and T02-DY remain locked", "No camera movement, reframing or background redesign", "Character faces, costumes and scale remain unchanged"],
        engine: "Continuity rules fallback",
      });
    } finally {
      setLoading(false);
    }
  }

  function loadBlank() {
    setTitle("");
    setStory("");
    setDialogue("");
    setBible("");
    setPack(emptyPack);
  }

  function loadCase() {
    setTitle(cowCase.title);
    setStory(cowCase.story);
    setDialogue(cowCase.dialogue);
    setBible(cowCase.bible);
    setPack(emptyPack);
  }

  async function copyActive() {
    await navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function downloadPack() {
    const blob = new Blob([markdown(pack, title || "Untitled scene")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title || "scene").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-production-pack.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const ready = Boolean(pack.shotBrief);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AI Cinema Continuity Director home">
          <span className="brandMark">AC</span>
          <span><b>AI Cinema</b><small>Continuity Director</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workspace">Workspace</a>
          <a href="#workflow">Workflow</a>
          <a href="#case-study">Case study</a>
        </nav>
        <span className="buildBadge"><i /> Built with Codex + GPT-5.6</span>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span>Production intelligence</span><span>Continuity before generation</span></div>
        <h1>Direct the scene.<br /><em>Protect the story.</em></h1>
        <p>Turn narrative intent into a production-ready prompt pack—shot design, start pose, action timing, voice lock, and continuity QC in one controlled workflow.</p>
        <div className="heroActions">
          <a className="primaryButton" href="#workspace">Open scene workspace <span>↘</span></a>
          <button className="textButton" onClick={loadCase}>Load Mahosadha case study</button>
        </div>
        <div className="signalLine"><span>01 STORY</span><b /><span>02 SHOT</span><b /><span>03 START POSE</span><b /><span>04 VIDEO</span><b /><span>05 QC</span></div>
      </section>

      <section className="workspace" id="workspace">
        <div className="sectionHeading">
          <div><span className="sectionNo">01</span><h2>Scene workspace</h2></div>
          <p>Build from intent. Lock what must survive generation.</p>
        </div>

        <div className="workspaceGrid">
          <form className="inputPanel" onSubmit={(event) => { event.preventDefault(); generate(); }}>
            <div className="panelTop"><span>INPUT / SCENE SOURCE</span><div><button type="button" onClick={loadCase}>Case study</button><button type="button" onClick={loadBlank}>Clear</button></div></div>
            <label>Scene title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="SC43 — The accusation" required /></label>
            <label>Story intent<textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="What happens, why it matters, and what the audience should feel..." required /></label>
            <label>Dialogue / action<textarea className="short" value={dialogue} onChange={(e) => setDialogue(e.target.value)} placeholder="Speaker, line, and required action..." /></label>
            <label>Production bible<textarea value={bible} onChange={(e) => setBible(e.target.value)} placeholder="Character identity, camera, light, environment and continuity locks..." required /></label>
            <div className="formFooter"><span><i /> Scene data stays in this session</span><button className="generateButton" disabled={loading}>{loading ? "Directing scene…" : "Generate production pack"}<b>→</b></button></div>
          </form>

          <div className={`outputPanel ${ready ? "isReady" : ""}`}>
            <div className="panelTop"><span>OUTPUT / PRODUCTION PACK</span><span className="engine">{pack.engine || "Awaiting scene"}</span></div>
            {ready && <div className="beat"><small>DRAMATIC BEAT</small><p>{pack.dramaticBeat}</p></div>}
            <div className="tabs" role="tablist" aria-label="Production pack sections">
              {tabs.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={activeTab === key} onClick={() => { setActiveTab(key); setCopied(false); }}>{label}</button>)}
            </div>
            <div className="outputCopy" role="tabpanel">
              {!ready ? <div className="emptyState"><span>◌</span><h3>Your production pack begins here</h3><p>Load the case study or enter a scene, then generate a continuity-controlled production plan.</p></div> : activeTab === "continuityChecklist" ? <ul className="checklist">{pack.continuityChecklist.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul> : <p>{activeText}</p>}
            </div>
            <div className="outputActions"><button type="button" disabled={!ready} onClick={copyActive}>{copied ? "Copied" : "Copy section"}</button><button type="button" disabled={!ready} onClick={downloadPack}>Download .md</button></div>
          </div>
        </div>
      </section>

      <section className="workflow" id="workflow">
        <div className="sectionHeading light"><div><span className="sectionNo">02</span><h2>One scene. Five production locks.</h2></div><p>Designed for directors—not prompt roulette.</p></div>
        <div className="steps">
          {[['01','Story intent','Protect the dramatic purpose before visual decisions begin.'],['02','Shot design','Translate story pressure into camera, blocking and readable staging.'],['03','Start pose','Build an exact first frame with identity, material and geography locks.'],['04','Video direction','Sequence movement, speech, timing and mouth ownership.'],['05','Continuity QC','Audit what changed before a flawed generation reaches the edit.']].map(([n,h,p]) => <article key={n}><span>{n}</span><h3>{h}</h3><p>{p}</p></article>)}
        </div>
      </section>

      <section className="caseStudy" id="case-study">
        <div className="caseLabel">REAL PRODUCTION CASE / MAHOSADHA JATAKA</div>
        <div className="caseGrid"><div><h2>Built from the problems<br />AI filmmakers actually face.</h2><p>A multi-scene Jataka production exposed recurring failures: drifting faces, changing backgrounds, impossible anatomy, floating props, wrong speakers and broken action continuity. This workflow turns those failures into explicit production constraints before the next generation.</p><button className="secondaryButton" onClick={() => { loadCase(); document.querySelector('#workspace')?.scrollIntoView({behavior:'smooth'}); }}>Open the cow dispute scene →</button></div><div className="failureBoard"><div><b>IDENTITY DRIFT</b><span>Face and costume lock</span></div><div><b>SPATIAL BREAK</b><span>Background and blocking lock</span></div><div><b>ACTION ERROR</b><span>Ordered movement and timing</span></div><div><b>VOICE MIX</b><span>Speaker and mouth ownership</span></div><div><b>PROP FAILURE</b><span>Physics and attachment logic</span></div><div className="resolved"><b>PRODUCTION PACK</b><span>One source of truth</span></div></div></div>
      </section>

      <footer><div className="brand"><span className="brandMark">AC</span><span><b>AI Cinema</b><small>Continuity Director</small></span></div><p>Created by an independent AI filmmaker. Built during OpenAI Build Week 2026.</p></footer>
    </main>
  );
}
