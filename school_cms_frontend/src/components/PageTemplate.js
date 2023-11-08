import { useState } from 'react';
import './PageTemplate.css';
import { StudentAddForm } from './StudentAddForm';
import { TeacherAddForm } from './TeacherAddForm';
import { CourseAddForm } from './CourseAddForm';
import { palette } from '../utils/theme';
import { ErrorContainer } from './ErrorContainer';

function PageTemplate({ section, getAllData, children }) {
    const [formShow, setFromshow] = useState(false);
    const [errors, setErrors] = useState([]);

    const btnAddNewClick = () => { setFromshow(true) }
    const btnCloseClick = () => {
        setFromshow(false);
        setErrors([]);
    }

    const addNewForm = (section) => {
        switch (section) {
            case 'Student':
                return <StudentAddForm
                    formShow={formShow}
                    getAllData={getAllData}
                    setErrors={setErrors} />
            case 'Teacher':
                return <TeacherAddForm
                    formShow={formShow}
                    getAllData={getAllData}
                    setErrors={setErrors} />
            case 'Course':
                return <CourseAddForm
                    formShow={formShow}
                    getAllData={getAllData}
                    setErrors={setErrors} />
        }
    }

    return (
        <div className='PageTemplate'>
            <button className='addNewBtn' onClick={btnAddNewClick} style={{ color: palette[section.toLowerCase()] }}>Add New {section}</button>
            <ul className='dataList'>
                {children}
            </ul>
            <div className={`addNewFrom${formShow ? " show" : ""}`}>
                <h2>Add New {section}</h2>
                <button className='closeBtn' onClick={btnCloseClick}>x</button>
                {addNewForm(section)}
                <ErrorContainer errors={errors} />
            </div>
        </div>
    )
}

export { PageTemplate }