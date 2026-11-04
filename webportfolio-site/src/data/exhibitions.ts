export type Exhibition = {
  title: string;
  venue: string;
  city: string;
  /** As written on the original page, e.g. "06.2025". */
  date: string;
  note?: string;
};

// [title, venue, city, date, note?]
const rows: [string, string, string, string, string?][] = [
  ["Joan Miró: Sculptures", "Thaddeus Ropac", "Seoul", "01.2026"],
  ["Heemin Chung: Garden of Turmoil", "Thaddeus Ropac", "Seoul", "01.2026"],
  ["From Impressionism to Early Modernism: Collectors of Light (The Robert Lehman Collection at The Metropolitan Museum of Art)", "National Museum of Korea", "Seoul", "12.2025"],
  ["Louise Bourgeois: The Evanescent and the Eternal", "Hoam Museum of Art", "Yongin", "12.2025"],
  ["Chiharu Shiota: Echoes Between", "Templon Gallery", "New York", "11.2025"],
  ["The Noguchi Collection", "Noguchi Museum", "New York", "11.2025"],
  ["Lee Kang So: Dwelling in Mist and Glow", "Thaddeus Ropac", "Seoul", "08.2025"],
  ["Minyoung Choi: Midnight Walk", "Gallery Baton", "Seoul", "08.2025"],
  ["Tokyo National Museum Collection", "Tokyo National Museum", "Tokyo", "07.2025"],
  ["Encounters: Giacometti x Huma Bhabha", "Barbican Centre", "London", "07.2025"],
  ["National Portrait Gallery Collection", "National Portrait Gallery", "London", "07.2025"],
  ["Kiefer / Van Gogh", "Royal Academy of Arts (RA)", "London", "06.2025"],
  ["The Wallace Collection", "The Wallace Collection", "London", "06.2025"],
  ["Yoshitomo Nara", "Hayward Gallery", "London", "06.2025"],
  ["Abstract Erotic: Louise Bourgeois, Eva Hesse, Alice Adams", "The Courtauld Gallery", "London", "06.2025"],
  ["Victoria and Albert Museum Collection", "Victoria and Albert Museum", "London", "06.2025"],
  ["Do Ho Suh: Walk the House", "Tate Modern", "London", "06.2025"],
  ["Tate Britain Collection", "Tate Britain", "London", "06.2025"],
  ["Ron Mueck", "MMCA (National Museum of Modern and Contemporary Art)", "Seoul", "06.2025"],
  ["Werner Bronkhorst: The World’s a Canvas", "Ground Seesaw Gallery", "Seoul", "06.2025"],
  ["MMCA Collection: Korean Contemporary Art", "MMCA", "Seoul", "06.2025"],
  ["Kitty Crowther: Who’s There", "Albus Gallery", "Seoul", "06.2025"],
  ["SOCOTRA: A Most unusual ISLAND by Bill Bentley", "Four Seasons Hotel Art Space by MOCA Bangkok", "Bangkok", "03.2025"],
  ["취향가옥: Art in Life, Life in Art", "D Museum", "Seoul", "12.2024"],
  ["The MET Collections", "The Metropolitan Museum of Art", "New York", "1.2024"],
  ["The Harmony and Dissonance: Orphism in Paris, 1910-1930", "Guggenheim", "New York", "11.2024"],
  ["Collection in Focus | Piet Mondrian: Even Further", "Guggenheim", "New York", "11.2024"],
  ["Bernard Buffet: “천재의 빛: 광대의 그림자”", "Seoul Arts Center", "Seoul", "07/08.2024", "Visited twice"],
  ["Alexander Calder", "Azabudai Hills Gallery", "Tokyo", "07.2024"],
  ["Issey Miyake: Focus on STRETCH PLEATS", "21_21 Design Sight", "Tokyo", "06.2024"],
  ["Yun Hyong-keun: Yun/Paris/Yun", "PKM Gallery", "Seoul", "05.2024"],
  ["Paintings as Drawings and Drawings as Paintings in KIM Hong Joo’s Art", "The Sungkok Art Museum", "Seoul", "05.2024"],
  ["Koo Bonhchang’s Voyages", "Seoul Museum of Art (SeMA)", "Seoul", "01.2024"],
  ["The Most Honest Confession: Chang Ucchin Retrospective", "MMCA", "Seoul", "01.2024"],
  ["Kohei Nawa: Cosmic Sensibility", "Pace Gallery", "Seoul", "12.2023"],
  ["Emilio Vedova: Colour and Gesture", "Thaddeus Ropac", "Seoul", "12.2023"],
  ["Jongwan Jang: GOLDILOCKS ZONE", "Foundry Seoul", "Seoul", "12.2023"],
  ["Loriel Beltran: Total Collapse", "Lehmann Maupin", "Seoul", "12.2023"],
  ["Raoul Dufy: Colorful Symphony", "Seoul Arts Center", "Seoul", "05.2023"],
  ["The Centennial exhibition of Guei-Hong Won: beyond", "The Sungkok Art Museum", "Seoul", "05.2023"],
  ["Lee Bae: Oblique", "Johyun Gallery", "Busan", "06.2022"],
  ["Loie Hollowell: Starting from O", "Pace Gallery Seoul", "Seoul", "05.2022"],
  ["Oliver Beer: Resonance in Paintings – Two Notes", "Thaddaeus Ropac Seoul", "Seoul", "05.2022"],
  ["Ugo Rondinone: Nuns and monks by the sea", "Kukje Gallery", "Seoul", "04.2022"],
  ["Alex Katz: Flowers", "Thaddaeus Ropac Seoul", "Seoul", "01.2022"],
  ["Park Soo Keun: The Naked Tree Awaiting Spring", "MMCA", "Seoul", "01.2022"],
  ["Kwon Jin Kyu × Mok Jungwook: Images of Eternity", "PKM Gallery", "Seoul", "12.2021"],
  ["Louise Bourgeois: The Smell of Eucalyptus", "Kukje Gallery", "Seoul", "12.2021"],
  ["Julian Opie", "Kukje Gallery", "Seoul", "11.2021"],
  ["Moon Jars by Kwon Dae Sup", "Johyun Gallery", "Seoul", "03.2021"],
  ["Evergreens in Wintry Days: Saehan", "National Museum of Korea", "Seoul", "01.2021"],
  ["Shiota Chiharu: Between Us", "Gana Art Center", "Seoul", "08.2020"],
  ["Gallery Hyundai 50 pt.II", "Gallery Hyundai", "Seoul", "07.2020"],
  ["Huh Myoungwook: Overlaying", "Gana Art Center", "Seoul", "06.2020"],
  ["Yun Hyong-keun", "PKM Gallery", "Seoul", "05.2020"],
  ["Toulouse Lautrec", "Seoul Art Center", "Seoul", "04.2020"],
  ["Léon Spilliaert", "Royal Academy of Arts (RA)", "London", "02.2020"],
  ["Dora Maar", "Royal Academy of Arts (RA)", "London", "01.2020"],
  ["Picasso and Paper", "Royal Academy of Arts (RA)", "London", "01.2020"],
  ["Lucian Freud", "Royal Academy of Arts (RA)", "London", "01.2020"],
  ["Olafur Eliasson: in real life", "Tate Modern", "London", "09.2019"],
  ["Bernard Buffet", "Seoul Art Center", "Seoul", "08.2019"],
  ["David Hockney", "Seoul Museum of Art", "Seoul", "08.2019"],
  ["Escher", "S Factory", "Seoul", "08.2019"],
  ["Erik Johansson: Impossible is possible", "Seoul Art Center", "Seoul", "08.2019"],
  ["Tokyo teamLab Borderless", "teamLab Planets TOKYO", "Tokyo", "07.2019"],
  ["Bill Viola / Michelangelo: Life, Death, Rebirth", "Royal Academy of Arts (RA)", "London", "03.2019"],
  ["MMCA Hyundai Motor Series 2018: CHOIJEONGHWA - Blooming Matrix", "MMCA (National Museum of Modern and Contemporary Art)", "Seoul", "02.2019"],
];

export const exhibitions: Exhibition[] = rows.map(
  ([title, venue, city, date, note]) => ({ title, venue, city, date, note }),
);

export const exhibitionYear = (e: Exhibition) => e.date.split(".").pop() ?? "";
