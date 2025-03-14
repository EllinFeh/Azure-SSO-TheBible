import Navbar from "../../components/Navbar";
import AnimatedVersesBackground from "../../components/Background_animed";
export default function Home() {

  return (
    <div className="relative">
      <AnimatedVersesBackground />
      <div className="relative z-10">
        <Navbar></Navbar>
        <div className="h-screen flex flex-col justify-center items-center gap-6">
          <h1 className="text-md font-bold text-black">
            Seu Hub de versículos usando palavras!
          </h1>
          <a href="/homepage">
            <button className="w-[200px] bg-gray-900 hover:scale-105 text-white font-semibold p-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
            >Começar</button>
          </a>
        </div>
      </div>
    </div>
  );
}
