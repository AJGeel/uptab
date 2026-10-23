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

const SEARCH_DELAY = 300;
const MIN_QUERY_LENGTH = 2;

type Props = {
  location: LocationSettings;
  onChange: (location: LocationSettings) => void;
};

const AddLocation = ({ location, onChange }: Props) => {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string>();

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
      <div className="relative overflow-hidden rounded-xl border bg-white">
        <input
          className="w-full bg-white px-3 py-2 pl-9 font-sans focus-within:outline-hidden"
          placeholder="Search for a city..."
          type="search"
          aria-label="Add a location"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setNotice(undefined);
          }}
        />
        <div className="pointer-events-none absolute top-0 left-0 flex items-center justify-center p-2.5">
          <MagnifyingGlassIcon className="size-4 text-gray-600" />
        </div>
      </div>

      {/* Room for five results, so the modal doesn't jump while searching. */}
      <div className="h-48 space-y-2 overflow-y-auto">
        {notice && <p className="text-sm text-amber-700">{notice}</p>}

        {isSearching && isError && (
          <p className="text-sm text-red-500">
            Unable to search for places. Check your connection and try again.
          </p>
        )}

        {isSearching && !isError && places?.length === 0 && !isFetching && (
          <p className="text-sm text-gray-700">No places found for {search}.</p>
        )}

        {isSearching && !isError && !!places?.length && (
          <ul className="divide-y divide-black/10 rounded-xl border bg-white">
            {places.map((place) => (
              <li key={place.id}>
                <button
                  className="w-full px-3 py-2 text-left text-sm duration-150 hover:bg-sky-500/10 hover:text-sky-800 focus-visible:bg-sky-500/10 focus-visible:outline-hidden"
                  onClick={() => handleAdd(place)}
                >
                  {place.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddLocation;
