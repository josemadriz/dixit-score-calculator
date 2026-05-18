import { forwardRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { SparkleContainer } from "./Sparkle";

const ResetConfirmSlideTransition = forwardRef(function ResetConfirmSlideTransition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GameDialogs({ 
  showWinnerDialog, 
  showResetDialog, 
  winner, 
  onCloseWinnerDialog, 
  onCloseResetDialog, 
  onResetGame 
}) {
  return (
    <>
      {/* Winner Dialog */}
      <Dialog
        open={showWinnerDialog}
        onClose={onCloseWinnerDialog}
        aria-labelledby="winner-dialog-title"
        aria-describedby="winner-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          id="winner-dialog-title"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center text-2xl font-bold py-4 relative"
        >
          <SparkleContainer sparkleCount={6}>
            🎉 Congratulations! 🎉
          </SparkleContainer>
        </DialogTitle>
        <DialogContent className="text-center pt-6 pb-4">
          <div className="mb-4">
            <SparkleContainer sparkleCount={4}>
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl mb-4 relative">
                👑
              </div>
            </SparkleContainer>
            <p className="text-xl text-gray-800 font-bold mb-2">
              {winner} wins the game!
            </p>
            <p className="text-gray-600">Continue to set up a new game.</p>
          </div>
        </DialogContent>
        <DialogActions className="flex justify-center pb-4">
          <Button
            onClick={onResetGame}
            variant="contained"
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Back to setup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset confirmation — slide-in alert dialog (MUI alert pattern) */}
      <Dialog
        open={showResetDialog}
        onClose={onCloseResetDialog}
        TransitionComponent={ResetConfirmSlideTransition}
        role="alertdialog"
        aria-labelledby="reset-alert-dialog-title"
        aria-describedby="reset-alert-dialog-description"
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="reset-alert-dialog-title"
          className="text-xl font-semibold text-center py-4"
        >
          Back to setup?
        </DialogTitle>
        <DialogContent className="pt-0 pb-1">
          <DialogContentText
            id="reset-alert-dialog-description"
            component="p"
            className="text-base text-center text-gray-700"
          >
            This clears all scores.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="flex justify-center pb-4 gap-2">
          <Button onClick={onCloseResetDialog} variant="outlined" autoFocus>
            Cancel
          </Button>
          <Button
            onClick={onResetGame}
            variant="contained"
            color="error"
          >
            Back to setup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 