import { useEffect, useRef,useState } from 'react';

const baseUrl = process.env.REACT_APP_BASE_URL;

function TeacherAddForm({ formShow, getAllData, setErrors }) {
    const [firstname, setFirstname] = useState(false);
    const [lastname, setLastname] = useState(false);
    const [email, setEmail] = useState(false);

    const form = useRef();

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
            const response = await fetch(`${baseUrl}v1/teachers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (response.ok) {
                form.current.reset();
                getAllData();

            }
            const data = await response.json();
            if (data.errors) {
                Object.keys(data.errors).map((k)=>{
                    if (k==='firstname') setFirstname(true)
                    if (k==='lastname') setLastname(true)
                    if (k==='email') setEmail(true)
                })
                setErrors(data.errors);
            }
        } catch (error) {
            console.log('postNewData error:', error);
        }
    }

    return (
        <form ref={form} onSubmit={formSubmitHandler}>
            <label htmlFor="firstname">First Name:</label>
            <input type="text" className={`${firstname ? "error" : ""}`} id="firstname" name="firstname" />
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" className={`${lastname ? "error" : ""}`} id="lastname" name="lastname" />
            <label htmlFor="email">Email:</label>
            <input type="text" className={`${email ? "error" : ""}`} id="email" name="email" />
            <label htmlFor="courses">Courses:</label>
            <textarea type="text" id="courses" name="courses"></textarea>
            <button type="submit">Add</button>
        </form>
    )
}

export { TeacherAddForm }