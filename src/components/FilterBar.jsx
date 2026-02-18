const FilterBar = ({ rating, setRating }) => {
  return (
    <select
      value={rating}
      onChange={(e) => setRating(e.target.value)}
      className="border border-gray-500 md:mt-5 h-11 bg-[#111827] rounded-xl px-2 outline-none text-gray-200 font-semibold"
    >
      <option value="0">Rating : All</option>
      <option value="6">Rating : 6+</option>
      <option value="7">Rating : 7+</option>
      <option value="8">Rating : 8+</option>
      <option value="9">Rating : 9+</option>
    </select>
  );
};

export default FilterBar;
