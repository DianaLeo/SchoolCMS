import { useEffect, useRef, useState } from "react";
import { ErrorContainer } from "./ErrorContainer";

const baseUrl = process.env.REACT_APP_BASE_URL;

function TeacherUpdateForm({ show, setshow, data, getAllData }) {
    const [errors, setErrors] = useState([]);
    const [errFirstname, setErrFirstname] = useState(false);
    const [errLastname, setErrLastname] = useState(false);
    const [errEmail, setErrEmail] = useState(false);
    const [firstname, setFirstname] = useState(data.firstname);
    const [lastname, setLastname] = useState(data.lastname);
    const [email, setEmail] = useState(data.email);

    const form = useRef();
    const inputFirstname = useRef();
    const inputLastname = useRef();
    const inputEmail = useRef();

    useEffect(() => {
        setErrFirstname(false);
        setErrLastname(false);
        setErrEmail(false);
        setErrors([]);
    }, [show]);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const teacherData = Object.fromEntries(formData.entries());
        console.log(teacherData);
        setErrFirstname(false);
        setErrLastname(false);
        setErrEmail(false);
        setErrors([]);
        try {
            console.log(`${baseUrl}v1/teachers/${data._id}`);
            const response = await fetch(`${baseUrl}v1/teachers/${data._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teacherData)
            });
            if (response.ok) {
                console.log('update teacher res ok');
                getAllData();
            }
            const responseJSON = await response.json();
            if (responseJSON.errors) {
                console.log(responseJSON.errors);
                Object.keys(responseJSON.errors).map((k) => {
                    if (k === 'firstname') setErrFirstname(true)
                    if (k === 'lastname') setErrLastname(true)
                    if (k === 'email') setErrEmail(true)
                })
                setErrors(responseJSON.errors);
            }
        } catch (error) {
            console.log('postNewData error:', error);
        }
    }
    const firstnameChangeHandler = (e) => { setFirstname(e.target.value) }
    const lastnameChangeHandler = (e) => { setLastname(e.target.value) }
    const emailChangeHandler = (e) => { setEmail(e.target.value) }

    const editClickHandler = (e) => {
        e.preventDefault();
        inputFirstname.current.removeAttribute('disabled')
        inputLastname.current.removeAttribute('disabled')
        inputEmail.current.removeAttribute('disabled')
    }
    const deleteClickHandler = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm('Are you sure to delete this item?');
        if (!confirmed) { return }
        try {
            console.log(`${baseUrl}v1/students/${data._id}`);
            const response = await fetch(`${baseUrl}v1/teachers/${data._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                console.log('deleted');
                getAllData();
                setshow(false);
                return;
            }
            const responseJSON = await response.json();
            if (responseJSON.errors) {
                console.log('Not found error', responseJSON.errors);
            }
        } catch (error) {
            console.log('postNewData other error:', error);
        }
    }

    return (
        <form ref={form} className={`updateForm ${show ? "show" : ""}`} onSubmit={formSubmitHandler}>
            <div className="detialContainer">
                <div className="info">
                    <label htmlFor="firstname">First Name:</label>
                    <input ref={inputFirstname} type="text" className={`${errFirstname ? "error" : ""}`} id="firstname" name="firstname" value={firstname} onChange={firstnameChangeHandler} disabled />
                </div>
                <div className="info">
                    <label htmlFor="lastname">Last Name:</label>
                    <input ref={inputLastname} type="text" className={`${errLastname ? "error" : ""}`} id="lastname" name="lastname" value={lastname} onChange={lastnameChangeHandler} disabled />
                </div>
                <div className="info">
                    <label htmlFor="email">Email:</label>
                    <input ref={inputEmail} type="text" className={`${errEmail ? "error" : ""}`} id="email" name="email" value={email} onChange={emailChangeHandler} disabled />
                </div>
                <div className="info">
                    <label htmlFor="courses">Courses:</label>
                    {/* {data._id}<input type="checkbox" id="courses" name="courses" value={data._id} /> */}
                </div>
                <ErrorContainer errors={errors} />
            </div>
            <div className="buttonContainer">
                <button onClick={editClickHandler}>Edit</button>

                <button onClick={deleteClickHandler}>Delete</button>
                <button type="submit">Save</button>
            </div>
        </form>
    )
}

export { TeacherUpdateForm }