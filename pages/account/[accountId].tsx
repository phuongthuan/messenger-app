import ChatBox from 'components/ChatBox';
import * as React from 'react';
import { useRouter } from 'next/router';
import isNil from 'lodash/fp/isNil';

export interface AccountProps {
  className?: string;
}

function Account({ className }: AccountProps) {
  const router = useRouter();
  const { accountId } = router.query;

  const isRouteReady = typeof accountId === 'string' && !isNil(accountId);

  return <div className={className}>{isRouteReady && <ChatBox accountId={accountId} />}</div>;
}

export default Account;
