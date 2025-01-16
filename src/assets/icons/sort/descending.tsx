import { memo } from 'react';

function SortDescendingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.666 7.166 8 4.499 5.333 7.166"
        stroke="#CBD3E5"
        strokeWidth="1.62"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.666 10.5 8 13.167 5.333 10.5"
        stroke="#1BA5F8"
        strokeWidth="1.62"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default memo(SortDescendingIcon);
