import update from 'immutability-helper'
import React, { useCallback, useEffect, useState } from 'react'
import { DnDCard } from './DnDCard.js'
import "./Favorites.css";

const style = {
  width: 500,
  margin: '1em',
}

export const Container = ({ reorderFavorites, favoritesMoviesList }) => {

  const [cards, setCards] = useState(favoritesMoviesList);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
      )
  })

  useEffect(() => {
    if (cards.length > 0) {
      let sortFavorites = cards.map(c => c.id);
      console.log(sortFavorites);
      reorderFavorites(sortFavorites);
    }
  }, [cards])

  useEffect(() => {
    console.log(favoritesMoviesList);
    if (favoritesMoviesList.length > 0) {
      setCards(favoritesMoviesList);
    }
  }, [favoritesMoviesList])

  const renderCard = useCallback((card, index) => {
    return (
      <DnDCard
        key={card.id}
        index={index}
        id={card.id}
        text={card.text}
        poster={card.poster}
        moveCard={moveCard}
      />
    )
  }, [])
  return (
    <>
      <div style={style}>
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </>
  )
}