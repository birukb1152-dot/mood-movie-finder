import { Search } from "lucide-react";
const SearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 w-full mt-5"
    >
      <div className="relative w-full flex gap-3">
        <Search className="absolute top-3 left-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search for movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 border border-gray-500 rounded-[10px] w-full focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="h-11 bg-blue-500  px-5 rounded-[10px] hover:bg-blue-700 font-semibold duration-500"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
