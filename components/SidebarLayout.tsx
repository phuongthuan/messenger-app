import React from 'react';
import useSWR from 'swr';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import UserAvatar from './UserAvatar';

type Account = { id: string; name: string };
type Conversation = {
  id: string;
  participants: Account[];
  lastMessage: { createdAt: string; id: string; sender: Account; text: string };
};

const SearchBar: React.FC<{ value: string; setValue: (value: string) => void }> = ({ value, setValue }) => {
  const router = useRouter();

  return (
    <div className="flex gap-2 mb-4 xl:w-96">
      <button className="" onClick={() => router.push('/')}>
        <svg
          data-prefix="far"
          data-icon="arrow-alt-circle-left"
          aria-hidden="true"
          focusable="false"
          className="w-7 h-7"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"
          />
        </svg>
      </button>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="
          rounded-full
          form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border-2 border-solid border-gray-300
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-indigo-500 focus:outline-none
        "
        id="search-bar"
        placeholder="Search"
      />
    </div>
  );
};

const Conversation: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
  const { accountId, conversationId } = useRouter().query;

  const {
    participants,
    lastMessage: { text, createdAt },
  } = conversation;

  const participant = participants.filter((p) => p.id !== accountId)[0];

  return (
    <div
      className={`border-solid flex gap-2 items-end rounded-lg p-2 border-2 border-indigo-500 ${
        conversation.id === conversationId ? 'bg-violet-200' : ''
      }`}
    >
      <div className="place-self-center">
        <UserAvatar />
      </div>
      <div className="flex-1">
        <div className="font-semi-bold">{participant.name}</div>
        <div className="text-slate-500">{text}</div>
      </div>
      <div className="text-slate-500">{format(new Date(createdAt), 'LLLL d, yyyy')}</div>
    </div>
  );
};

const Sidebar: React.FC<{ conversations: Conversation[] }> = ({ conversations }) => {
  const router = useRouter();
  const { accountId } = router.query;

  const [value, setValue] = React.useState('');
  const filteredConversations = React.useMemo(
    () =>
      conversations.filter((row) =>
        row.participants.find(({ id, name }) => id !== accountId && name.toLowerCase().includes(value.toLowerCase()))
      ) ?? [],
    [conversations, value, accountId]
  );

  return (
    <div className="h-full sticky top-0 p-4 w-full">
      <SearchBar value={value} setValue={setValue} />
      <ul className="relative">
        {filteredConversations.map((conversation) => (
          <li
            className="relative mb-2 cursor-pointer hover:bg-gray-100"
            key={conversation.id}
            onClick={() => router.push(`/account/${accountId}/conversation/${conversation.id}`)}
          >
            <Conversation conversation={conversation} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const fetcher = (path: string): Promise<{ rows: Conversation[] }> => fetch(path).then((res) => res.json());

const SidebarLayout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const router = useRouter();
  const { accountId, conversationId } = router.query;

  const { data } = useSWR<{ rows: Conversation[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/account/${accountId}/conversations`,
    fetcher
  );

  React.useEffect(() => {
    if (!conversationId && data) router.push(`/account/${accountId}/conversation/${data.rows[0].id}`);
  }, [data, accountId, router, conversationId]);

  return accountId && conversationId ? (
    <div className="h-screen flex flex-wrap flex-row relative">
      <aside className="h-full hidden w-full sm:inline-block sm:w-1/3 md:w-1/3 sm:fixed border border-solid border-gray-300">
        <Sidebar conversations={data?.rows ?? []} />
      </aside>
      <main role="main" className="absolute right-0 w-full sm:w-2/3 md:w-2/3">
        {children}
      </main>
    </div>
  ) : (
    <div>Loading ...</div>
  );
};

export const getLayout = (page: React.ReactElement) => {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default SidebarLayout;
