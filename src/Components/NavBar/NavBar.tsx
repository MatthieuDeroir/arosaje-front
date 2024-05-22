import React, {useContext, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import Popup from '../PopupSettings/popup';
import {AuthContext} from "../../Contexts/AuthContext";
import '../../Styles/NavBar.css';
import logo from "../../assets/images/logo.png";

interface NavBarProps {
    onSettingsClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({onSettingsClick}) => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const user = useContext(AuthContext);

    const location = useLocation();

    if (location.pathname === '/login') {
        return null;
    }

    const handleReset = () => {
        document.documentElement.style.setProperty('--color1', '#48806c');
        document.documentElement.style.setProperty('--color2', 'rgb(5, 5, 5)');
    };

    const handleChange = () => {
        const color1 = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const color2 = '#' + Math.floor(Math.random() * 16777215).toString(16);

        document.documentElement.style.setProperty('--color1', color1);
        document.documentElement.style.setProperty('--color2', color2);
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/"><img src={logo} alt="Arosaje logo" className='logo'/></Link>
                </li>
                <div className="right">
                    {user.user ? (
                        <>
                            <li>
                                <Link to="/profile"><span className="fa-solid fa-user"></span></Link>
                            </li>
                            <li>
                                <Link to="/recherche"><span className="fa-solid fa-magnifying-glass"></span></Link>
                            </li>
                            <li>
                                <Link to="/messages"><span className="fa-solid fa-paper-plane"></span></Link>
                            </li>
                            <li>
                                <Link to="/logout"><span className="fa-solid fa-power-off"></span></Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login"><span className="fa-solid fa-power-off"></span></Link>
                        </li>
                    )}
                    <li>
                        {!isPopupOpen && (
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                togglePopup();
                            }}>
                                <span className="fa-solid fa-gear"></span>
                            </a>
                        )}
                        {isPopupOpen &&
                            <Popup handleClose={togglePopup} handleReset={handleReset} handleChange={handleChange}/>}
                    </li>
                </div>
            </ul>
        </nav>
    );
};

export default NavBar;