"use client";

import { useEffect, useState } from "react";

export default function AnimatedVersesBackground() {
  const [verses, setVerses] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    async function fetchVerses() {
      try {
        const response = await fetch(`/api/bible?query=fé`);
        const data = await response.json();

        if (data.results) {
          setVerses(data.results);

          // 🔹 Distribuição melhorada para evitar sobreposição
          const newPositions = data.results.map((_, index) => ({
            left: `${Math.random() * 80 + 10}%`, // Mantém dentro da tela (10% - 90%)
            top: `${index * 10}vh`, // Espaçamento melhorado entre os versículos
            animationDelay: `${Math.random() * 6}s`, // Delay aleatório para cada versículo
          }));

          setPositions(newPositions);
        }
      } catch (error) {
        console.error("Erro ao buscar versículos:", error);
      }
    }

    fetchVerses();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {verses.map((verse, index) => (
        <p
          key={index}
          className="absolute text-gray-400 text-lg opacity-80 animate-scroll"
          style={{
            left: positions[index]?.left,
            top: positions[index]?.top,
            animationDelay: positions[index]?.animationDelay,
          }}
        >
          {verse.book} {verse.chapter}:{verse.verse}
        </p>
      ))}

      {/* CSS da animação */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-15vh);
            opacity: 0;
          }
        }
        .animate-scroll {
          position: absolute;
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
