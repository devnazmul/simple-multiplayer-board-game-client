import {
  Backdrop, Box, Button, Fade, makeStyles,
  Modal, TextField, Typography
} from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    borderRadius: "10px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: "center",
    maxWidth: 500,
    width: "80%",
  },

  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  answerInput: {
    width: "80%",
    height: "40px",
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    backgroundColor: "#009688",
    color: "#fff",
    borderRadius: "5px",
    padding: theme.spacing(1, 2),
    cursor: "pointer",
    marginBottom: theme.spacing(2),
  },
  successMessage: {
    color: "green",
    fontSize: "18px",
    marginTop: theme.spacing(2),
  },
  errorMessage: {
    color: "red",
    fontSize: "18px",
    marginTop: theme.spacing(2),
  },
  timer: {
    position: "absolute",
    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const QuestionModal = ({
  isOpen,
  question,
  onClose,
  onSubmit,
  success,
  error,
}) => {
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const classes = useStyles();

  const showTimer = useMemo(() => isOpen && timeLeft > 0, [isOpen, timeLeft]);

  useEffect(() => {
    let timerId;
    if (showTimer) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (timeLeft == 1) {
          handleCancel()
        }
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isOpen, showTimer, timeLeft,]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit(answer);
      setTimeLeft(0);
    },
    [onSubmit, answer]
  );

  const handleCancel = () => {
    onSubmit(answer);
    console.log('dfgdfgdgfdg')
  };

  // console.log("QuestionModal: isOpen: ", isOpen);
  // console.log("QuestionModal: question: ", question);
  // console.log("QuestionModal: success: ", success);
  // console.log("QuestionModal: error: ", error);

  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onClose={handleCancel}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <div className={classes.paper}>
          <Box position='relative'>
            <Typography variant='h5'>
              {question.operand1} {question.operator} {question.operand2} =
            </Typography>
            <Button
              className={classes.closeButton}
              onClick={handleCancel}
              variant='contained'
              color='secondary'
            >
              X
            </Button>
            {showTimer && (
              <Typography className={classes.timer}>
                Time left: {timeLeft}
              </Typography>
            )}
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              className={classes.answerInput}
              variant='outlined'
              label='Answer'
              type='number'
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button
              className={classes.submitButton}
              type='submit'
              variant='contained'
              disableElevation
            >
              Submit
            </Button>
          </form>
          {success && (
            <Typography className={classes.successMessage}>
              {success}
            </Typography>
          )}
          {error && (
            <Typography className={classes.errorMessage}>{error}</Typography>
          )}
        </div>
      </Fade>
    </Modal>
  );
};

export default QuestionModal;
