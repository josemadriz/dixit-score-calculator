import { Button, TableContainer, Tooltip, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { effectiveBoardScore } from "../utils/gameUtils";

export default function ScoreTable({ 
  players, 
  roundScores, 
  onScoreChange, 
  onSubmitScores 
}) {
  return (
    <div className="flex flex-col p-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl gap-2">
      <Button
        onClick={onSubmitScores}
        className="w-full px-6 py-3 rounded-4xl! bg-linear-to-r from-blue-500 to-purple-600 text-white! font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        aria-label="Submit all player scores"
      >
        🎯 Submit Scores
      </Button>
      <TableContainer>
        <div className="overflow-x-auto shadow-xl rounded-xl mb-3 border border-gray-200/50">
          <table className="min-w-full table-auto" role="table" aria-label="Player scores">
            <thead className="bg-linear-to-r from-gray-600 to-gray-700 text-white">
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
                    {/* Prevent HTML5 drop from inserting drag text/plain (player id) into inputs */}
                    <div
                      className="inline-flex items-center justify-center gap-1"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "none";
                      }}
                      onDrop={(e) => e.preventDefault()}
                    >
                      <IconButton
                        type="button"
                        onClick={() => {
                          const raw = roundScores[index];
                          const n = parseInt(raw, 10);
                          const cur = Number.isFinite(n) ? n : 0;
                          onScoreChange(index, String(cur - 1));
                        }}
                        aria-label={`Decrease round score for ${player.name}`}
                        sx={{
                          width: 34,
                          height: 34,
                          minWidth: 34,
                          color: "#fff",
                          backgroundColor: player.color,
                          boxShadow: 1,
                          "&:hover": {
                            backgroundColor: player.color,
                            filter: "brightness(0.88)",
                          },
                        }}
                        className="rounded-full!"
                      >
                        <Icon icon="mdi:minus" width={26} style={{ color: "#fff" }} />
                      </IconButton>
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-14 py-2 px-1 text-base tabular-nums text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={roundScores[index]}
                        onChange={(e) => onScoreChange(index, e.target.value)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "none";
                        }}
                        onDrop={(e) => e.preventDefault()}
                        aria-label={`Enter score for ${player.name}`}
                      />
                      <IconButton
                        type="button"
                        onClick={() => {
                          const raw = roundScores[index];
                          const n = parseInt(raw, 10);
                          const cur = Number.isFinite(n) ? n : 0;
                          onScoreChange(index, String(cur + 1));
                        }}
                        aria-label={`Increase round score for ${player.name}`}
                        sx={{
                          width: 34,
                          height: 34,
                          minWidth: 34,
                          color: "#fff",
                          backgroundColor: player.color,
                          boxShadow: 1,
                          "&:hover": {
                            backgroundColor: player.color,
                            filter: "brightness(0.88)",
                          },
                        }}
                        className="!rounded-full"
                      >
                        <Icon icon="mdi:plus" width={26} style={{ color: "#fff" }} />
                      </IconButton>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    {player.scores.join(", ") || "No scores yet"}
                  </td>
                  <td className="px-4 py-2 text-sm text-center font-semibold">
                    {player.boardPositionOverride != null ? (
                      <Tooltip
                        title={`Score: ${player.total} — board position manually set to ${effectiveBoardScore(player)}`}
                        arrow
                        disableInteractive
                      >
                        <span className="inline-flex items-center gap-1">
                          <span>{effectiveBoardScore(player)}</span>
                          <Icon
                            icon="mdi:cursor-move"
                            width={13}
                            className="text-amber-500 shrink-0"
                            aria-label="manual override"
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      player.total
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>
    </div>
  );
} 