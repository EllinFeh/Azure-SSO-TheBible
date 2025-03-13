"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeLogged() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    //  verifica se está autenticado
    useEffect(() => {
        fetch("/api/user")
            .then((res) => res.json())
            .then((data) => {
                if (data.name) {
                    setUser(data);
                } else {
                    router.push("/"); // Redireciona para login se não estiver autenticado
                }
            })
            .catch(() => {
                router.push("/");
            });
    }, []);

    const handleLogout = () => {
        window.location.href = "/api/logout";
    };

    //Logica bible
    const [query, setQuery] = useState("fé");
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        setLoading(true);
        setError("");
        setVerses([]);

        try {
            const response = await fetch(`/api/bible?query=${query}`);
            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setVerses(data.results);
            }
        } catch (err) {
            setError("Erro ao conectar a api");
        }

        setLoading(false);
    };

    return (
        <div className="">
            {/* <div className="w-full max-w-md bg-blue-950 shadow-lg rounded-xl p-8 text-center">
                <h1 className="text-2xl font-bold text-white">Bem-vindo à Pesquisa</h1>

                {user ? (
                    <>
                        <p className="mt-4 text-gray-700">
                            Olá, <span className="font-semibold">{user.name}</span>!
                        </p>
                        <p className="text-gray-600">{user.email}</p>
                        <button
                            onClick={handleLogout}
                            className="mt-6 w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <p className="text-gray-600 mt-4">Verificando autenticação...</p>
                )}
            </div> */}
            {/* Parte da biblia */}
            <div className="mt-24 flex flex-col items-center min-h-screen p-6">
                <h1 className="text-2xl font-bold text-black my-12">Descubra Passagens Bíblicas com uma Palavra:</h1>

                <div className="flex gap-2 mb-12">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Digite uma palavra..."
                        className="px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Buscar
                    </button>
                </div>

                {loading && <p className="mt-4 text-gray-600">Buscando...</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}

                <div className="mt-6 w-full max-w-2xl">
                    {verses.length > 0 && verses.map((verse, index) => (
                        <div key={index} className="p-4 mb-4 bg-gray-200 shadow rounded-lg">
                            <p className="text-gray-700">{verse.text}</p>
                            <p className="text-gray-500 text-sm mt-2">{verse.book} {verse.chapter}:{verse.verse}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
