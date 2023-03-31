import {
  Backdrop, Box, Fade, makeStyles,
  Modal, Typography
} from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdAlarm } from "react-icons/md";
import "./QuestionModal.css";


const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: 'border-box',
    padding: '20px'
  },
  closeButton: {
    position: "absolute",
    top: "-10px",
    right: "-25px",
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
    marginTop: "10px",
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
      className={`${classes.modal}`}
      open={isOpen}
      onClose={handleCancel}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isOpen}>
        <div className="MathQuestionModal">
          <div className="logoImageContainer">
            <img src="/images/game-board-title.png" alt="" />
          </div>
          <div className="QuestionModaltimerContainer">
            <div>

              {showTimer && (
                <span>
                  <MdAlarm />
                  Time left: {timeLeft}
                </span>
              )}
            </div>
            <button
              className="QuestionModalCrossButton"
              onClick={handleCancel}
              variant='contained'
              color='secondary'
            >
              X
            </button>
          </div>


          <form className={`${classes.questionContainer} QuestionForm`} onSubmit={handleSubmit}>
            <Box className={`${classes.questionAndAnsContainer} QuestionContainerFlex`}>
              <div className="QuestionMath">
                <div>{question.operand1}</div>

                <div className="mathOparations">
                  {
                    question.operator === "/"
                      ? "÷"
                      : question.operator === "*"
                        ? "×"
                        : question.operator
                  }
                </div>
                <div>{question.operand2}</div>

              </div>
              <div className="AnsContainer">
                <div>=</div>
                <div>
                  <input
                    step="any"
                    className={`QuestionAndField`}
                    type='number'
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              </div>

            </Box>

            <button
              className={`submitButton`}
              type='submit'
              disableElevation
            >
              Submit
            </button>
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
