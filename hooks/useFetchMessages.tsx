import axios from 'axios';
import React from 'react';
import { Message } from 'types/api';
import sortBy from 'lodash/fp/sortBy';
import flow from 'lodash/fp/flow';
import filter from 'lodash/fp/filter';
import delay from 'lodash/fp/delay';

export default function useFetMessage(pageSize: number, accountId: string, converstationId: string) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isError, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false);
  const [cursorRequest, setCursorRequest] = React.useState<string | null>(null);
  const [cursor, setCursor] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await axios.get(`/api/account/${accountId}/conversation/${converstationId}/messages`, {
          params: { pageSize, cursor },
        });

        const isNewestFirst = response.data.sort === 'NEWEST_FIRST';

        const newMessages: any = flow(
          filter(({ text }) => text),
          sortBy('id')
        )(response.data.rows);

        if (isNewestFirst) {
          setCursorRequest(response.data.cursor_prev);
        } else {
          setCursorRequest(response.data.cursor_next);
        }

        setMessages((prevMessages) => [...newMessages, ...prevMessages]);

        setHasMore(response.data.rows.length > 0);
        setIsLoading(false);
      } catch (error: any) {
        setError(true);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [accountId, converstationId, cursor]);

  return { messages, setMessages, cursorRequest, setCursor, hasMore, isError, isLoading };
}
