import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  // gap: "4px",
};

//setting property
StarRating.propTypes = {
  start: PropTypes.number,
  color: PropTypes.string,
  classname: PropTypes.string,
  messages: PropTypes.array,
  onRating: PropTypes.func,
  defaultRating: PropTypes.number,
  // start: PropTypes.number.isRequired,//bool//object
};
export default function StarRating({
  start = 5,
  color = "#ff8",
  size = 48,
  classname = "",
  messages = [],
  defaultRating = 0,
  onRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [temrating, setTemRating] = useState(0);
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size}px`,
  };

  function handelRate(id) {
    setRating(id);
    onRating(id);
  }
  return (
    <div style={containerStyle} className={classname}>
      <div style={starContainerStyle}>
        {Array.from({ length: start }, (_, i) => (
          <Star
            fill={(temrating || rating) >= i + 1}
            onRate={() => handelRate(i + 1)}
            key={i + 1}
            onHoverIn={() => setTemRating(i + 1)}
            onHoverOut={() => setTemRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === start
          ? messages[temrating ? temrating - 1 : rating - 1]
          : temrating || rating || ""}
      </p>
    </div>
  );
}

function Star({ fill, onRate, onHoverIn, onHoverOut, size, color }) {
  const starStyle = {
    cursor: "pointer",
    display: "block",
    width: `${size}px`,
    height: `${size}px`,
  };
  return (
    <span
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      onClick={onRate}
      role="button"
      style={starStyle}
    >
      {fill ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
