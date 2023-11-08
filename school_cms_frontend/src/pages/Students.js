import { useEffect, useState } from "react";
import { PageTemplate } from "../components/PageTemplate";
import { StudentsList } from "../components/StudentsList";

const baseUrl = process.env.REACT_APP_BASE_URL;

function Students() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        getAllData();
    }, [])

    const getAllData = () => {
        fetch(`${baseUrl}v1/students`)
            .then((res) => res.json())
            .then((data) => {
                setStudents(data);
            })
    }

    return (
        <PageTemplate section="Student" getAllData={getAllData}>
            <StudentsList data={students} getAllData={getAllData}/>
        </PageTemplate>
    )
}

export { Students }