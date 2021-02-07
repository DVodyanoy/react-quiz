import React, {Component} from "react";
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import classes from "./Quiz.css";
import Loader from "../../components/UI/Loader/Loader";
import {connect} from "react-redux";
import {fetchQuizById, quizAnswerClick, retryQuiz} from "../../store/actions/quiz";

class Quiz extends Component {

    componentDidMount() {
        this.props.fetchQuizById(this.props.match.params.id)
    }

    componentWillUnmount() {
        this.props.retryQuiz()
    }

    render() {
        const {activeQuestion, quiz, answerState, isFinished, results, loading} = this.props;

        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    {
                        isFinished
                            ? <h1>Результаты</h1>
                            : <h1>Ответьте на все вопросы</h1>
                    }
                    {
                        loading || !quiz
                            ? <Loader/>
                            : isFinished
                            ? <FinishedQuiz
                                results={results}
                                quiz={quiz}
                                onRetry={this.props.retryQuiz}
                            />
                            : <ActiveQuiz
                                answers={quiz[activeQuestion].answers}
                                question={quiz[activeQuestion].question}
                                onAnswerClick={this.props.quizAnswerClick}
                                quizLength={quiz.length}
                                answerNumber={activeQuestion + 1}
                                state={answerState}
                            />
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {results, isFinished, activeQuestion, answerState, quiz, loading} = state.quiz;
    return {
        results,
        isFinished,
        activeQuestion,
        answerState,
        quiz,
        loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchQuizById: id => dispatch(fetchQuizById(id)),
        quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
        retryQuiz: () => dispatch(retryQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);