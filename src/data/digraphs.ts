export interface DigraphWord {
  word: string;
  image: string;
}

export interface IntroAudio {
  letter1: string;
  letter2: string;
  together: string;
}

export interface Digraph {
  id: string;
  letters: string;
  sound: string;
  audioText: string;
  phonetic: string;
  soundLabel: string;
  examplePhrase: string;
  introAudio: IntroAudio;
  mouthPosition: string;
  teachingTip: string;
  words: {
    beginning: DigraphWord[];
    ending: DigraphWord[];
  };
  yayaSpecial: string;
  color: string;
  order: number;
}

export const digraphs: Digraph[] = [
  {
    id: 'sh',
    letters: 'SH',
    sound: '/ʃ/',
    audioText: 'shhhh... like when we say be quiet. Ship. Sheep. Shell.',
    phonetic: 'shh, shh, shh',
    soundLabel: 'shhh',
    examplePhrase: 'like in ship',
    introAudio: {
      letter1: 'This is the letter S. It usually says sss.',
      letter2: 'This is the letter H. It usually says hhh.',
      together: 'But when S and H are together, they make a special sound! They say shhhh! Like in ship!',
    },
    mouthPosition: 'Lips pushed forward, teeth together',
    teachingTip: 'Like saying quiet - shhh! 🤫',
    words: {
      beginning: [
        { word: 'ship', image: '🚢' },
        { word: 'sheep', image: '🐑' },
        { word: 'shell', image: '🐚' },
        { word: 'shoe', image: '👟' },
        { word: 'shark', image: '🦈' },
      ],
      ending: [
        { word: 'fish', image: '🐟' },
        { word: 'dish', image: '🍽️' },
        { word: 'wish', image: '⭐' },
        { word: 'brush', image: '🪥' },
        { word: 'splash', image: '💦' },
      ],
    },
    yayaSpecial: 'squishy! 🧸',
    color: '#FF69B4',
    order: 1,
  },
  {
    id: 'ch',
    letters: 'CH',
    sound: '/tʃ/',
    audioText: 'ch ch ch... like a choo choo train! Cheese. Chair. Chicken.',
    phonetic: 'ch, ch, ch',
    soundLabel: 'chhh',
    examplePhrase: 'like in cheese',
    introAudio: {
      letter1: 'This is the letter C. It can say kuh or sss.',
      letter2: 'This is the letter H. It usually says hhh.',
      together: 'But when C and H are together, they make a train sound! Ch ch ch! Like choo choo! Or cheese!',
    },
    mouthPosition: 'Lips round, tongue behind top teeth',
    teachingTip: 'Like a choo choo train! 🚂',
    words: {
      beginning: [
        { word: 'cheese', image: '🧀' },
        { word: 'chair', image: '🪑' },
        { word: 'chicken', image: '🐔' },
        { word: 'cherry', image: '🍒' },
        { word: 'chocolate', image: '🍫' },
      ],
      ending: [
        { word: 'beach', image: '🏖️' },
        { word: 'peach', image: '🍑' },
        { word: 'lunch', image: '🥪' },
        { word: 'bench', image: '🪑' },
        { word: 'teach', image: '👩‍🏫' },
      ],
    },
    yayaSpecial: 'Chilli! 🐕',
    color: '#9B59B6',
    order: 2,
  },
  {
    id: 'th',
    letters: 'TH',
    sound: '/θ/',
    audioText: 'thhhh... put your tongue between your teeth! This. That. Three.',
    phonetic: 'th, th, th',
    soundLabel: 'thhh',
    examplePhrase: 'like in thumb',
    introAudio: {
      letter1: 'This is the letter T. It usually says tuh.',
      letter2: 'This is the letter H. It usually says hhh.',
      together: 'But when T and H are together, they say thhhh! Stick your tongue out a tiny bit between your teeth! Like in thumb!',
    },
    mouthPosition: 'Tongue between your teeth!',
    teachingTip: 'Stick your tongue out a little! 😛',
    words: {
      beginning: [
        { word: 'thumb', image: '👍' },
        { word: 'three', image: '3️⃣' },
        { word: 'think', image: '🤔' },
        { word: 'thunder', image: '⛈️' },
        { word: 'thanks', image: '🙏' },
      ],
      ending: [
        { word: 'bath', image: '🛁' },
        { word: 'teeth', image: '🦷' },
        { word: 'math', image: '🔢' },
        { word: 'path', image: '🛤️' },
        { word: 'moth', image: '🦋' },
      ],
    },
    yayaSpecial: 'the, that, this 📖',
    color: '#3498DB',
    order: 3,
  },
  {
    id: 'wh',
    letters: 'WH',
    sound: '/w/',
    audioText: 'wh wh wh... like blowing out a candle! Whale. What. White.',
    phonetic: 'wh, wh, wh',
    soundLabel: 'whhh',
    examplePhrase: 'like in whale',
    introAudio: {
      letter1: 'This is the letter W. It says wuh.',
      letter2: 'This is the letter H. It usually says hhh.',
      together: 'When W and H are together, they say wh! Like when you ask what? or where? Or like a big whale!',
    },
    mouthPosition: 'Lips in a small circle, blow air',
    teachingTip: 'Like blowing out a candle! 🕯️',
    words: {
      beginning: [
        { word: 'whale', image: '🐋' },
        { word: 'wheel', image: '🎡' },
        { word: 'whisper', image: '🤫' },
        { word: 'white', image: '🤍' },
        { word: 'whistle', image: '📯' },
      ],
      ending: [],
    },
    yayaSpecial: 'whale! 🐋',
    color: '#1ABC9C',
    order: 4,
  },
  {
    id: 'ck',
    letters: 'CK',
    sound: '/k/',
    audioText: 'ck ck ck... a quick sound at the end! Duck. Sock. Truck.',
    phonetic: 'ck, ck, ck',
    soundLabel: 'kuh',
    examplePhrase: 'like in duck',
    introAudio: {
      letter1: 'This is the letter C. It can say kuh.',
      letter2: 'This is the letter K. It also says kuh.',
      together: 'When C and K are together at the end of a word, they make one quick k sound! Like in duck! Or sock! Or clock tick tock!',
    },
    mouthPosition: 'Back of tongue touches the roof of mouth',
    teachingTip: 'A quick sound at the end! Like a clock! ⏰',
    words: {
      beginning: [],
      ending: [
        { word: 'duck', image: '🦆' },
        { word: 'sock', image: '🧦' },
        { word: 'clock', image: '🕐' },
        { word: 'truck', image: '🚚' },
        { word: 'rock', image: '🪨' },
        { word: 'pink', image: '💗' },
      ],
    },
    yayaSpecial: 'duck! 🦆',
    color: '#F1C40F',
    order: 5,
  },
];

export const getDigraphById = (id: string): Digraph | undefined => {
  return digraphs.find(d => d.id === id);
};

export const getDigraphByOrder = (order: number): Digraph | undefined => {
  return digraphs.find(d => d.order === order);
};

export const getAllWords = (digraph: Digraph): DigraphWord[] => {
  return [...digraph.words.beginning, ...digraph.words.ending];
};
