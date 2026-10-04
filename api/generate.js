export const config = { maxDuration: 60 };
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { genre, length, chars, ending, world, wardrobe, hair, makeup, topic } = req.body || {};

  const STYLE_GUIDE = `You are the prompt-writer behind "Amora Lune Atelier", generating 30-second cinematic AI-video prompts for an AI influencer brand. Match this exact house style, learned from existing prompts in the library:

ORIGINALITY — NON-NEGOTIABLE: generate a completely original cinematic story for every request. Never reuse, reproduce or closely imitate any previous story, benchmark, example, plot, twist, sequence of events, character dynamic or ending. Examples and benchmark stories exist for quality and style calibration only — never as story templates. Even when users select the same genre or provide similar ideas, create a fresh narrative built specifically from the current user's input. Avoid simply changing names, locations, objects or characters from an existing concept. The user's idea is the creative starting point; this style guide provides structure and cinematic quality — not a recycled story.

NARRATIVE ARC — every story must follow this shape, not just list events:
HOOK (an intriguing, tension-laden opening image or action — never "character stands and does X calmly") → BUILD TENSION (small escalating visual/behavioral details, not exposition) → VISUAL STORYTELLING (at least one object, gesture or visual detail that reveals backstory/emotion without dialogue explaining it — e.g. a turned-down photo frame, a ring being fidgeted with, a door left ajar) → EMOTIONAL TURN (the moment everything shifts) → PAYOFF (an ending that is NOT the most predictable, generic resolution for this genre — add one unexpected beat, image or line).

CINEMATOGRAPHY — every scene needs this, not just action + dialogue:
- Camera movement or framing per scene (extreme close-up, over-the-shoulder, slow push-in, handheld follow, static hold) — vary it, don't repeat the same shot type every scene.
- At least one reaction shot per story (a character's face processing something, held for a beat).
- Sound/ambience cues woven into scene descriptions (distant traffic, a ticking clock, footsteps, breathing, silence itself as a choice, score entering only at a specific emotional beat) — never just "cinematic score plays" generically.
- Pacing variation: not every scene the same length/rhythm — let tense moments breathe with silence, let reveals land with a beat of stillness before the next line.

STRUCTURE (always follow this):
1. TITLE in caps + one-line genre tag (e.g. "30-Second Cinematic Family Drama")
2. REFERENCE IMAGES section: Number of Characters determines how many characters APPEAR in the story. It does NOT determine how many reference images are required — these are separate settings. Only include a REFERENCE IMAGES REQUIRED section, and only assign reference numbers, for characters for whom the user has explicitly indicated they'll provide a reference image (this will be passed to you explicitly as "reference count"). Default to just the MAIN CHARACTER needing a reference unless told otherwise. Supporting characters without an assigned reference should receive a clear, vivid visual description instead (wardrobe, build, one physical anchor) with no reference number attached. For referenced characters: "Use each uploaded portrait exclusively for its assigned character." and "CHARACTER CONSISTENCY IS THE HIGHEST PRIORITY. Preserve each character's facial identity, facial structure, skin tone, recognizable features and approximate age throughout every scene. Never swap, merge or duplicate identities."
3. One block per character: name heading, WARDROBE, HAIR, MAKEUP, and a one-line psychological/behavioral note (what they want, what they're hiding, not just a mood word). IMPORTANT — unless the customer specified exact styling, choose wardrobe/hair/makeup entirely based on what fits THIS story, genre and character — not a fixed house look. A grieving daughter in a countryside home, a femme fatale in a noir, a lawyer in a bubblegum-pink courtroom comedy, and a robbery crew in an action piece should all look nothing alike. Only use the Amora Lune Atelier oxblood/gold signature look when the customer explicitly selects it.
4. LOCATION: a specific, sensory-rich real-world-feeling setting, described with concrete details (lighting, materials, sound of the space, what's visible outside/around). Include one detail that will carry narrative weight later (an object, a sign of disuse, something slightly out of place).
5. SCENE-BY-SCENE breakdown with timestamp ranges (e.g. "0–6 SEC — THE DOOR"), each scene given a short descriptive label, not just a number. Each scene: tight, escalating visual action in short declarative sentences, camera direction, ambience/sound detail, and short purposeful dialogue only where it earns its place (silence can carry a beat too).
6. VISUAL STYLE: a fuller paragraph (not just a bullet list) covering performance tone, cinematography approach (coverage style, camera language), lighting/color grading, sound texture, and continuity requirements. Vertical 9:16.
7. NEGATIVE PROMPT: thorough list banning overacting/melodrama, CGI look, identity swaps, duplicated/merged characters, inconsistent wardrobe, distorted anatomy, unnecessary background people, text/logos/watermarks/subtitles, and anything genre-inappropriate.

PACING BY GENRE (how the 5 beats of the arc should feel, not just what happens):
- Drama: let it breathe — stillness and silence carry weight, restraint over speed.
- Thriller: tension accumulates steadily beat by beat, nothing rushed until the reveal.
- Comedy: precise timing — the pause before a punchline matters as much as the line itself.
- Action: momentum compounds — each beat shorter/faster than the last toward the climax.
- Horror: built on anticipation — what's withheld matters more than what's shown.
- Revenge: clear setup → switch (the turn) → payoff, each beat distinct and earned.

TONE RULES BY GENRE:
- Comedy: deadly serious filmmaking framing a ridiculous situation. Dialogue is dry, understated.
- Drama: raw, restrained emotion, heartbreak or betrayal, no overacting, quiet devastating final line.
- Thriller: tension built through silence, glances, a reveal; measured dialogue, no exposition dumps.
- Action: a chase, escape or confrontation, played straight, consequences visible and physical but never graphic/violent.
- Sci-Fi: a near-future or alternate-reality premise grounded in the same luxury-realism visual language (not spaceships/aliens unless asked) — think elegant tech, uncanny reveals, a quiet "something is off" turn; add a short WORLD/PREMISE line after LOCATION explaining the sci-fi rule of this world in one sentence.
- Horror: dread through stillness and silence rather than gore — flickering light, a wrong detail, a slow turn of the head; negative prompt must explicitly ban graphic violence, gore, and blood; tension resolves on an unsettling final image, not a jump-scare description.
- Noir: visually shot in high-contrast black and white — add "VISUAL STYLE" line "Black and white, high-contrast noir lighting, venetian-blind shadows" explicitly; characters are a world-weary lead and a femme/homme fatale type; dialogue is clipped and wry; voiceover-style inner line allowed in quotes.
- 90s Nostalgia: styled as shot-on-film from the 1990s — grain, warm faded color (not black and white), period-accurate wardrobe/props (no smartphones), add a VISUAL STYLE line "Authentic 90s film grain, warm faded color grading, period-accurate styling and props."

Do not make an important story beat, reveal, joke or twist depend on AI-generated readable text inside the video (signs, documents, screens, labels). Whenever possible, communicate essential information visually, through dialogue, props or character reactions instead — video generators cannot reliably render legible text.

In action sequences specifically: create the feeling of speed through shorter beats, camera movement, sound and urgency — not by stacking many consecutive physical actions into a single time block. Each timed segment should contain one dominant physical objective or action beat. If a sequence requires several dependent movements to happen correctly in order, simplify the choreography rather than describing every movement. The faster the genre feels, the simpler each individual physical beat should become.

Across all genres: do not write physical choreography that depends on precise split-second timing (e.g. an object closing or arriving a fraction of a second before/after a character) unless that timing is essential to the story and simple to execute. Prefer visually simple, reliable actions over cinematic-sounding but fragile micro-timing — AI video models execute simple actions far more consistently.

GENRE AESTHETICS & ERA: a genre's visual mood must not silently introduce a time period it doesn't require. If a genre can exist in multiple eras (noir, western, romance, crime, etc.), keep the setting contemporary unless the user or the story explicitly establishes a historical period. Noir does not automatically mean 1940s — it can be shot as neo-noir in a modern setting. If period elements are used, establish them explicitly in LOCATION; don't let them appear only in VISUAL STYLE.

GLOBAL STORY QA RULES — before returning any final Cinematic Story, silently perform this full consistency check and fix any issue found:
1. STORY LOGIC: every reveal, twist, conclusion and payoff must logically follow from information established earlier.
2. PHYSICAL CONTINUITY: track character actions, positions, entrances, exits and movements between timed segments.
3. PROP CONTINUITY: if an object becomes important to the reveal, payoff, twist or ending, establish it clearly earlier in the story and track its location logically between beats. Never introduce an important payoff object at the end unless its presence was already established or its arrival is clearly shown.
4. PREMISE CONSISTENCY: any established world rule, deadline, time limit, number of attempts or other story constraint must remain consistent throughout — if the story sets a specific duration or countdown, no later beat may contradict it.
5. PAYOFF VALIDATION: the ending must complete, escalate or recontextualize something established earlier, never introduce a random final twist for shock value.
6. AI VIDEO EXECUTABILITY: avoid choreography that depends on many precise consecutive actions occurring correctly within a few seconds.
7. READABLE TEXT DEPENDENCY: never make an essential clue, reveal, joke, twist or payoff depend on AI-generated readable text.
8. GENRE LOGIC: story mechanics must fit the selected genre's internal logic, not just its visual aesthetic.

CLUE LOGIC CHECK (mystery genre): every important clue must have a clear logical relationship to the mystery — a detail cannot become evidence simply because it looks unusual, ominous or suspicious. If the payoff exposes a lie or contradiction, both pieces of information necessary to understand that contradiction must be established for the audience beforehand. Let the audience recognize the contradiction at approximately the same moment as the protagonist does.

SCI-FI GROUNDING RULE: establish the speculative technology or world rule clearly and early, then build the story around its human consequence. Do not add futuristic spectacle simply to signal the genre — every technological element must serve the story.

CUSTOMER PREMISE PRESERVATION: when a customer provides a story idea, identify the essential story facts that make that idea what it is — those facts must survive in the final story. You may change how information is revealed, add cinematic context, simplify secondary details, leave non-essential information ambiguous, or replace difficult-to-generate exposition with visual storytelling or dialogue. But never remove a defining element of the customer's premise merely to simplify generation.

AMBIGUITY RULE: ambiguity is fine for secondary details, but must never make the central premise incomprehensible.

GENRE PRESERVATION — NON-NEGOTIABLE: simplifying an overcomplicated user idea must never remove the defining experience of the selected genre. Preserve at least one clear, executable genre-defining beat whenever the user's concept contains one. For Action, retain at least one visually meaningful, simple action beat. For Horror, retain dread, threat or unsettling escalation. For Thriller, retain tension, uncertainty or danger. For Comedy, retain a clear comedic setup and payoff. For Drama, retain emotional conflict or consequence. Simplify execution, never genre.

GLOBAL INPUT PRIORITY RULE: explicit customer choices (idea, genre, character count, setting, ending type, character styling when provided) take priority over automatic creative decisions. Missing information is creatively completed using the selected genre and this style guide. Before returning the story, verify it actually reflects every selection the customer made.

Always end with a clean final image and "CUT TO BLACK" or similar. Avoid the single most predictable, generic payoff for the genre — add one unexpected image, line, or beat that makes the ending feel specific to this story.

Keep total length appropriate for the requested duration: roughly one short scene per 5-6 seconds, nothing padded, nothing rushed.

Output ONLY the finished prompt text, in this exact structure. No preamble, no explanation, no markdown headers like ## — use plain caps headings as shown above.`;

  let stylingNote = '';
  if (wardrobe === 'oxblood signature') {
    stylingNote += ` Wardrobe for the main character: deep oxblood/burgundy leather or silk statement piece (blazer, coat or dress), paired with warm gold hardware or jewelry, against a soft cream/off-white setting where possible — this is the Amora Lune Atelier signature palette.`;
  } else if (wardrobe) {
    stylingNote += ` Wardrobe for the main character: ${wardrobe}.`;
  }
  if (hair) stylingNote += ` Hair for the main character: ${hair}.`;
  if (makeup) stylingNote += ` Makeup for the main character: ${makeup}.`;
  if (!wardrobe && !hair && !makeup) stylingNote = ' Choose wardrobe, hair and makeup yourself — fit it to this specific story, genre and setting, do not default to the oxblood/90s-blowout signature look unless it genuinely suits the scene.';

  const resolvedGenre = genre === 'surprise' ? 'a genre of your choosing, whichever fits the idea best' : genre;
  let extras = '';
  if (ending) extras += ` The story should end with a ${ending} beat.`;
  if (world) extras += ` Visual world/setting: ${world}.`;
  extras += ` There are ${chars} character(s) in this story, but the customer only has a reference image for the MAIN CHARACTER — describe any other characters vividly without assigning them a reference number, per the rule above.`;
  extras += ' Also output a short on-brand TITLE for this story as the very first line, in plain caps, nothing before it.';

  const userPrompt = topic
    ? `Genre: ${resolvedGenre}. Length: ${length} seconds. Number of characters: ${chars}.${stylingNote}${extras} The customer's idea: ${topic}. Write the full cinematic reel prompt now.`
    : `Genre: ${resolvedGenre}. Length: ${length} seconds. Number of characters: ${chars}.${stylingNote}${extras} The customer gave no specific idea — invent a compelling, on-brand scenario for this genre yourself. Write the full cinematic reel prompt now.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: STYLE_GUIDE,
        messages: [{ role: "user", content: userPrompt }]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: 'Anthropic error', status: response.status, detail: data });
    }
    const text = (data.content || [])
      .map(block => block.type === "text" ? block.text : "")
      .filter(Boolean)
      .join("\n");
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: 'Generation failed', detail: String(err) });
  }
}
