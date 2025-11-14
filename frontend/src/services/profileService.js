import axios from '@/lib/axios';

export const profileService = {
  getProfile: () => {
    return axios.get('/profile');
  },
  updateProfile: (data) => {
    return axios.put('/profile', data);
  },
};