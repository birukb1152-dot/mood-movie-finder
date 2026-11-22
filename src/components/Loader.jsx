import { LoaderCircle } from "lucide-react";

const Loader = ({ message = "Loading movies..." }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 mt-8 py-6"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        size={42}
        strokeWidth={2.5}
        className="animate-spin text-blue-500"
        aria-hidden="true"
      />

      <p className="text-sm font-medium text-gray-400">{message}</p>

      <span className="sr-only">Please wait</span>
    </div>
  );
};

export default Loader;
