/**
 * All portfolio content lives here. To edit a project, change the text below;
 * to swap an image, change its `src` (a URL, or a file in /public such as
 * "/work/umgpt/cover.png" — when using /public paths, see the README note on
 * NEXT_PUBLIC_BASE_PATH).
 */

export type Img = { src: string; w: number; h: number; alt: string };

export type Block =
  | { type: "text"; heading?: string; paragraphs: string[]; tight?: boolean }
  | {
      type: "list";
      heading: string;
      items: { title: string; text?: string }[];
      numbered?: boolean;
    }
  | {
      type: "artworks";
      heading: string;
      items: { title: string; year: string; medium: string; size: string; note?: string; image?: Img }[];
    }
  | {
      type: "images";
      heading?: string;
      images: Img[];
      /** Cap the width of the whole group (px). */
      maxWidth?: number;
      /** Sit close under the block above (a few px apart instead of the full section gap). */
      tight?: boolean;
      /** Show the images without the rounded frame and hairline outline. */
      plain?: boolean;
      /** Let these images use more of the screen height (CSS length for the height cap). */
      fitH?: string;
    };

export type Project = {
  slug: string;
  /** Skip the big cover image at the top of the page (used when the works carry their own images). */
  hideCover?: boolean;
  /** Which page it lives on: the Projects scroll or the Studio page. */
  section: "projects" | "studio";
  title: string;
  /** Optional muted line under the title (disciplines). */
  subtitle?: string;
  /** Short name used on the home page and cards. */
  short: string;
  category: string;
  client: string;
  role: string;
  timeframe: string;
  year?: string;
  details?: { label: string; value: string }[];
  summary: string;
  /** Leave undefined to show a typographic placeholder until you add one. */
  cover?: Img;
  /** A different image for the top of the project page (the cover stays for the home page and grid). */
  hero?: Img;
  /** Max width (px) of the page-top hero image. Defaults to 760. */
  heroMax?: number;
  /** Hide the hairline outline on this page's images (corners stay rounded). */
  noOutline?: boolean;
  /** Show the hero at full width instead of shrinking it to fit the first screen. */
  heroFull?: boolean;
  /** Gap between page blocks: "large" is the roomier rhythm (96–192px) used by dmcg.co. */
  spacing?: "large";
  /** Slug of a related project, shown in the footer instead of the next project. */
  related?: string;
  /** Show the hero without the rounded frame and outline. */
  heroPlain?: boolean;
  /**
   * Further pages that open out next to the cover on hover (poster sets): the first is the cover's
   * partner, the rest sit tucked behind it.
   */
  spread?: Img[];
  /** A second picture that fades in over the cover on hover (same framing, so the object does not move). */
  hoverCover?: Img;
  /** Show the whole cover in grid cards instead of cropping it to 4:3. */
  containCover?: boolean;
  /** A short muted clip that plays over the cover on hover (same frame size as the cover). */
  video?: { webm: string; mp4: string };
  /** On hover the cover zooms into `main`, then `sides` slide out next to it (Infinite Machine style). */
  /** A four-panel brochure that folds up on hover. front = A,B,C,D left to right; back = the reverse side as seen from behind (left to right). */
  fold?: { front: Img[]; back: Img[] };
  /** On hover the poster's edges lift as if a breeze were blowing from the side (square corners). */
  wind?: boolean;
  reveal?: { main: Img; sides: [Img, Img]; onCover: [[number, number], [number, number], [number, number], [number, number]] };
  /** A Figma prototype shown inside an iPhone frame instead of a cover image. */
  phone?: { src: string; words?: string[] };
  blocks: Block[];
};

// Images are currently served from your Framer site. For long-term safety,
// download them into /public and point `src` there (see README).
const fr = (id: string, ext: "png" | "jpg", w: number, h: number, alt: string): Img => ({
  src: `https://framerusercontent.com/images/${id}.${ext}?scale-down-to=2048&width=${w}&height=${h}`,
  w,
  h,
  alt,
});

// MBGNA poster pages, exported from the PDF into /public/projects/mbgna.
const poster = (n: number, alt: string): Img => ({
  src: `/projects/mbgna/page-${n}.jpg`,
  w: 1100,
  h: 1634,
  alt,
});

const all: Project[] = [
  {
    slug: "mbgna-posters",
    section: "projects",
    title: "MBGNA Poster Series",
    subtitle: "Visual Identity · Print Design · Art Direction",
    short: "MBGNA Posters",
    category: "Graphic Design",
    client: "Matthaei Botanical Gardens and Nichols Arboretum (MBGNA)",
    role: "",
    timeframe: "",
    year: "2026",
    details: [
      { label: "Year", value: "2026" },
      { label: "Role", value: "Graphic Design, Art Direction" },
      { label: "Deliverables", value: "Six-poster series · 24 × 36 in." },
    ],
    summary:
      "A six-poster series that reframes a botanical garden network as a living museum you take part in, not just look at.",
    cover: poster(1, "Matthaei Botanical Gardens and Nichols Arboretum poster"),
    hero: { src: "/projects/mbgna/series.jpg", w: 2138, h: 2063, alt: "All six MBGNA posters in a grid" },
    heroPlain: true,
    noOutline: true,
    heroMax: 942,
    heroFull: true,
    spacing: "large",
    related: "article-poster",
    spread: [
      poster(2, "2026 Events poster"),
      poster(3, "Peony Garden poster"),
      poster(4, "Bonsai Garden poster"),
      poster(5, "Campus Farm poster"),
      poster(6, "Beaver Family poster"),
    ],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Matthaei Botanical Gardens and Nichols Arboretum (MBGNA) is a University of Michigan institution encompassing five distinct sites across 841 acres in Ann Arbor: Matthaei Botanical Gardens, Nichols Arboretum, Campus Farm, Mud Lake Bog, and Horner-McLaughlin Woods.",
          "Working with MBGNA’s Director, Anthony Kolenic, and Interpretation and Communications Specialist, Katie Seguin, this project explored how the institution could be represented beyond its familiar association with gardens and scenic landscapes. A central idea emerged from our conversations: MBGNA is not simply a place to experience nature, but a living museum shaped by the relationships between people, plants, and place.",
          "The six-poster series translates this perspective into a visual language that positions human presence as integral to the landscape. Rather than depicting nature as something to observe from a distance, the work highlights the ways people inhabit, experience, and contribute to these spaces. The series includes an institutional overview, a poster for events and seasonal programming, and four posters focused on the Peony Garden, Farm Stand, Bonsai Garden, and Beaver Habitat, each representative of the four seasons.",
        ],
      },
      {
        type: "images",
        fitH: "4000px",
        images: [{ src: "/projects/mbgna/photo-4159.jpg", w: 1500, h: 2000, alt: "A child photographing camellias at the Arboretum" }, { src: "/projects/mbgna/photo-4158.jpg", w: 1500, h: 2000, alt: "A camellia in bloom" }],
      },
      {
        type: "images",
        fitH: "4000px",
        plain: true,
        tight: true,
        images: [{ src: "/projects/mbgna/detail-peony.jpg", w: 2000, h: 1485, alt: "Close-up of the Peony Garden poster's linework and typography" }],
      },
      {
        type: "text",
        paragraphs: [
          "Inspired by Japanese graphic design, the visual direction balances simplicity, negative space, and functional clarity with organic forms and expressive linework.",
          "Hand-drawn elements reference natural growth and ecological systems, while structured layouts and typography provide consistency across the series. Layered shapes and transparency suggest the relationships between people, plants, species, and time. A seasonal colour palette gives each poster its own character while establishing a visual rhythm across the collection.",
        ],
      },
      {
        type: "images",
        fitH: "4000px",
        images: [{ src: "/projects/mbgna/photo-4167.jpg", w: 2000, h: 1500, alt: "Visitors resting beside the Bonsai Garden pond" }],
      },
      {
        type: "text",
        paragraphs: [
          "The six posters explore MBGNA at different scales - from its broader institutional identity and seasonal programming to individual spaces and programs, including the Peony Garden, Farm Stand, Bonsai Garden, and Beaver Habitat.",
        ],
      },
      {
        type: "images",
        fitH: "4000px",
        images: [{ src: "/projects/mbgna/photo-4183.jpg", w: 2000, h: 1500, alt: "Visitors in the desert house" }, { src: "/projects/mbgna/photo-4133.jpg", w: 2000, h: 1500, alt: "Visitors walking through the Conservatory" }],
      },
      {
        type: "text",
        paragraphs: [
          "By placing people alongside plants and landscapes, the series challenges the idea of botanical spaces as purely scenic environments. Instead, it presents MBGNA as a shared cultural and ecological space shaped by everyday experiences, stewardship, and connection.",
        ],
      },
      {
        type: "images",
        fitH: "4000px",
        images: [{ src: "/projects/mbgna/hero.jpg", w: 1716, h: 1696, alt: "MBGNA events poster on a wall as a person walks past" }],
      },
      {
        type: "images",
        fitH: "4000px",
        images: [{ src: "/projects/mbgna/mockup-3.jpg", w: 1612, h: 1096, alt: "MBGNA posters displayed outdoors" }],
      },
    ],
  },
  {
    slug: "soundscape",
    section: "projects",
    title: "SoundScape",
    subtitle: "UX Design · Mobile App · Music Discovery",
    short: "SoundScape",
    category: "UX Design",
    client: "Personal project",
    role: "",
    timeframe: "",
    year: "2026",
    details: [
      { label: "Year", value: "2026" },
      { label: "Role", value: "UX Designer" },
      { label: "Timeframe", value: "March – April 2026" },
    ],
    summary:
      "A music app that turns physical location into a living playlist, blending your taste with what people nearby are listening to.",
    cover: { src: "/projects/soundscape/cover.png", w: 680, h: 1000, alt: "SoundScape app, globe screen in an iPhone" },
    containCover: true,
    hero: { src: "/projects/soundscape/hero.jpg", w: 1920, h: 1080, alt: "SoundScape app screens: globe, trending map, now playing and library" },
    noOutline: true,
    heroMax: 942,
    heroFull: true,
    spacing: "large",
    video: { webm: "/projects/soundscape/hover.webm", mp4: "/projects/soundscape/hover.mp4" },
    blocks: [
      {
        type: "text",
        paragraphs: [
          "SoundScape is a location-aware music discovery platform that connects personal listening habits with the musical identity of places. It allows users to explore what people nearby are listening to, discover music while travelling, and uncover the sounds that define different cities, regions, and cultures.",
          "While traditional streaming platforms such as Spotify and Apple Music focus primarily on personal listening history and algorithmic recommendations, SoundScape introduces a geographic dimension to music discovery. By drawing on anonymised, opt-in listening activity, the platform makes local music trends part of the listening experience.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Music discovery is largely disconnected from place. Existing streaming platforms are built around individual preferences and global recommendations, offering limited insight into the music being listened to in a particular neighbourhood or city.",
          "SoundScape explores a different approach: using location as a starting point for discovery. Rather than simply recommending what a user might like next, it invites them to explore questions such as “What are people around me listening to?” and “What defines the sound of this city?”",
          "The goal is to make discovering music feel more connected to the places people visit and the communities around them.",
        ],
      },
      {
        type: "images",
        images: [{ src: "/projects/soundscape/shot-1.jpg", w: 2212, h: 1080, alt: "Interactive globe home screen in light and dark" }],
      },
      {
        type: "text",
        paragraphs: [
          "The interactive globe forms the centre of the experience, making geography the primary way users discover music. Country-level markers reveal listening trends across different regions, turning the home screen into an entry point for exploring music around the world.",
        ],
      },
      {
        type: "images",
        images: [{ src: "/projects/soundscape/shot-2.jpg", w: 2212, h: 1080, alt: "Country, city and street-level views" }],
      },
      {
        type: "text",
        paragraphs: [
          "A three-level navigation system takes users from country to city to street level. This progressive zoom preserves geographic context while allowing users to move from broad regional trends to more local listening activity.",
        ],
      },
      {
        type: "images",
        images: [{ src: "/projects/soundscape/shot-3.jpg", w: 2212, h: 1080, alt: "The two explore modes in light and dark" }],
      },
      {
        type: "text",
        paragraphs: [
          "SoundScape offers two complementary approaches to discovery. One surfaces recommendations in relation to the music a user is already playing, creating a more passive and continuous listening experience. The other encourages active exploration, allowing users to browse music by country, language, or origin.",
          "Together, these modes balance personal discovery with the opportunity to encounter music beyond familiar listening habits.",
        ],
      },
      {
        type: "images",
        images: [{ src: "/projects/soundscape/shot-4.jpg", w: 2212, h: 1080, alt: "Map pin interaction and playback screen" }],
      },
      {
        type: "text",
        paragraphs: [
          "Location markers act as more than points of information. Selecting a pin reveals the music associated with that place and provides a direct path into listening through Spotify playback integration. This connects the act of discovering a local trend with experiencing the music itself.",
        ],
      },
      {
        type: "images",
        images: [{ src: "/projects/soundscape/shot-5.jpg", w: 2212, h: 1080, alt: "Navigation, library and profile screens" }],
      },
      {
        type: "text",
        paragraphs: [
          "Although the concept introduces a different way to discover music, the interface builds on familiar interaction patterns. A bottom navigation bar and library structure draw on established music-streaming conventions, while profile and map interactions take cues from widely used social and mapping platforms.",
          "These familiar patterns help make the experience approachable, allowing the geographic discovery concept to remain the focus.",
        ],
      },
    ],
  },
  {
    slug: "umgpt",
    section: "projects",
    title: "U-M GPT: An AI-powered conversational assistant for the University of Michigan",
    short: "U-M GPT",
    category: "UX Design",
    client: "UMSI IT Services",
    role: "UX Designer",
    timeframe: "August – December 2025",
    year: "2025",
    summary:
      "A semester-long redesign of the University of Michigan’s generative AI platform, focused on usability, accessibility, and visual coherence.",
    cover: { src: "/projects/umgpt/cover.png", w: 1412, h: 1026, alt: "U-M GPT home page, tilted" },
    containCover: true,
    reveal: {
      // Where the main page's corners (TL, TR, BR, BL) sit on the tilted cover, in the cover's own pixels.
      onCover: [[272.0, 209.1], [786.0, 64.2], [927.2, 376.0], [411.4, 521.4]],
      main: { src: "/projects/umgpt/page-2.jpg", w: 1610, h: 988, alt: "U-M GPT home page" },
      sides: [
        { src: "/projects/umgpt/page-1.jpg", w: 1640, h: 1186, alt: "U-M GPT landing page" },
        { src: "/projects/umgpt/page-3.jpg", w: 1450, h: 1052, alt: "U-M GPT folders" },
      ],
    },
    blocks: [
      {
        type: "text",
        heading: "Overview",
        paragraphs: [
          "U-M GPT is the University of Michigan’s generative AI platform for students, faculty, and researchers. As a semester-long project, I explored ways to improve its usability and visual appeal to encourage adoption.",
        ],
      },
      {
        type: "list",
        heading: "Problems with the previous version",
        items: [
          {
            title: "Cluttered layout & visual incoherence",
            text: "The layout lacked a clear hierarchy, and extreme color contrast and inconsistent spacing made it feel less modern and professional.",
          },
          { title: "Lack of customisable visual options and accessibility features" },
          { title: "Poor navigation and conversation management tools" },
        ],
      },
      {
        type: "text",
        heading: "Challenge",
        paragraphs: [
          "How can the U-M GPT interface be redesigned to be visually coherent, accessible, and user-friendly, with efficient navigation and personalization for all users?",
        ],
      },
      {
        type: "text",
        heading: "My role",
        paragraphs: [
          "Analyzing the core usability and visual problems, defining the redesign vision, ideating through sketching, building task flows, and producing high-fidelity desktop and mobile wireframes with design rationale.",
        ],
      },
      {
        type: "list",
        heading: "Process",
        numbered: true,
        items: [
          { title: "Problem identification" },
          { title: "Ideation & sketching" },
          { title: "Task flow development" },
          { title: "Design direction & integration", text: "Prompt organisation was chosen as the foundation." },
          { title: "High-fidelity wireframes", text: "Desktop and mobile." },
        ],
      },
      {
        type: "list",
        heading: "Key design decisions",
        items: [
          {
            title: "Enhanced navigation with search",
            text: "Search helps users find conversations, prompts, and resources.",
          },
          {
            title: "Folder-based organisation",
            text: "Folders help users manage chats and prompts.",
          },
          {
            title: "Preview-based prompt identification",
            text: "Short previews help users pick the right conversation.",
          },
          {
            title: "Preview-based folder drop-downs",
            text: "Drop-downs with preview information improve access to chats and prompts.",
          },
          {
            title: "Empowering users with customisation",
            text: "Customisation gives users control over their experience.",
          },
          {
            title: "Flexible viewing modes",
            text: "List and grid modes let users choose what suits their workflow and device.",
          },
          {
            title: "Custom labels, cover images & color-coding",
            text: "Users can label, add cover images, and color-code their work, with sensible default modes.",
          },
        ],
      },
      {
        type: "list",
        heading: "Landing page decisions",
        items: [
          {
            title: "Content strategy",
            text: "Four tools are introduced at the top, each with a visual preview and detailed insights in the body, ending with a “Why GenAI” section.",
          },
          {
            title: "U-M GPT first",
            text: "Making it the first interactive element lets first-time users try the most familiar tool immediately.",
          },
          {
            title: "Quick launch",
            text: "A type bar in the hero lets returning users resume work fast.",
          },
          {
            title: "Clear hierarchy",
            text: "Intro, tools, details, and why-use sections, with side navigation for quick jumps between tools.",
          },
        ],
      },
      {
        type: "list",
        heading: "Outcome",
        items: [
          { title: "First-time users understand the tools are free, campus-provided, and open to all." },
          { title: "Users can compare features and intended audiences." },
          { title: "Returning users can quickly resume workflows through the hero input and navigation." },
          {
            title: "The page supports both scanning and deep reading.",
            text: "Each tool can open in a new tab for more information.",
          },
        ],
      },
      {
        type: "images",
        heading: "Selected visuals",
        images: [
          fr("2qgaPORF0QaxzPJHCNI24kdd0", "png", 1938, 922, "U-M GPT interface"),
          fr("1RNicZ4sPIJltVwufdbmvTXrbsY", "png", 1758, 1196, "U-M GPT design exploration 1"),
          fr("NpGNkDMXM78sJQXEdIk71Z7yZLY", "png", 1758, 1196, "U-M GPT design exploration 2"),
          fr("9aCRHAbH2pwnYpRKvtKKCCaB8", "png", 1758, 1196, "U-M GPT design exploration 3"),
          fr("a33h1rfM6brcUvJ0b4QKaozX3OI", "png", 1758, 1196, "U-M GPT design exploration 4"),
          fr("7rHsLbGCVHj9TNNEYxyk03K0I", "png", 3648, 1208, "U-M GPT wireframe 1"),
          fr("r05W8mXW2q7BknI3DWNfV7SQHY", "png", 3648, 1208, "U-M GPT wireframe 2"),
          fr("QPZvYdyBrxRB7nQxHkwU8lpMk", "png", 3648, 1208, "U-M GPT wireframe 3"),
          fr("ayVTUGXseVIYlz653jMD59pEX4", "png", 3648, 1208, "U-M GPT wireframe 4"),
          fr("5Dd5GlXoMWjmfVo7W2WQzAsYjE", "png", 3648, 1208, "U-M GPT wireframe 5"),
          fr("vCpk8tXyRZNsYuTbNhrxziII", "png", 3648, 1208, "U-M GPT wireframe 6"),
          fr("ONr2osHe2alVvOkU0WaIMU47KPY", "png", 1782, 564, "U-M GPT landing page 1"),
          fr("XnFgB44lsQO8QVtMdNYTBAOAU", "png", 1782, 564, "U-M GPT landing page 2"),
          fr("x4uksNvNXVIWJxMPg7LUXB6CQ", "png", 1782, 564, "U-M GPT landing page 3"),
          fr("odiJHi0CxXYHAyRaHC6o3fvM54k", "png", 1600, 592, "U-M GPT landing page 4"),
          fr("iqnOrzoOwWyrZ3o5nnzJzNfOIeM", "png", 1756, 592, "U-M GPT landing page 5"),
          fr("qf9fpsbyUZOxw9qKtlnz3eXdos", "png", 2212, 750, "U-M GPT landing page 6"),
          fr("1FRtfWhS9SzpNBKTMAm2N3uiVKU", "png", 1804, 592, "U-M GPT landing page 7"),
        ],
      },
    ],
  },
  {
    slug: "brochure",
    section: "projects",
    title: "Brochure for the poem “Lotus Flower” (Korean)",
    short: "Lotus Flower Brochure",
    category: "Graphic Design",
    client: "Personal project",
    role: "Graphic Designer",
    timeframe: "3 weeks",
    details: [
      { label: "Tools", value: "Adobe InDesign, Procreate" },
      { label: "Dimensions", value: "210 mm × 210 mm" },
      { label: "Medium", value: "Printed brochure" },
    ],
    summary:
      "A Valentine’s Day brochure for a Korean love poem, exploring the geometry of Korean letterforms.",
    cover: { src: "/projects/brochure/still.jpg", w: 2224, h: 556, alt: "Lotus Flower brochure, laid flat" },
    containCover: true,
    fold: {
      front: ["a", "b", "c", "d"].map((k) => ({ src: `/projects/brochure/front-${k}.jpg`, w: 556, h: 556, alt: "Lotus Flower brochure panel" })),
      back: ["a", "b", "c", "d"].map((k) => ({ src: `/projects/brochure/back-${k}.jpg`, w: 556, h: 556, alt: "Lotus Flower brochure, inside panel" })),
    },
    blocks: [
      {
        type: "text",
        heading: "Overview",
        paragraphs: [
          "Inspired by Seyoung Oh’s Korean love poem “Lotus Flower” and made for Valentine’s Day, this brochure explores the geometry of Korean typography compared with alphabetic forms.",
          "It pairs a minimalist sans serif with a traditional brushstroke typeface. The title runs along the gutter, reading as legible but pattern-like, and changes shape when folded.",
        ],
      },
      {
        type: "list",
        heading: "Key design decisions",
        items: [
          { title: "Title on the gutter", text: "The brush letterforms stay legible when the brochure is folded." },
          { title: "Korean first", text: "The original Korean poem takes priority over the English translation." },
          { title: "A pond of lotus flowers", text: "The poem is visualized as a pond." },
          { title: "Letterforms as ripples", text: "The irregularity of Korean letterforms suggests water ripples." },
          { title: "One accent color", text: "“Lotus flower” in the poem shares the title’s color." },
        ],
      },
      {
        type: "images",
        heading: "Final deliverable",
        images: [
          fr("RDhgBjq8xlCTJYbuctXiLSIpxDI", "png", 1598, 442, "Lotus Flower brochure spread 1"),
          fr("MplSfyoiRFGhJFtIy7lVbZhhE", "png", 1598, 442, "Lotus Flower brochure spread 2"),
          fr("H04HNYh6wD9tWT2xp9GvZPnGbI", "png", 1848, 1344, "Lotus Flower brochure"),
          fr("Lk4NWTLsP8JFKZZtLNyNcjMCmEQ", "png", 1596, 1109, "Lotus Flower brochure detail 1"),
          fr("9Jg94l1bolM19HGVZ6YIr0kK6CI", "png", 1593, 1109, "Lotus Flower brochure detail 2"),
        ],
      },
    ],
  },
  {
    slug: "article-poster",
    section: "projects",
    title: "Poster for Audrey Bennett’s “The African Roots of Swiss Design”",
    short: "Article Poster",
    wind: true,
    category: "Graphic Design",
    client: "Audrey G. Bennett",
    role: "Graphic Designer",
    timeframe: "3 weeks",
    details: [
      { label: "Tools", value: "Adobe Illustrator, Procreate" },
      { label: "Dimensions", value: "A2" },
    ],
    summary:
      "An article redesigned as a Korean-language poster, building cultural awareness between African and Korean design histories.",
    cover: fr("jU9aCgf5M116WXMMldE4JVd5Vyc", "png", 934, 1491, "African Roots of Swiss Design poster"),
    blocks: [
      {
        type: "text",
        heading: "Overview",
        paragraphs: [
          "At Professor Bennett’s request, her article from The Conversation was redesigned as a poster that reframes her message for a Korean audience. Her writing examines how African design traditions shaped Swiss modernism, a link often overlooked in Western accounts.",
          "As a Korean designer shaped by both Korean and global cultures, I translated the article into Korean and visualized it to build cultural awareness between African and Korean design histories.",
        ],
      },
      {
        type: "list",
        heading: "Process",
        numbered: true,
        items: [
          {
            title: "Sketching",
            text: "Initial idea sketches included English-language poster sketches and a Korean-language one.",
          },
          {
            title: "Choosing Korean",
            text: "The Korean-language version let me test alternative letterforms and attract a Korean audience.",
          },
          {
            title: "Version 1",
            text: "The original letter spacing reduced legibility, and illustrations between text blocks nearly touched the side margins.",
          },
          {
            title: "Version 2",
            text: "Wider title letter spacing improved legibility and hierarchy. Key topics moved to the side, and the QR code and credits were right-aligned for balance.",
          },
          {
            title: "Version 3 (final)",
            text: "Subtopics were integrated into the illustrations, and varied letter heights added dynamism.",
          },
        ],
      },
      {
        type: "list",
        heading: "Key design decisions",
        items: [
          { title: "Vertical letterforms" },
          { title: "Hierarchy through placement", text: "Rather than through text size." },
          {
            title: "Korean traditional painting",
            text: "Used for familiarity, applied to style rather than context so the focus on African influence stays clear.",
          },
          {
            title: "“African” over “Swiss”",
            text: "Emphasis reflects the article’s focus on an overlooked influence.",
          },
        ],
      },
      {
        type: "images",
        heading: "Final deliverable",
        images: [
          fr("oxUUe0sUboHV7fGulcHP49YR7BQ", "jpg", 3072, 4096, "African Roots poster, final 1"),
          fr("bZ7xaFTlztXYwwY8TNPmLhk1zOY", "jpg", 3072, 4096, "African Roots poster, final 2"),
          fr("iifRghBmJCcH5T5osUR23w91Js", "jpg", 3072, 4096, "African Roots poster, final 3"),
          fr("CbqFgCp7kQTtcNMIMDjLH01WkVQ", "png", 712, 1140, "African Roots poster, version 1"),
          fr("ixndz1E2eUx77m26ddaxYLTiF4", "png", 706, 1136, "African Roots poster, version 2"),
          fr("HSjxr04e3xt6GZBlRvFEQ0nUQco", "png", 1424, 2272, "African Roots poster, version 3"),
          fr("Fn98XsUJKHLQjjBGMiurK3bLU", "png", 1876, 1432, "African Roots poster, detail"),
        ],
      },
    ],
  },
  {
    slug: "lamp",
    section: "projects",
    title: "Lamp Holder: Scenery through a window",
    short: "Lamp Holder",
    category: "3D Design",
    client: "Personal project",
    role: "3D Designer",
    timeframe: "5 weeks",
    details: [
      { label: "Tools", value: "Rhino (laser cutting)" },
      { label: "Dimensions", value: "5″ × 5″ × 8″" },
      { label: "Materials", value: "Taskboard, tissue paper, acrylic paint, fineliner pen" },
    ],
    summary:
      "A lamp holder inspired by Korean landscape painting and window lattices, like looking out at a calm view.",
    cover: { src: "/projects/lamp/cover.jpg", w: 1500, h: 1875, alt: "Lamp holder with a pine branch painted on rice paper, unlit" },
    hoverCover: { src: "/projects/lamp/hover.jpg", w: 1500, h: 1875, alt: "The same lamp holder lit from inside" },
    containCover: true,
    blocks: [
      {
        type: "text",
        heading: "Overview",
        paragraphs: [
          "The lamp holder draws on Korean traditional paintings and window lattice patterns to evoke looking out at a calm landscape — a quiet moment between inside and outside, like viewing nature through a frame.",
        ],
      },
      {
        type: "list",
        heading: "Process",
        numbered: true,
        items: [
          { title: "Plan the key design decisions" },
          { title: "Sketch the visual idea" },
          { title: "Laser-cut the taskboard pieces", text: "Designed in Rhino." },
          { title: "Paint traditional-style trees on tissue paper" },
          { title: "Paint the taskboard brown", text: "To resemble wooden window lattice." },
          { title: "Attach the taskboard and tissue paper" },
          { title: "Assemble all sides into the finished structure" },
        ],
      },
      {
        type: "list",
        heading: "Key design decisions",
        items: [
          { title: "Painted scenery", text: "Two facing sides carry traditional scenic painting." },
          { title: "Window lattice", text: "The other two facing sides carry lattice patterns." },
          { title: "Rice-paper effect", text: "Tissue paper imitates rice paper." },
          {
            title: "A different top",
            text: "The top uses another pattern that leaves the light source uncovered by tissue paper.",
          },
        ],
      },
      {
        type: "images",
        heading: "Final deliverable",
        images: [
          fr("WQfuwk9XGsMP8hcKQNf1xtqLQ2s", "jpg", 4032, 3024, "Lamp holder, view 1"),
          fr("KNq64GJJ1CYUUVMv6DOez1zXZ0", "jpg", 4032, 3024, "Lamp holder, view 2"),
          fr("Bvp2QIq8R4I6gSvCvh6MIGcbHo", "jpg", 4032, 3024, "Lamp holder, view 3"),
          fr("pUltGKNYxAU7N5LKAFEDhwjEo0", "jpg", 4032, 3024, "Lamp holder, view 4"),
          fr("wcmXdZQjX6bK9igCB4TxGmT4", "jpg", 3024, 4032, "Lamp holder, view 5"),
          fr("JkKgGjEoky0aafV0AVEvti8P9v0", "jpg", 3024, 4032, "Lamp holder, view 6"),
        ],
      },
    ],
  },
  {
    slug: "perfume",
    section: "projects",
    title: "Perfume Packaging & Branding: Fate and Fragrance",
    short: "Fate & Fragrance",
    category: "Branding",
    client: "Personal project",
    role: "Graphic Designer",
    timeframe: "6 weeks",
    details: [{ label: "Tools", value: "Adobe Illustrator, Adobe Photoshop, Micron pens" }],
    summary:
      "Tarot-inspired perfume packaging exploring the idea that we shape our fate through the scent we choose each morning.",
    cover: { src: "/projects/perfume/cover.jpg", w: 2956, h: 2080, alt: "Tarot perfume packaging" },
    containCover: true,
    blocks: [
      {
        type: "text",
        heading: "Overview",
        paragraphs: [
          "The project explores the idea that people might shape their fate through the fragrance they choose each morning. Drawing on tarot symbolism, the packaging visualizes the connection between scent and destiny — perfumes leave impressions, and memories of the people who wear them.",
        ],
      },
      {
        type: "list",
        heading: "Process",
        numbered: true,
        items: [
          { title: "Sketch four rough concepts" },
          { title: "Draw four higher-quality covers" },
          { title: "Edit in Photoshop", text: "So the artwork can be placed into a product mockup." },
        ],
      },
      {
        type: "list",
        heading: "Key design decisions",
        items: [
          { title: "Tarot symbolism", text: "The central visual inspiration." },
          {
            title: "Packaging as a link between fragrance and fate",
            text: "Designed to express the mystical connection.",
          },
        ],
      },
      {
        type: "images",
        heading: "Final deliverable",
        images: [
          fr("UgUtwwjleECmhpUmWTPhr8IEwo", "png", 1262, 1697, "Tarot perfume cover sketches"),
          fr("R4GRYynDvAwSraSAdr6QcNQaGQ", "png", 1486, 832, "Tarot perfume process"),
          fr("5KTUyrw0BTjPXbxa2iSeJmlZ04", "png", 1995, 1420, "Tarot perfume packaging 1"),
          fr("KJ6IFEgvcxD1ADMTyAKxpvWlE", "png", 1678, 1140, "Tarot perfume packaging 2"),
          fr("Y8zMHnMvw133RnRksx6mBZc8", "png", 2022, 1440, "Tarot perfume packaging 3"),
        ],
      },
    ],
  },
  {
    slug: "portrait-paintings",
    section: "studio",
    title: "Portrait Paintings",
    short: "Portrait Paintings",
    category: "Fine Art",
    client: "Personal",
    role: "",
    timeframe: "2021 – 2022",
    summary: "Selected paintings and mixed-media work from 2021 and 2022.",
    hideCover: true,
    cover: fr("9OoLlBiYqxvnv2ZMQkBjsPdHxQ", "jpg", 1030, 1262, "Portrait painting"),
    blocks: [
      {
        type: "artworks",
        heading: "Works",
        items: [
          { title: "Perspectives", year: "2022", medium: "Acrylics on canvas", size: "60.6 × 50.0 cm", image: fr("9OoLlBiYqxvnv2ZMQkBjsPdHxQ", "jpg", 1030, 1262, "Perspectives, acrylics on canvas") },
          { title: "Sacrifice", year: "2022", medium: "Acrylics on canvas", size: "100.0 × 80.3 cm", image: fr("OadVbuj9CTtYCZEG9moJILxOQ", "jpg", 1620, 2205, "Sacrifice, acrylics on canvas") },
          {
            title: "Memento Mori",
            year: "2022",
            medium: "Mixed media on canvas",
            size: "100.0 × 72.7 cm",
            note: "Veil, beads, plastic bone model, acrylics",
            image: fr("sQxEar0E7QubKQBFJrFqgfjDXM", "jpg", 1913, 1451, "Memento Mori, mixed media on canvas"),
          },
          { title: "Father’s Portrait", year: "2021", medium: "Acrylics on canvas", size: "60.6 × 50.0 cm", image: fr("3XXT4uXbPYK7wi2OE5mDoenVg", "jpg", 1762, 2047, "Father’s Portrait, acrylics on canvas") },
        ],
      },
    ],
  },
];

/** Everything on the Projects page. */
export const projects = all.filter((p) => p.section === "projects");
/** Everything on the Studio page. */
export const studio = all.filter((p) => p.section === "studio");

export const getProject = (slug: string) => all.find((p) => p.slug === slug);
export const sectionOf = (p: Project) => (p.section === "studio" ? studio : projects);
