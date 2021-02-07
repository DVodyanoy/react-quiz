import React, {Component} from "react";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import {createControl} from "../../form/formFramework";
import classes from "./Auth.css";
import {connect} from "react-redux";
import {auth} from "../../store/actions/auth";

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

class Auth extends Component {
    state = {
        isFormValid: false,
        formControls: {
            email: createControl({
                type: 'email',
                label: 'Email:',
                errorMessage: 'Введите корректный email'
            }, {required: true, email: true}),
            password: createControl({
                type: 'password',
                label: 'Пароль:',
                errorMessage: 'Пароль должен быть не менее 6 символов'
            }, {required: true, minLength: 6})
        }
    }

    loginHandler = () => {
        const {email, password} = this.state.formControls
        this.props.auth(email.value, password.value, true)
    }

    registerHandler = () => {
        const {email, password} = this.state.formControls
        this.props.auth(email.value, password.value, false)
    }

    validateControl(value, validation) {
        if (!validation)
            return true

        let isValid = true

        if (validation.required)
            isValid = value.trim() !== '' && isValid

        if (validation.email)
            isValid = validateEmail(value) && isValid

        if (validation.minLength)
            isValid = value.length >= validation.minLength && isValid

        return isValid
    }

    onChangeHandler = (event, controlName) => {
        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}

        control.touched = true
        control.value = event.target.value
        control.valid = this.validateControl(control.value, control.validation)

        formControls[controlName] = control

        let isFormValid = true

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        this.setState({
            formControls,
            isFormValid
        })
    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName];
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    errorMessage={control.errorMessage}
                    shouldValidate={!!control.validation}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />
            )
        })
    }

    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Авторизация</h1>

                    <form onSubmit={e => e.preventDefault()}>
                        { this.renderInputs() }
                        <Button
                            type="success"
                            onClick={this.loginHandler}
                            disabled={!this.state.isFormValid}
                        >Войти
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.registerHandler}
                            disabled={!this.state.isFormValid}
                        >Зарегистрироваться
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
    }
}

export default connect(null, mapDispatchToProps)(Auth);