import {
  Smile,
  Frown,
  Flame,
  Coffee,
  Heart,
  Ghost,
  Clapperboard,
} from "lucide-react";

const moods = [
  { name: "Happy", icon: Smile, genre: 35 },
  { name: "Sad", icon: Frown, genre: 18 },
  { name: "Hype", icon: Flame, genre: 28 },
  { name: "Chill", icon: Coffee, genre: 12 },
  { name: "Romantic", icon: Heart, genre: 10749 },
  { name: "Horror", icon: Ghost, genre: 27 },
  { name: "Animation", icon: Clapperboard, genre: 16 },
];

const MoodSelector = ({ selectedMood, setSelectedMood }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
      {moods.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selectedMood?.name === mood.name;

        return (
          <button
            key={mood.name}
            type="button"
            onClick={() => setSelectedMood(mood)}
            aria-pressed={isSelected}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 border transition-all duration-300 hover:-translate-y-0.5 ${
              isSelected
                ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20"
                : "bg-[#1F2937] border-white/10 text-gray-300 hover:bg-gray-700 hover:border-blue-500/40 hover:text-white"
            }`}
          >
            <Icon
              size={17}
              strokeWidth={2}
              className={isSelected ? "text-white" : "text-blue-400"}
            />
            {mood.name}
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
