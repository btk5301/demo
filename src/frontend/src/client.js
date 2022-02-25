import fetch from 'unfetch';

const checkStatus = response => {
    if (response.ok) {
        return response
    }

    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

// If single line no bracket needed, else need bracket and return a value
export const getAllStudents = () => 
    fetch("api/v1/students")
        // if one param, then don't need (resp => checkstatus(resp)) can just pass directly to function without parenthesis like below
        .then(checkStatus);

export const addNewStudent = student =>
    fetch("api/v1/students", {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(student)
    }).then(checkStatus)

export const deleteStudent = studentId =>
    fetch(`api/v1/students/${studentId}`, {
        method: 'DELETE',
    }).then(checkStatus)
