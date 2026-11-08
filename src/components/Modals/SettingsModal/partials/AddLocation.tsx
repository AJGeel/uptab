import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import {
  addSavedLocation,
  MAX_SAVED_LOCATIONS,
} from "@/src/services/location/savedLocations";
import { Place, searchPlaces } from "@/src/services/location/searchPlaces";
import { LocationSettings } from "@/src/services/location/types";

/** Lets the settings modal focus the search when it opens. */
export const CITY_SEARCH_ID = "city-search";

const SEARCH_DELAY = 300;
const MIN_QUERY_LENGTH = 2;

type Props = {
  location: LocationSettings;
  onChange: (location: LocationSettings) => void;
};

const AddLocation = ({ location, onChange }: Props) => {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string>();
  const [isFocused, setIsFocused] = useState(false);

  const search = useDebouncedValue(query.trim(), SEARCH_DELAY);
  const isSearching = search.length >= MIN_QUERY_LENGTH;

  const {
    data: places,
    isError,
    isFetching,
  } = useQuery({
    enabled: isSearching,
    queryFn: ({ signal }) => searchPlaces(search, signal),
    queryKey: ["placeSearch", search],
    retry: 1,
    networkMode: "always",
  });

  // Something to show in the dropdown: results, a failure, or that there are none.
  const hasResults = isError || !!places?.length || (!isFetching && !!places);

  if (location.saved.length >= MAX_SAVED_LOCATIONS) {
    return (
      <p className="py-3 text-sm text-gray-700">
        Limit reached ({MAX_SAVED_LOCATIONS}). Delete a location to add another.
      </p>
    );
  }

  const handleAdd = ({ label, latitude, longitude }: Place) => {
    const result = addSavedLocation(location, { label, latitude, longitude });

    if (!result.ok) {
      setNotice(
        result.reason === "duplicate"
          ? `Already saved as ${result.existing.label}.`
          : `You can save up to ${MAX_SAVED_LOCATIONS} locations.`,
      );
      return;
    }

    onChange(result.location);
    setQuery("");
    setNotice(undefined);
  };

  return (
    <div className="space-y-2 pt-3">
      <div className="relative">
        <div className="relative rounded-xl border bg-surface ring-sky-500 duration-150 focus-within:ring-2 focus-within:ring-offset-2">
          <input
            className="w-full rounded-xl bg-surface px-3 py-2 pl-9 font-sans focus-within:outline-hidden"
            id={CITY_SEARCH_ID}
            placeholder="Search for a city..."
            type="search"
            aria-label="Add a location"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && isSearching && places?.length) {
                handleAdd(places[0]);
              }
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              setNotice(undefined);
            }}
          />
          <div className="pointer-events-none absolute top-0 left-0 flex items-center justify-center p-2.5">
            <MagnifyingGlassIcon className="size-4 text-gray-600" />
          </div>
        </div>

        {/* Floats over what's below, and goes away with the focus. */}
        {isFocused && isSearching && hasResults && (
          <div
            // Keeps the focus in the input, so that a click on a result still lands.
            onMouseDown={(event) => event.preventDefault()}
            className="absolute inset-x-0 top-full z-10 mt-2 max-h-48 overflow-y-auto rounded-xl border bg-surface p-1 shadow-lg"
          >
            {isError && (
              <p className="px-2 py-1.5 text-sm text-red-500">
                Unable to search for places. Check your connection and try
                again.
              </p>
            )}

            {!isError && places?.length === 0 && !isFetching && (
              <p className="px-2 py-1.5 text-sm text-gray-700">
                No places found for {search}.
              </p>
            )}

            {!isError && !!places?.length && (
              <ul>
                {places.map((place) => (
                  <li key={place.id}>
                    <button
                      className="w-full rounded-lg px-2 py-1.5 text-left text-sm duration-150 hover:bg-sky-500/10 hover:text-sky-800 focus-visible:bg-sky-500/10 focus-visible:outline-hidden dark:hover:bg-sky-500/25 dark:hover:text-sky-300 dark:focus-visible:bg-sky-500/25"
                      onClick={() => handleAdd(place)}
                    >
                      {place.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {notice && <p className="text-sm text-amber-700">{notice}</p>}

      {!notice && (
        <p className="text-sm text-gray-700">
          Type a city and press Enter to add the best match.{" "}
          {location.saved.length} of {MAX_SAVED_LOCATIONS} saved.
        </p>
      )}
    </div>
  );
};

export default AddLocation;
