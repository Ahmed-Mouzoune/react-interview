import { MovieProvider } from "@/context/MovieContext";
import Image from "next/image";
import MovieList from "@/components/Movie/MovieList";

export default function Home() {
  return (
    <MovieProvider>
      <header className="flex items-center justify-center shadow bg-primary py-4">
        <Image
          className="w-40"
          src="/logo.svg"
          alt="logo particeep vidéo"
          width={0}
          height={0}
        />
      </header>
      <main className="container mt-8 sm:mt-12 pb-8 sm:pb-12 flex flex-col gap-4">
        <MovieList />
      </main>
    </MovieProvider>
  );
}
