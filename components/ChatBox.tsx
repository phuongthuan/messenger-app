import * as React from 'react';
import { Message } from 'types/api';
import axios from 'axios';

import useFetMessage from 'hooks/useFetchMessages';
import SendIcon from './SendIcon';

export interface ChatBoxProps {
  accountId: string;
}

const getUserStyles = (isSender: boolean) => {
  return isSender ? 'text-green-600 border-green-600' : 'text-purple-500 border-purple-500';
};

function ChatBox({ accountId }: ChatBoxProps) {
  const [text, setText] = React.useState<string>('');
  const [isScolledTop, setIsScolledTop] = React.useState(false);

  const observer = React.useRef<any>();

  const { messages, setMessages, cursorRequest, setCursor, hasMore, isError, isLoading } = useFetMessage(
    10,
    accountId,
    '1'
  );

  // React.useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY == 0) {
  //       console.log('scroll :>> ', cursorRequest);
  //       // setCursor(cursorRequest);
  //       setIsScolledTop(true);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => removeEventListener('scroll', handleScroll);
  // }, []);

  // Ref to track the last message element
  const lastMessageRef = React.useRef<HTMLDivElement>(null);

  // Effect run when user start typing. It will auto scroll to bottom
  // React.useEffect(() => {
  //   lastMessageRef.current?.scrollIntoView();
  // }, [text]);

  const firstMessageElementRef = React.useCallback(
    (node: any) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log('found node :>> ', entries);
          // setCursor(cursorRequest);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text) return;

    try {
      const address = '/api/account/1/conversation/1/messages';
      const newMessage = await axios.post(address, { text });

      setText('');

      setMessages((prev) => [...prev, newMessage.data]);
      lastMessageRef.current?.scroll()
      console.log('lastMessageRef.current :>> ', lastMessageRef.current);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore) return;

    setCursor(cursorRequest);
  };

  return (
    <div className="relative w-full flex flex-col justify-between p-4">
      <div className="flex flex-col gap-y-4 pb-16 z-0">
        {isError && <p className="text-center">Load message failed</p>}
        {isLoading && <p>Loading...</p>}

        {messages.map((message: Message, index: number) => {
          // Check if the last message element
          const isSender = message.sender.id.toString() === accountId;

          if (index === 0) {
            return (
              <div
                ref={firstMessageElementRef}
                key={message.id}
                className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
              >
                <p className={`msg ${getUserStyles(isSender)}`}>Oldest message - {message.text}</p>
              </div>
            );
          }
          // else if (messages.length === index + 1) {
          //   return (
          //     <div
          //       // ref={lastMessageRef}
          //       key={message.id}
          //       className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
          //     >
          //       <p className={`msg ${getUserStyles(isSender)}`}>{message.text}</p>
          //     </div>
          //   );
          // }
          else {
            return (
              <div key={message.id} className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
                <p className={`msg ${getUserStyles(isSender)}`}>{message.text}</p>
              </div>
            );
          }
        })}
        <div ref={lastMessageRef} />
      </div>

      <form className="fixed bottom-0 right-0 w-full bg-slate-200 p-4 z-99" onSubmit={handleSubmit}>
        <input
          name="text-input"
          className="border-2 rounded-full px-4 py-1 border-green-600 focus:border-green-600 focus:outline-none text-sm w-full"
          type="text"
          placeholder="type your messages"
          onChange={handleChange}
          value={text}
        />
        <SendIcon onClick={handleLoadMore} />
      </form>
    </div>
  );
}

export default ChatBox;
