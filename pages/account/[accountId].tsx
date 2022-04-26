import ChatBox from 'components/ChatBox';
import { NextPageContext } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import isNil from 'lodash/fp/isNil';
import filter from 'lodash/fp/filter';
import axios from 'axios';
import { Conversation, User } from 'types/api';

interface AccountProps {
  className?: string;
  converstations: Conversation[];
}

function Account({ className, converstations }: AccountProps) {
  const router = useRouter();
  const { accountId } = router.query;

  const participants: User[] = filter(({ id }: User) => id !== accountId)(converstations[0].participants);

  const conversationId = converstations[0].id;

  const isRouteReady = typeof accountId === 'string' && !isNil(accountId);

  return (
    <div className={className}>
      {isRouteReady && <ChatBox participants={participants} accountId={accountId} conversationId={conversationId} />}
    </div>
  );
}

Account.getInitialProps = async ({ query }: NextPageContext) => {
  const res = await axios.get(`http://localhost:3000/api/account/${query.accountId}/conversations`);

  const converstations = res.data.rows;

  return { converstations };
};

export default Account;
