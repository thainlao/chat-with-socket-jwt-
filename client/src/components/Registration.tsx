import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, isLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            isLoading(true);
            setError(''); // Сбросить ошибку перед началом регистрации
            if (password.length < 5) {
                setError('Пароль должен быть не менее 5 символов');
                isLoading(false);
                return;
            }
            if (username.length < 5) {
                setError('Имя пользователя должно быть не менее 5 символов');
                isLoading(false);
                return;
            }

            const res = await axios.post('http://localhost:3030/auth/register', {
                password, username 
            });
            console.log(res)

            // Сбросить поля ввода и перенаправить пользователя на dashboard
            isLoading(false);
            setUsername('');
            setPassword('');
            localStorage.setItem('accessToken', res.data);
            if (!res.data) {
                alert('Произошла ошибка')
                localStorage.clear();
                return;
            }
            navigate('/dashboard');
        } catch (error) {
            isLoading(false);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    setError(error.response.data.message);
                } else {
                    setError('Произошла ошибка при регистрации');
                }
            } else {
                setError('Произошла ошибка при регистрации');
            }
            console.error(error);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <h3>Registration</h3>
            {error && <div style={{color: 'red'}}>{error}</div>}
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

            <button onClick={handleRegister} disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Создать'}
            </button>
        </form>
    )
}

export default Registration