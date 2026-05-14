import { Button, TableContainer } from "@mui/material";
import { Icon } from "@iconify/react";

export default function ScoreTable({ 
  players, 
  roundScores, 
  onScoreChange, 
  onSubmitScores 
}) {
  return (
    <TableContainer>
      <div className="overflow-x-auto shadow-xl rounded-xl mb-3 border border-gray-200/50">
        <table className="min-w-full table-auto" role="table" aria-label="Player scores">
          <thead className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            <tr>
              <th className="px-4 py-2 text-center text-sm font-semibold">
                Player
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold">
                Score
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold">
                Round Scores
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold">
                Total Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {players.map((player, index) => (
              <tr key={player.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td
                  className="px-2 py-4 text-center truncate flex items-center gap-2"
                  style={{ color: player.color }}
                >
                  <Icon
                    icon="mdi:rabbit"
                    width={18}
                    height={18}
                    style={{ color: player.color }}
                    aria-label={`${player.name}'s color`}
                  />
                  <span>{player.name}</span>
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="number"
                    min="0"
                    className="w-14 p-2 text-sm text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    value={roundScores[index]}
                    onChange={(e) => onScoreChange(index, e.target.value)}
                    aria-label={`Enter score for ${player.name}`}
                  />
                </td>
                <td className="px-4 py-2 text-sm text-center">
                  {player.scores.join(", ") || "No scores yet"}
                </td>
                <td className="px-4 py-2 text-sm text-center font-semibold">
                  {player.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        onClick={onSubmitScores}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 !text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        aria-label="Submit all player scores"
      >
        🎯 Submit Scores
      </Button>
    </TableContainer>
  );
} 