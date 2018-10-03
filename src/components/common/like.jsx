import React from "react";

const Like = props => {
  let iden = "fa fa-heart";
  if (!props.determiner) iden += "-o";

  return <i className={iden} aria-hidden="true" onClick={props.onClick} />;
};

export default Like;
