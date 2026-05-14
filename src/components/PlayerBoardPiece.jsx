import { Icon } from "@iconify/react";
import { DIXIT_PLAYER_DRAG_MIME } from "../utils/gameUtils";

const RABBIT_ICON = "mdi:rabbit";

export default function PlayerBoardPiece({
  player,
  size = 30,
  className = "",
  style,
  draggable = true,
  onDragStart,
  onDragSessionStart,
  onDragSessionEnd,
}) {
  const spanClass = [
    draggable
      ? "inline-flex cursor-grab select-none active:cursor-grabbing"
      : "inline-flex select-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={spanClass}
      style={style}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData(DIXIT_PLAYER_DRAG_MIME, player.id);
        e.dataTransfer.setData("text/plain", player.id);
        e.dataTransfer.effectAllowed = "move";
        onDragSessionStart?.(player);
        onDragStart?.(e);
      }}
      onDragEnd={() => {
        onDragSessionEnd?.();
      }}
    >
      <Icon
        icon={RABBIT_ICON}
        width={size}
        height={size}
        style={{
          color: player.color,
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
          pointerEvents: "none",
          userSelect: "none",
          display: "block",
        }}
        aria-label={player.name}
      />
    </span>
  );
}
