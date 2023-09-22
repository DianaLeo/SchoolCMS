import { StudentListItem } from "./StudentListItem";

function StudentsList({ data,getAllData }) {
    let arr = [];
    data.forEach((i, index) => {
        arr.push(
            <StudentListItem data={i} getAllData={getAllData} key={index} />
        )
    })

    return (
        <>
            {arr}
        </>
    )
}

export { StudentsList }