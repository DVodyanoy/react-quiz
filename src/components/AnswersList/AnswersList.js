import React from "react";
import AnswerItem from "./AnswerItem/AnswerItem";
import classes from "./AnswersList.css";

const AnswersList = ({answers, state, onAnswerClick}) => {
    return (
        <ul className={classes.AnswersList}>
            {answers.map((answer, index) => {
                return (
                    <AnswerItem
                        key={index}
                        answer={answer}
                        onAnswerClick={onAnswerClick}
                        state={state ? state[answer.id] : null}
                    />
                )
            })}
        </ul>
    )
}

export default AnswersList;