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
} from "../actions/actionTypes";


const initialState = {
    quizzes: [],
    loading: false,
    error: null,
    results: {},
    isFinished: false,
    activeQuestion: 0,
    answerState: null,
    quiz: null
}

export default function quizReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_QUIZZES_START:
            return {
                ...state,
                loading: true
            }
        case FETCH_QUIZZES_SUCCESS:
            return {
                ...state,
                loading: false,
                quizzes: action.quizzes
            }
        case FETCH_QUIZZES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        case FETCH_QUIZ_SUCCESS:
            return {
                ...state,
                loading: false,
                quiz: action.quiz
            }
        case QUIZ_SET_STATE:
            return {
                ...state,
                answerState: action.answerState,
                results: action.results
            }
        case QUIZ_FINISH:
            return {
                ...state,
                isFinished: true
            }
        case QUIZ_NEXT_QUESTION:
            return {
                ...state,
                activeQuestion: action.number,
                answerState: null
            }
        case QUIZ_RETRY:
            return {
                ...state,
                results: {},
                isFinished: false,
                activeQuestion: 0,
                answerState: null
            }
        case STOP_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}