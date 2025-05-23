import { Search } from "lucide-react";

const SearchBox = () => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full text-[12px] pl-10 pr-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground"
      />
    </div>
  );
};

export default SearchBox;
