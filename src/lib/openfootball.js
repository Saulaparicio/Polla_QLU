/**
 * Mapeo de nombres de equipos en inglés (usados por la API de openfootball)
 * a los códigos de ID de equipo utilizados en la base de datos de Polla QLU.
 */
const TEAM_NAME_TO_CODE = {
  "Mexico": "MEX", "South Africa": "RSA", "Rep. of Korea": "KOR", "Czech Rep.": "CZE",
  "Canada": "CAN", "Bosnia/Herzeg.": "BIH", "Qatar": "QAT", "Switzerland": "SUI",
  "Brazil": "BRA", "Morocco": "MAR", "Haiti": "HAI", "Scotland": "SCO",
  "USA": "USA", "Paraguay": "PAR", "Australia": "AUS", "Turkey": "TUR",
  "Germany": "GER", "Curaçao": "CUW", "Ivory Coast": "CIV", "Ecuador": "ECU",
  "Netherlands": "NED", "Japan": "JPN", "Sweden": "SWE", "Tunisia": "TUN",
  "Belgium": "BEL", "Egypt": "EGY", "IR Iran": "IRN", "New Zealand": "NZL",
  "Spain": "ESP", "Cape Verde": "CPV", "Saudi Arabia": "KSA", "Uruguay": "URU",
  "France": "FRA", "Senegal": "SEN", "Iraq": "IRQ", "Norway": "NOR",
  "Argentina": "ARG", "Algeria": "ALG", "Austria": "AUT", "Jordan": "JOR",
  "Portugal": "POR", "DR Congo": "COD", "Uzbekistan": "UZB", "Colombia": "COL",
  "England": "ENG", "Croatia": "CRO", "Ghana": "GHA", "Panama": "PAN"
};

/**
 * Consume la API externa de openfootball para obtener los marcadores oficiales
 * del Mundial 2026 y los retorna limpios y listos para mapear en la interfaz de la polla.
 * 
 * @returns {Promise<Array<{matchId: string, homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number}>>}
 */
export async function fetchExternalResults() {
  const url = "https://raw.githubusercontent.com/openfootball/world-cup.json/master/2026/worldcup.json";
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const cleanResults = [];

    if (data && Array.isArray(data.rounds)) {
      data.rounds.forEach(round => {
        if (Array.isArray(round.matches)) {
          round.matches.forEach(match => {
            // Verificar si el partido tiene un marcador final registrado
            if (match.score && Array.isArray(match.score.ft)) {
              const homeScore = match.score.ft[0];
              const awayScore = match.score.ft[1];

              // Validar que los goles sean números válidos
              if (homeScore !== null && homeScore !== undefined && 
                  awayScore !== null && awayScore !== undefined) {
                
                const homeTeamId = TEAM_NAME_TO_CODE[match.team1];
                const awayTeamId = TEAM_NAME_TO_CODE[match.team2];

                if (homeTeamId && awayTeamId) {
                  cleanResults.push({
                    homeTeamId,
                    awayTeamId,
                    homeScore: Number(homeScore),
                    awayScore: Number(awayScore),
                    rawHomeTeam: match.team1,
                    rawAwayTeam: match.team2
                  });
                }
              }
            }
          });
        }
      });
    }

    return cleanResults;
  } catch (error) {
    console.error("Error fetching external World Cup 2026 results:", error);
    throw error;
  }
}

/**
 * Mapea los resultados obtenidos de la API externa directamente al estado de marcadores 
 * del componente de administración `MarcadoresPanel` de Next.js.
 * 
 * @param {Array} dbMatches - Lista de partidos cargados desde la base de datos de Firestore.
 * @param {Function} setScores - Función `setScores` del componente de administración.
 * @param {Function} setStatuses - Función `setStatuses` del componente de administración.
 * @returns {Promise<number>} - Cantidad de marcadores actualizados/sincronizados.
 */
export async function syncExternalResultsToState(dbMatches, setScores, setStatuses) {
  try {
    const externalResults = await fetchExternalResults();
    let updatedCount = 0;

    setScores(prevScores => {
      const nextScores = { ...prevScores };
      setStatuses(prevStatuses => {
        const nextStatuses = { ...prevStatuses };
        
        externalResults.forEach(result => {
          // Buscar en los partidos de la base de datos el que coincida con los equipos
          const matchedDbMatch = dbMatches.find(m => 
            m.homeTeamId === result.homeTeamId && 
            m.awayTeamId === result.awayTeamId &&
            m.status !== "finished" // Solo actualizar si no está marcado como terminado
          );

          if (matchedDbMatch) {
            nextScores[matchedDbMatch.id] = {
              homeScore: result.homeScore,
              awayScore: result.awayScore
            };
            nextStatuses[matchedDbMatch.id] = "finished"; // Pre-seleccionar estado a Finalizado
            updatedCount++;
          }
        });

        return nextStatuses;
      });
      return nextScores;
    });

    return updatedCount;
  } catch (error) {
    console.error("Failed to sync external results to state:", error);
    throw error;
  }
}
