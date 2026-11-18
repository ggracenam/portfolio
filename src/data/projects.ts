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
      /** Pull the block up by a further number of px (and blend its white margin into the block above). */
      pull?: number;
      /** Blend a white-backed picture into the page colour (white takes on the background, everything darker is left alone). */
      blend?: boolean;
      /** A small muted line under the images (e.g. to credit work that is not mine). */
      caption?: string;
      /** Show the images without the rounded frame and hairline outline. */
      plain?: boolean;
      /** Let these images use more of the screen height (CSS length for the height cap). */
      fitH?: string;
    }
  | {
      /** A silent looping clip (e.g. a page scrolling through), shown in the same frame as images. */
      type: "video";
      mp4: string;
      webm?: string;
      poster: string;
      w: number;
      h: number;
      alt: string;
      tight?: boolean;
    };

export type Project = {
  slug: string;
  /** Page colours for this project: a pale tint of its colour behind a deeper shade of it for text. */
  theme?: { bg: string; fg: string };
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
  timeframe?: string;
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
  /** Blend the hero into the page colour (white backing takes on the background). */
  heroBlend?: boolean;
  /**
   * Further pages that open out next to the cover on hover (poster sets): the first is the cover's
   * partner, the rest sit tucked behind it.
   */
  spread?: Img[];
  /** A second picture that fades in over the cover on hover (same framing, so the object does not move). */
  hoverCover?: Img;
  /** Project-page hero shown on hover (pairs with `hero`). */
  heroHover?: Img;
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
    theme: { bg: "#FEFEFC", fg: "#404040" },
    section: "projects",
    title: "MBGNA Poster Series",
    subtitle: "Visual Identity · Print Design · Art Direction",
    related: "brochure",
    short: "MBGNA Posters",
    category: "Graphic Design",
    client: "Matthaei Botanical Gardens and Nichols Arboretum (MBGNA)",
    role: "Graphic Design, Art Direction",
    year: "2026",
    summary:
      "A six-poster series that reframes a botanical garden network as a living museum you take part in, not just look at.",
    cover: poster(1, "Matthaei Botanical Gardens and Nichols Arboretum poster"),
    hero: { src: "/projects/mbgna/series.jpg", w: 2138, h: 2063, alt: "All six MBGNA posters in a grid" },
    heroPlain: true,
    noOutline: true,
    heroMax: 942,
    heroFull: true,
    spacing: "large",
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
    theme: { bg: "#FEFCFD", fg: "#404040" },
    section: "projects",
    title: "SoundScape",
    subtitle: "UX Design · Mobile App · Music Discovery",
    related: "umgpt",
    short: "SoundScape",
    category: "UX Design",
    client: "Personal project",
    role: "UX Designer",
    year: "2026",
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
        plain: true,
        images: [{ src: "/projects/soundscape/shot-2-t.webp", w: 2212, h: 1080, alt: "Country, city and street-level views" }],
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
        plain: true,
        images: [{ src: "/projects/soundscape/shot-4-t.webp", w: 2212, h: 1080, alt: "Map pin interaction and playback screen" }],
      },
      {
        type: "text",
        paragraphs: [
          "Location markers act as more than points of information. Selecting a pin reveals the music associated with that place and provides a direct path into listening through Spotify playback integration. This connects the act of discovering a local trend with experiencing the music itself.",
        ],
      },
      {
        type: "images",
        plain: true,
        images: [{ src: "/projects/soundscape/shot-5-t.webp", w: 2212, h: 1080, alt: "Navigation, library and profile screens" }],
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
    theme: { bg: "#FDFDFE", fg: "#404040" },
    section: "projects",
    title: "U-M GPT & ITS AI Services",
    subtitle: "UX Design · Interface Design · Web Design",
    related: "soundscape",
    short: "U-M GPT",
    category: "UX Design",
    client: "UMSI IT Services",
    role: "UX Designer",
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
    hero: { src: "/projects/umgpt/hero.jpg", w: 1600, h: 1200, alt: "Redesigned U-M GPT interface on desktop and mobile" },
    heroMax: 800,
    heroFull: true,
    noOutline: true,
    spacing: "large",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "U-M GPT is the University of Michigan’s generative AI platform, providing students, faculty, and researchers with access to a range of AI tools. As part of a semester-long design project, I explored how its interface could be improved to create a more cohesive, accessible, and intuitive experience for the university community.",
          "The project focused on rethinking the platform’s visual hierarchy, navigation, and conversation management, while introducing more flexible ways for users to organize and personalize their workspace.",
        ],
      },
      {
        type: "images",
        caption: "*Original U-M GPT visuals",
        images: [{ src: "/projects/umgpt/old.jpg", w: 1938, h: 922, alt: "The original U-M GPT interface" }],
      },
      {
        type: "text",
        paragraphs: [
          "The original U-M GPT experience presented several usability and visual challenges. A cluttered layout, inconsistent spacing, and competing colour treatments made the interface difficult to navigate and lacked a clear visual hierarchy. Conversation management was also limited, making it harder for users to organize and return to their work.",
          "The redesign focused on creating a more structured and approachable experience, with an emphasis on clarity, flexibility, and efficient access to frequently used content.",
        ],
      },
      {
        type: "images",
        fitH: "4000px",
        images: [{ src: "/projects/umgpt/flow-desktop.jpg", w: 1884, h: 1046, alt: "Desktop screens in the order a user moves through them" }],
      },
      {
        type: "text",
        paragraphs: [
          "A central direction of the redesign was to make conversations and prompts easier to manage. Search functionality allows users to locate existing content, while folder-based organization provides a clearer structure for grouping related conversations and resources.",
          "Preview information was introduced across conversations, prompts, and folders, helping users identify content before opening it. Together, these features create a more organized workspace and reduce the effort required to find and revisit previous work.",
        ],
      },      {
        type: "images",
        fitH: "4000px",
        images: [{ src: "/projects/umgpt/flow-mobile.jpg", w: 1884, h: 1626, alt: "Mobile screens in the order a user moves through them" }],
      },

      {
        type: "text",
        paragraphs: [
          "The redesign also introduces greater flexibility in how users organize and view their workspace. Alternative list and grid layouts accommodate different preferences, while custom labels, cover images, and colour coding help users distinguish between projects and content.",
          "These options give users more control over their environment while maintaining a consistent underlying interface.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Alongside the platform redesign, I explored the University of Michigan ITS AI Services landing page as an entry point to the university’s broader collection of generative AI tools.",
        ],
      },
      {
        type: "images",
        images: [{ src: "/projects/umgpt/its-landing.jpg", w: 1817, h: 928, alt: "University of Michigan ITS AI Services landing page on desktop and mobile" }],
      },
      {
        type: "video",
        tight: true,
        mp4: "/projects/umgpt/its-scroll.mp4",
        webm: "/projects/umgpt/its-scroll.webm",
        poster: "/projects/umgpt/its-scroll-poster.jpg",
        w: 1280,
        h: 800,
        alt: "The ITS AI Services landing page scrolling from top to bottom",
      },
      {
        type: "text",
        paragraphs: [
          "The page was structured to help visitors understand and access the available services quickly. A prominent U-M GPT entry point encourages immediate engagement, while an overview of all four tools introduces their capabilities and intended audiences. Visual previews and supporting descriptions provide additional context, with side navigation allowing users to move directly between sections.",
          "The page balances quick access with more detailed information, supporting both first-time visitors exploring the available tools and returning users looking to get started.",
        ],
      },
    ],
  },
  {
    slug: "brochure",
    theme: { bg: "#FEFEFE", fg: "#404040" },
    section: "projects",
    title: "Lotus Flower Poem Brochure",
    subtitle: "Graphic Design · Typography · Print Design",
    related: "article-poster",
    short: "Lotus Flower Brochure",
    category: "Graphic Design",
    client: "Personal project",
    role: "Graphic Designer",
    year: "2025",
    summary:
      "A Valentine’s Day brochure for a Korean love poem, exploring the geometry of Korean letterforms.",
    cover: { src: "/projects/brochure/still.jpg", w: 2224, h: 556, alt: "Lotus Flower brochure, laid flat" },
    containCover: true,
    fold: {
      front: ["a", "b", "c", "d"].map((k) => ({ src: `/projects/brochure/front-${k}.jpg`, w: 556, h: 556, alt: "Lotus Flower brochure panel" })),
      back: ["a", "b", "c", "d"].map((k) => ({ src: `/projects/brochure/back-${k}.jpg`, w: 556, h: 556, alt: "Lotus Flower brochure, inside panel" })),
    },
    hero: { src: "/projects/brochure/hero.jpg", w: 2551, h: 930, alt: "Lotus Flower brochure folded like an accordion, seen from above, with the calligraphy title on the front crease" },
    noOutline: true,
    heroMax: 942,
    heroFull: true,
    spacing: "large",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Inspired by the Korean love poem Lotus Flower by Seyoung Oh, this brochure was designed for Valentine’s Day as an exploration of Korean typography, poetry, and visual form. The project examines the geometric qualities of Korean letterforms and their contrast with alphabetic typography, bringing together contemporary simplicity and traditional expression.",
          "A minimalist sans serif is paired with a Korean brushstroke typeface, creating a balance between restraint and movement. The original Korean poem takes visual priority, allowing its language and letterforms to shape the reading experience, while the English translation provides a secondary point of reference.",
        ],
      },
      {
        type: "images",
        fitH: "4000px",
        plain: true,
        images: [{ src: "/projects/brochure/spread.jpg", w: 2823, h: 766, alt: "Lotus Flower brochure spread" }],
      },
      {
        type: "images",
        tight: true,
        pull: 19,
        fitH: "4000px",
        plain: true,
        images: [{ src: "/projects/brochure/poem.jpg", w: 2823, h: 766, alt: "Korean poem and typographic details" }],
      },
      {
        type: "text",
        paragraphs: [
          "The title, Lotus Flower, runs along the central gutter, functioning as both a typographic element and a recurring visual motif. Its placement allows the letterforms to shift in appearance when the brochure is folded, creating different compositions while remaining legible in both formats.",
          "The Korean poem is arranged to evoke a pond filled with lotus flowers. Irregular spacing and the natural variation of the brushstroke letterforms suggest ripples across the water’s surface, translating the poem’s imagery into the structure of the page.",
        ],
      },
      {
        type: "images",
        fitH: "4000px",
        plain: true,
        maxWidth: 680,
        images: [{ src: "/projects/brochure/detail.jpg", w: 2300, h: 826, alt: "Highlighted text and colour details" }],
      },
      {
        type: "text",
        paragraphs: [
          "A restrained colour palette draws attention to the words “lotus flower” within the poem, echoing the colour of the title. This subtle connection ties the text to the broader composition, reinforcing the relationship between language, imagery, and form.",
        ],
      },
    ],
  },
  {
    slug: "article-poster",
    theme: { bg: "#FEFEFE", fg: "#404040" },
    section: "projects",
    title: "The African Roots of Swiss Design",
    subtitle: "Poster Design · Typography · Editorial Design",
    related: "mbgna-posters",
    short: "Article Poster",
    wind: true,
    category: "Graphic Design",
    client: "Audrey G. Bennett",
    role: "Graphic Design, Translation",
    year: "2025",
    summary:
      "An article redesigned as a Korean-language poster, building cultural awareness between African and Korean design histories.",
    cover: fr("jU9aCgf5M116WXMMldE4JVd5Vyc", "png", 934, 1491, "African Roots of Swiss Design poster"),
    hero: { src: "/projects/article-poster/hero.jpg", w: 1868, h: 2980, alt: "The African Roots of Swiss Design, final poster" },
    heroPlain: true,
    heroMax: 942,
    noOutline: true,
    spacing: "large",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Created at the request of Professor Audrey G. Bennett, this poster reinterprets her article, The African Roots of Swiss Design, originally published in The Conversation, for a Korean audience. The article explores the often-overlooked influence of African design traditions on Swiss modernism, challenging established narratives of modern graphic design.",
          "Translating the article into Korean became an opportunity to reconsider how its message could be communicated through a different language and visual context. The poster brings together Korean typography and visual references to introduce the article’s central argument to a new audience.",
        ],
      },
      {
        type: "images",
        plain: true,
        maxWidth: 760,
        fitH: "4000px",
        images: [{ src: "/projects/article-poster/detail.jpg", w: 1170, h: 600, alt: "Close-up of the poster: Korean words placed irregularly above the figures" }],
      },
      {
        type: "text",
        paragraphs: [
          "The composition draws inspiration from traditional Korean painting, using its visual qualities as a familiar point of reference for Korean audiences without shifting the subject away from African design history. Vertical Korean letterforms create the structure of the poster, with hierarchy established through placement, rhythm, and spacing rather than scale alone.",
          "The poster brings two cultural references together. Its figures are inspired by African drawing, with expressive, gestural brushwork, while the medium looks to Korean tradition: the warm, fibrous texture of hanji (traditional Korean paper) and the deep black of meok (먹), the ink used in Korean calligraphy and painting. Placed together, they connect the subject of the article with the visual culture of its Korean audience.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Through the translation and visual reinterpretation of the article, the poster explores how graphic design can create connections between cultural histories, making overlooked influences more visible to audiences beyond their original context.",
        ],
      },
    ],
  },
  {
    slug: "lamp",
    theme: { bg: "#FEFCFA", fg: "#404040" },
    section: "projects",
    title: "Lamp Holder",
    subtitle: "Product Design · Lighting Design · Craft & 3D Design",
    related: "perfume",
    short: "Lamp Holder",
    category: "3D Design",
    client: "Personal project",
    year: "2023",
    role: "3D Designer",
    summary:
      "A lamp holder inspired by Korean landscape painting and window lattices, like looking out at a calm view.",
    cover: { src: "/projects/lamp/cover.jpg", w: 1500, h: 1875, alt: "Lamp holder with a pine branch painted on rice paper, unlit" },
    hoverCover: { src: "/projects/lamp/hover.jpg", w: 1500, h: 1875, alt: "The same lamp holder lit from inside" },
    containCover: true,
    hero: { src: "/projects/lamp/hero-cover.jpg", w: 1464, h: 2344, alt: "Lamp holder with a pine branch painted on rice paper, unlit" },
    heroHover: { src: "/projects/lamp/hero-hover.jpg", w: 1464, h: 2344, alt: "The same lamp holder lit from inside" },
    heroPlain: true,
    noOutline: true,
    spacing: "large",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Inspired by traditional Korean landscape paintings and architectural window lattice patterns, this lamp holder explores the relationship between light, nature, and framing. The design draws on the experience of looking out through a traditional window, capturing a quiet moment between interior and exterior.",
          "Two opposing panels feature hand-drawn landscape scenes inspired by traditional Korean paintings. Rendered on tissue paper, the illustrations evoke the delicate, translucent quality of traditional rice paper, allowing light to soften the imagery and create a gentle atmosphere.",
        ],
      },
      {
        type: "images",
        images: [
          { src: "/projects/lamp/final-3.jpg", w: 2250, h: 3000, alt: "Lamp holder, view 3" },
          { src: "/projects/lamp/final-4.jpg", w: 2250, h: 3000, alt: "Lamp holder, view 4" },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "The remaining panels reinterpret traditional Korean window latticework. Laser-cut taskboard forms the structure, finished with brown acrylic paint to suggest the warmth and texture of wood. Together, the contrasting panels create a balance between illustrated scenery and architectural pattern.",
        ],
      },
      {
        type: "images",
        images: [
          { src: "/projects/lamp/final-5.jpg", w: 2250, h: 3000, alt: "Lamp holder, view 5" },
          { src: "/projects/lamp/final-6.jpg", w: 2250, h: 3000, alt: "Lamp holder, view 6" },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "The open patterned top allows light to escape more freely, emphasizing the lamp's glow while distinguishing it from the more enclosed sides. Through the combination of layered materials, hand-drawn details, and filtered light, the lamp holder transforms traditional visual references into a contemporary functional object.",
        ],
      },
    ],
  },
  {
    slug: "perfume",
    theme: { bg: "#FCFCFD", fg: "#404040" },
    section: "projects",
    title: "Tarot Perfumes",
    subtitle: "Graphic Design · Packaging Design · Illustration",
    related: "lamp",
    short: "Fate & Fragrance",
    category: "Branding",
    client: "Personal project",
    year: "2022",
    role: "Graphic Designer",
    summary:
      "Tarot-inspired perfume packaging exploring the idea that we shape our fate through the scent we choose each morning.",
    cover: { src: "/projects/perfume/cover.jpg", w: 2956, h: 2080, alt: "Tarot perfume packaging" },
    containCover: true,
    hero: { src: "/projects/perfume/hero-t.webp", w: 2956, h: 2080, alt: "Tarot perfume packaging: La lionne" },
    heroPlain: true,
    noOutline: true,
    spacing: "large",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Fate and Fragrance explores the idea that the scent we choose each morning might influence the course of our day, shaping the impressions and memories we leave behind. Drawing on the symbolism of tarot, the project imagines fragrance as something more than a personal preference: a small ritual connected to fate and destiny.",
          "The packaging illustrations take inspiration from the visual language of tarot, using hand-drawn imagery to give the fragrances a sense of mysticism and symbolism. Each illustration began on paper, drawn with Micron pens before being digitised and refined in Photoshop for use across the packaging.",
        ],
      },
      {
        type: "images",
        images: [
          { src: "/projects/perfume/moon.jpg", w: 1600, h: 1143, alt: "Tarot perfume packaging: The Moon" },
          { src: "/projects/perfume/sun.jpg", w: 1600, h: 1143, alt: "Tarot perfume packaging: The Sun" },
          { src: "/projects/perfume/wheel.jpg", w: 1600, h: 1143, alt: "Tarot perfume packaging: The Wheel of Fortune" },
          { src: "/projects/perfume/lion.jpg", w: 1600, h: 1143, alt: "Tarot perfume packaging: The Lion" },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "The combination of traditional drawing and digital composition brings a tactile quality to the packaging, while the tarot-inspired direction gives the fragrances a visual identity rooted in mystery, intuition and the possibility of the unknown.",
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
    year: "2021 – 2022",
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
