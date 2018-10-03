import React from "react";
import Input from "./common/input";

const SearchBox = ({ value, onChange }) => {
  return (
    <div>
      <form>
        <Input
          type="text"
          name="query"
          className="form-control my-3"
          placeholder="Search..."
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
        />
      </form>
    </div>
  );
};

export default SearchBox;
