import * as React from 'react';
import { Message, User } from 'types/api';
import axios from 'axios';

import useFetMessage from 'hooks/useFetchMessages';
import useEventListener from 'hooks/useEventListener';

import SendIcon from './SendIcon';

export interface ChatBoxProps {
  accountId: string;
  participants: User[];
}

const getUserStyles = (isSender: boolean) => {
  return isSender ? 'bg-indigo-500' : 'bg-purple-400';
};

function ChatBox({ accountId, participants }: ChatBoxProps) {
  const [text, setText] = React.useState<string>('');
  const [pageSize, setPageSize] = React.useState(20);

  const { messages, setMessages, cursorRequest, setCursor, hasMore, isError, isLoading } = useFetMessage(
    pageSize,
    accountId,
    '1'
  );

  // Ref to track the last message element
  const scrollMessageRef = React.useRef<HTMLDivElement>(null);

  // const observer = React.useRef<any>();

  // Scroll to top to get older message
  useEventListener('scroll', () => {
    if (window.scrollY == 0) {
      handleLoadMore();
    }
  });

  // React.useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.pageYOffset == 0) {
  //       // console.log('scroll :>> ', cursorRequest);
  //       // setCursor(cursorRequest);
  //       setIsScolledTop(true);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => removeEventListener('scroll', handleScroll);
  // }, []);

  // Effect run when new message came. It will auto scroll to bottom
  React.useEffect(() => {
    scrollMessageRef.current?.scrollIntoView();
  }, [messages]);

  // const firstMessageElementRef = React.useCallback(
  //   (node: any) => {
  //     if (isLoading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting) {
  //         console.log('node :>> ', node);
  //         // // setCursor(cursorRequest);
  //         // handleLoadMore();
  //         // setIsScrolledTop(false);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [isLoading, hasMore]
  // );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text) return;

    try {
      const address = '/api/account/1/conversation/1/messages';
      const newMessage = await axios.post(address, { text });

      setText('');

      setMessages((prev) => [...prev, newMessage.data]);
      scrollMessageRef.current?.scrollIntoView();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore) return;

    setCursor(cursorRequest);
    setPageSize(5);
  };

  return (
    <div className="relative w-full flex flex-col justify-between">
      <div className="fixed w-full text-center p-4 bg-slate-200 z-10 flex flex-col items-center">
        <p className="text-sm">Converstation between You and {participants.map((p) => p.name).join(',')}</p>
        {isLoading ? <p className="text-sm mt-2 text-indigo-500">Loading...</p> : null}
        {isError && <p className="text-sm text-red-500">Load message failed</p>}
      </div>

      <div className="flex flex-col gap-y-4 mb-20 z-0 text-center mt-16 p-4">
        {messages.map((message: Message, index: number) => {

          const isSender = message.sender.id.toString() === accountId;

          if (index === 0) {
            return (
              <div
                // ref={firstMessageElementRef}
                key={message.id}
                className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
              >
                <p className={`msg ${getUserStyles(isSender)}`}>Oldest message - {message.text}</p>
              </div>
            );
          } else if (index === 2) {
            return (
              <div
                ref={scrollMessageRef}
                key={message.id}
                className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
              >
                <p className={`msg ${getUserStyles(isSender)}`}>Scroll message - {message.text}</p>
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
      </div>

      <form className="fixed bottom-0 right-0 w-full bg-slate-200 p-4 z-10" onSubmit={handleSubmit}>
        <input
          name="text-input"
          className="border rounded-full px-4 py-1 border-indigo-500 focus:border-indigo-500 focus:outline-none text-sm w-full"
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
