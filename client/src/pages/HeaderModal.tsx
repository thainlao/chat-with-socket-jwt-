import React from "react"
import { IUser } from "../types/types"

interface Props {
    user: IUser;
    handleLogout: () => void;
}

const HeaderModal: React.FC<Props> = ({ user, handleLogout }) => {
    console.log(user)
    return (
        <div className="header_modal">
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default HeaderModal;