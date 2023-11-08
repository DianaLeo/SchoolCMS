import { useState } from "react";
import { CourseUpdateForm } from "./CourseUpdateForm";

function CourseListItem({ data, getAllData }) {
    const [show, setshow] = useState(false);

    const clickHandler = (e) => {
        setshow(show => !show);
    }

    return (
        <div className="liContainer">
            <p className={`liP`} onClick={clickHandler}>{data.name}</p>
            <CourseUpdateForm show={show} setshow={setshow} data={data} getAllData={getAllData} />
        </div>
    )
}

export { CourseListItem }