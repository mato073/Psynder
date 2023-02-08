import axios from 'axios';
import { BASE_URL } from '@env';
import Store from '../Redux/Store'
import axiosInstance from '../../helpers/axios'

const base_url = BASE_URL;

export async function post_therapists_specialty(token, id) {
  const url = `${base_url}/therapists/current/specialties`;
  //const url = `http://10.0.2.2:8080/therapists/current/specialties`;
  let result;
  const params = new URLSearchParams();

  params.append('specialty', id);

  try {
    result = await axiosInstance().post(url, params);
  } catch (err) {
    return (false);
  }

  return (result);
}

export async function delete_therapists_speciality(id) {
  const url = `${base_url}/therapists/current/specialties`;
  //const url = `http://10.0.2.2:8080/therapists/current/specialties`;
  let result;
  try {
    result = await axiosInstance().delete(url, { params: { specialty: id } });
  } catch (err) {
    return (false);
  }
  return (result);
}

export async function patch_speciality(token, id) {
  const url = `${base_url}/specialties`;
  //const url = `http://10.0.2.2:8080/specialties`;
  let result;

  const config = {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  };

  try {
    result = await patch.delete(url, config);
  } catch (err) {
    return (false);
  }

  return (result.data);
}

export async function post_speciality(token, name, acronym, description) {
  const url = `${base_url}/specialties`;
  //const url = `http://10.0.2.2:8080/specialties`;
  let result;
  const params = new URLSearchParams();
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };
  if (name)
    params.append('name', name);
  if (acronym)
    params.append('acronym', acronym);
  if (description)
    params.append('description', description);

  try {
    result = await axiosInstance().post(url, params, config);
  } catch (err) {
    console.error('err =', err);
  }
  return (result.data);
}

export async function get_specialitys(token) {
  const url = `${base_url}/specialties`;
  //const url = `http://10.0.2.2:8080/specialties`;

  let result;
  try {

    result = await axiosInstance().get(url);
  } catch (err) {
    console.error('err =', err);
  }
  return (result.data);

}

export async function get_spe(id) {
  const url = `${base_url}/specialties`;
  //const url = `http://10.0.2.2:8080/specialties/${id}`;
  
  let urlList = [];
  id.map((id) => {
    urlList.push(axiosInstance().get(url + `/${id}`));
  })

  try {
    return await axios.all(urlList).then(
      axios.spread((...responses) => {
        return (responses);
      })
    )
  } catch (err) {
    console.error('err =', err);
  }

}