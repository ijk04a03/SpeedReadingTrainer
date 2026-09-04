import Logo from "./Logo"
import Btn from "./NavbarBtns"
const Navbar = () => {
    return (
        <nav className="navbar">
            <Logo />
            <Btn name="Dashboard" id="dashboard-btn" />
            <Btn name="About" id="about-btn" />
            <Btn name="Settings" id="setings-btn" />
        </nav>
    )
}

export default Navbar