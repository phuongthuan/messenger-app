import * as React from 'react';
import { Message, User } from 'types/api';
import axios from 'axios';

import useFetchMessage from 'hooks/useFetchMessages';
import useScrollEventListener from 'hooks/useScrollEventListener';

import SendIcon from './SendIcon';
import SingleMessage from './SingleMessage';
import UserAvatar from './UserAvatar';
import Spinner from './Spinner';

export interface ChatBoxProps {
  accountId: string;
  conversationId: string;
  participants: User[];
}

function ChatBox({ accountId, conversationId, participants }: ChatBoxProps) {
  const [text, setText] = React.useState<string>('');
  const [pageSize, setPageSize] = React.useState(20);

  const scrollMessageRef = React.useRef<HTMLDivElement>(null);
  const lastMessageRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToBottom = () => lastMessageRef.current?.scrollIntoView();
  const handleScrollAfterLoadMessage = () => scrollMessageRef.current?.scrollIntoView();

  const { messages, setMessages, cursorRequest, setCursor, hasMore, isError, isLoading } = useFetchMessage(
    pageSize,
    accountId,
    conversationId,
    handleScrollAfterLoadMessage
  );

  // Scroll to top to get older message
  useScrollEventListener(() => {
    if (window.scrollY == 0) {
      handleLoadMore();
    }
  });

  React.useEffect(() => {
    handleScrollToBottom();
  }, []);

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
      handleScrollToBottom();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore) return;

    setCursor(cursorRequest);
    setPageSize(8);
  };

  return (
    <div className="relative flex flex-col justify-between z-50">
      <div className="fixed w-full sm:w-2/3 md:w-2/3 text-center z-10 flex flex-col items-center">
        <div className="bg-violet-200 w-full flex items-center h-12">
          <p className="flex gap-x-1 mx-2">
            <UserAvatar isSender />
            {participants.map((p) => (
              <React.Fragment key={p.id}>
                <UserAvatar />
              </React.Fragment>
            ))}
          </p>
          <p className="text-sm text-center">
            Converstation between You and {participants.map((p) => p.name).join(',')}
          </p>
        </div>
        {isLoading ? <Spinner className="mt-4 mb-2" /> : null}
        {isError && <p className="text-sm text-red-500">Load message failed</p>}
        {!hasMore && !isLoading && (
          <p className="text-sm py-2 bg-white z-10 w-full text-indigo-500">No more messages to load</p>
        )}
      </div>

      <div className="flex flex-col overflow-y-auto gap-y-4 mb-20 z-0 text-center mt-20 p-2">
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

      <form className="fixed w-full sm:w-2/3 md:w-2/3 bottom-0 bg-slate-200 p-4 z-10" onSubmit={handleSubmit}>
        <input
          name="text-input"
          className="border-2 rounded-full px-4 py-1 border-gray-300 focus:border-indigo-500 focus:outline-none text-sm w-full"
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
