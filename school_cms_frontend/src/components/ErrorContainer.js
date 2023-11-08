import './ErrorContainer.css';

function ErrorContainer({ errors }) {
    const errorlist = [];

    Object.values(errors).forEach((e,index) => {
        errorlist.push(<p key={index}>{e}</p>);
    });

    return (
        <div className='errorContainer'>
            {errorlist}
        </div>
    )
}

export { ErrorContainer };