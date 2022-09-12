import axios from "axios";

class MovieDataService {
    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?page=${page}`);
    }

    find(query, by="title", page=0) {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?${by}=${query}&page=${page}`
        );
    }

    getRatings() {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/ratings`);
    }

    getId(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/id/${id}`);
    }

    createReview(data) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, data);
    }

    deleteReview(review) {
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, {data: review});
    }

    editReview(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, data);
    }
}

export default new MovieDataService();