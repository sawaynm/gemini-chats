import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-500 text-white py-4 px-6 shadow-md flex justify-between items-center">
      <h1 className="text-lg font-bold">Gemini Chatbox</h1>
      {session && (
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sign Out
        </button>
      )}
    </header>
  );
}
