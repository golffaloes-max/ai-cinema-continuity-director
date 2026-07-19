import { NextRequest, NextResponse } from "next/server";

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["dramaticBeat", "shotBrief", "startPose", "videoPrompt", "voiceDirection", "continuityChecklist"],
  properties: {
    dramaticBeat: { type: "string" },
    shotBrief: { type: "string" },
    startPose: { type: "string" },
    videoPrompt: { type: "string" },
    voiceDirection: { type: "string" },
    continuityChecklist: { type: "array", items: { type: "string" }, minItems: 6, maxItems: 12 },
  },
};

function fallback(input: Record<string, string>) {
  const camera = input.bible || "Preserve the approved camera, lighting, characters and environment.";
  return {
    dramaticBeat: `Make the audience understand the dramatic purpose of “${input.title || "this scene"}” before any spectacle. Preserve uncertainty, readable motivation and emotional cause-and-effect.`,
    shotBrief: `Design one stable, readable composition for this beat: ${input.story}. Use foreground, mid-ground and background separation to clarify character relationships. Do not add visual business that competes with the dialogue or breaks the established geography.`,
    startPose: `LANDSCAPE 16:9 — CREATE A NEW CINEMATIC START POSE. STORY MOMENT: ${input.story} DIALOGUE / ACTION: ${input.dialogue || "No dialogue specified."} PRODUCTION LOCK: ${camera} Begin before the action: every mouth closed, weight naturally distributed, hands in their continuity positions, and all props physically supported. Preserve approved face identities, costumes, scale, background geography, lighting direction, perspective and material behavior. No redesign, no distorted anatomy, no duplicated people or props, no text or watermark.`,
    videoPrompt: `Continue from the exact approved start frame. Hold for 0.4 seconds, then perform only the action required by this scene: ${input.dialogue || input.story}. Complete physical repositioning before speech begins. Keep the camera and framing locked unless movement is explicitly specified. Only the designated speaker may move their mouth; every other character remains silent. Preserve character identity, costume, scale, background, lighting, props and depth of field throughout. No morphing, extra gestures, camera drift or unmotivated walking.`,
    voiceDirection: `Use only the designated speaker in: ${input.dialogue || "the approved dialogue"}. Match age, social role, emotional restraint and dramatic intention. Preserve natural breath and conversational timing. All non-speaking characters keep mouths fully closed; do not add narration, crowd dialogue, subtitles or music.`,
    continuityChecklist: ["Approved camera code, framing and lens remain unchanged", "Lighting direction and tonal identity match the previous scene", "Every character retains approved face, age, costume and scale", "Start pose occurs before the principal action", "Body turn, gesture and speech happen in the specified order", "Only the designated speaker moves their mouth", "Background geography and crowd placement remain stable", "Props obey gravity, tension, attachment and contact logic", "No new characters, duplicated elements or anatomy errors", "End pose creates a usable continuity handoff to the next scene"],
    engine: "Continuity rules fallback",
  };
}

function outputText(data: any) {
  for (const item of data?.output || []) for (const content of item?.content || []) if (content?.type === "output_text") return content.text;
  return "";
}

export async function POST(request: NextRequest) {
  const input = await request.json() as Record<string, string>;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json(fallback(input));

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.6",
        reasoning: { effort: "medium" },
        input: [
          { role: "system", content: [{ type: "input_text", text: "You are a senior AI-film continuity director. Convert scene intent into concise, production-ready instructions. Fantasy may affect lighting and atmosphere, but anatomy, materials, physics, perspective and action order must remain realistic. Never invent missing identities or redesign established assets." }] },
          { role: "user", content: [{ type: "input_text", text: JSON.stringify(input) }] },
        ],
        text: { format: { type: "json_schema", name: "production_pack", strict: true, schema } },
      }),
    });
    if (!response.ok) return NextResponse.json(fallback(input));
    const parsed = JSON.parse(outputText(await response.json()));
    return NextResponse.json({ ...parsed, engine: "GPT-5.6 live" });
  } catch {
    return NextResponse.json(fallback(input));
  }
}
