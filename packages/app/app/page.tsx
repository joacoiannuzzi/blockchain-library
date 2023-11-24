"use client";

import { Wrapper } from "@/app/components/Wrapper";
import Link from "next/link";

const Home = () => {
  return (
    <main>
      <Wrapper>
        <div className="p-4 flex flex-col gap-4">
          <Link href="/books">
            <span className="text-xl text-gray-500">Books</span>
          </Link>
          <Link href="/my-books">
            <span className="text-xl text-gray-500">My Books</span>
          </Link>
          <Link href="/add-book">
            <span className="text-xl text-gray-500">Add Book</span>
          </Link>
        </div>
      </Wrapper>
    </main>
  );
};

export default Home;
