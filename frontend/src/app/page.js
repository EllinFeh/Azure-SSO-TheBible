import Navbar from "../../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-md font-bold text-black">
          Faça Login para acessar o nosso conteúdo.
        </h1>
      </div>
    </div>
  );
}
