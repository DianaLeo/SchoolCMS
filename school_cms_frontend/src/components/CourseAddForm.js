import { useEffect, useRef, useState } from 'react';

const baseUrl = process.env.REACT_APP_BASE_URL;

function CourseAddForm({ formShow, getAllData, setErrors }) {
    const [errId, seterrId] = useState(false);
    const [errName, setErrName] = useState(false);

    const form = useRef();

    useEffect(() => {
        form.current.reset();
        seterrId(false);
        setErrName(false);
    }, [formShow]);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const courseData = Object.fromEntries(formData.entries());
        console.log('courseData:', courseData);
        seterrId(false);
        setErrName(false);
        setErrors([]);
        try {
            const response = await fetch(`${baseUrl}v1/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
            if (response.ok) {
                form.current.reset();
                getAllData();
            }
            const data = await response.json();
            if (data.errors) {
                console.log('data.errors=',data.errors);
                Object.keys(data.errors).map((k) => {
                    if (k === 'code') seterrId(true)
                    if (k === 'name') setErrName(true)
                })
                setErrors(data.errors);
            }
        } catch (error) {
            console.log('postNewData error:', error);
        }
    }

    return (
        <form ref={form} onSubmit={formSubmitHandler}>
            <label htmlFor="code">Course Code:</label>
            <input type="text" className={`${errId ? "error" : ""}`} id="code" name="code"  />
            <label htmlFor="name">Course Name:</label>
            <input type="text" className={`${errName ? "error" : ""}`} id="name" name="name"  />
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description" />
            <label htmlFor="students">Students:</label>
            <textarea type="text" id="students" name="students"></textarea>
            <label htmlFor="teachers">Teachers:</label>
            <textarea type="text" id="teachers" name="teachers"></textarea>
            <button type="submit">Add</button>
        </form>
    )
}

export { CourseAddForm }