"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, HelpCircle, Trophy, Calendar, Lock, CreditCard, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      category: "Sistema de Puntuación",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      questions: [
        {
          q: "¿Cómo se calculan los puntos en la Fase de Grupos?",
          a: "Para explicar los escenarios claramente, usaremos un partido de ejemplo:\n\n⚽ Partido Real: México 2 - 1 Alemania\n\n🎯 1. Resultado Exacto (3 Puntos)\nExplicación simple: ¡Le pegaste al marcador idéntico! Adivinaste exactamente cuántos goles metió cada equipo.\nEjemplo:\n- Tu predicción: México 2 - 1 Alemania.\n- Resultado real: México 2 - 1 Alemania.\n- Puntos ganados: 3 pts (te llevas el premio mayor de este partido).\n\n⚖️ 2. Ganador + Diferencia de Goles (2 Puntos)\nExplicación simple: Acertaste quién ganó el partido y también la diferencia exacta de goles, pero no el marcador exacto. (Nota: La diferencia en el ejemplo real es de 1 gol a favor de México).\nEjemplo:\n- Tu predicción: México 1 - 0 Alemania o México 3 - 2 Alemania.\n- Resultado real: México 2 - 1 Alemania.\n- Puntos ganados: 2 pts (No le diste al marcador, pero adivinaste que ganaba México por exactamente 1 gol de ventaja).\n\n🟢 3. Solo Ganador Correcto (1 Punto)\nExplicación simple: Supiste quién ganaba el partido, pero no acertaste ni el marcador ni la diferencia de goles. ¡Igual sumas por irle al equipo correcto!\nEjemplo:\n- Tu predicción: México 3 - 0 Alemania (Adivinaste que ganaba México, pero fallaste la diferencia de goles que fue de 1, y el marcador).\n- Resultado real: México 2 - 1 Alemania.\n- Puntos ganados: 1 pt.\n\n🤝 4. Empate Exacto (3 Puntos)\nExplicación simple: Dijeste que el partido terminaba en empate y acertaste el número exacto de goles de ese empate.\nEjemplo:\n- Tu predicción: México 1 - 1 Alemania.\n- Resultado real: México 1 - 1 Alemania.\n- Puntos ganados: 3 pts.\nNota: Si predices un 1-1 pero el partido real queda 2-2, el sistema te otorgará automáticamente 1 punto por haber acertado el \"Concepto de Empate\" (Solo Ganador/Destino del partido).\n\n⭐ 5. Comodín (Multiplicador x2)\nExplicación simple: En cada jornada podrás marcar un partido como tu \"Comodín\" (el partido en el que estés más seguro). ¡Cualquier puntaje que saques en ese partido se duplicará automáticamente!\nEjemplo:\n- Activas el comodín en el partido de México vs Alemania.\n- En tu predicción aciertas el Resultado Exacto (que base son 3 pts).\n- Puntos totales obtenidos: 3 pts × 2 = 6 pts en un solo partido.\n¡Cuidado! Si en tu partido comodín no sumas nada (0 pts), el doble de cero sigue siendo 0 pts. ¡Elige bien!"
        },
        {
          q: "¿Cómo funcionan los puntos en las Fases Eliminatorias?",
          a: "A partir de Octavos de Final, la dificultad aumenta y se habilitan dos bonificaciones:\n\n1. **Avanzar de Ronda (10 puntos adicionales):** Si aciertas qué equipo avanza a la siguiente ronda (sin importar si se define en 90 minutos, prórroga o tanda de penales).\n2. **Podio Final (10 puntos de bonificación por acierto):** Si aciertas al Campeón y al Tercer Lugar desde el inicio del torneo (se bloquea antes del primer partido)."
        }
      ]
    },
    {
      category: "Reglas de Tiempos y Bloqueos",
      icon: <Lock className="h-5 w-5 text-rose-500" />,
      questions: [
        {
          q: "¿Cuándo se cierran las predicciones?",
          a: "Las predicciones para cualquier partido se bloquearán automáticamente en el sistema **15 minutos antes del pitazo inicial oficial**. Una vez bloqueado el partido, el botón de 'Guardar Pronóstico' se desactivará y no habrá excepciones."
        },
        {
          q: "¿Puedo modificar mis predicciones guardadas?",
          a: "Sí, puedes cambiar tu pronóstico todas las veces que quieras siempre y cuando lo hagas **antes del bloqueo (15 minutos antes del partido)**. El sistema guardará y validará únicamente la última predicción registrada."
        }
      ]
    },
    {
      category: "Condiciones de Empate en Cancha",
      icon: <Calendar className="h-5 w-5 text-[#00E676]" />,
      questions: [
        {
          q: "¿Qué marcador es válido en partidos con Prórroga o Penales?",
          a: "El resultado válido para la asignación de puntos por marcador es el del **final de los 120 minutos (tiempo reglamentario + prórroga)**. Los goles anotados en la tanda de penales de desempate no se suman al marcador final del pronóstico. (Ejemplo: Si el partido termina 1-1 tras los 120 minutos y luego alguien gana en penales, el resultado oficial para la polla es 1-1)."
        }
      ]
    },
    {
      category: "Criterios de Desempate en Ranking",
      icon: <Trophy className="h-5 w-5 text-blue-500" />,
      questions: [
        {
          q: "¿Qué sucede si dos o más usuarios terminan con los mismos puntos?",
          a: "En caso de empate en puntos acumulados al finalizar el Mundial, el ganador se decidirá bajo los siguientes criterios en estricto orden de prioridad:\n\n1. **Mayor cantidad de Resultados Exactos** (10 pts) acertados durante todo el torneo.\n2. **Menor margen de error global:** La suma acumulada de las diferencias absolutas de goles frente a los marcadores reales.\n3. **Registro y pago temprano:** Ganará quien haya completado el registro y adjuntado su comprobante de pago primero en la plataforma."
        }
      ]
    },
    {
      category: "Inscripción y Pago",
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      questions: [
        {
          q: "¿Cómo activo mi cuenta para empezar a pronosticar?",
          a: "Para activar tu cuenta debes realizar la transferencia de **B/.10** vía Yappy al número oficial del organizador. Luego, inicia sesión, ve a tu perfil/dashboard, adjunta la captura de pantalla de la transferencia como comprobante, y un administrador validará tu acceso en menos de 24 horas."
        }
      ]
    }
  ];

  let faqIndexCounter = 0;

  return (
    <div className="relative overflow-hidden min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#07101D] text-[#E8F0FF]">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#00E676]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />

      <div className="mx-auto max-w-3xl">
        {/* Back navigation */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-[#5E7A9E] hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
        </div>

        {/* Header */}
        <div className="text-center sm:text-left mb-12 border-b border-white/10 pb-8 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-3">
            <HelpCircle className="h-9 w-9 text-[#00E676]" />
            Centro de Ayuda y FAQ
          </h1>
          <p className="mt-3 text-[#5E7A9E] text-base leading-relaxed">
            Resuelve todas tus dudas sobre el reglamento del Polla Mundialista, sistema de puntos, desempates y registro de comprobantes.
          </p>
        </div>

        {/* Categories & Questions */}
        <div className="space-y-10">
          {faqData.map((category, catIdx) => (
            <div key={catIdx} className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                {category.icon}
                <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                  {category.category}
                </h2>
              </div>
              
              <div className="space-y-3">
                {category.questions.map((faq) => {
                  const currentIndex = faqIndexCounter++;
                  const isOpen = openIndex === currentIndex;
                  return (
                    <div
                      key={currentIndex}
                      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                        isOpen
                          ? "bg-white/[0.04] border-[#00E676]/30 shadow-[0_0_15px_rgba(0,230,118,0.05)]"
                          : "bg-white/[0.02] border-white/5 hover:border-white/10"
                      }`}
                    >
                      <button
                        onClick={() => toggleFAQ(currentIndex)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-zinc-100 outline-none"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-[#5E7A9E] transition-transform duration-300 shrink-0 ml-4 ${
                            isOpen ? "transform rotate-185 text-[#00E676]" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-[300px] border-t border-white/5 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="p-5 text-sm text-[#C5D2EE] leading-relaxed whitespace-pre-line bg-white/[0.01]">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact organizador banner */}
        <div className="mt-16 bg-gradient-to-br from-[#00E676]/10 to-blue-500/5 border border-[#00E676]/15 rounded-2xl p-8 text-center animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-2">¿Tienes alguna otra pregunta?</h3>
          <p className="text-xs sm:text-sm text-[#5E7A9E] max-w-md mx-auto mb-6">
            Si tienes problemas con la validación de tu pago o quieres reportar un error, ponte en contacto directo con soporte.
          </p>
          <a
            href="https://wa.me/50762149386"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00E676] text-black px-6 py-2.5 font-bold font-mono transition-all hover:opacity-90 hover:shadow-[0_0_12px_rgba(0,230,118,0.3)] text-xs active:scale-[0.97]"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
