import { useState } from 'react';
import './PageTemplate.css';
import { StudentForm } from './StudentForm';
import { TeacherForm } from './TeacherForm';
import { CourseForm } from './CourseForm';
import { palette } from '../../utils/common';
import { ErrorContainer } from './ErrorContainer';

function PageTemplate({ section, getAllData, children }) {
    const [formShow, setFromshow] = useState(false);
    const [errors, setErrors] = useState([]);

    const btnAddNewClick = () => { setFromshow(true)}
    const btnCloseClick = () => {
        setFromshow(false);
        setErrors([]);
    }

    const form = (section) => {
        switch (section) {
            case 'Student':
                return <StudentForm
                    formShow={formShow}
                    getAllData={getAllData}
                    setErrors={setErrors} />
            case 'Teacher':
                return <TeacherForm
                    formShow={formShow}
                    getAllData={getAllData}
                    setErrors={setErrors} />
            case 'Course':
                return <CourseForm
                    formShow={formShow}
                    getAllData={getAllData}
                    setErrors={setErrors} />
        }
    }

    const color = section.toLowerCase();

    return (
        <div className='PageTemplate'>
            <button className='addNewBtn' onClick={btnAddNewClick} style={{ color: palette[section.toLowerCase()] }}>Add New {section}</button>
            <ul className='dataList'>
                {children}
            </ul>
            <div className={`addNewFrom${formShow ? " show" : ""}`}>
                <h2>Add New {section}</h2>
                <button className='closeBtn' onClick={btnCloseClick}>x</button>
                {form(section)}
                <ErrorContainer errors={errors} />
            </div>
        </div>
    )
}

export { PageTemplate }