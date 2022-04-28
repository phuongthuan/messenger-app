import type { NextPage } from 'next';
import { useRouter } from 'next/router';

type AccountProps = {
  id: number;
  name: string;
};
const Home: NextPage<{ accounts: AccountProps[] }> = ({ accounts }) => {
  const router = useRouter();
  const handleClick = (id: number) => router.push(`/account/${id}`);

  if (!accounts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <h1 className="text-2xl font-bold mb-10">Select an Account</h1>
        <ul className="text-center">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="cursor-pointer p-5 border-solid border-gray-800 border-2 mt-5 mb-5 rounded flex"
              onClick={() => handleClick(account.id)}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                className="w-7 h-7 border-2 rounded-full"
              />
              <p className="ml-5">{account.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Home.getInitialProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts`);
  const accounts = await res.json();

  return { accounts };
};

export default Home;
