import apiClient from './client';

export const mentorshipApi = {
  getMentors: () => {
    return apiClient.get('/mentorship/mentors');
  },
  createRequest: (alumniId) => {
    return apiClient.post('/mentorship/requests', { alumni_id: alumniId });
  },
  getMyRequests: () => {
    return apiClient.get('/mentorship/requests/me');
  },
  updateRequestStatus: (requestId, status) => {
    return apiClient.put(`/mentorship/requests/${requestId}/status`, { status });
  },
  toggleOptIn: (isMentor) => {
    return apiClient.put('/mentorship/opt-in', { is_mentor: isMentor });
  },
  getOptInStatus: () => {
    return apiClient.get('/mentorship/opt-in/status');
  }
};

export default mentorshipApi;
