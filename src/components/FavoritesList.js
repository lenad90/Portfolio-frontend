import React from 'react';
import Favorites from './Favorites'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import "./Favorites.css";

const FavoritesList = ({favorites, reorderFavorites, favoritesMoviesList}) => {
    return (
        <div className="favoritesContainer">
            <div className="favoritesPanel">
                {
                    favorites.filter(f => f !== null).length < 1 ?
                        "You haven't chosen any favorites yet"
                        :
                        "Drag your favorites to rank them"
                }
            </div>
            <DndProvider backend={HTML5Backend}>
            <Favorites
                reorderFavorites= { reorderFavorites }
                favoritesMoviesList={ favoritesMoviesList }
            />
            </DndProvider>
        </div>
    )
}

export default FavoritesList;