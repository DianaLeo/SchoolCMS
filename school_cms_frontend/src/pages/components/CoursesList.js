import { CourseListItem } from "./CourseListItem";

function CoursesList({data,getAllData}) {
    let arr = [];
    data.map((i,index)=>{
        arr.push(
            <CourseListItem data={i} getAllData={getAllData} key={index} />
        )
    })

    return (
        <>
            {arr}
        </>
    )
}

export { CoursesList }