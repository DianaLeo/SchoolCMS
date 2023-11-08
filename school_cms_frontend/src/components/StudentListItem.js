import { useState } from "react";
import { StudentUpdateForm } from "./StudentUpdateForm";

function StudentListItem({ data, getAllData }) {
    const [show, setshow] = useState(false);

    const clickHandler = (e) => {
        setshow(show => !show);
    }

    return (
        <div className="liContainer">
            <p className={`liP`} onClick={clickHandler}>{data.firstname} {data.lastname}</p>
            <StudentUpdateForm show={show} setshow={setshow} data={data} getAllData={getAllData} />
        </div>
    )
}

export { StudentListItem }