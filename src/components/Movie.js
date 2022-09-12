import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const Movie = ({ user }) => {
    let params = useParams();

    const [movie, setMovie] = useState({
        id: null,
        title: "",
        rated: "",
        reviews: []
    });

    const getMovie = id => {
        MovieDataService.getId(id)
        .then(res => {
            setMovie(res.data)
        })
        .catch(e => {
            console.log(e);
        })
    }

    const deleteReview = (reviewId, index) => {
        var deleteData = {
            review_id: reviewId,
            user_id: user.googleId
        }
        MovieDataService.deleteReview(deleteData)
            .then(response => {
                setMovie((prevState) => {
                    prevState.reviews.splice(index, 1);
                    return ({
                        ...prevState
                    })
                })
            })
            .catch(e => {
                console.log(e)
            })
    }

    useEffect(() => {
        getMovie(params.id)
    }, [params.id]);
    
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                    <div className="poster">
                        <Image
                        className="bigPicture"
                        src={movie.poster+"/100px250"}
                        fluid
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src="../../images/NoPosterAvailable-crop.jpeg";
                        }} />
                    </div>
                    </Col>
                    <Col>
                    <Card>
                        <Card.Header as="h5">{movie.title}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {movie.plot}
                            </Card.Text>
                            { user &&
                                <Link to={"/movies/" + params.id + "/review"}>
                                    Add Review
                                    </Link>}
                        </Card.Body>
                    </Card>
                    <h2>Reviews</h2>
                    <br></br>
                    { movie.reviews.map((review, index) => {
                        return (
                            <div className="d-flex" key={index}>
                                <div className="flex-shrink-0 reviewsText">
                                    <h5>{review.name + " reviewed on "} { moment(review.date).format("Do MMMM YYYY") }</h5>
                                    <p className="review">{review.review}</p>
                                    { user && user.googleId === review.user_id &&
                                        <Row>
                                            <Col>
                                            <Link to={{
                                                pathname: "/movies/"+params.id+"/review"
                                            }}
                                            state = {{
                                                currentReview: review
                                            }} >
                                                Edit
                                                </Link>
                                                </Col>
                                                <Col>
                                                <Button variant="link" onClick={ () =>
                                                {
                                                    deleteReview(movie.reviews[index]._id, index);
                                                } }>
                                                    Delete
                                                    </Button>
                                                </Col>
                                        </Row>
                                        }
                                </div>
                            </div>
                        )
                    })}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}


export default Movie;