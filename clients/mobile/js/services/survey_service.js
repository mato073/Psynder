import axios from 'axios';
import { BASE_URL } from '@env';
import axiosInstance from '../../helpers/axios'

const base_url = BASE_URL;

export async function post_survey(body) {
    const url = `${base_url}/survey/users/results`;
    //const url = `http://10.0.2.2:8080/survey/users/results`

    let data = JSON.stringify(body);
    let config = {
        headers: {
            'Content-Type': 'application/json'
        },
    };

    await axiosInstance().post(url, data, config)
        .then(function (response) {
            console.log('status: ', response.status, 'body: ', response.data);
        })
        .catch(function (error) {
            console.log('.stack = ', error.stack, 'data =', error.response.data);
        });
}

export async function post_conditions(conditions, questions) {
    const url = `${base_url}/survey/check-conditions`;
    //const url = `http://10.0.2.2:8080/survey/check-conditions`
    let result;

    const body = {
        "questions": questions,
        "conditions": conditions
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
    };
    try {
        result = await axiosInstance().post(url, body, config);
    } catch (err) {
        console.error('error =', err);
    }
    return (result.data);
}

export async function get_survey_names() {
    const url = `${base_url}/survey/names`;
    //const url = `http://10.0.2.2:8080/survey/names`
    let response;

    try {
        response = await axios.get(url);
    } catch (err) {
        return (false);
    }
    return response.data;
}

export async function get_questions(CategoryName) {
    const url = `${base_url}/survey/${CategoryName}`;
    //const url = `http://10.0.2.2:8080/survey/${CatName}`
    let response;

    try {
        response = await axios.get(url);
    } catch (err) {
        return (false);
    }
    return response.data;
}