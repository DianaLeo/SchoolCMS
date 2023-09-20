function StudentsList({data}) {
    let arr = [];
    data.forEach((i,index)=>{
        arr.push(
            <li key={index}>{i.firstname}</li>
        )
    })

    return (
        <>
            {arr}
        </>
    )
}

export { StudentsList }