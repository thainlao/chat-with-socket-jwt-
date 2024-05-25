import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../pages/Alert";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, isLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            isLoading(true);
            const res = await axios.post('http://localhost:3030/auth/login', {
                username,
                password
            });
            isLoading(false);
            if (res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
                navigate('/dashboard');
                setAlertMessage('Вы успешно вошли!');
                setShowAlert(true);
                setIsSuccess(true);
                setTimeout(() => setShowAlert(false), 3000);
            } else {
                setAlertMessage('Вы ввели неверные данные');
                setShowAlert(true);
                setIsSuccess(false);
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (error) {
            console.error(error);
            setAlertMessage('Произошла ошибка');
            setShowAlert(true);
            setIsSuccess(false);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <h3>Login</h3>

            <div>
                <h2>Your Username</h2>
                <input 
                    placeholder="username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div>
                <h2>Your Password</h2>
                <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password..."
                    type="password"
                />
            </div>

            <button onClick={handleLogin} disabled={loading}>
                {loading ? <div className="spinner"></div> : 'войти'}
            </button>
            {showAlert && <Alert isSuccess={isSuccess} alertMessage={alertMessage} showAlert={showAlert} />}
        </form>
    )
}

export default Login;