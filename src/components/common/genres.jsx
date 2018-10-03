import React from "react";

const Genre = props => {
  const {
    items,
    currentGenre,
    onItemSelect,
    textProperty,
    valueProperty
  } = props;
  return (
    <ul className="list-group">
      {items.map(gen => (
        <li
          key={gen[valueProperty]}
          className={
            gen[textProperty] === currentGenre[textProperty]
              ? "list-group-item active"
              : "list-group-item"
          }
          onClick={() => onItemSelect(gen)}
        >
          {gen[textProperty]}
        </li>
      ))}
    </ul>
  );
};
Genre.defaultProps = {
  textProperty: "name",
  valueProperty: "_id"
};
export default Genre;
