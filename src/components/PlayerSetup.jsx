import { useState } from "react";
import { TextField, Button, Tooltip, ClickAwayListener } from "@mui/material";
import { ImCross } from "react-icons/im";
import { Icon } from "@iconify/react";
import DixitLogo from "/images/dixit.png";
import { GAME_CONFIG, getDefaultPlayerName, PLAYER_COLORS } from "../constants/gameConfig";

function SwatchPalette({ playerIndex, currentColor, takenColors, onSelect, onClose }) {
  return (
    <div className="grid grid-cols-4 gap-2 p-1">
      {PLAYER_COLORS.map((color) => {
        const taken = takenColors.includes(color) && color !== currentColor;
        return (
          <button
            key={color}
            type="button"
            disabled={taken}
            onClick={() => { onSelect(playerIndex, "color", color); onClose(); }}
            aria-label={`Select color ${color}`}
            className={`w-9 h-9 rounded-lg border-2 transition-all duration-150
              ${
                color === currentColor
                  ? "border-gray-800 scale-110 shadow-md"
                  : taken
                    ? "ring-gray-400 ring-2 opacity-25 ring-offset-0 cursor-not-allowed"
                    : "border-transparent hover:scale-110 hover:border-gray-500 cursor-pointer"
              }`}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}

function ColorPicker({ playerIndex, currentColor, takenColors, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <Tooltip
          open={open}
          disableHoverListener
          disableFocusListener
          disableTouchListener
          arrow
          placement="bottom"
          title={
            <SwatchPalette
              playerIndex={playerIndex}
              currentColor={currentColor}
              takenColors={takenColors}
              onSelect={onSelect}
              onClose={() => setOpen(false)}
            />
          }
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: "white",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 3,
                boxShadow: 6,
                p: 1.5,
                maxWidth: "none",
              },
            },
            arrow: { sx: { color: "white" } },
            popper: {
              sx: {
                zIndex: (theme) => theme.zIndex.tooltip + 1000,
              },
            },
          }}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Pick player color"
            className="focus:outline-none hover:scale-110 transition-transform duration-150"
          >
            <Icon icon="mdi:rabbit" width={48} height={48} style={{ color: currentColor }} />
          </button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

export default function PlayerSetup({ 
  players, 
  onUpdatePlayer, 
  onAddPlayer, 
  onRemovePlayer, 
  onStartGame 
}) {
  const canAddPlayer = players.length < GAME_CONFIG.MAX_PLAYERS;
  const canRemovePlayer = players.length > GAME_CONFIG.MIN_PLAYERS;
  const takenColors = players.map((p) => p.color);

  return (
    <div>
      <div className="flex justify-center m-4">
        <img src={DixitLogo} alt="Dixit Logo" className="w-42 drop-shadow-lg" />
      </div>
      <div className="p-6 max-w-md mx-auto bg-linear-to-br from-white/95 to-gray-50/95 backdrop-blur-sm shadow-xl border border-gray-200/50 rounded-xl mt-6">
        <h1 className="text-2xl font-bold mb-4 text-center bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Player Setup
        </h1>

        <div className="space-y-4">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <ColorPicker
                playerIndex={index}
                currentColor={player.color}
                takenColors={takenColors}
                onSelect={onUpdatePlayer}
              />

              <TextField
                label="Player Name"
                variant="outlined"
                placeholder={`Player Name ${index + 1}`}
                value={player.name}
                onChange={(e) => onUpdatePlayer(index, "name", e.target.value)}
                className="grow"
                InputLabelProps={{ shrink: true }}
                inputProps={{ "aria-label": `${getDefaultPlayerName(index)} name` }}
              />

              <button
                onClick={() => onRemovePlayer(index)}
                disabled={!canRemovePlayer}
                className={`text-xl cursor-pointer p-1 rounded-full transition-all duration-200 ${
                  canRemovePlayer
                    ? "text-red-600 hover:text-red-800 hover:bg-red-50 hover:scale-110"
                    : "opacity-50 cursor-not-allowed text-gray-400"
                }`}
                aria-label={`Remove ${player.name.trim() || getDefaultPlayerName(index)}`}
              >
                <ImCross />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            variant="contained"
            onClick={onAddPlayer}
            disabled={!canAddPlayer}
            aria-label="Add new player"
            className="flex-1 sm:flex-none px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            sx={{
              background: canAddPlayer 
                ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(45deg, #ccc 0%, #999 100%)',
              '&:hover': {
                background: canAddPlayer 
                  ? 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)'
                  : 'linear-gradient(45deg, #ccc 0%, #999 100%)',
              }
            }}
          >
            Add Player ({players.length}/{GAME_CONFIG.MAX_PLAYERS})
          </Button>
          <Button 
            variant="contained" 
            onClick={onStartGame}
            aria-label="Start the game"
            className="flex-1 sm:flex-none px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            sx={{
              background: 'linear-gradient(45deg, #11998e 0%, #38ef7d 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0f8a7a 0%, #2dd66a 100%)',
              }
            }}
          >
            🎮 Start Game
          </Button>
        </div>
      </div>
    </div>
  );
} 