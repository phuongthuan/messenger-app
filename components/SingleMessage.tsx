import * as React from 'react';
import { Message } from 'types/api';
import UserAvatar from './UserAvatar';

interface SingleMessageProps {
  index: number;
  message: Message;
  isSender: boolean;
}

type MessageDateProps = Omit<SingleMessageProps, 'index'>;

const MessageDate = ({ isSender, message }: MessageDateProps) => {
  return (
    <p className="text-xs text-gray-100">
      by: {isSender ? 'You' : message.sender.name} at{' '}
      {new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(new Date(message.createdAt))}
    </p>
  );
};

const SingleMessage = React.forwardRef<HTMLDivElement, SingleMessageProps>(({ isSender, message, index }, ref) => {
  if (index === 5) {
    return (
      <div ref={ref} className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
        <UserAvatar isSender={isSender} className={`${isSender ? 'order-last ml-2' : 'mr-2'}`} />
        <div className={`msg ${isSender ? 'bg-indigo-500' : 'bg-purple-400'}`}>
          <span className="font-semibold text-sm text-black">#({message.id})</span>
          <span className="text-left mb-1">{message.text}</span>
          <MessageDate message={message} isSender={isSender} />
        </div>
      </div>
    );
  } else {
    return (
      <div className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
        <UserAvatar
          isSender={isSender}
          className={`${isSender ? 'order-last border-indigo-500 ml-2' : 'mr-2 border-purple-400'}`}
        />
        <div className={`msg ${isSender ? 'bg-indigo-500' : 'bg-purple-400'}`}>
          <span className="font-semibold text-sm text-black">#({message.id})</span>
          <span className="text-left mb-1">{message.text}</span>
          <MessageDate message={message} isSender={isSender} />
        </div>
      </div>
    );
  }
});

SingleMessage.displayName = 'SingleMessage';

export default SingleMessage;
