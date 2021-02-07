import React, {Component} from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Select from "../../components/UI/Select/Select";
import {createControl, validate, validateForm} from "../../form/formFramework";
import classes from "./QuizCreator.css";
import {connect} from "react-redux";
import {createQuizQuestion, finishCreateQuiz} from "../../store/actions/create";

function createAnswerControl(answerNumber) {
    return createControl({
        label: `Введите ${answerNumber}й вариант ответа:`,
        errorMessage: 'Ответ не может быть пустым',
        id: answerNumber
    }, {required: true})
}

function createFormControls() {
    return {
        question: createControl({
            label: 'Введите вопрос:',
            errorMessage: 'Вопрос не может быть пустым',
        }, {required: true}),
        answer1: createAnswerControl(1),
        answer2: createAnswerControl(2),
        answer3: createAnswerControl(3),
        answer4: createAnswerControl(4)
    }
}

class QuizCreator extends Component {
    state = {
        isFormValid: false,
        rightAnswerId: 1,
        formControls: {
            quizName: createControl({
                label: 'Введите название теста:',
                errorMessage: 'Название не может быть пустым'
            }, {required: true}),
            ...createFormControls()
        }
    }

    addQuestionHandler = event => {
        event.preventDefault()

        const {question, answer1, answer2, answer3, answer4, quizName} = this.state.formControls

        const questionItem = {
            quizName: quizName.value,
            question: question.value,
            id: this.props.quiz.length + 1,
            rightAnswerId: this.state.rightAnswerId,
            answers: [
                {text: answer1.value, id: answer1.id},
                {text: answer2.value, id: answer2.id},
                {text: answer3.value, id: answer3.id},
                {text: answer4.value, id: answer4.id}
            ]
        }

        this.props.createQuizQuestion(questionItem)

        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: {
                quizName: createControl({
                    label: 'Введите название теста:',
                    errorMessage: 'Название не может быть пустым',
                    value: quizName.value
                }),
                ...createFormControls()
            }
        })
    }

    createQuizHandler = event => {
        event.preventDefault()

        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: {
                quizName: createControl({
                    label: 'Введите название теста:',
                    errorMessage: 'Название не может быть пустым'
                }, {required: true}),
                ...createFormControls()
            }
        })
        this.props.finishCreateQuiz()
    }

    changeHandler = (value, controlName) => {
        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}

        control.touched = true
        control.value = value
        control.valid = validate(control.value, control.validation)

        formControls[controlName] = control

        this.setState({
            formControls,
            isFormValid: validateForm(formControls)
        })
    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]

            return (
                <React.Fragment key={index}>
                    <Input
                        label={control.label}
                        value={control.value}
                        valid={control.valid}
                        shouldValidate={!!control.validation}
                        touched={control.touched}
                        errorMessage={control.errorMessage}
                        onChange={e => this.changeHandler(e.target.value, controlName)}
                    />
                    {index === 0 ? <React.Fragment>
                        <hr/>
                        <hr/>
                    </React.Fragment> : null}
                    {index === 1 ? <hr/> : null}
                </React.Fragment>
            )
        })
    }

    selectChangeHandler = event => {
        this.setState({
            rightAnswerId: +event.target.value
        })
    }


    render() {
        return (
            <div className={classes.QuizCreator}>
                <div>
                    <h1>Создание теста</h1>
                    <form onSubmit={e => e.preventDefault()}>
                        {this.renderInputs()}
                        <Select
                            label={'Выберите правильный ответ'}
                            value={this.state.rightAnswerId}
                            onChange={this.selectChangeHandler}
                            options={[
                                {text: 1, value: 1},
                                {text: 2, value: 2},
                                {text: 3, value: 3},
                                {text: 4, value: 4}
                            ]}
                        />
                        <Button
                            type={'primary'}
                            onClick={this.addQuestionHandler}
                            disabled={!this.state.isFormValid}
                        >Добавить вопрос</Button>
                        <Button
                            type={'success'}
                            onClick={this.createQuizHandler}
                            disabled={this.props.quiz.length === 0}
                        >Создать тест</Button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        quiz: state.create.quiz
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: () => dispatch(finishCreateQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator);