import './ErrorContainer.css';

function ErrorContainer({ errors }) {
    const errorlist = [];

    Object.values(errors).forEach(e => {
        errorlist.push(<p>{e}</p>);
    });

    return (
        <div className='errorContainer'>
            {errorlist}
        </div>
    )
}

export { ErrorContainer };