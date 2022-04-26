import * as React from 'react';

export interface SendIconProps {
  onClick?: () => void;
}

function SendIcon({ onClick }: SendIconProps) {
  return (
    <div className="rotate-90 absolute right-6 bottom-6 cursor-pointer" onClick={onClick}>
      <svg
        className="w-4 h-4 stroke-indigo-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
      </svg>
    </div>
  );
}

export default SendIcon;
