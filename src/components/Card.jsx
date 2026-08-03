import React from "react";

function Card({ title, children, actions, className }) {
  return (
    <article className={className} aria-label={title}>
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
      {actions && actions.length > 0 && (
        <div className="card-actions">{actions}</div>
      )}
    </article>
  );
}

export default React.memo(Card);
