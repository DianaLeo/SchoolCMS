import './NavList.css';

function NavList({ bgColor, txtColor, icon, children }) {
    return (
        <button className="navListBtn">
            <div className="iconContainer" style={{ backgroundColor: `${bgColor}` }}>
                {icon}
            </div >
            <p  style={{ color: `${txtColor}` }}>{children}</p>
        </button>
    )
}

export { NavList }