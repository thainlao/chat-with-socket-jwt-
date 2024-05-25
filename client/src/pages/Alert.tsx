import React from 'react';
import '../styles/alert.css';

interface Props {
    alertMessage: string;
    showAlert: boolean;
    isSuccess: null | boolean;
}

const Alert: React.FC<Props> = ({ isSuccess, alertMessage, showAlert }) => {
    return (
        showAlert && (
            <div className={`alert ${isSuccess === true ? 'succes-alert' : ''}`}>
                <h2>{alertMessage}</h2>
                <div>{isSuccess ? '✔' : '✖'}</div>
            </div>
        )
    );
}

export default Alert;