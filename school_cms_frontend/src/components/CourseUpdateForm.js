import { useEffect, useRef, useState } from "react";
import { ErrorContainer } from "./ErrorContainer";

const baseUrl = process.env.REACT_APP_BASE_URL;

function CourseUpdateForm({ show, setshow, data, getAllData }) {
    const [errors, setErrors] = useState([]);
    const [errCode, setErrCode] = useState(false);
    const [errName, setErrName] = useState(false);
    const [code, setCode] = useState(data.code);
    const [name, setName] = useState(data.name);
    const [description, setDescription] = useState(data.description);
    
    const form = useRef();
    const inputCode = useRef();
    const inputName = useRef();
    const inputDescription = useRef();
    

    useEffect(() => {
        setErrCode(false);
        setErrName(false);
        setErrors([]);
    }, [show]);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const courseData = Object.fromEntries(formData.entries());
        console.log('courseData',courseData);
        try {
            console.log(`${baseUrl}v1/courses/${data._id}`);
            const response = await fetch(`${baseUrl}v1/courses/${data._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
            console.log('response.ok=',response.ok);
            if (response.ok) {
                console.log('update course res ok');
                getAllData();
                setErrCode(false);
                setErrName(false);
                setErrors([]);
            }
            const responseJSON = await response.json();
            if (responseJSON.errors) {
                console.log('Not found error', responseJSON.errors);
                Object.keys(responseJSON.errors).map((k) => {
                    if (k === 'code') setErrCode(true)
                    if (k === 'name') setErrName(true)
                })
                setErrors(responseJSON.errors);
            }
        } catch (error) {
            console.log('postNewData error:', error);
        }
    }
    const codeChangeHandler = (e) => { setCode(e.target.value) }
    const nameChangeHandler = (e) => { setName(e.target.value) }
    const descriptionChangeHandler = (e) => { setDescription(e.target.value) }

    const editClickHandler = (e) => {
        e.preventDefault();
        inputCode.current.removeAttribute('disabled')
        inputName.current.removeAttribute('disabled')
        inputDescription.current.removeAttribute('disabled')
    }
    const deleteClickHandler = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm('Are you sure to delete this item?');
        if (!confirmed) { return }
        try {
            console.log(`${baseUrl}v1/students/${data._id}`);
            const response = await fetch(`${baseUrl}v1/courses/${data._id}`, {
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
                    <label htmlFor="code">Course code:</label>
                    <input ref={inputCode} type="text" className={`${errCode ? "error" : ""}`} id="code" name="code" value={code} onChange={codeChangeHandler} disabled />
                </div>
                <div className="info">
                    <label htmlFor="name">Course Name:</label>
                    <input ref={inputName} type="text" className={`${errName ? "error" : ""}`} id="name" name="name" value={name} onChange={nameChangeHandler} disabled />
                </div>
                <div className="info">
                    <label htmlFor="description">Description:</label>
                    <input ref={inputDescription} type="text" id="description" name="description" value={description} onChange={descriptionChangeHandler} disabled />
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

export { CourseUpdateForm }