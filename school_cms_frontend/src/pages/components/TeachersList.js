import { TeacherListItem } from "./TeacherListItem";

function TeachersList({data,getAllData}) {
    let arr = [];
    data.forEach((i,index)=>{
        arr.push(
            <TeacherListItem data={i} getAllData={getAllData} key={index} />
        )
    })

    return (
        <>
            {arr}
        </>
    )
}

export { TeachersList }