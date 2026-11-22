import { memo } from "react";
import { Star, CalendarDays, ArrowDownUp } from "lucide-react";

const FilterBar = ({
  rating,
  setRating,
  releasePeriod,
  setReleasePeriod,
  sortBy,
  setSortBy,
}) => {
  const selectStyle =
    "h-11 w-full min-w-0 md:w-auto md:flex-1 border border-gray-600 bg-[#111827] rounded-xl pl-3 pr-8 text-sm text-gray-200 font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition cursor-pointer";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto md:flex-1 min-w-0">
      {/* Rating Filter */}
      <label className="relative min-w-0">
        <span className="sr-only">Minimum movie rating</span>
        <Star
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none"
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className={`${selectStyle} pl-9`}
          aria-label="Minimum movie rating"
        >
          <option value="0">Rating: All</option>
          <option value="6">Rating: 6+</option>
          <option value="7">Rating: 7+</option>
          <option value="8">Rating: 8+</option>
          <option value="9">Rating: 9+</option>
        </select>
      </label>

      {/* Release Period Filter */}
      <label className="relative min-w-0">
        <span className="sr-only">Movie release period</span>
        <CalendarDays
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
        />
        <select
          value={releasePeriod}
          onChange={(e) => setReleasePeriod(e.target.value)}
          className={`${selectStyle} pl-9`}
          aria-label="Movie release period"
        >
          <option value="all">Any Year</option>
          <option value="2020-2025">2020–2025</option>
          <option value="2015-2025">2015–2025</option>
          <option value="2010-2019">2010–2019</option>
          <option value="2000-2009">2000–2009</option>
        </select>
      </label>

      {/* Sorting Filter */}
      <label className="relative min-w-0">
        <span className="sr-only">Sort movies</span>
        <ArrowDownUp
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`${selectStyle} pl-9`}
          aria-label="Sort movies"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="primary_release_date.desc">Newest Releases</option>
          <option value="revenue.desc">Highest Revenue</option>
        </select>
      </label>
    </div>
  );
};

FilterBar.displayName = "FilterBar";

export default memo(FilterBar);
