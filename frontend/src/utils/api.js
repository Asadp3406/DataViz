import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchAlgorithms = async () => {
  const response = await api.get('/algorithms')
  return response.data
}

export const fetchDatasets = async () => {
  const response = await api.get('/datasets')
  return response.data
}

export const trainModel = async (algorithm, dataset, parameters) => {
  const response = await api.post('/train', {
    algorithm,
    dataset,
    parameters,
  })
  return response.data
}

export default api
