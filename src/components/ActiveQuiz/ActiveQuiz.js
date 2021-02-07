import React from "react";
import AnswersList from "../AnswersList/AnswersList";
import classes from "./ActiveQuiz.css";

const ActiveQuiz = ({question, answers, answerNumber, quizLength, state, onAnswerClick}) => {
    return (
        <div className={classes.ActiveQuiz}>
            <p className={classes.Question}>
            <span>
                <strong>{answerNumber}.</strong> {question}
            </span>
                <small>{answerNumber} из {quizLength}</small>
            </p>
            <AnswersList
                answers={answers}
                onAnswerClick={onAnswerClick}
                state={state}
            />
        </div>
    )
}

export default ActiveQuiz;