import myaxios from '../hoocs/myaxios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IUser } from "../types/types";
import '../styles/dashboard.css';
import ChatSection from './ChatSection';
import HeaderModal from '../pages/HeaderModal';

const Dashboard = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isTokenShow, setIsTokenShow] = useState<boolean>(false);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await myaxios.get('/users/me');
                setUser(res.data);
                console.log(user)
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!user) {
        return (
        <div className='error_user'>
            <h3>Не удалось найти пользователя, перезайдите</h3>
            <button onClick={handleLogout}>Logout</button>
        </div>
        )
    }

    const user_username = user.username.split('@')[0].substring(0, 2).toUpperCase();

    return (
        <div className='dashboard'>
            <header>
                <div>
                    <section style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <div className='username_ava'>{user_username}</div>
                        <h2>Welcome, <span>{user.username}</span></h2>
                        <h2>id: <span>{user.id}</span></h2>
                    </section>
                    
                    <h2>Your JWT token jenerated, check localStorage</h2>
                    <section>
                        {!isTokenShow ? <button onClick={() => setIsTokenShow(true)}> Показать jwt токен</button> 
                        :
                        <section className='token'>
                            <p>{localStorage.getItem('accessToken')}</p>
                            <button onClick={() => setIsTokenShow(false)}>Убрать jwt токен</button>
                        </section>
                        }
                    </section>
                </div>
                <button className='logout' onClick={handleLogout}>Выйти</button>
            </header>

            <ChatSection currentUserId={user.id} curUsername={user.username} />
        </div>
    );
};

export default Dashboard;