import ChatBox from 'components/ChatBox';
import { NextPageContext } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import isNil from 'lodash/fp/isNil';
import filter from 'lodash/fp/filter';
import axios from 'axios';
import { Conversation, User } from 'types/api';
import { getLayout } from '../../../../components/SidebarLayout';

interface AccountProps {
  className?: string;
  converstation: Conversation;
}

function Account({ className, converstation }: AccountProps) {
  const router = useRouter();
  const { accountId, conversationId } = router.query;

  const participants: User[] = filter(({ id }: User) => id !== accountId)(converstation.participants);

  const isRouteReady = typeof accountId === 'string' && !isNil(accountId);

  return (
    <div className={className}>
      {isRouteReady && typeof conversationId === 'string' && (
        <ChatBox participants={participants} accountId={accountId} conversationId={conversationId} />
      )}
    </div>
  );
}

Account.getInitialProps = async ({ query }: NextPageContext) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/account/${query.accountId}/conversation/${query.conversationId}`
  );

  const converstation = res.data;

  return { converstation };
};

Account.getLayout = getLayout;

export default Account;
