import * as React from 'react';
import { Message } from 'types/api';
import axios from 'axios';
import useSWR, { useSWRConfig } from 'swr';

import useFetMessage from 'hooks/useFetchMessages';
import SendIcon from './SendIcon';

export interface ChatBoxProps {
  accountId: string;
}

const fetchMessages = async (url: string) => await axios.get(url).then((res) => res.data);
const addNewMessage = async (url: string, text: string) => await axios.post(url, { text }).then((res) => res.data);

const getUserStyles = (isSender: boolean) => {
  return isSender ? 'text-green-600 border-green-600' : 'text-purple-500 border-purple-500';
};

function ChatBox({ accountId }: ChatBoxProps) {
  const [text, setText] = React.useState<string>('');
  const [isScolledTop, setIsScolledTop] = React.useState(false);

  // const { mutate } = useSWRConfig();
  // const { data, error: isError } = useSWR(`/api/account/${accountId}/conversation/1/messages`, fetchMessages);

  const observer = React.useRef<any>();

  const { messages, setMessages, cursorPrev, setCursor, isError, isLoading } = useFetMessage(
    10,
    accountId,
    '1'
    // cursor,
    // setCursor
    // isScolledTop
  );

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY == 0) {
        setIsScolledTop(true);
        // setCursor(cursorPrev);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => removeEventListener('scroll', handleScroll);
  }, []);

  // 1: eyJsYXN0U2VlbiI6IjE4MjUiLCJzb3J0IjoiT0xERVNUX0ZJUlNUIn0=
  // 2: eyJsYXN0U2VlbiI6IjE4MjQiLCJzb3J0IjoiTkVXRVNUX0ZJUlNUIn0=
  // 3: eyJsYXN0U2VlbiI6IjE4MjciLCJzb3J0IjoiT0xERVNUX0ZJUlNUIn0=

  // Ref to track the last message element
  const lastMessageRef = React.useRef<HTMLDivElement>(null);

  // Effect run when new message came. It will auto scroll to bottom
  React.useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // const firstMessageElementRef = React.useCallback(
  //   (node: any) => {
  //     if (isLoading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && isScolledTop) {
  //         console.log('entries :>> ', entries);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [isLoading]
  // );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text) return;

    try {
      const address = '/api/account/1/conversation/1/messages';
      const response = await axios.post(address, { text });
      // const newMessage = await addNewMessage(address, text);

      // await mutate(addNewMessage(address, text), {
      //   optimisticData: {
      //     rows: [newMessage, ...data.rows],
      //   },
      //   rollbackOnError: true,
      // });

      setText('');

      // console.log('res :>> ', res);
      setMessages((prev) => [...prev, response.data]);
    } catch (e) {
      console.error(e);
    }
  };

  if (isError) return <div>{isError}</div>;
  if (!messages || isLoading) return <div>Loading...</div>;

  // const messages = data.rows;

  console.log('messages :>> ', messages);

  return (
    <div className="relative w-full flex flex-col justify-between p-4">
      <div className="flex flex-col gap-y-2 pb-20 z-0">
        {messages.map((message: Message, index: number) => {
          // Check if the last message element
          const isSender = message.sender.id.toString() === accountId;

          if (index === 0) {
            return (
              <div
                // ref={firstMessageElementRef}
                key={message.id}
                className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
              >
                <p className={`msg ${getUserStyles(isSender)}`}>First message - {message.text}</p>
              </div>
            );
          } else if (messages.length === index + 1) {
            return (
              <div
                ref={lastMessageRef}
                key={message.id}
                className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}
              >
                <p className={`msg ${getUserStyles(isSender)}`}>{message.text}</p>
              </div>
            );
          } else {
            return (
              <div key={message.id} className={`w-full flex items-center ${isSender ? 'justify-end' : ''}`}>
                <p className={`msg ${getUserStyles(isSender)}`}>{message.text}</p>
              </div>
            );
          }
        })}
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
        <SendIcon onClick={() => setCursor(cursorPrev)} />
      </form>
    </div>
  );
}

export default ChatBox;
