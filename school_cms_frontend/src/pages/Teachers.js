import { useEffect, useState } from "react";
import { PageTemplate } from "../components/PageTemplate"
import { TeachersList } from "../components/TeachersList";

const baseUrl = process.env.REACT_APP_BASE_URL;

function Teachers() {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        getAllData();
    }, [])

    const getAllData = () => {
        fetch(`${baseUrl}v1/teachers`)
            .then((res) => res.json())
            .then((data) => {
                setTeachers(data);
            })
    }
    return (
        <PageTemplate section="Teacher" getAllData={getAllData}>
            <TeachersList data={teachers} getAllData={getAllData}/>
        </PageTemplate>
    )
}

export { Teachers }