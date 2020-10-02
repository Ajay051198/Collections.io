import React, { useState, useEffect } from "react";
import "./explore.sass";
//api
import { getPopularCollections } from "../../helpers/api";
//components
import { useStateValue } from "../../helpers/stateProvider";
import PopCollection from "./popCollection";

function Explore() {
  //GlobalStates
  const [, dispatch] = useStateValue();
  //states
  const [popularCollections, setPopularCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [getError, setGetError] = useState(null);
  //mount
  useEffect(() => {
    dispatch({
      type: "SET_PAGE",
      page: "explore",
    });
    console.log("[RENDERING] >> Explore ");
    async function fetchFollowedCollection() {
      console.log("[GET] >> PopularCollections");
      try {
        const response = await getPopularCollections();
        setPopularCollections(response.data);
      } catch (error) {
        console.log(`[ERROR] >> ${error.response}`);
        setGetError("Error communicating with server");
      }
    }
    fetchFollowedCollection();
    setIsLoading(false);
  }, []);

  return (
    <main className="explore">
      <div className="explore-container">
        <div className="left-container">
          <h1>Popular Collections</h1>
          <div className="pop-collections">
            {popularCollections.map((collection) => (
              <PopCollection key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
        <div className="right-container">
          <div className="top">
            <div className="top-left"></div>
            <div className="top-right"></div>
          </div>
          <div className="bottom center">
            COLLECTIONS
          </div>
        </div>
      </div>
    </main>
  );
}

export default Explore;

{
  /* <header>This should be aqua yellow</header>
      <section>
        <div className="popularCollections">
          {isLoading
            ? null
            : popularCollections.map((collection) => (
                <div key={collection.id}>
                  <h4>
                    {collection.name}, {collection.id}
                  </h4>
                </div>
              ))}
        </div>
      </section> */
}
