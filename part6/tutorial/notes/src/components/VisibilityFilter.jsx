import { useNoteActions } from "../store";

const VisibilityFilter = () => {
  const { setFilter } = useNoteActions();

  return (
    <div>
      <input
        type="radio"
        name="filter"
        onClick={() => {
          setFilter("all");
        }}
        defaultChecked
      />
      all
      <input
        type="radio"
        name="filter"
        onClick={() => {
          setFilter("nonimportant");
        }}
      />
      not important
      <input
        type="radio"
        name="filter"
        onClick={() => {
          setFilter("importand");
        }}
      />
      important
    </div>
  );
};

export default VisibilityFilter;
