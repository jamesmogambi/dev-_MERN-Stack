import api from './api';

const getPhoto = async (id) => {
  try {
    const response = await api.get(`/profile/photo/${id}`, {
      responseType: 'arraybuffer'
    });
    const base64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    let userPhoto = 'data:;base64,' + base64;
    return userPhoto;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

export default getPhoto;
