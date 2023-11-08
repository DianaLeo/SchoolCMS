import { useEffect, useState } from "react";
import { PageTemplate } from "../components/PageTemplate";
import { CoursesList } from "../components/CoursesList";

const baseUrl = process.env.REACT_APP_BASE_URL;

function Courses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getAllData();
    }, [])

    const getAllData = () => {
        fetch(`${baseUrl}v1/courses`)
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
            })
    }
    return (
        <PageTemplate section="Course" getAllData={getAllData}>
            <CoursesList data={courses} getAllData={getAllData}/>
        </PageTemplate>
    )
}

export { Courses }