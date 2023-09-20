function CoursesList({data}) {
    let arr = [];
    data.map((i,index)=>{
        arr.push(
            <li key={index}>{i._id}</li>
        )
    })

    return (
        <>
            {arr}
        </>
    )
}

export { CoursesList }