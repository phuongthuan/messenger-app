import * as React from 'react';
import { Message } from 'types/api';
import UserAvatar from './UserAvatar';

interface SingleMessageProps {
  index: number;
  message: Message;
  isSender: boolean;
}

const SingleMessage = React.forwardRef<HTMLDivElement, SingleMessageProps>(({ isSender, message, index }, ref) => {
  // if (index === 0) {
  //   return (
  //     <div
  //       // ref={firstMessageElementRef}
  //       className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
  //     >
  //       <p className={`msg ${getUserStyles(isSender)}`}>Oldest message - {message.text}</p>
  //     </div>
  //   );
  // } else
  if (index === 5) {
    return (
      <div ref={ref} className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
        <p className={`msg ${isSender ? 'bg-indigo-500' : 'bg-purple-400'}`}>{message.text}</p>
        <UserAvatar isSender={isSender} className={`${isSender ? 'order-last ml-1' : 'mr-1'}`} />
      </div>
    );
  } else {
    return (
      <div className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
        <UserAvatar isSender={isSender} className={`${isSender ? 'order-last border-indigo-500 ml-1' : 'mr-1 border-purple-400'}`} />
        <p className={`msg ${isSender ? 'bg-indigo-500' : 'bg-purple-400'}`}>{message.text}</p>
      </div>
    );
  }
});

SingleMessage.displayName = 'SingleMessage';

export default SingleMessage;
