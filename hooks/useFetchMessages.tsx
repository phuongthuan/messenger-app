import axios from 'axios';
import React from 'react';
import { Message } from 'types/api';
import useSWR from 'swr';

export default function useFetMessage(
  pageSize: number,
  accountId: string,
  converstationId: string
  // cursor: string | null,
  // setCursor: React.Dispatch<React.SetStateAction<string | null>>
  // isScolledTop: boolean
) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isError, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);
  const [cursorPrev, setCursorPrev] = React.useState<string | null>(null);
  const [cursor, setCursor] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMessages([]);
  }, []);

  React.useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await axios.get(`/api/account/${accountId}/conversation/${converstationId}/messages`, {
          params: { pageSize, cursor },
        });

        const isNewestFirst = response.data.sort === 'NEWEST_FIRST';
        const newMessages = isNewestFirst ? response.data.rows : response.data.rows.reverse();

        setMessages((prevMessages) => [...prevMessages, ...newMessages]);

        console.log('response.data :>> ', response.data);
        setHasMore(response.data.rows.length > 0);
        setCursorPrev(response.data.cursor_prev);

        setIsLoading(false);
      } catch (error: any) {
        setError(true);
        setIsLoading(false);
        setMessages((prevMessages) => [...prevMessages]);
      }
    };

    fetchMessages();
  }, [accountId, converstationId, cursor]);

  return { messages, setMessages, cursorPrev, setCursor, hasMore, isError, isLoading };
}
