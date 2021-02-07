import axios from "axios";

export default axios.create({
    baseURL: 'https://react-quiz-a7d59-default-rtdb.firebaseio.com/'
})