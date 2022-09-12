import axios from "axios";

class FavoritesListDataService {
    getFavoriteMovies(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favoritemovies/${id}`);
    }
}

export default new FavoritesListDataService();