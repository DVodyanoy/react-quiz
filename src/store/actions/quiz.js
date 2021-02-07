import axios from "../../axios/axios-quiz";
import {
    STOP_LOADING,
    FETCH_QUIZ_SUCCESS,
    FETCH_QUIZZES_ERROR,
    FETCH_QUIZZES_START,
    FETCH_QUIZZES_SUCCESS,
    QUIZ_FINISH,
    QUIZ_NEXT_QUESTION,
    QUIZ_RETRY,
    QUIZ_SET_STATE
} from "./actionTypes";


export function fetchQuizzes() {
    return async dispatch => {
        dispatch(fetchQuizzesStart())
        try {
            const response = await axios.get('/quizzes.json')
            const quizzes = []
            if (response.data === null) {
                dispatch(stopLoading())
            } else {
                Object.keys(response.data).forEach((key) => {
                    quizzes.push({
                        id: key,
                        name: response.data[key][0].quizName
                    })
                })
            }

            dispatch(fetchQuizzesSuccess(quizzes))
        } catch (error) {
            fetchQuizzesError(error)
        }
    }
}

export function fetchQuizById(quizId) {
    return async dispatch => {
        dispatch(fetchQuizzesStart())
        try {
            const response = await axios.get(`/quizzes/${quizId}.json`)
            const quiz = response.data
            dispatch(fetchQuizSuccess(quiz))
        } catch (error) {
            fetchQuizzesError(error)
        }
    }
}

export function fetchQuizSuccess(quiz) {
    return {
        type: FETCH_QUIZ_SUCCESS,
        quiz
    }
}

export function fetchQuizzesStart() {
    return {
        type: FETCH_QUIZZES_START
    }
}

export function fetchQuizzesSuccess(quizzes) {
    return {
        type: FETCH_QUIZZES_SUCCESS,
        quizzes
    }
}

export function fetchQuizzesError(error) {
    return {
        type: FETCH_QUIZZES_ERROR,
        error
    }
}

export function quizSetState(answerState, results) {
    return {
        type: QUIZ_SET_STATE,
        answerState,
        results
    }
}

export function finishQuiz() {
    return {
        type: QUIZ_FINISH
    }
}

export function quizNextQuestion(number) {
    return {
        type: QUIZ_NEXT_QUESTION,
        number
    }
}

export function retryQuiz() {
    return {
        type: QUIZ_RETRY
    }
}

export function fetchDeleteQuiz(quizId) {
    return async dispatch => {
        try {
            await axios.delete(`https://react-quiz-a7d59-default-rtdb.firebaseio.com/quizzes/${quizId}.json`)
        } catch (error) {
            fetchQuizzesError(error)
        }

        dispatch(fetchQuizzes())
    }
}

export function stopLoading() {
    return {
        type: STOP_LOADING
    }
}

export function quizAnswerClick(answerId) {
    return (dispatch, getState) => {
        const state = getState().quiz

        const {quiz, activeQuestion, answerState, results} = state;
        const question = quiz[activeQuestion];

        if (answerState) {
            const key = Object.keys(answerState)[0];
            if (answerState[key] === 'success') {
                return
            }
        }

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }

            dispatch(quizSetState({[answerId]: 'success'}, results))

            const timeout = window.setTimeout(() => {
                if (activeQuestion + 1 === quiz.length) {
                    dispatch(finishQuiz())
                } else {
                    dispatch(quizNextQuestion(activeQuestion + 1))
                }
                window.clearTimeout(timeout)
            }, 500);
        } else {
            results[question.id] = 'error'

            dispatch(quizSetState({[answerId]: 'error'}, results))

            const timeout = window.setTimeout(() => {
                if (activeQuestion + 1 === quiz.length) {
                    dispatch(finishQuiz())
                } else {
                    dispatch(quizNextQuestion(activeQuestion + 1))
                }
                window.clearTimeout(timeout)
            }, 500);
        }
    }
}