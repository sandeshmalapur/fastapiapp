import { Link, useLocation } from "react-router-dom";

const links = [
    { to: "/companies", label: "Companies" },
    { to: "/jobs", label: "Jobs" },
    { to: "/job-match", label: "Job Match" },
    { to: "/chatbot", label: "Chatbot" },
    { to: "/resume-analyser", label: "Resume Analyser" },
];

function NavBar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <span className="navbar-brand">TalentSpark</span>
            <ul className="navbar-links">
                {links.map((link) => (
                    <li key={link.to}>
                        <Link to={link.to} className={location.pathname === link.to ? "active" : ""}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;