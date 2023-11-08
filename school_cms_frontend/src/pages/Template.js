import { Outlet, NavLink } from "react-router-dom";
import './Template.css';
import { NavList } from "../components/NavList";
import { palette } from "../utils/theme";

function Template() {
    const studentsIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 56 56" id="group"><path d="M14 5c0-2.676-2.324-5-5-5S4 2.324 4 5s2.324 5 5 5 5-2.324 5-5zm3.5 19c0-8-4.152-12-8.75-12S0 16 0 24c0 5.48 17.5 5.48 17.5 0zm6-10.11c2.676 0 5-2.324 5-5s-2.324-5-5-5-5 2.324-5 5 2.324 5 5 5zm-.25 2c-1.382 0-2.706.406-3.906 1.13.726 1.952 1.156 4.266 1.156 6.98 0 2.694-1.796 4.792-4.878 5.992C19.444 33.228 32 32.538 32 27.89c0-8-4.152-12-8.75-12z"></path></svg>
    const coursesIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 36 36" id="school"><g data-name="Layer 2"><path d="M11 18h2v4h-2z"></path><path d="m18 4.32-6-2.4-6 2.4V8H2v14h7v-6h6v6h7V8h-4ZM7 18H5v-2h2Zm0-4H5v-2h2Zm4 0H9v-2h2Zm0-8h2v4h-2Zm4 8h-2v-2h2Zm4 4h-2v-2h2Zm0-6v2h-2v-2Z"></path></g></svg>
    const teachersIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="-24 -24 150 150" id="online-meeting"><path d="M91,11v38c0,1.1-0.9,2-2,2H66v-2c0-8.8-7.2-16-16-16c5,0,9-4,9-9c0-5-4-9-9-9s-9,4-9,9c0,5,4,9,9,9c-8.8,0-16,7.2-16,16v2H11c-1.1,0-2-0.9-2-2V11c0-1.1,0.9-2,2-2h78C90.1,9,91,9.9,91,11z M50,19c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S52.8,19,50,19zM50,37c-6.6,0-12,5.4-12,12v2h24v-2C62,42.4,56.6,37,50,37z M54,69c0-2.2-1.8-4-4-4s-4,1.8-4,4c0,2.2,1.8,4,4,4S54,71.2,54,69zM50,81c-4.4,0-8,3.6-8,8v2h16v-2C58,84.6,54.4,81,50,81z M84,69c0-2.2-1.8-4-4-4s-4,1.8-4,4c0,2.2,1.8,4,4,4S84,71.2,84,69z M80,81c-4.4,0-8,3.6-8,8v2h16v-2C88,84.6,84.4,81,80,81z M24,69c0-2.2-1.8-4-4-4s-4,1.8-4,4c0,2.2,1.8,4,4,4S24,71.2,24,69z M20,81c-4.4,0-8,3.6-8,8v2h16v-2C28,84.6,24.4,81,20,81z"></path></svg>

    return (
        <div className="bg">
            <h1 className="title">Olu Art Studio</h1>
            <div className='navBar width-80vm-700'>
                <NavLink className='link' to='/Students'>
                    {({ isActive, isPending }) => (
                        <NavList
                            bgColor={isActive ? palette.student : palette.unselected}
                            txtColor={isActive ? 'white' : palette.unselected}
                            icon={studentsIcon}
                        >Students</NavList>
                    )}
                </NavLink>
                <NavLink className='link' to='/Courses'>
                    {({ isActive, isPending }) => (
                        <NavList
                            bgColor={isActive ? palette.course : palette.unselected}
                            txtColor={isActive ? 'white' : palette.unselected}
                            icon={coursesIcon}
                        >Courses</NavList>
                    )}
                </NavLink>
                <NavLink className='link' to='/Teachers'>
                    {({ isActive, isPending }) => (
                        <NavList
                            bgColor={isActive ? palette.teacher : palette.unselected}
                            txtColor={isActive ? 'white' : palette.unselected}
                            icon={teachersIcon}
                        >Teachers</NavList>
                    )}
                </NavLink>
            </div>
            <div className='width-80vm-700'>
                <Outlet />
            </div>
        </div>
    )
}

export { Template }