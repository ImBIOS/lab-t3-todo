import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { TodoList } from "~/components/TodoList";

export default function Home() {
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!sessionData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="A simple todo app built with T3 Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-4xl font-bold">Todo List</h1>
          <TodoList />
        </div>
      </main>
    </>
  );
}
