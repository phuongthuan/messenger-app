import * as React from 'react';
import { Message } from 'types/api';

interface SingleMessageProps {
  index: number;
  message: Message;
  isSender: boolean;
}

const getUserStyles = (isSender: boolean) => {
  return isSender ? 'bg-indigo-500' : 'bg-purple-400';
};

const SingleMessage = React.forwardRef<HTMLDivElement, SingleMessageProps>(({ isSender, message, index }, ref) => {
  if (index === 0) {
    return (
      <div
        // ref={firstMessageElementRef}
        className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
      >
        <p className={`msg ${getUserStyles(isSender)}`}>Oldest message - {message.text}</p>
      </div>
    );
  } else if (index === 3) {
    return (
      <div ref={ref} className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
        <p className={`msg ${getUserStyles(isSender)}`}>Scroll message - {message.text}</p>
      </div>
    );
  } else {
    return (
      <div className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
        <p className={`msg ${getUserStyles(isSender)}`}>{message.text}</p>
      </div>
    );
  }
});

SingleMessage.displayName = 'SingleMessage';

export default SingleMessage;
