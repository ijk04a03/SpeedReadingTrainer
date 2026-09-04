import Logo from "./Logo"
import Btn from "./NavbarBtns"
const Navbar = ({ activePage, onNavigate }) => {
    return (
        <nav className="navbar">
            <button type="button" className="logo-button" onClick={() => onNavigate('practice')} aria-label="Go to practice"><Logo /></button>
            <div className="navbar-links">
                <Btn name="Home" id="home-btn" active={activePage === 'practice'} onClick={() => onNavigate('practice')} />
                <Btn name="Dashboard" id="dashboard-btn" active={activePage === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                <Btn name="About" id="about-btn" active={activePage === 'about'} onClick={() => onNavigate('about')} />
                <Btn name="Settings" id="settings-btn" active={activePage === 'settings'} onClick={() => onNavigate('settings')} />
            </div>
        </nav>
    )
}

export default Navbar