import { useEffect, useRef,useState } from 'react';

const baseUrl = process.env.REACT_APP_BASE_URL;

function CourseForm({ formShow, getAllData, setErrors }) {
    const [id, setId] = useState(false);
    const [name, setName] = useState(false);

    const form = useRef();

    useEffect(() => {
        form.current.reset();
    }, [formShow]);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const courseData = Object.fromEntries(formData.entries());
        console.log('courseData:',courseData);
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
                console.log('data.errors');
                Object.keys(data.errors).map((k)=>{
                    if (k==='_id') setId(true)
                    if (k==='name') setName(true)
                })
                setErrors(data.errors);
            }
        } catch (error) {
            console.log('postNewData error:', error);
        }
    }
console.log(id,name);
    return (
        <form ref={form} onSubmit={formSubmitHandler}>
            <label htmlFor="code">Course Code:</label>
            <input type="text" className={`${id ? "error" : ""}`} id="code" name="_id" required/>
            <label htmlFor="name">Course Name:</label>
            <input type="text" className={`${name ? "error" : ""}`} id="name" name="name" required/>
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

export { CourseForm }