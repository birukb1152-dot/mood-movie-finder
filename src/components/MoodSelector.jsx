const moods = [
  { name: "Happy", emoji: "😄", genre: 35 },
  { name: "Sad", emoji: "😢", genre: 18 },
  { name: "Hype", emoji: "🔥", genre: 28 },
  { name: "Chill", emoji: "😌", genre: 12 },
  { name: "Romantic", emoji: "💘", genre: 10749 },
  { name: "Horror", emoji: "😱", genre: 27 },
  { name: "Animation", emoji: "🐭", genre: 16 },
];

const MoodSelector = ({ selectedMood, setSelectedMood }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
      {moods.map((mood) => (
        <button
          key={mood.name}
          onClick={() => setSelectedMood(mood)}
          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition duration-300
            ${
              selectedMood?.name === mood.name
                ? "bg-blue-500 text-white"
                : "bg-[#1F2937] text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
        >
          <span>{mood.emoji}</span>
          {mood.name}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
