import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../Styles/AuthForm.css';
import '../../Styles/Login.css';
import {useAuth} from "../../Contexts/AuthContext";
import {AuthFormContext} from "../../Contexts/AuthFormContext";
import {AuthService} from "../../Services/AuthService";
import login_illustrator from "../../assets/images/login-illustrator.png";
import logo from "../../assets/images/logo.png";



function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const {setIsAuthFormLogin} = useContext(AuthFormContext);

    const navigate = useNavigate();
    const {setToken} = useAuth();

    const checkAllInput = () => {
        return email !== '' && password !== '';
    };

    const handleSubmit = async (event: React.FormEvent) => {
        console.log('Login form submitted');
        event.preventDefault();

        setEmailError('');
        setPasswordError('');

        if (password.trim() === '') {
            console.log('Password is required');
            setPasswordError('Password is required');
            return;
        }

        if (email.trim() === '') {
            console.log('Email is required');
            setEmailError('Email is required');
            return;
        }

        try {
            console.log('Logging in user...');
            const response = await AuthService.login(email, password);
            console.log('Response:', response);

            console.log('User logged in successfully', response);
            setToken(response);
            navigate('/');
        } catch (error) {
            setEmailError('Failed to log in');
            setPasswordError('Failed to log in');
        }
    };




    return (
        <div className="login-menu">
            <img src={login_illustrator} alt="Login illustrator" className="login-illustrator"/>
            <div className="login-background">
                <div className="login-logo">
                    <img src={logo} alt="Arosaje logo"/>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="login-form">
                        <label>
                            Login <sup style={{fontSize: '0.6em'}}>*</sup>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={emailError ? {border: '1px solid red'} : {}}
                            />
                        </label>
                        <label>
                            Password <sup style={{fontSize: '0.6em'}}>*</sup>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={passwordError ? {border: '1px solid red'} : {}}
                            />
                        </label>
                        <input type="submit" onSubmit={handleSubmit} value="Connect" className="button-connect"/>
                        
                        <div className="text-asterisk">
                            * Required fields
                        </div>
                    </form>
                </div>
                <div className="other-option">
                    <div className="login-text signup">
                        <span className="text-account-question">Don't have an account ? </span>
                        <button onClick={() => setIsAuthFormLogin(false)}>Sign Up</button>
                    </div>
                    <div className="login-text forgot-password">
                        <a href=''>Forgot your password ?</a>
                    </div>
                </div>
                <div className="text-login footer">
                    <span>
                        All rights reserved, Arosaje©
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;