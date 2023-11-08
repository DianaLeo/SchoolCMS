import { useEffect, useRef, useState } from 'react';

const baseUrl = process.env.REACT_APP_BASE_URL;

function StudentAddForm({ formShow, getAllData, setErrors }) {
    const [firstname, setFirstname] = useState(false);
    const [lastname, setLastname] = useState(false);
    const [email, setEmail] = useState(false);
    const [courses, setCourses] = useState([]);

    const form = useRef();

    useEffect(() => {
        getAllCourses();
    }, [])
    useEffect(() => {
        form.current.reset();
        setFirstname(false);
        setLastname(false);
        setEmail(false);
    }, [formShow]);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const studentData = Object.fromEntries(formData.entries());
        console.log(studentData);
        setFirstname(false);
        setLastname(false);
        setEmail(false);
        setErrors([]);
        try {
            const response = await fetch(`${baseUrl}v1/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (response.ok) {
                console.log('post student res ok');
                form.current.reset();
                getAllData();
            }
            const data = await response.json();
            if (data.errors) {
                Object.keys(data.errors).map((k) => {
                    if (k === 'firstname') setFirstname(true)
                    if (k === 'lastname') setLastname(true)
                    if (k === 'email') setEmail(true)
                })
                setErrors(data.errors);
            }
        } catch (error) {
            console.log('postNewData error:', error);
        }
    }

    const getAllCourses = () => {
        fetch(`${baseUrl}v1/courses`)
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
            })
    }

    let arr = [];
    const courseCheckbox = courses.map((course,index) => {
        arr.push(
            <input  key={index} type="checkbox" name="courses" value={course.code} />
        )
    })

    return (
        <form ref={form} onSubmit={formSubmitHandler}>
            <label htmlFor="firstname">First Name:</label>
            <input type="text" className={`${firstname ? "error" : ""}`} id="firstname" name="firstname" />
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" className={`${lastname ? "error" : ""}`} id="lastname" name="lastname" />
            <label htmlFor="email">Email:</label>
            <input type="text" className={`${email ? "error" : ""}`} id="email" name="email" />
            <label htmlFor="courses">Courses:</label>
            {arr}
            <button type="submit">Add</button>
        </form>
    )
}

export { StudentAddForm }