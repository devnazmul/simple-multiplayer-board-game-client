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
    top: "-10px",
    right: "-25px",
  },
  answerInput: {
    width: "100px",
    marginLeft: "10px",
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
    marginTop: "20px",
    fontSize: "1.1rem",
    color: "red",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    fontWeight: "bold",
  },
  questionContainer: {
    marginTop: "50px",
  },
  questionAndAnsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const QuestionModal = ({
  setIsOpen,
  isOpen,
  question,
  onClose,
  onSubmit,
  success,
  error,
}) => {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const classes = useStyles();

  const showTimer = useMemo(() => isOpen && timeLeft > 0, [isOpen, timeLeft]);

  useEffect(() => {
    let timerId;
    if (showTimer) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (timeLeft == 1) {
          handleCancel();
          setIsOpen(false)

        }
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isOpen, showTimer, timeLeft]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit(answer === '' ? 0 : answer);
      setIsOpen(false)
      setTimeLeft(0);
    },
    [onSubmit, answer]
  );

  const handleCancel = () => {
    onSubmit(answer === '' ? 0 : answer);
    setIsOpen(false)

  };

  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onClose={handleCancel}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isOpen}>
        <div className={classes.paper}>
          <Box position='relative'>
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
          <form className={classes.questionContainer} onSubmit={handleSubmit}>
            <Box className={classes.questionAndAnsContainer}>
              <Typography variant='h5'>
                {question.operand1}{" "}
                {question.operator === "/"
                  ? "÷"
                  : question.operator === "*"
                    ? "×"
                    : question.operator}{" "}
                {question.operand2} =
              </Typography>

              <TextField
                className={classes.answerInput}
                variant='outlined'
                type='number'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </Box>

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
