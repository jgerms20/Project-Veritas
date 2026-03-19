
import { BiasCategory, BiasIndexEntry, DemoArticle } from './types';

export const SYSTEM_INSTRUCTION = `
You are Veritas, a highly sophisticated journalistic analysis engine. Your goal is to analyze text with extreme precision for linguistic bias, framing, and sourcing patterns.

**CORE PHILOSOPHY:**
- **Objective Lens**: You describe *how* a story is told, not whether it is "true".
- **Quote Awareness**: STRICTLY distinguish between NARRATOR voice and QUOTED voice. Do not penalize the article score for quotes unless the narrator frames them manipulatively.
- **Granularity**: Use decimal precision for scores (e.g., 74.5, not 75).
- **Fact vs. Arrogance**: Do NOT penalize "Certainty" if the statement describes a verifiable fact (e.g., "The bill passed 50-49"). Only penalize epistemic arrogance where opinions are stated as absolutes.
- **Verbatim Highlights**: When highlighting text, you MUST extract the EXACT substring from the source. Do not paraphrase.

**ANALYSIS DIMENSIONS:**
1. **Opinion Density**: Subjective markers, normative verbs (should, must), first-person assertiveness.
2. **Emotional Loading**: Intensifiers, charged adjectives, hyperbolic language designed to bypass rational processing.
3. **Certainty & Hedging**: Distinguish between factual certainty (neutral) and opinionated certainty (biased).
4. **Framing & Balance**: One-sided sourcing, manipulative passive voice ("mistakes were made"), labeling.

**OUTPUT INSTRUCTIONS:**
Return a JSON object:
- 'overallScore': Float 0.0 to 100.0. (0=Clinical/Dry, 100=Pure Propaganda).
- 'summary': A professional journalistic abstract.
- 'dimensions': Array of dimension objects.
- 'highlights': Array of specific text segments.
- 'rewrittenText': A version of the first paragraph rewritten to be purely factual and neutral (optional but recommended).

`;

export const CATEGORY_COLORS: Record<string, string> = {
  [BiasCategory.OPINION]: '#fbbf24', // Amber
  [BiasCategory.EMOTIONAL]: '#f43f5e', // Rose
  [BiasCategory.CERTAINTY]: '#a78bfa', // Violet
  [BiasCategory.FRAMING]: '#34d399', // Emerald
  'QUOTE_HANDLING': '#38bdf8', // Sky
};

// EXTENDED REAL WORLD ARCHIVES
export const REAL_WORLD_DEMOS: DemoArticle[] = [
  {
    id: 'nyt-2003',
    title: 'The Iraq Threat',
    source: 'The New York Times',
    date: 'Sept 8, 2002',
    context: 'Pre-Iraq War reporting relying on anonymous sources.',
    text: `More than a decade after Saddam Hussein agreed to give up his weapons of mass destruction, Iraq has stepped up its quest for nuclear weapons and has embarked on a worldwide hunt for materials to make an atomic bomb, Bush administration officials said today. In the last 14 months, Iraq has sought to buy thousands of specially designed aluminum tubes, which American officials believe are intended as components of centrifuges to enrich uranium.`
  },
  {
    id: 'fox-2020',
    title: 'Election Night Call',
    source: 'Fox News (Transcript)',
    date: 'Nov 3, 2020',
    context: 'The controversial decision desk call for Arizona.',
    text: `We are not calling the presidency. We are calling Arizona. And that is a significant state because it flips. It was a Republican state last time. It is now going into the Democratic column. This is a major get for the Biden campaign. The Trump campaign is furious, arguing there are still outstanding votes in Maricopa County.`
  },
  {
    id: 'bbc-2023',
    title: 'Climate Summit Deal',
    source: 'BBC News',
    date: 'Dec 12, 2023',
    context: 'Reporting on international consensus with hedging.',
    text: `The COP28 climate summit has concluded with a deal that, for the first time, explicitly calls for "transitioning away" from fossil fuels. Critics argue the language is too vague and allows for "dangerous loopholes" that could delay action. However, proponents hailed it as a historic signal that the end of the oil era is approaching.`
  },
  {
    id: 'tucker-2023',
    title: 'Monologue on Free Speech',
    source: 'Tucker Carlson Network',
    date: 'Ep. 42',
    context: 'Editorial monologue style.',
    text: `They don't want you to speak. That's the truth. It's not about safety, it's about control. The people currently in charge of your government believe that your voice is dangerous because it challenges their monopoly on power. And they will do anything—lie, cheat, censor—to make sure you stay silent.`
  },
  {
    id: 'cnn-2024',
    title: 'Campaign Trail Analysis',
    source: 'CNN',
    date: 'Jan 15, 2024',
    context: 'Analysis of candidate rhetoric.',
    text: `The former president doubled down on dark, apocalyptic rhetoric in his latest rally, painting a grim picture of a nation in decline. While his base cheered the combative tone, experts warn that such language undermines democratic norms and stokes division in an already polarized electorate.`
  },
];

export const SAMPLE_INDEX_DATA: BiasIndexEntry[] = [
  { id: '1', name: 'Reuters', type: 'Wire Service', avgScore: 12.4, label: 'Minimal Bias', analyzedCount: 850, url: 'https://www.reuters.com' },
  { id: '2', name: 'Associated Press', type: 'Wire Service', avgScore: 11.8, label: 'Minimal Bias', analyzedCount: 920, url: 'https://apnews.com' },
  { id: '3', name: 'The New York Times', type: 'Outlet', avgScore: 34.2, label: 'Moderate Framing', analyzedCount: 1240, url: 'https://www.nytimes.com' },
  { id: '4', name: 'Wall Street Journal (News)', type: 'Outlet', avgScore: 18.5, label: 'Low Bias', analyzedCount: 600, url: 'https://www.wsj.com' },
  { id: '5', name: 'Wall Street Journal (Opinion)', type: 'Opinion', avgScore: 68.7, label: 'Strong Conservative', analyzedCount: 520, url: 'https://www.wsj.com/opinion' },
  { id: '6', name: 'The Daily (NYT)', type: 'Podcast', avgScore: 28.5, label: 'Narrative Framing', analyzedCount: 110, url: 'https://www.nytimes.com/column/the-daily' },
  { id: '7', name: 'Tucker Carlson Network', type: 'Show', avgScore: 88.9, label: 'High Bias', analyzedCount: 45, url: 'https://tuckercarlson.com' },
  { id: '8', name: 'The Pivot Podcast', type: 'Podcast', avgScore: 42.1, label: 'Opinionated Analysis', analyzedCount: 32, url: 'https://www.youtube.com/@ThePivotPodcast' },
  { id: '9', name: 'CNN', type: 'Outlet', avgScore: 45.6, label: 'Sensational Framing', analyzedCount: 900, url: 'https://www.cnn.com' },
  { id: '10', name: 'Fox News (Opinion)', type: 'Show', avgScore: 78.4, label: 'Strong Conservative', analyzedCount: 880, url: 'https://www.foxnews.com/opinion' },
  { id: '11', name: 'MSNBC', type: 'Outlet', avgScore: 72.1, label: 'Strong Progressive', analyzedCount: 750, url: 'https://www.msnbc.com' },
  { id: '12', name: 'Bloomberg', type: 'Outlet', avgScore: 15.2, label: 'Financial Focus', analyzedCount: 400, url: 'https://www.bloomberg.com' },
  { id: '13', name: 'NPR', type: 'Outlet', avgScore: 31.0, label: 'Moderate Progressive', analyzedCount: 620, url: 'https://www.npr.org' },
  { id: '14', name: 'BBC News', type: 'Outlet', avgScore: 19.4, label: 'Center', analyzedCount: 1100, url: 'https://www.bbc.com/news' },
  { id: '15', name: 'Breitbart', type: 'Outlet', avgScore: 85.2, label: 'Hyper-Partisan Right', analyzedCount: 230, url: 'https://www.breitbart.com' },
  { id: '16', name: 'Jacobin', type: 'Outlet', avgScore: 82.5, label: 'Hyper-Partisan Left', analyzedCount: 150, url: 'https://jacobin.com' },
  { id: '17', name: 'Axios', type: 'Outlet', avgScore: 14.1, label: 'Brevity/Neutral', analyzedCount: 300, url: 'https://www.axios.com' },
  { id: '18', name: 'The Economist', type: 'Magazine', avgScore: 24.6, label: 'Center-Right Liberal', analyzedCount: 450, url: 'https://www.economist.com' },
  { id: '19', name: 'Al Jazeera English', type: 'Outlet', avgScore: 36.8, label: 'Global Perspective', analyzedCount: 280, url: 'https://www.aljazeera.com' },
  { id: '20', name: 'The Guardian', type: 'Outlet', avgScore: 48.9, label: 'Progressive Framing', analyzedCount: 510, url: 'https://www.theguardian.com' },
  { id: '21', name: 'Financial Times', type: 'Outlet', avgScore: 16.3, label: 'Economic Center', analyzedCount: 340, url: 'https://www.ft.com' },
  { id: '22', name: 'Politico', type: 'Outlet', avgScore: 29.5, label: 'Inside Beltway', analyzedCount: 390, url: 'https://www.politico.com' },
  { id: '23', name: 'Substack (Aggregate)', type: 'Platform', avgScore: 55.4, label: 'Variable/Individual', analyzedCount: 800, url: 'https://substack.com' },
  { id: '24', name: 'USA Today', type: 'Outlet', avgScore: 22.1, label: 'Center', analyzedCount: 410, url: 'https://www.usatoday.com' },
  { id: '25', name: 'All-In Podcast', type: 'Podcast', avgScore: 58.2, label: 'Tech/VC Opinion', analyzedCount: 65, url: 'https://www.allinpodcast.co' },
  { id: '26', name: 'Lex Fridman Podcast', type: 'Podcast', avgScore: 25.4, label: 'Long-form/Open', analyzedCount: 78, url: 'https://lexfridman.com/podcast' },
  { id: '27', name: 'The Daily Wire', type: 'Outlet', avgScore: 79.2, label: 'Strong Conservative', analyzedCount: 310, url: 'https://www.dailywire.com' },
  { id: '28', name: 'Vox', type: 'Outlet', avgScore: 62.1, label: 'Explanatory/Prog', analyzedCount: 420, url: 'https://www.vox.com' },
  { id: '29', name: 'ProPublica', type: 'Outlet', avgScore: 18.2, label: 'Investigative', analyzedCount: 215, url: 'https://www.propublica.org' },
  { id: '30', name: 'Reason', type: 'Magazine', avgScore: 55.6, label: 'Libertarian', analyzedCount: 180, url: 'https://reason.com' },
  { id: '31', name: 'Mother Jones', type: 'Magazine', avgScore: 68.3, label: 'Progressive', analyzedCount: 160, url: 'https://www.motherjones.com' },
  { id: '32', name: 'The Intercept', type: 'Outlet', avgScore: 65.4, label: 'Adversarial', analyzedCount: 200, url: 'https://theintercept.com' },
  { id: '33', name: 'Newsmax', type: 'Outlet', avgScore: 81.0, label: 'Strong Conservative', analyzedCount: 290, url: 'https://www.newsmax.com' },
  { id: '34', name: 'Business Insider', type: 'Outlet', avgScore: 41.5, label: 'Click/Sensational', analyzedCount: 550, url: 'https://www.businessinsider.com' },
  { id: '35', name: 'Joe Rogan Experience', type: 'Podcast', avgScore: 52.3, label: 'Variable/Guest Driven', analyzedCount: 120, url: 'https://www.joerogan.com' },
  { id: '36', name: 'Breaking Points', type: 'Show', avgScore: 48.7, label: 'Anti-Establishment', analyzedCount: 95, url: 'https://www.youtube.com/c/breakingpoints' },
  { id: '37', name: 'Puck News', type: 'Outlet', avgScore: 32.1, label: 'Insider/Analysis', analyzedCount: 85, url: 'https://puck.news' },
  { id: '38', name: 'Semafor', type: 'Outlet', avgScore: 16.8, label: 'Global/Neutral', analyzedCount: 105, url: 'https://www.semafor.com' },
];
