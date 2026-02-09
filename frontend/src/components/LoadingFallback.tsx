import { Hourglass } from "lucide-react";
import { useMemo } from "react";
import EmptyState from "./EmptyState";

const LOADING_PHRASES = [
  "Getting page ready…",
  "Warming things up…",
  "Fetching the good stuff…",
  "Almost there…",
  "Loading awesomeness…",
  "Hang tight, preparing content…",
  "Just a moment…",
];

export const LoadingFallback = () => {
  const phrase = useMemo(() => {
    return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
  }, []);

  return (
    <EmptyState
      icon={Hourglass}
      isLoading
      height="100vh"
      description={phrase}
    />
  );
};
