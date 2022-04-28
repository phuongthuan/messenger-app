import * as React from 'react';
import { Message, User } from 'types/api';
import axios from 'axios';

import useFetchMessage from 'hooks/useFetchMessages';
import useEventListener from 'hooks/useEventListener';

import SendIcon from './SendIcon';
import SingleMessage from './SingleMessage';

export interface ChatBoxProps {
  accountId: string;
  conversationId: string;
  participants: User[];
}

function ChatBox({ accountId, conversationId, participants }: ChatBoxProps) {
  const [text, setText] = React.useState<string>('');
  const [pageSize, setPageSize] = React.useState(20);

  const { messages, setMessages, cursorRequest, setCursor, hasMore, isError, isLoading } = useFetchMessage(
    pageSize,
    accountId,
    conversationId
  );

  // Ref to track the last message element
  const scrollMessageRef = React.useRef<HTMLDivElement>(null);

  const lastMessageRef = React.useRef<HTMLDivElement>(null);

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
      const newMessage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/${accountId}/conversation/${conversationId}/messages`,
        {
          text,
        }
      );

      setText('');

      setMessages((prev) => [...prev, newMessage.data]);
      lastMessageRef.current?.scrollIntoView();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore) return;

    setCursor(cursorRequest);
    setPageSize(4);
  };

  return (
    <div className="relative flex flex-col justify-between z-50">
      <div className="fixed w-2/3 text-center z-10 flex flex-col items-center">
        <div className="bg-violet-200 w-full flex flex-col justify-center h-12">
          <p className="text-sm text-center">
            Converstation between You and {participants.map((p) => p.name).join(',')}
          </p>
        </div>
        {isLoading ? <p className="text-sm mt-4 text-indigo-500">Loading...</p> : null}
        {isError && <p className="text-sm text-red-500">Load message failed</p>}
      </div>

      <div className="flex flex-col gap-y-4 mb-20 z-0 text-center mt-16 p-4">
        {messages.map((message: Message, index: number) => (
          <React.Fragment key={message.id}>
            <SingleMessage
              isSender={message.sender.id.toString() === accountId}
              index={index}
              message={message}
              ref={scrollMessageRef}
            />
          </React.Fragment>
        ))}

        <div ref={lastMessageRef} />
      </div>

      <form className="fixed bottom-0 w-2/3 bg-slate-200 p-4 z-10" onSubmit={handleSubmit}>
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
