import { highlightParts } from "../searchSettings";

type Props = { text: string; query: string };

/** The text, with the words that match the search marked. */
const Highlight = ({ text, query }: Props) => (
  <>
    {highlightParts(text, query).map(({ text: part, isMatch }, index) =>
      isMatch ? (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <mark key={index} className="rounded-xs bg-amber-200 text-inherit">
          {part}
        </mark>
      ) : (
        part
      ),
    )}
  </>
);

export default Highlight;
