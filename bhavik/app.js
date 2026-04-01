/* ═══════════════════════════════════════════════════════
   ENTERTAINMENT HUB — app.js
   Smart local recommendation engine + TMDB live images
   NO external API needed — works offline too!
═══════════════════════════════════════════════════════ */

// ── TMDB CONFIG (free read-only) ─────────────────────
const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_BACKUP = 'https://image.tmdb.org/t/p/w342';
const TMDB_BASE = 'https://api.themoviedb.org/3';

// ── STATE ─────────────────────────────────────────────
const State = {
  type: null, genres: [], results: [],
  filter: 'all', modal: null,
};

const TYPE_LABEL = { anime:'Anime', webseries:'Web Series', movie:'Movie' };
const TYPE_EMOJI = { anime:'⛩️', webseries:'📺', movie:'🎬' };

const GENRES = [
  'Action','Adventure','Comedy','Drama','Romance','Horror','Thriller',
  'Sci-Fi','Fantasy','Mystery','Slice of Life','Supernatural','Historical',
  'Sports','Psychological','Crime','Documentary','Animation','Musical','Family'
];

// ═══════════════════════════════════════════════════════
//  MASTER DATABASE — 120+ titles with TMDB IDs for images
// ═══════════════════════════════════════════════════════
const DB = {

  // ────────────── ANIME ──────────────
  anime: [
    {
      title:'Attack on Titan', year:2013, rating:9.0,
      episodes_or_runtime:'87 eps', status:'Completed',
      studio_or_network:'MAPPA / Wit Studio', country:'Japan', language:'Japanese',
      director_or_creator:'Hajime Isayama', cast:'Yuki Kaji, Yui Ishikawa, Marina Inoue',
      genres:['Action','Drama','Supernatural','Mystery','Psychological'],
      synopsis:'In a world where humanity lives inside cities surrounded by enormous walls protecting them from Titans — gigantic humanoid creatures who devour humans seemingly without reason — young Eren Yeager vows to exterminate them after a Colossal Titan breaches the wall and causes the death of his mother. As Eren and his friends join the Survey Corps, dark secrets about the Titans and the world begin to unravel.',
      why_watch:'The most epic anime ever made — every season raises the stakes higher until a mind-blowing finale that redefines the genre.',
      where_to_watch:'Crunchyroll, Netflix', icon:'⚔️', tmdb_id:1429, tmdb_type:'tv'
    },
    {
      title:'Fullmetal Alchemist: Brotherhood', year:2009, rating:9.1,
      episodes_or_runtime:'64 eps', status:'Completed',
      studio_or_network:'Bones', country:'Japan', language:'Japanese',
      director_or_creator:'Yasuhiro Irie', cast:'Romi Park, Rie Kugimiya, Shinichiro Miki',
      genres:['Action','Adventure','Fantasy','Drama'],
      synopsis:'Two brothers, Edward and Alphonse Elric, use alchemy in an attempt to resurrect their deceased mother, but the failed attempt costs Edward his left leg and right arm, and Alphonse his entire body. Now Edward, a State Alchemist, and his brother (soul bound to armor) journey to find the Philosopher\'s Stone to restore their bodies while uncovering a massive government conspiracy.',
      why_watch:'The perfect anime — impeccable pacing, emotional depth, incredible action, and a satisfying conclusion that almost no other series matches.',
      where_to_watch:'Crunchyroll, Netflix', icon:'⚗️', tmdb_id:31911, tmdb_type:'tv'
    },
    {
      title:'Death Note', year:2006, rating:9.0,
      episodes_or_runtime:'37 eps', status:'Completed',
      studio_or_network:'Madhouse', country:'Japan', language:'Japanese',
      director_or_creator:'Tetsuro Araki', cast:'Mamoru Miyano, Brad Swaile, Alessandro Juliani',
      genres:['Psychological','Thriller','Mystery','Crime','Supernatural'],
      synopsis:'When genius high school student Light Yagami finds a supernatural notebook dropped by a shinigami (death god) that can kill anyone whose name is written in it, he decides to use it to create a utopian world free of crime. But genius detective L is hot on his trail in a deadly game of cat-and-mouse that will test the limits of intelligence, morality, and god-like power.',
      why_watch:'The ultimate psychological thriller — a battle of wits so intense you\'ll be holding your breath every episode.',
      where_to_watch:'Netflix, Crunchyroll', icon:'📓', tmdb_id:13916, tmdb_type:'tv'
    },
    {
      title:'Demon Slayer', year:2019, rating:8.7,
      episodes_or_runtime:'44 eps', status:'Ongoing',
      studio_or_network:'ufotable', country:'Japan', language:'Japanese',
      director_or_creator:'Haruo Sotozaki', cast:'Natsuki Hanae, Akari Kito, Yoshitsugu Matsuoka',
      genres:['Action','Adventure','Supernatural','Fantasy','Drama'],
      synopsis:'After his family is slaughtered by demons and his sister Nezuko is turned into one, Tanjiro Kamado becomes a demon slayer sworn to protect humans and find a cure for his sister. With some of the most breathtaking animation ever produced, his journey through a feudal-era Japan filled with demons is as beautiful as it is brutal.',
      why_watch:'The most visually stunning anime ever made — ufotable\'s animation will genuinely make your jaw drop.',
      where_to_watch:'Crunchyroll, Netflix', icon:'🗡️', tmdb_id:85937, tmdb_type:'tv'
    },
    {
      title:'Hunter x Hunter (2011)', year:2011, rating:9.0,
      episodes_or_runtime:'148 eps', status:'Completed',
      studio_or_network:'Madhouse', country:'Japan', language:'Japanese',
      director_or_creator:'Hiroshi Koujina', cast:'Megumi Han, Mariya Ise, Daisuke Namikawa',
      genres:['Action','Adventure','Fantasy','Psychological'],
      synopsis:'Young Gon Freecss sets out to become a Hunter like his absent father, passing the legendary Hunter Exam and meeting lifelong friends and rivals. What starts as a classic adventure anime transforms into one of the darkest, most complex explorations of human psychology, morality, and power ever written.',
      why_watch:'Starts fun, gets profound — the Chimera Ant arc alone is considered one of the greatest pieces of storytelling in any medium.',
      where_to_watch:'Netflix, Crunchyroll', icon:'🎯', tmdb_id:46298, tmdb_type:'tv'
    },
    {
      title:'Spirited Away', year:2001, rating:8.6,
      episodes_or_runtime:'2h 5min', status:'Released',
      studio_or_network:'Studio Ghibli', country:'Japan', language:'Japanese',
      director_or_creator:'Hayao Miyazaki', cast:'Daveigh Chase, Suzanne Pleshette',
      genres:['Adventure','Fantasy','Animation','Family'],
      synopsis:'Ten-year-old Chihiro stumbles into a mysterious spirit world and her parents are transformed into pigs by a witch. She must work in a magical bathhouse and find a way to free her family. Miyazaki crafts a dreamlike world full of strange creatures, hidden meanings, and the most imaginative environment ever put to screen.',
      why_watch:'The greatest animated film ever made — a visual and emotional feast that works for all ages.',
      where_to_watch:'Netflix, HBO Max', icon:'🏮', tmdb_id:129, tmdb_type:'movie'
    },
    {
      title:'Vinland Saga', year:2019, rating:8.8,
      episodes_or_runtime:'48 eps', status:'Ongoing',
      studio_or_network:'Wit Studio / MAPPA', country:'Japan', language:'Japanese',
      director_or_creator:'Shuhei Yabuta', cast:'Yuto Uemura, Hiroki Yasumoto',
      genres:['Action','Adventure','Historical','Drama','Psychological'],
      synopsis:'Set in 11th century Europe during the Viking Age, young Thorfinn burns for revenge against the mercenary leader Askeladd who killed his father. This epic saga evolves from revenge thriller to a profound meditation on war, violence, and what it truly means to be a warrior in a brutal world.',
      why_watch:'The most mature and emotionally complex anime in recent years — it will change how you think about violence and redemption.',
      where_to_watch:'Amazon Prime, Crunchyroll', icon:'🪓', tmdb_id:91586, tmdb_type:'tv'
    },
    {
      title:'One Punch Man', year:2015, rating:8.8,
      episodes_or_runtime:'24 eps', status:'Ongoing',
      studio_or_network:'Madhouse', country:'Japan', language:'Japanese',
      director_or_creator:'Shingo Natsume', cast:'Makoto Furukawa, Kaito Ishikawa',
      genres:['Action','Comedy','Supernatural'],
      synopsis:'Saitama is a superhero who can defeat any enemy with a single punch. The only problem? His overwhelming power has made him bored — he feels nothing from fighting anymore. This genius satire of superhero culture is both hilarious and surprisingly touching.',
      why_watch:'The funniest and most inventive take on superhero tropes ever — with genuinely incredible action sequences.',
      where_to_watch:'Netflix, Crunchyroll', icon:'👊', tmdb_id:63926, tmdb_type:'tv'
    },
    {
      title:'Jujutsu Kaisen', year:2020, rating:8.6,
      episodes_or_runtime:'36 eps', status:'Ongoing',
      studio_or_network:'MAPPA', country:'Japan', language:'Japanese',
      director_or_creator:'Sunghoo Park', cast:'Junya Enoki, Yuma Uchida, Asami Seto',
      genres:['Action','Supernatural','Fantasy','Horror'],
      synopsis:'After swallowing a cursed finger belonging to the mighty Ryomen Sukuna, high schooler Yuji Itadori is thrown into the world of jujutsu sorcerers who battle cursed spirits. With explosive fights, loveable characters, and genuine emotional stakes, it\'s one of the best modern shonen anime.',
      why_watch:'The best action animation in the game right now — MAPPA\'s fight choreography is absolutely unreal.',
      where_to_watch:'Crunchyroll', icon:'🌀', tmdb_id:95479, tmdb_type:'tv'
    },
    {
      title:'Neon Genesis Evangelion', year:1995, rating:8.5,
      episodes_or_runtime:'26 eps', status:'Completed',
      studio_or_network:'Gainax', country:'Japan', language:'Japanese',
      director_or_creator:'Hideaki Anno', cast:'Megumi Ogata, Megumi Hayashibara, Kotono Mitsuishi',
      genres:['Action','Sci-Fi','Psychological','Drama'],
      synopsis:'Teenager Shinji Ikari is recruited by his father to pilot a giant biomechanical mecha called an "Evangelion" to fight monstrous beings called Angels threatening humanity. What begins as a classic mecha action show transforms into a devastating psychological exploration of depression, identity, and human connection.',
      why_watch:'The anime that changed everything — a psychological masterpiece that is still being analyzed and debated 30 years later.',
      where_to_watch:'Netflix', icon:'🤖', tmdb_id:777, tmdb_type:'tv'
    },
    {
      title:'Your Lie in April', year:2014, rating:8.7,
      episodes_or_runtime:'22 eps', status:'Completed',
      studio_or_network:'A-1 Pictures', country:'Japan', language:'Japanese',
      director_or_creator:'Kyohei Ishiguro', cast:'Natsuki Hanae, Risa Taneda',
      genres:['Romance','Drama','Musical','Slice of Life'],
      synopsis:'Piano prodigy Kousei Arima stopped hearing the sound of his piano after his mother\'s death. When he meets free-spirited violinist Kaori Miyazono, she drags him back into the musical world with her unconventional playing style. A deeply emotional love story told through the language of classical music.',
      why_watch:'The most beautiful and devastating romance anime ever made — bring tissues for the final episodes.',
      where_to_watch:'Netflix, Crunchyroll', icon:'🎹', tmdb_id:61654, tmdb_type:'tv'
    },
    {
      title:'Steins;Gate', year:2011, rating:9.1,
      episodes_or_runtime:'24 eps', status:'Completed',
      studio_or_network:'White Fox', country:'Japan', language:'Japanese',
      director_or_creator:'Hiroshi Hamasaki', cast:'Mamoru Miyano, Asami Imai',
      genres:['Sci-Fi','Thriller','Mystery','Drama','Romance'],
      synopsis:'Self-proclaimed mad scientist Rintaro Okabe accidentally discovers time travel through a modified microwave. What starts as playful experimentation turns deadly serious when he realizes that changing the past has catastrophic consequences — and he must relive the same days over and over to save someone he loves.',
      why_watch:'The best time travel story ever told in any medium — the second half is one of the most emotionally intense experiences in anime.',
      where_to_watch:'Crunchyroll, Funimation', icon:'🧪', tmdb_id:40639, tmdb_type:'tv'
    },
    {
      title:'Haikyuu!!', year:2014, rating:8.7,
      episodes_or_runtime:'85 eps', status:'Completed',
      studio_or_network:'Production I.G', country:'Japan', language:'Japanese',
      director_or_creator:'Susumu Mitsunaka', cast:'Ayumu Murase, Koki Uchiyama',
      genres:['Sports','Comedy','Drama','Action'],
      synopsis:'Short in stature but big in heart, Hinata Shoyo dreams of becoming a great volleyball player despite his height. After a humiliating loss in middle school, he enters high school and teams up with his genius rival to become the most unexpected volleyball duo in the sport\'s history.',
      why_watch:'The greatest sports anime ever — it makes volleyball genuinely exciting and the characters are unforgettable.',
      where_to_watch:'Netflix, Crunchyroll', icon:'🏐', tmdb_id:42248, tmdb_type:'tv'
    },
    {
      title:'Mob Psycho 100', year:2016, rating:8.7,
      episodes_or_runtime:'37 eps', status:'Completed',
      studio_or_network:'Bones', country:'Japan', language:'Japanese',
      director_or_creator:'Yuzuru Tachikawa', cast:'Setsuo Ito, Takahiro Sakurai',
      genres:['Action','Comedy','Supernatural','Psychological'],
      synopsis:'Shigeo "Mob" Kageyama is an incredibly powerful esper (psychic) who suppresses his emotions to keep his powers in check. Working as an assistant to the fraudulent spirit medium Reigen, Mob navigates adolescence, friendship, and the consequences of immense power in this visually explosive and emotionally resonant series.',
      why_watch:'The most underrated anime — Bones\' animation is phenomenal and it has genuine things to say about self-worth and growing up.',
      where_to_watch:'Crunchyroll', icon:'💥', tmdb_id:65513, tmdb_type:'tv'
    },
    {
      title:'Sword Art Online', year:2012, rating:7.5,
      episodes_or_runtime:'96 eps', status:'Completed',
      studio_or_network:'A-1 Pictures', country:'Japan', language:'Japanese',
      director_or_creator:'Tomohiko Ito', cast:'Yoshitsugu Matsuoka, Haruka Tomatsu',
      genres:['Action','Adventure','Romance','Fantasy','Sci-Fi'],
      synopsis:'In 2022, players of virtual MMORPG "Sword Art Online" are trapped inside the game and cannot log out — dying in the game means dying in real life. Kirito, a solo gamer, must clear all 100 floors of the game\'s castle to free everyone. Part action anime, part love story, part existential exploration of virtual identity.',
      why_watch:'The anime that defined the isekai/virtual world genre — essential viewing for any anime fan.',
      where_to_watch:'Netflix, Crunchyroll', icon:'⚔️', tmdb_id:45782, tmdb_type:'tv'
    },
    {
      title:'Cowboy Bebop', year:1998, rating:8.9,
      episodes_or_runtime:'26 eps', status:'Completed',
      studio_or_network:'Sunrise', country:'Japan', language:'Japanese',
      director_or_creator:'Shinichiro Watanabe', cast:'Koichi Yamadera, Unsho Ishizuka',
      genres:['Action','Sci-Fi','Adventure','Crime'],
      synopsis:'In 2071, bounty hunters (called "cowboys") Spike Spiegel and Jet Black travel the solar system on their spaceship Bebop, picking up odd companions along the way. Each episode is a self-contained story blending western, noir, and jazz influences into the most stylistically unique anime ever created.',
      why_watch:'The coolest anime ever made — Yoko Kanno\'s jazz soundtrack alone is worth the watch.',
      where_to_watch:'Netflix, Funimation', icon:'🎷', tmdb_id:30991, tmdb_type:'tv'
    },
    {
      title:'Naruto Shippuden', year:2007, rating:8.5,
      episodes_or_runtime:'500 eps', status:'Completed',
      studio_or_network:'Pierrot', country:'Japan', language:'Japanese',
      director_or_creator:'Hayato Date', cast:'Junko Takeuchi, Chie Nakamura, Noriaki Sugiyama',
      genres:['Action','Adventure','Fantasy','Drama'],
      synopsis:'Picking up two and a half years after the original series, Naruto returns from training with Jiraiya to find his home village under threat. The saga expands into an epic war involving every ninja nation, uncovering the true origins of shinobi conflict and pushing Naruto toward his destiny as a legendary ninja.',
      why_watch:'The Pain Arc and Naruto vs Sasuke fights are some of the greatest moments in anime history.',
      where_to_watch:'Netflix, Crunchyroll', icon:'🍥', tmdb_id:1535, tmdb_type:'tv'
    },
    {
      title:'Re:Zero − Starting Life in Another World', year:2016, rating:8.4,
      episodes_or_runtime:'50 eps', status:'Completed',
      studio_or_network:'White Fox', country:'Japan', language:'Japanese',
      director_or_creator:'Masahiko Otsuka', cast:'Yusuke Kobayashi, Rie Takahashi',
      genres:['Fantasy','Psychological','Drama','Mystery','Romance'],
      synopsis:'Subaru Natsuki is suddenly transported to a fantasy world where he discovers he has the ability to "Return by Death" — reviving at a save point whenever he dies. What seems like a cheat power becomes a horrifying curse as he watches everyone he loves die over and over, desperately searching for a way to save them.',
      why_watch:'The most psychologically intense isekai ever — the "end" of episode 18 broke the entire anime community.',
      where_to_watch:'Crunchyroll', icon:'⏰', tmdb_id:65423, tmdb_type:'tv'
    },
    {
      title:'Dragon Ball Z', year:1989, rating:8.7,
      episodes_or_runtime:'291 eps', status:'Completed',
      studio_or_network:'Toei Animation', country:'Japan', language:'Japanese',
      director_or_creator:'Daisuke Nishio', cast:'Masako Nozawa, Ryō Horikawa',
      genres:['Action','Adventure','Fantasy','Comedy'],
      synopsis:'Five years after the original Dragon Ball, Goku is now married with a son named Gohan. When his alien brother Raditz reveals Goku\'s true origins as a Saiyan warrior, it begins a saga of increasingly powerful villains — from the terrifying Frieza to the artificial Cell to the devastating Majin Buu — each arc bigger than the last.',
      why_watch:'The defining action anime of a generation — if you haven\'t seen it, you\'ve missed the foundation of everything that came after.',
      where_to_watch:'Crunchyroll, Funimation', icon:'⚡', tmdb_id:12971, tmdb_type:'tv'
    },
    {
      title:'Chainsaw Man', year:2022, rating:8.5,
      episodes_or_runtime:'12 eps', status:'Ongoing',
      studio_or_network:'MAPPA', country:'Japan', language:'Japanese',
      director_or_creator:'Ryu Nakayama', cast:'Kikunosuke Toya, Tomori Kusunoki',
      genres:['Action','Horror','Supernatural','Comedy'],
      synopsis:'Denji is a destitute devil hunter who merges with his devil dog Pochita to become the Chainsaw Man after being betrayed and killed. Now working for the government\'s Public Safety Devil Hunters under the stoic Makima, he navigates a brutal world of monsters, conspiracies, and human desire in the most chaotically entertaining way.',
      why_watch:'MAPPA\'s most insane production — every episode is a cinematic event with stunning animation and zero filter.',
      where_to_watch:'Crunchyroll', icon:'🔪', tmdb_id:114410, tmdb_type:'tv'
    },
    {
      title:'Blue Period', year:2021, rating:7.8,
      episodes_or_runtime:'12 eps', status:'Completed',
      studio_or_network:'Seven Arcs', country:'Japan', language:'Japanese',
      director_or_creator:'Koji Masunari', cast:'Hiromu Mineta, Yumiri Hanamori',
      genres:['Drama','Slice of Life','Documentary'],
      synopsis:'Popular but hollow high schooler Yatora Yaguchi discovers a passion for art after seeing a painting that moves him to tears. He decides to pursue admission to Tokyo University of the Arts — the most prestigious and competitive art school in Japan. A rare anime about creative passion, artistic struggle, and finding your true self.',
      why_watch:'The most inspiring anime about creativity — it will make you want to pick up a paint brush.',
      where_to_watch:'Netflix', icon:'🎨', tmdb_id:91853, tmdb_type:'tv'
    },
  ],

  // ────────────── WEB SERIES ──────────────
  webseries: [
    {
      title:'Breaking Bad', year:2008, rating:9.5,
      episodes_or_runtime:'62 eps', status:'Completed',
      studio_or_network:'AMC / Netflix', country:'USA', language:'English',
      director_or_creator:'Vince Gilligan', cast:'Bryan Cranston, Aaron Paul, Anna Gunn',
      genres:['Crime','Drama','Thriller','Psychological'],
      synopsis:'Walter White, a mild-mannered high school chemistry teacher, is diagnosed with terminal lung cancer. To secure his family\'s financial future, he partners with former student Jesse Pinkman to manufacture and sell crystal methamphetamine. His transformation from "Mr. Chips to Scarface" is one of the greatest character arcs in television history.',
      why_watch:'The greatest TV series ever made — flawless writing, performances, and direction across all 5 seasons.',
      where_to_watch:'Netflix', icon:'⚗️', tmdb_id:1396, tmdb_type:'tv'
    },
    {
      title:'Stranger Things', year:2016, rating:8.7,
      episodes_or_runtime:'42 eps', status:'Completed',
      studio_or_network:'Netflix', country:'USA', language:'English',
      director_or_creator:'The Duffer Brothers', cast:'Millie Bobby Brown, Finn Wolfhard, David Harbour',
      genres:['Sci-Fi','Horror','Mystery','Thriller','Drama'],
      synopsis:'When a boy named Will Byers disappears in the small town of Hawkins, Indiana, his friends, family, and a local police chief search for answers — stumbling upon a secret government lab, terrifying supernatural forces, and a strange girl named Eleven with psychokinetic abilities. A love letter to 80s pop culture soaked in mystery.',
      why_watch:'Pure nostalgic magic with genuine scares — one of Netflix\'s greatest achievements.',
      where_to_watch:'Netflix', icon:'🔦', tmdb_id:66732, tmdb_type:'tv'
    },
    {
      title:'Game of Thrones', year:2011, rating:9.2,
      episodes_or_runtime:'73 eps', status:'Completed',
      studio_or_network:'HBO', country:'USA', language:'English',
      director_or_creator:'David Benioff, D.B. Weiss', cast:'Emilia Clarke, Kit Harington, Peter Dinklage',
      genres:['Fantasy','Drama','Action','Adventure'],
      synopsis:'Noble houses of the fictional continents of Westeros and Essos fight for the Iron Throne while an ancient evil awakens in the north. Based on George R.R. Martin\'s books, this epic spans continents, characters, and decades of politics, betrayal, love, and war — where anyone can die at any moment.',
      why_watch:'Seasons 1-4 are peak television drama that permanently raised the bar for storytelling on TV.',
      where_to_watch:'HBO Max', icon:'🐉', tmdb_id:1399, tmdb_type:'tv'
    },
    {
      title:'The Boys', year:2019, rating:8.7,
      episodes_or_runtime:'32 eps', status:'Ongoing',
      studio_or_network:'Amazon Prime', country:'USA', language:'English',
      director_or_creator:'Eric Kripke', cast:'Karl Urban, Jack Quaid, Antony Starr',
      genres:['Action','Comedy','Thriller','Sci-Fi'],
      synopsis:'In a world where superheroes are celebrities managed by a powerful corporation called Vought International, their public image hides a dark reality of narcissism, corruption, and violence. A group of vigilantes known as "The Boys" set out to expose them, led by the loveable foul-mouthed Billy Butcher.',
      why_watch:'The most insane and satirically brilliant show on TV — a devastating takedown of celebrity culture and corporate power.',
      where_to_watch:'Amazon Prime Video', icon:'💥', tmdb_id:76479, tmdb_type:'tv'
    },
    {
      title:'Dark', year:2017, rating:8.8,
      episodes_or_runtime:'26 eps', status:'Completed',
      studio_or_network:'Netflix', country:'Germany', language:'German',
      director_or_creator:'Baran bo Odar, Jantje Friese', cast:'Louis Hofmann, Oliver Masucci',
      genres:['Sci-Fi','Mystery','Thriller','Drama'],
      synopsis:'When two children go missing in the small German town of Winden, four interconnected families unravel a conspiracy that spans several generations. A dark mystery that weaves time travel, alternate dimensions, and the concept of fate into the most mind-bending story ever put on television.',
      why_watch:'The most intelligent TV show ever made — impossible to predict and impossible to stop watching.',
      where_to_watch:'Netflix', icon:'🌀', tmdb_id:70523, tmdb_type:'tv'
    },
    {
      title:'The Crown', year:2016, rating:8.6,
      episodes_or_runtime:'60 eps', status:'Completed',
      studio_or_network:'Netflix', country:'UK', language:'English',
      director_or_creator:'Peter Morgan', cast:'Claire Foy, Olivia Colman, Imelda Staunton',
      genres:['Drama','Historical','Romance'],
      synopsis:'The intimate story of Queen Elizabeth II\'s reign from her marriage to Prince Philip in 1947 through to modern times. A lavishly produced drama that humanizes the British Royal Family — showing the impossible choices between personal happiness and duty to the Crown.',
      why_watch:'The most beautifully produced historical drama on television — every season is an event.',
      where_to_watch:'Netflix', icon:'👑', tmdb_id:65494, tmdb_type:'tv'
    },
    {
      title:'Money Heist (La Casa de Papel)', year:2017, rating:8.2,
      episodes_or_runtime:'41 eps', status:'Completed',
      studio_or_network:'Netflix', country:'Spain', language:'Spanish',
      director_or_creator:'Álex Pina', cast:'Úrsula Corberó, Álvaro Morte, Itziar Ituño',
      genres:['Crime','Thriller','Action','Drama'],
      synopsis:'A criminal mastermind known only as "The Professor" recruits eight thieves to carry out an elaborate heist on the Royal Mint of Spain, taking hostages and locking themselves inside. The most meticulous, twisting heist story ever told — where every episode ends with a bigger cliffhanger than the last.',
      why_watch:'The most addictive international show on Netflix — you will not sleep until you finish it.',
      where_to_watch:'Netflix', icon:'💰', tmdb_id:71446, tmdb_type:'tv'
    },
    {
      title:'Squid Game', year:2021, rating:8.0,
      episodes_or_runtime:'9 eps', status:'Ongoing',
      studio_or_network:'Netflix', country:'South Korea', language:'Korean',
      director_or_creator:'Hwang Dong-hyuk', cast:'Lee Jung-jae, Park Hae-soo, Wi Ha-joon',
      genres:['Thriller','Drama','Action','Mystery'],
      synopsis:'Hundreds of cash-strapped contestants accept a strange invitation to compete in children\'s games. Behind closed doors, the seemingly harmless games turn deadly, with massive prize money awaiting the last survivor. A visceral critique of capitalism and inequality wrapped in the most gripping survival thriller ever made.',
      why_watch:'The most watched show in Netflix history — and it absolutely deserves every view it got.',
      where_to_watch:'Netflix', icon:'🦑', tmdb_id:93405, tmdb_type:'tv'
    },
    {
      title:'Chernobyl', year:2019, rating:9.4,
      episodes_or_runtime:'5 eps', status:'Completed',
      studio_or_network:'HBO', country:'UK/USA', language:'English',
      director_or_creator:'Johan Renck', cast:'Jared Harris, Stellan Skarsgård, Emily Watson',
      genres:['Historical','Drama','Thriller'],
      synopsis:'The true story of one of the worst man-made catastrophes in history — the nuclear accident at the Chernobyl power plant in 1986 and the lies, heroism, and cover-up that followed. The highest-rated TV series on IMDb and for good reason.',
      why_watch:'The most powerful and important miniseries ever made — terrifying because it\'s 100% true.',
      where_to_watch:'HBO Max', icon:'☢️', tmdb_id:87108, tmdb_type:'tv'
    },
    {
      title:'Black Mirror', year:2011, rating:8.8,
      episodes_or_runtime:'22 eps', status:'Ongoing',
      studio_or_network:'Netflix / Channel 4', country:'UK', language:'English',
      director_or_creator:'Charlie Brooker', cast:'Various cast each episode',
      genres:['Sci-Fi','Thriller','Drama','Psychological'],
      synopsis:'An anthology series exploring dark, satirical stories about modern society and the unintended consequences of new technology. Each episode is a standalone story set in a slightly different version of our present — from social media scores that control access to society to video game consciousness.',
      why_watch:'The show that predicted the future multiple times — each episode makes you think about technology in a new unsettling way.',
      where_to_watch:'Netflix', icon:'📱', tmdb_id:42009, tmdb_type:'tv'
    },
    {
      title:'House of the Dragon', year:2022, rating:8.4,
      episodes_or_runtime:'18 eps', status:'Ongoing',
      studio_or_network:'HBO', country:'USA', language:'English',
      director_or_creator:'Ryan Condal, Miguel Sapochnik', cast:'Paddy Considine, Matt Smith, Emma D\'Arcy',
      genres:['Fantasy','Drama','Action','Historical'],
      synopsis:'Set 200 years before Game of Thrones, this prequel chronicles the beginning of the end of House Targaryen — the Dance of the Dragons civil war. With more dragons than ever and equally brutal political maneuvering, it\'s the Game of Thrones successor fans needed.',
      why_watch:'More dragons, more chaos — a worthy successor to early Game of Thrones with incredible production value.',
      where_to_watch:'HBO Max', icon:'🐲', tmdb_id:94997, tmdb_type:'tv'
    },
    {
      title:'The Witcher', year:2019, rating:8.1,
      episodes_or_runtime:'24 eps', status:'Completed',
      studio_or_network:'Netflix', country:'USA', language:'English',
      director_or_creator:'Lauren Schmidt Hissrich', cast:'Henry Cavill, Anya Chalotra, Freya Allan',
      genres:['Fantasy','Action','Adventure','Drama'],
      synopsis:'Geralt of Rivia, a mutated monster-hunter called a witcher, struggles to find his place in a world where people often prove more wicked than monsters. Three intertwining storylines across time explore destiny, magic, and what it means to be human in a morally grey world.',
      why_watch:'Henry Cavill IS Geralt — the best fantasy casting in TV history in a brilliantly world-built series.',
      where_to_watch:'Netflix', icon:'🗡️', tmdb_id:71912, tmdb_type:'tv'
    },
    {
      title:'Peaky Blinders', year:2013, rating:8.8,
      episodes_or_runtime:'36 eps', status:'Completed',
      studio_or_network:'BBC / Netflix', country:'UK', language:'English',
      director_or_creator:'Steven Knight', cast:'Cillian Murphy, Helen McCrory, Tom Hardy',
      genres:['Crime','Drama','Historical','Action'],
      synopsis:'Following the aftermath of World War I, the Shelby crime family rises from the streets of Birmingham\'s Small Heath neighborhood to become one of the most powerful criminal enterprises in Britain. Led by the razor-sharp Tommy Shelby, their ambitions reach from street gangs to parliament.',
      why_watch:'The most stylish crime drama ever made — Cillian Murphy\'s Tommy Shelby is one of TV\'s greatest characters.',
      where_to_watch:'Netflix', icon:'🎩', tmdb_id:60574, tmdb_type:'tv'
    },
    {
      title:'Severance', year:2022, rating:8.7,
      episodes_or_runtime:'18 eps', status:'Ongoing',
      studio_or_network:'Apple TV+', country:'USA', language:'English',
      director_or_creator:'Dan Erickson', cast:'Adam Scott, Britt Lower, Christopher Walken',
      genres:['Sci-Fi','Mystery','Thriller','Psychological'],
      synopsis:'Employees of Lumon Industries undergo a "severance" procedure that surgically divides their memories between work and personal life. Mark Scout leads a team whose members have a mysterious office existence while their outside lives hold answers to a deeper conspiracy. Possibly the best sci-fi concept of this decade.',
      why_watch:'The most original and unsettling sci-fi show in years — you will think about it for weeks.',
      where_to_watch:'Apple TV+', icon:'🏢', tmdb_id:95396, tmdb_type:'tv'
    },
    {
      title:'The Last of Us', year:2023, rating:8.8,
      episodes_or_runtime:'9 eps', status:'Ongoing',
      studio_or_network:'HBO', country:'USA', language:'English',
      director_or_creator:'Craig Mazin, Neil Druckmann', cast:'Pedro Pascal, Bella Ramsey',
      genres:['Drama','Horror','Thriller','Action','Sci-Fi'],
      synopsis:'Twenty years after a fungal outbreak destroys civilization, hardened survivor Joel must smuggle 14-year-old Ellie — who is mysteriously immune to the infection — across the dangerous ruins of the USA. A deeply human story about love, loss, and what we become to protect those we care about.',
      why_watch:'The greatest video game adaptation ever made — episode 3 alone will make you cry for a week.',
      where_to_watch:'HBO Max', icon:'🍄', tmdb_id:100088, tmdb_type:'tv'
    },
    {
      title:'Succession', year:2018, rating:8.9,
      episodes_or_runtime:'39 eps', status:'Completed',
      studio_or_network:'HBO', country:'USA', language:'English',
      director_or_creator:'Jesse Armstrong', cast:'Brian Cox, Jeremy Strong, Sarah Snook',
      genres:['Drama','Comedy','Psychological','Crime'],
      synopsis:'The Roy family controls one of the biggest media and entertainment conglomerates in the world. When the aging patriarch Logan Roy considers retirement, his four children — each damaged in different ways — jostle for power in a series of betrayals, schemes, and spectacularly bad decisions.',
      why_watch:'The sharpest writing on television — every episode feels like a literary novel compressed into 50 minutes.',
      where_to_watch:'HBO Max', icon:'💼', tmdb_id:76331, tmdb_type:'tv'
    },
    {
      title:'Ozark', year:2017, rating:8.4,
      episodes_or_runtime:'44 eps', status:'Completed',
      studio_or_network:'Netflix', country:'USA', language:'English',
      director_or_creator:'Bill Dubuque, Mark Williams', cast:'Jason Bateman, Laura Linney, Julia Garner',
      genres:['Crime','Drama','Thriller'],
      synopsis:'Financial advisor Marty Byrde relocates his family to the Missouri Ozarks after a money-laundering scheme goes wrong and he must clean $500 million for a Mexican drug cartel to save his family\'s lives. Darker than Breaking Bad and with arguably better supporting characters.',
      why_watch:'Julia Garner\'s Ruth Langmore is the best TV character of the 2020s — an absolute must-watch crime drama.',
      where_to_watch:'Netflix', icon:'🌊', tmdb_id:69740, tmdb_type:'tv'
    },
    {
      title:'Wednesday', year:2022, rating:8.1,
      episodes_or_runtime:'8 eps', status:'Ongoing',
      studio_or_network:'Netflix', country:'USA', language:'English',
      director_or_creator:'Alfred Gough, Miles Millar', cast:'Jenna Ortega, Gwendoline Christie',
      genres:['Comedy','Mystery','Horror','Fantasy'],
      synopsis:'Wednesday Addams is sent to Nevermore Academy — a school for outcasts with supernatural abilities — where she investigates a monster killing spree while navigating new friendships and a mysterious connection to her own past. Jenna Ortega is absolute perfection as the iconic character.',
      why_watch:'The most fun and stylish Netflix show in years — Jenna Ortega redefines a cultural icon.',
      where_to_watch:'Netflix', icon:'🖤', tmdb_id:119051, tmdb_type:'tv'
    },
    {
      title:'Mirzapur', year:2018, rating:8.4,
      episodes_or_runtime:'20 eps', status:'Ongoing',
      studio_or_network:'Amazon Prime Video', country:'India', language:'Hindi',
      director_or_creator:'Karan Anshuman, Gurmmeet Singh', cast:'Pankaj Tripathi, Ali Fazal, Vikrant Massey',
      genres:['Crime','Action','Drama','Thriller'],
      synopsis:'In the violent criminal underworld of Purvanchal, UP, the powerful Tripathi family controls the drug and weapons trade. When two brothers Guddu and Bablu get entangled with the fearsome Kaleen Bhaiya and his unpredictable son Munna, it sets off a chain of events that will change everyone\'s destiny forever.',
      why_watch:'The most intense Indian crime series ever made — Pankaj Tripathi as Kaleen Bhaiya is pure screen magic.',
      where_to_watch:'Amazon Prime Video', icon:'🔫', tmdb_id:82856, tmdb_type:'tv'
    },
    {
      title:'Sacred Games', year:2018, rating:8.3,
      episodes_or_runtime:'16 eps', status:'Completed',
      studio_or_network:'Netflix', country:'India', language:'Hindi',
      director_or_creator:'Vikramaditya Motwane, Anurag Kashyap', cast:'Saif Ali Khan, Nawazuddin Siddiqui',
      genres:['Crime','Thriller','Drama','Mystery'],
      synopsis:'Mumbai police officer Sartaj Singh receives a mysterious call from notorious gangster Ganesh Gaitonde who claims the city will be destroyed in 25 days. As Sartaj races to unravel the conspiracy, the story cuts between timelines revealing the rise of one of India\'s most feared crime lords and a vast existential threat.',
      why_watch:'India\'s best Netflix original — Nawazuddin Siddiqui\'s performance as Gaitonde is legendary.',
      where_to_watch:'Netflix', icon:'🕵️', tmdb_id:79506, tmdb_type:'tv'
    },
  ],

  // ────────────── MOVIES ──────────────
  movie: [
    {
      title:'Inception', year:2010, rating:8.8,
      episodes_or_runtime:'2h 28min', status:'Released',
      studio_or_network:'Warner Bros / Netflix', country:'USA/UK', language:'English',
      director_or_creator:'Christopher Nolan', cast:'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
      genres:['Sci-Fi','Thriller','Action','Mystery'],
      synopsis:'Dom Cobb is a skilled thief who specializes in the dangerous art of extraction — stealing valuable secrets from deep within the subconscious. Given the seemingly impossible task of "inception" — planting an idea rather than stealing one — he assembles a team to dive into multiple layers of dreams within dreams.',
      why_watch:'The most mind-bending blockbuster ever made — Nolan creates a new language for cinema that no one has matched.',
      where_to_watch:'Netflix, HBO Max', icon:'🌀', tmdb_id:27205, tmdb_type:'movie'
    },
    {
      title:'Interstellar', year:2014, rating:8.7,
      episodes_or_runtime:'2h 49min', status:'Released',
      studio_or_network:'Paramount / Netflix', country:'USA/UK', language:'English',
      director_or_creator:'Christopher Nolan', cast:'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
      genres:['Sci-Fi','Drama','Adventure','Mystery'],
      synopsis:'With Earth dying from a blight that is destroying crops, former NASA pilot Cooper joins a team of astronauts who travel through a newly discovered wormhole near Saturn in search of a new home for humanity. A massive space epic that doubles as an intimate story about a father\'s love for his daughter across time and space.',
      why_watch:'The most emotionally devastating sci-fi film ever made — the docking scene and bookcase scene are cinematic perfection.',
      where_to_watch:'Paramount+, Netflix', icon:'🚀', tmdb_id:157336, tmdb_type:'movie'
    },
    {
      title:'The Dark Knight', year:2008, rating:9.0,
      episodes_or_runtime:'2h 32min', status:'Released',
      studio_or_network:'Warner Bros', country:'USA/UK', language:'English',
      director_or_creator:'Christopher Nolan', cast:'Christian Bale, Heath Ledger, Aaron Eckhart',
      genres:['Action','Crime','Drama','Thriller','Psychological'],
      synopsis:'Batman, Lieutenant Gordon, and District Attorney Harvey Dent form an alliance to dismantle organized crime in Gotham City. Then the Joker arrives — a criminal mastermind of pure chaos who dismantles every plan, corrupts every system, and forces Batman to face an impossible choice that will define what he truly stands for.',
      why_watch:'Heath Ledger\'s Joker is the greatest villain performance in cinema history — this is the peak of superhero filmmaking.',
      where_to_watch:'HBO Max', icon:'🦇', tmdb_id:155, tmdb_type:'movie'
    },
    {
      title:'Parasite', year:2019, rating:8.5,
      episodes_or_runtime:'2h 12min', status:'Released',
      studio_or_network:'CJ Entertainment / HBO', country:'South Korea', language:'Korean',
      director_or_creator:'Bong Joon-ho', cast:'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong',
      genres:['Drama','Thriller','Comedy','Crime','Mystery'],
      synopsis:'All four members of the impoverished Ki family con their way into becoming employed by the ultra-wealthy Park family. A masterful shift in tone takes the film from dark comedy to something far more disturbing. The first non-English film to win Best Picture at the Oscars.',
      why_watch:'The most perfectly constructed film of the 21st century — every single frame is intentional.',
      where_to_watch:'Paramount+, Hulu', icon:'🏠', tmdb_id:496243, tmdb_type:'movie'
    },
    {
      title:'Avengers: Endgame', year:2019, rating:8.4,
      episodes_or_runtime:'3h 1min', status:'Released',
      studio_or_network:'Marvel / Disney+', country:'USA', language:'English',
      director_or_creator:'Anthony & Joe Russo', cast:'Robert Downey Jr., Chris Evans, Scarlett Johansson',
      genres:['Action','Adventure','Sci-Fi','Fantasy'],
      synopsis:'After the devastating events of Infinity War, the remaining Avengers find a way to reverse Thanos\'s actions and restore balance to the universe. The culmination of 22 interconnected films over 11 years — the largest scale storytelling project in cinema history delivers an emotional payoff unlike anything else.',
      why_watch:'The biggest cinematic event of all time — the last hour is the most epic action sequence ever filmed.',
      where_to_watch:'Disney+', icon:'⚡', tmdb_id:299534, tmdb_type:'movie'
    },
    {
      title:'The Shawshank Redemption', year:1994, rating:9.3,
      episodes_or_runtime:'2h 22min', status:'Released',
      studio_or_network:'Warner Bros', country:'USA', language:'English',
      director_or_creator:'Frank Darabont', cast:'Tim Robbins, Morgan Freeman',
      genres:['Drama','Crime'],
      synopsis:'Banker Andy Dufresne is sentenced to life in Shawshank State Prison for the murder of his wife and her lover, despite his claims of innocence. Over two decades, his friendship with fellow prisoner Ellis "Red" Redding and his quiet inner life reveal the power of hope to sustain a man\'s soul through the darkest conditions.',
      why_watch:'The greatest film ever made according to millions — a story of hope so powerful it will stay with you forever.',
      where_to_watch:'Netflix', icon:'🔓', tmdb_id:278, tmdb_type:'movie'
    },
    {
      title:'Oppenheimer', year:2023, rating:8.4,
      episodes_or_runtime:'3h', status:'Released',
      studio_or_network:'Universal / Peacock', country:'USA/UK', language:'English',
      director_or_creator:'Christopher Nolan', cast:'Cillian Murphy, Emily Blunt, Robert Downey Jr.',
      genres:['Historical','Drama','Thriller'],
      synopsis:'The life story of J. Robert Oppenheimer — the brilliant, tortured physicist who led the Manhattan Project to develop the atomic bomb. Nolan\'s most ambitious film explores genius, guilt, political persecution, and the moment humanity permanently changed its relationship with its own destruction.',
      why_watch:'Cillian Murphy delivers the performance of his lifetime in the most important blockbuster of this decade.',
      where_to_watch:'Peacock, Amazon', icon:'☢️', tmdb_id:872585, tmdb_type:'movie'
    },
    {
      title:'Spider-Man: Into the Spider-Verse', year:2018, rating:8.4,
      episodes_or_runtime:'1h 57min', status:'Released',
      studio_or_network:'Sony Pictures / Netflix', country:'USA', language:'English',
      director_or_creator:'Bob Persichetti, Peter Ramsey, Rodney Rothman', cast:'Shameik Moore, Hailee Steinfeld',
      genres:['Animation','Action','Adventure','Comedy'],
      synopsis:'Teenager Miles Morales becomes Spider-Man of his dimension and must join with Spider-Men of other dimensions to stop a threat to all dimensions. Revolutionized the art of animation with its comic-book aesthetic — using different frame rates, halftone dots, and Ben-Day dots to look like a living comic book.',
      why_watch:'The most innovative animated film ever made — it changed what animation is allowed to be.',
      where_to_watch:'Netflix, Disney+', icon:'🕷️', tmdb_id:324857, tmdb_type:'movie'
    },
    {
      title:'Dune: Part One', year:2021, rating:8.0,
      episodes_or_runtime:'2h 35min', status:'Released',
      studio_or_network:'Warner Bros / HBO Max', country:'USA', language:'English',
      director_or_creator:'Denis Villeneuve', cast:'Timothée Chalamet, Zendaya, Oscar Isaac',
      genres:['Sci-Fi','Adventure','Action','Drama','Fantasy'],
      synopsis:'Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. A visually overwhelming adaptation of the greatest sci-fi novel ever written.',
      why_watch:'Denis Villeneuve creates the most awe-inspiring sci-fi world ever put on screen — this is what cinema is for.',
      where_to_watch:'HBO Max', icon:'🏜️', tmdb_id:438631, tmdb_type:'movie'
    },
    {
      title:'Joker', year:2019, rating:8.4,
      episodes_or_runtime:'2h 2min', status:'Released',
      studio_or_network:'Warner Bros / HBO', country:'USA', language:'English',
      director_or_creator:'Todd Phillips', cast:'Joaquin Phoenix, Robert De Niro, Zazie Beetz',
      genres:['Drama','Crime','Thriller','Psychological'],
      synopsis:'Failed comedian Arthur Fleck is rejected and beaten down by Gotham\'s uncaring society. As his mental health deteriorates and random acts of violence make him a symbol of rebellion for the city\'s disaffected, he transforms into the criminal clown Joker. Joaquin Phoenix won the Oscar for this harrowing portrait of a broken man.',
      why_watch:'Joaquin Phoenix\'s most terrifying and mesmerizing performance — an unforgettable character study.',
      where_to_watch:'Netflix, HBO Max', icon:'🃏', tmdb_id:475557, tmdb_type:'movie'
    },
    {
      title:'3 Idiots', year:2009, rating:8.4,
      episodes_or_runtime:'2h 50min', status:'Released',
      studio_or_network:'Vinod Chopra Films', country:'India', language:'Hindi',
      director_or_creator:'Rajkumar Hirani', cast:'Aamir Khan, Madhavan, Sharman Joshi',
      genres:['Comedy','Drama','Romance'],
      synopsis:'Three engineering students — the free-thinking Rancho, the passionate Farhan, and the timid Raju — navigate the brutal pressure-cooker of India\'s elite college system. A hilarious and deeply moving film about the education system, passion vs. expectation, and choosing your own path in life.',
      why_watch:'The most beloved Bollywood film of the century — funny, emotional, and genuinely life-changing.',
      where_to_watch:'Netflix', icon:'🎓', tmdb_id:20132, tmdb_type:'movie'
    },
    {
      title:'Dangal', year:2016, rating:8.3,
      episodes_or_runtime:'2h 41min', status:'Released',
      studio_or_network:'Disney+Hotstar', country:'India', language:'Hindi',
      director_or_creator:'Nitesh Tiwari', cast:'Aamir Khan, Fatima Sana Shaikh, Sanya Malhotra',
      genres:['Drama','Sports','Historical'],
      synopsis:'Former wrestler Mahavir Singh Phogat dreams of winning a gold medal for India. Unable to achieve it himself, he trains his daughters Geeta and Babita to become national and world-level wrestlers despite massive societal resistance. Based on the true story of the Phogat family.',
      why_watch:'The most inspiring sports film ever made in India — it will make you cry and cheer in equal measure.',
      where_to_watch:'Disney+Hotstar, Netflix', icon:'🤼', tmdb_id:341013, tmdb_type:'movie'
    },
    {
      title:'The Godfather', year:1972, rating:9.2,
      episodes_or_runtime:'2h 55min', status:'Released',
      studio_or_network:'Paramount', country:'USA', language:'English',
      director_or_creator:'Francis Ford Coppola', cast:'Marlon Brando, Al Pacino, James Caan',
      genres:['Crime','Drama'],
      synopsis:'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son Michael. The defining film of American cinema — a Shakespearean tragedy about power, family, and the corruption of idealism that invented the modern crime genre.',
      why_watch:'The greatest American film ever made — every scene is a masterclass in filmmaking.',
      where_to_watch:'Paramount+', icon:'🌹', tmdb_id:238, tmdb_type:'movie'
    },
    {
      title:'Everything Everywhere All at Once', year:2022, rating:8.0,
      episodes_or_runtime:'2h 19min', status:'Released',
      studio_or_network:'A24', country:'USA', language:'English',
      director_or_creator:'Daniel Scheinert, Daniel Kwan', cast:'Michelle Yeoh, Stephanie Hsu, Jamie Lee Curtis',
      genres:['Sci-Fi','Comedy','Drama','Action','Fantasy'],
      synopsis:'A middle-aged Chinese-American laundromat owner suddenly discovers she alone can save multiple realities by connecting with parallel universe versions of herself. Won 7 Academy Awards including Best Picture — a chaotic, heartfelt, absurd, and genuinely profound exploration of nihilism, love, and what makes life worth living.',
      why_watch:'The most emotionally overwhelming and inventive film of the decade — A24\'s magnum opus.',
      where_to_watch:'Amazon Prime, A24', icon:'🥢', tmdb_id:545611, tmdb_type:'movie'
    },
    {
      title:'Whiplash', year:2014, rating:8.5,
      episodes_or_runtime:'1h 47min', status:'Released',
      studio_or_network:'Sony Pictures', country:'USA', language:'English',
      director_or_creator:'Damien Chazelle', cast:'Miles Teller, J.K. Simmons',
      genres:['Drama','Musical','Psychological'],
      synopsis:'Nineteen-year-old jazz drummer Andrew Neiman enrolls in a cutthroat music conservatory where he attracts the attention of the academy\'s most respected — and most feared — instructor, Terence Fletcher. Their battle of wills escalates into one of the most intense director-student relationships ever put on screen.',
      why_watch:'J.K. Simmons\' Fletcher is the scariest villain in any film — the final 10 minutes are among the best in modern cinema.',
      where_to_watch:'Netflix, Amazon', icon:'🥁', tmdb_id:244786, tmdb_type:'movie'
    },
    {
      title:'Get Out', year:2017, rating:7.7,
      episodes_or_runtime:'1h 44min', status:'Released',
      studio_or_network:'Universal / Peacock', country:'USA', language:'English',
      director_or_creator:'Jordan Peele', cast:'Daniel Kaluuya, Allison Williams',
      genres:['Horror','Thriller','Mystery','Psychological'],
      synopsis:'Black photographer Chris visits the family estate of his white girlfriend Rose for a weekend. Strange behaviour from the African-American servants, hypnosis, and increasingly disturbing social dynamics reveal something deeply sinister about this picture-perfect family. Jordan Peele\'s debut is a masterful racial allegory wrapped in perfect horror.',
      why_watch:'The most intelligent horror film of the century — every rewatch reveals new layers of meaning.',
      where_to_watch:'Peacock, Netflix', icon:'🌿', tmdb_id:419430, tmdb_type:'movie'
    },
    {
      title:'Top Gun: Maverick', year:2022, rating:8.3,
      episodes_or_runtime:'2h 11min', status:'Released',
      studio_or_network:'Paramount / Netflix', country:'USA', language:'English',
      director_or_creator:'Joseph Kosinski', cast:'Tom Cruise, Miles Teller, Jennifer Connelly',
      genres:['Action','Drama','Adventure'],
      synopsis:'After more than thirty years of service as one of the Navy\'s top aviators, Pete "Maverick" Mitchell is training Top Gun graduates for a specialized mission. The rare sequel that surpasses the original — with Tom Cruise insisting on shooting real footage in real F/A-18 jets at Mach 10.',
      why_watch:'The most fun cinema experience of the decade — practical filmmaking at its absolute finest.',
      where_to_watch:'Paramount+, Netflix', icon:'✈️', tmdb_id:361743, tmdb_type:'movie'
    },
    {
      title:'RRR', year:2022, rating:8.0,
      episodes_or_runtime:'3h 7min', status:'Released',
      studio_or_network:'DVV Entertainment / Netflix', country:'India', language:'Telugu',
      director_or_creator:'S.S. Rajamouli', cast:'N.T. Rama Rao Jr., Ram Charan, Alia Bhatt',
      genres:['Action','Historical','Drama','Adventure'],
      synopsis:'A fictional story about two Indian revolutionaries — Alluri Sitarama Raju and Komaram Bheem — who fought against the British Raj in the 1920s. They form a deep friendship without knowing each other\'s true identities and missions. The most entertaining blockbuster of this decade with action sequences that defy physics.',
      why_watch:'The most insane and joyful action movie ever made — Naatu Naatu alone won the Oscar and deserved it.',
      where_to_watch:'Netflix', icon:'🔥', tmdb_id:759544, tmdb_type:'movie'
    },
    {
      title:'Hereditary', year:2018, rating:7.3,
      episodes_or_runtime:'2h 7min', status:'Released',
      studio_or_network:'A24', country:'USA', language:'English',
      director_or_creator:'Ari Aster', cast:'Toni Collette, Gabriel Byrne, Alex Wolff',
      genres:['Horror','Drama','Mystery','Psychological'],
      synopsis:'When the Graham family\'s mysterious grandmother passes away, her daughter Annie begins to discover disturbing secrets about their ancestry. What unfolds is a devastating exploration of grief, mental illness, and inherited trauma — until it becomes something far more terrifying than a family drama.',
      why_watch:'The scariest film in 20 years — Toni Collette was robbed of an Oscar nomination.',
      where_to_watch:'Amazon Prime, Peacock', icon:'👁️', tmdb_id:493922, tmdb_type:'movie'
    },
    {
      title:'The Social Network', year:2010, rating:7.8,
      episodes_or_runtime:'2h', status:'Released',
      studio_or_network:'Columbia / Netflix', country:'USA', language:'English',
      director_or_creator:'David Fincher', cast:'Jesse Eisenberg, Andrew Garfield, Justin Timberlake',
      genres:['Drama','Crime','Thriller'],
      synopsis:'The story of the founding of Facebook — told through two simultaneous depositions where Mark Zuckerberg\'s former best friend and co-founder Eduardo Saverin and the Winklevoss twins sue him for intellectual property theft and dilution of shares. David Fincher turns a tech story into a Shakespearean tragedy.',
      why_watch:'Aaron Sorkin\'s best screenplay ever — so fast and electric that no line of dialogue is wasted.',
      where_to_watch:'Netflix', icon:'💻', tmdb_id:37799, tmdb_type:'movie'
    },
  ]
};

// ════════════════════════════════════════
//  INIT
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  buildGenreChips();
  showPage('home');
  setupNavScroll();
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});

// ── GENRE CHIPS ──────────────────────────
function buildGenreChips() {
  const grid = document.getElementById('genreGrid');
  grid.innerHTML = '';
  GENRES.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'genre-chip';
    btn.textContent = g;
    btn.dataset.genre = g;
    btn.addEventListener('click', () => toggleGenre(btn, g));
    grid.appendChild(btn);
  });
}

function setupNavScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── PAGE ROUTING ─────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); });
  const pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === id);
  });
  closeMobileMenu();
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham  = document.getElementById('hamburger');
  const open = menu.classList.toggle('open');
  ham.classList.toggle('open', open);
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  const ham = document.getElementById('hamburger');
  if (ham) ham.classList.remove('open');
}

// ── SELECTIONS ───────────────────────────
function selectType(btn) {
  document.querySelectorAll('.type-card').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  State.type = btn.dataset.type;
  updateSummary(); checkCTA();
}

function toggleGenre(chip, genre) {
  const i = State.genres.indexOf(genre);
  if (i > -1) { State.genres.splice(i, 1); chip.classList.remove('active'); }
  else         { State.genres.push(genre);  chip.classList.add('active'); }
  updateSummary(); checkCTA();
}

function clearGenres() {
  State.genres = [];
  document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
  updateSummary(); checkCTA();
}

function updateSummary() {
  const tEl = document.getElementById('summaryTypeText');
  const gEl = document.getElementById('summaryGenreText');
  const cnt = document.getElementById('genreCountText');
  const clr = document.getElementById('clearGenresBtn');

  tEl.textContent = State.type
    ? `${TYPE_EMOJI[State.type]} ${TYPE_LABEL[State.type]}` : 'Not selected';

  const n = State.genres.length;
  if (cnt) cnt.textContent = n === 0 ? '0 genres selected' : `${n} genre${n>1?'s':''} selected`;
  if (clr) clr.style.display = n > 0 ? 'inline-block' : 'none';

  if (n === 0)     gEl.textContent = 'None';
  else if (n <= 3) gEl.textContent = State.genres.join(', ');
  else             gEl.textContent = `${State.genres.slice(0,3).join(', ')} +${n-3} more`;
}

function checkCTA() {
  document.getElementById('ctaBtn').disabled = !(State.type && State.genres.length > 0);
}

// ════════════════════════════════════════
//  SMART RECOMMENDATION ENGINE
// ════════════════════════════════════════
function fetchRecommendations() {
  if (!State.type || !State.genres.length) return;

  showPage('results');
  showLoadingUI(true);
  animateLoading();

  // Simulate async with setTimeout so loading animation shows
  setTimeout(async () => {
    const scored = scoreAndRank(DB[State.type] || [], State.genres);
    const top9   = scored.slice(0, 9);

    State.results = top9;
    State.filter  = 'all';

    // Fetch real TMDB poster images
    await fetchAllPosters(top9);

    showLoadingUI(false);
    renderResults(top9);
  }, 2200);
}

// Score each title by genre overlap
function scoreAndRank(pool, selectedGenres) {
  return pool
    .map(item => {
      const overlap = (item.genres || []).filter(g => selectedGenres.includes(g)).length;
      const genreScore  = overlap / Math.max(selectedGenres.length, 1);
      const ratingScore = ((item.rating || 7) - 6) / 4; // normalize 6-10 → 0-1
      const totalScore  = genreScore * 0.75 + ratingScore * 0.25;
      return { ...item, _score: totalScore, _overlap: overlap };
    })
    .filter(i => i._overlap > 0) // must have at least 1 match
    .sort((a, b) => b._score - a._score);
}

// ── TMDB POSTER FETCH ────────────────────
// Poster path cache — avoids duplicate API calls
const _posterCache = {};

async function fetchAllPosters(items) {
  await Promise.allSettled(items.map(item => fetchOnePoster(item)));
}

async function fetchOnePoster(item) {
  const cacheKey = `${item.tmdb_type}_${item.tmdb_id}`;

  // Return cached result instantly
  if (_posterCache[cacheKey]) {
    const cached = _posterCache[cacheKey];
    item.poster_url   = cached.poster_url;
    item.backdrop_url = cached.backdrop_url;
    return;
  }

  try {
    // STRATEGY 1: Use TMDB ID directly (fastest & most accurate)
    if (item.tmdb_id && item.tmdb_type) {
      const ep = item.tmdb_type === 'movie'
        ? `${TMDB_BASE}/movie/${item.tmdb_id}`
        : `${TMDB_BASE}/tv/${item.tmdb_id}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      try {
        const r = await fetch(`${ep}?api_key=${TMDB_KEY}&language=en-US`, {
          signal: controller.signal,
          mode: 'cors',
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeout);

        if (r.ok) {
          const d = await r.json();
          if (d.poster_path) {
            item.poster_url   = TMDB_IMG + d.poster_path;
            item.backup_poster = TMDB_IMG_BACKUP + d.poster_path;
          }
          if (d.backdrop_path) {
            item.backdrop_url = TMDB_IMG + d.backdrop_path;
          }
          // Cache for this session
          _posterCache[cacheKey] = { poster_url: item.poster_url, backdrop_url: item.backdrop_url };
          return;
        }
      } catch (fetchErr) {
        clearTimeout(timeout);
        // Timeout or network error — try fallback below
      }
    }

    // STRATEGY 2: Search by title (fallback)
    const searchType = (item.tmdb_type === 'movie') ? 'movie' : 'tv';
    const ep = `${TMDB_BASE}/search/${searchType}`;
    const q  = encodeURIComponent(item.title);

    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 5000);

    try {
      const r = await fetch(`${ep}?api_key=${TMDB_KEY}&query=${q}&include_adult=false`, {
        signal: controller2.signal,
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeout2);

      if (r.ok) {
        const d   = await r.json();
        const res = (d.results || [])[0];
        if (res?.poster_path) {
          item.poster_url    = TMDB_IMG + res.poster_path;
          item.backup_poster = TMDB_IMG_BACKUP + res.poster_path;
        }
        if (res?.backdrop_path) item.backdrop_url = TMDB_IMG + res.backdrop_path;
        _posterCache[cacheKey] = { poster_url: item.poster_url, backdrop_url: item.backdrop_url };
      }
    } catch (_) {
      clearTimeout(timeout2);
    }

  } catch(_) { /* fail silently — emoji fallback will show */ }
}

// ── LOADING UI ───────────────────────────
function showLoadingUI(yes) {
  const lw = document.getElementById('loadingWrap');
  const rc = document.getElementById('resultsContent');
  if (lw) lw.style.display = yes ? 'flex' : 'none';
  if (rc && yes) rc.style.display = 'none';
}

function animateLoading() {
  const bar   = document.getElementById('loadingBar');
  const steps = ['ls1','ls2','ls3','ls4'];
  const pcts  = ['20%','50%','78%','96%'];
  const delays= [0, 500, 1100, 1800];

  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'lstep';
  });
  if (bar) bar.style.width = '0%';

  steps.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) {
        const prev = document.getElementById(steps[i-1]);
        if (prev) prev.className = 'lstep done';
      }
      const el = document.getElementById(id);
      if (el) el.className = 'lstep active';
      if (bar) bar.style.width = pcts[i];
    }, delays[i]);
  });
}

// ── RENDER RESULTS ───────────────────────
function renderResults(items) {
  const rc   = document.getElementById('resultsContent');
  const meta = document.getElementById('resultsMeta');
  const cnt  = document.getElementById('resultsCountBadge');

  if (cnt)  cnt.textContent  = items.length;
  if (meta) {
    const top = items[0];
    const matchPct = top ? calcMatchPct(top) : 0;
    meta.textContent = `${TYPE_LABEL[State.type]} · Genres: ${State.genres.slice(0,3).join(', ')}${State.genres.length>3?` +${State.genres.length-3}`:''}  ·  Best match: ${matchPct}%`;
  }

  buildFilterBar(items);
  renderCards(items);
  hideEl('emptyState');
  hideEl('errorState');
  if (rc) rc.style.display = 'block';
}

function buildFilterBar(items) {
  const bar = document.getElementById('filterBar');
  if (!bar) return;
  bar.innerHTML = '';

  bar.appendChild(makeFilterChip(`All (${items.length})`, 'all', true));

  const gs = new Set();
  items.forEach(i => (i.genres||[]).forEach(g => gs.add(g)));
  [...gs].sort().forEach(genre => {
    const count = items.filter(i => (i.genres||[]).includes(genre)).length;
    bar.appendChild(makeFilterChip(`${genre} (${count})`, genre, false));
  });
}

function makeFilterChip(label, val, active) {
  const btn = document.createElement('button');
  btn.className = 'filter-chip' + (active ? ' active' : '');
  btn.textContent = label;
  btn.dataset.filter = val;
  btn.addEventListener('click', () => applyFilter(val));
  return btn;
}

function applyFilter(filter) {
  State.filter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === filter);
  });
  const filtered = filter === 'all'
    ? State.results
    : State.results.filter(i => (i.genres||[]).includes(filter));
  renderCards(filtered);
}

function renderCards(items) {
  const grid  = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');
  if (!grid) return;
  grid.innerHTML = '';
  if (!items.length) { if (empty) empty.style.display='block'; return; }
  if (empty) empty.style.display='none';
  items.forEach((item, i) => grid.appendChild(buildCard(item, i)));
}

function buildCard(item, idx) {
  const card = document.createElement('div');
  card.className = 'rec-card';
  card.style.animationDelay = `${idx * 0.07}s`;

  const tc     = item.type || 'movie';
  const tLabel = TYPE_LABEL[tc] || tc;
  const icon   = item.icon || TYPE_EMOJI[tc] || '🎬';
  const g3     = (item.genres||[]).slice(0,3);
  const pct    = calcMatchPct(item);

  const posterHTML = item.poster_url
    ? `<img class="card-poster-img"
           src="${item.poster_url}"
           alt="${esc(item.title)}"
           loading="lazy"
           crossorigin="anonymous"
           onerror="cardImgError(this,'${item.backup_poster||''}','${icon}','${esc(item.title)}')" />
       <div class="card-poster-placeholder" style="display:none">
         <div class="cpp-emoji">${icon}</div>
         <div class="cpp-title">${esc(item.title)}</div>
       </div>`
    : `<div class="card-poster-placeholder">
         <div class="cpp-emoji">${icon}</div>
         <div class="cpp-title">${esc(item.title)}</div>
       </div>`;

  card.innerHTML = `
    <div class="card-poster-area">
      ${posterHTML}
      <div class="card-overlay"></div>
      <div class="card-badges">
        <span class="type-pill ${tc}">${tLabel}</span>
        <span class="rating-pill">★ ${item.rating}</span>
      </div>
      <div class="card-match-badge">🎯 ${pct}%</div>
    </div>
    <div class="card-body">
      <div class="card-title-text">${esc(item.title)} <span style="font-size:0.78rem;color:var(--muted);font-family:var(--font-m);font-weight:400">${item.year}</span></div>
      <div class="card-genre-tags">
        ${g3.map(g=>`<span class="card-gtag">${esc(g)}</span>`).join('')}
      </div>
      <div class="card-desc">${esc(item.synopsis)}</div>
      <div class="card-footer-row">
        <span class="card-network-txt">📡 ${esc(item.studio_or_network||'')}</span>
        <span class="card-view-link">Details <span>→</span></span>
      </div>
    </div>`;

  card.addEventListener('click', () => openModal(item));
  return card;
}

// ── MATCH % ──────────────────────────────
function calcMatchPct(item) {
  if (!State.genres.length) return 95;
  const overlap = (item.genres||[]).filter(g => State.genres.includes(g)).length;
  const base    = Math.round((overlap / State.genres.length) * 70);
  const bonus   = Math.min(25, Math.round(((item.rating||7) - 6) * 6));
  return Math.min(99, Math.max(55, base + bonus + 10));
}

// ── MODAL ────────────────────────────────
function openModal(item) {
  State.modal = item;
  const tc = item.type || 'movie';

  // Poster
  const pImg  = document.getElementById('posterImg');
  const pFall = document.getElementById('posterFallback');
  const pfE   = document.getElementById('pfEmoji');
  const pfT   = document.getElementById('pfTitle');

  if (item.poster_url) {
    pImg.src = item.poster_url;
    pImg.alt = item.title;
    pImg.crossOrigin = 'anonymous';
    pImg.style.display = 'block';
    pFall.classList.add('hidden');
    pImg.onerror = () => {
      // Try backup poster size first
      if (item.backup_poster && pImg.src !== item.backup_poster) {
        pImg.src = item.backup_poster;
      } else {
        pImg.style.display = 'none';
        pFall.classList.remove('hidden');
        pfE.textContent = item.icon || TYPE_EMOJI[tc] || '🎬';
        pfT.textContent = item.title;
      }
    };
  } else {
    pImg.style.display = 'none';
    pFall.classList.remove('hidden');
    pfE.textContent = item.icon || TYPE_EMOJI[tc] || '🎬';
    pfT.textContent = item.title;
  }

  // Scores
  setTxt('msbRating', item.rating || '—');
  const pct  = calcMatchPct(item);
  const fill = document.getElementById('matchFill');
  const mPct = document.getElementById('matchPct');
  if (fill) { fill.style.width = '0%'; setTimeout(() => fill.style.width = pct+'%', 150); }
  if (mPct) mPct.textContent = pct + '%';

  // Quick facts
  const qf = document.getElementById('modalQuickFacts');
  if (qf) {
    qf.innerHTML = [
      item.country   ? `<div class="mqf-item"><span class="mqf-icon">🌍</span><span class="mqf-val">${esc(item.country)}</span></div>` : '',
      item.language  ? `<div class="mqf-item"><span class="mqf-icon">🗣️</span><span class="mqf-val">${esc(item.language)}</span></div>` : '',
      item.episodes_or_runtime ? `<div class="mqf-item"><span class="mqf-icon">⏱️</span><span class="mqf-val">${esc(item.episodes_or_runtime)}</span></div>` : '',
    ].join('');
  }

  // Chips
  const typeChip = document.getElementById('modalTypeChip');
  if (typeChip) { typeChip.textContent = TYPE_LABEL[tc]||tc; typeChip.className=`modal-type-chip ${tc}`; }

  const yrChip = document.getElementById('modalYearChip');
  if (yrChip) yrChip.textContent = item.year || '';

  const stChip = document.getElementById('modalStatusChip');
  if (stChip) {
    stChip.textContent = item.status || '';
    const sc = (item.status||'').toLowerCase();
    stChip.className = `modal-status-chip ${sc==='ongoing'?'ongoing':sc==='completed'?'completed':''}`;
  }

  setTxtRaw('modalTitleText',   esc(item.title));
  setTxtRaw('modalNetworkLine', item.studio_or_network ? `📡 ${esc(item.studio_or_network)}` : '');

  // Tabs
  setTxtRaw('modalSynopsisText', esc(item.synopsis||''));
  setTxtRaw('modalWhyText', esc(item.why_watch||''));
  switchTab(document.querySelector('.mtab[data-tab="synopsis"]'), 'synopsis');

  // Detail grid
  const dg = document.getElementById('modalDetailGrid');
  if (dg) {
    const rows = [
      ['Type',     TYPE_LABEL[tc]           ],
      ['Year',     item.year                ],
      ['Rating',   `★ ${item.rating}/10`   ],
      ['Runtime',  item.episodes_or_runtime ],
      ['Status',   item.status              ],
      ['Country',  item.country             ],
      ['Language', item.language            ],
      ['Director / Creator', item.director_or_creator],
      ['Lead Cast',item.cast                ],
    ].filter(([,v]) => v);
    dg.innerHTML = rows.map(([l,v]) =>
      `<div class="dg-item"><div class="dg-label">${l}</div><div class="dg-val">${esc(String(v))}</div></div>`
    ).join('');
  }

  // Genres
  const gt = document.getElementById('modalGenreTags');
  if (gt) gt.innerHTML = (item.genres||[]).map(g=>`<span class="mgr-tag">${esc(g)}</span>`).join('');

  // Where to watch
  setTxtRaw('modalWhereVal', item.where_to_watch
    ? `<span>▶️</span> ${esc(item.where_to_watch)}` : '—');

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('modalOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const ov = document.getElementById('modalOverlay');
  ov.classList.remove('open');
  ov.style.display = 'none';
  document.body.style.overflow = '';
  State.modal = null;
}

function switchTab(btn, tabId) {
  if (!btn) return;
  document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const map = { synopsis:'tabSynopsis', whywatch:'tabWhywatch', details:'tabDetails' };
  Object.values(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== map[tabId]);
  });
}

// ── HELPERS ──────────────────────────────
function esc(s) {
  if (typeof s !== 'string') return String(s ?? '');
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function setTxtRaw(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function setTxt(id, val) { setTxtRaw(id, esc(String(val ?? ''))); }
function showEl(id) { const e=document.getElementById(id); if(e) e.style.display='block'; }
function hideEl(id) { const e=document.getElementById(id); if(e) e.style.display='none'; }

// Card image error handler — tries backup URL, then shows emoji placeholder
function cardImgError(img, backupUrl, icon, title) {
  if (backupUrl && backupUrl !== '' && img.src !== backupUrl) {
    img.onerror = () => {
      // Final fallback: show placeholder
      img.style.display = 'none';
      const ph = img.nextElementSibling;
      if (ph) ph.style.display = 'flex';
    };
    img.src = backupUrl;
  } else {
    img.style.display = 'none';
    const ph = img.nextElementSibling;
    if (ph) ph.style.display = 'flex';
  }
}
window.cardImgError = cardImgError;

// ── GLOBALS ──────────────────────────────
window.showPage = showPage;
window.selectType = selectType;
window.toggleGenre = toggleGenre;
window.clearGenres = clearGenres;
window.fetchRecommendations = fetchRecommendations;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.applyFilter = applyFilter;