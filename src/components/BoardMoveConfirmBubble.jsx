import { Popper, Paper, ClickAwayListener, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";

export default function BoardMoveConfirmBubble({
  confirm,
  onConfirm,
  onCancel,
}) {
  if (!confirm?.anchorEl) return null;

  const { playerName, playerColor, slot } = confirm;
  const label = slot === 0 ? "start line" : `#${slot}`;

  return (
    <Popper
      open
      anchorEl={confirm.anchorEl}
      placement="top"
      modifiers={[
        { name: "offset", options: { offset: [0, 10] } },
        { name: "preventOverflow", options: { padding: 8 } },
      ]}
      style={{ zIndex: 1400 }}
    >
      <ClickAwayListener onClickAway={onCancel}>
        <Paper
          elevation={6}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl"
          style={{ minWidth: 0 }}
        >
          {/* Arrow */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid white",
              filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.12))",
            }}
          />

          {/* Label */}
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 whitespace-nowrap">
            <Icon
              icon="mdi:rabbit"
              width={18}
              style={{ color: playerColor, flexShrink: 0 }}
            />
            <span>{playerName}</span>
            <Icon icon="formkit:arrowright" width={14} className="text-gray-500 inline-block" />
            <span className="font-normal text-gray-500">
              {label}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1">
            <IconButton
              size="small"
              onClick={onCancel}
              aria-label="Cancel move"
              sx={{
                color: "white",
                background: "#ef4444",
                borderRadius: "50%",
                width: 32,
                height: 32,
                "&:hover": { background: "#dc2626" },
              }}
            >
              <Icon icon="mdi:close" width={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onConfirm}
              aria-label="Confirm move"
              sx={{
                color: "white",
                background: "#22c55e",
                borderRadius: "50%",
                width: 32,
                height: 32,
                "&:hover": { background: "#16a34a" },
              }}
            >
              <Icon icon="mdi:check" width={18} />
            </IconButton>
          </div>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
