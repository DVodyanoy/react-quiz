import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import Loader from "../../components/UI/Loader/Loader";
import {fetchDeleteQuiz, fetchQuizzes} from "../../store/actions/quiz";
import {connect} from "react-redux";
import classes from "./QuizList.css";

class QuizList extends Component {

    renderQuizzes() {
        return this.props.quizzes.map(quiz => {
            return (
                <li key={quiz.id}>
                    <i
                        className="far fa-trash-alt"
                        onClick={() => this.props.fetchDeleteQuiz(quiz.id)}
                    />
                    <NavLink
                        to={`/quiz/${quiz.id}`}
                    >
                        {quiz.name}
                    </NavLink>
                </li>
            )
        })
    }

    componentDidMount() {
        this.props.fetchQuizzes()
    }

    render() {
        return (
            <div className={classes.QuizList}>
                <div>
                    <h1>Список тестов</h1>
                    {
                        this.props.quizzes.length === 0
                            ? <h2>Тесты отсутствуют. Для создания нового теста перейдите в раздел "Создать тест"</h2>
                            : this.props.loading
                                ? <Loader/>
                                : <ul>
                                    {this.renderQuizzes()}
                                  </ul>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        quizzes: state.quiz.quizzes,
        loading: state.quiz.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchQuizzes: () => dispatch(fetchQuizzes()),
        fetchDeleteQuiz: quizId => dispatch(fetchDeleteQuiz(quizId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizList);