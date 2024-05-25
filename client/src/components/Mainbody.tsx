import { useEffect, useState } from "react";
import Login from "./Login";
import Registration from "./Registration";
import '../styles/mainbody.css';
import docker from '../assets/docker.png';
import nest from '../assets/nest.png';
import react_img from '../assets/react-icon.png';
import bd from '../assets/pg.png';
import sc from '../assets/socket.png';
import github from '../assets/github.png';
import { Link, useNavigate } from "react-router-dom";

const Mainbody = () => {
    const [isRegOpen, setIsRegOpen] = useState(true);
    const navigate = useNavigate();

    const openReg = () => {
        setIsRegOpen(true)
    }

    const openLog = () => {
        setIsRegOpen(false)
    }

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            navigate('/dashboard')
        }
    })

    return (
        <div className="mainbody">
            <div className="text">
                <h3>Welcome to one of my pet projects</h3>
                <h3>Secured chat with Socket.io and JWT</h3>
            </div>
            <div className="images">
                <Link to='https://www.docker.com'><img src={docker} alt="docker"/></Link>
                <Link to='https://nestjs.com'><img src={nest} alt="nest" /></Link>
                <Link to='https://react.dev'><img src={react_img} alt="react"/></Link>
                <Link to='https://socket.io'><img src={sc} alt="socket"/></Link>
                <Link to='https://www.postgresql.org'><img src={bd} alt="postgresql"/></Link>
            </div>

            <div className="github">
                <h2>Открыть исходный код --	&#62;&#62;</h2>
                <Link to='https://github.com/thainlao/chat-with-socket-jwt-'><img src={github} alt="github"/></Link>
            </div>

            <div className="buttons">
                <button className={isRegOpen ? 'active' : ''} onClick={openReg}>Registration</button>
                <button className={isRegOpen ? '' : 'active'} onClick={openLog}>Login</button>
            </div>
            {!isRegOpen ? <Login /> : <Registration />}
        </div>
    )
}

export default Mainbody;
