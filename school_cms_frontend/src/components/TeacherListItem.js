import { useState } from "react";
import { TeacherUpdateForm } from "./TeacherUpdateForm";

function TeacherListItem({ data, getAllData }) {
    const [show, setshow] = useState(false);

    const clickHandler = (e) => {
        setshow(show => !show);
    }

    return (
        <div className="liContainer">
            <p className={`liP`} onClick={clickHandler}>{data.firstname} {data.lastname}</p>
            <TeacherUpdateForm show={show} setshow={setshow} data={data} getAllData={getAllData} />
        </div>
    )
}

export { TeacherListItem }