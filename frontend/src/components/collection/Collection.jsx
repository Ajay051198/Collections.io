import React, { useState, useEffect } from "react";
import "./collection.sass";

//api
import { getCollectionFromID } from "../../helpers/api";
//components
import SnippetRow from "./snippetRow";
//icons
import Podcast from "../../assets/svgs/podcasts.svg";
import Article from "../../assets/svgs/articles_green.svg";
import URL from "../../assets/svgs/URLs.svg";
import Video from "../../assets/svgs/videos.svg";
import { Favorite, MoreVert, PlaylistAdd, Search } from "@material-ui/icons";

// import { Heart } from "react-feather";
//modules
import { useParams } from "react-router-dom";
import { useStateValue } from "../../helpers/stateProvider";

function Collection() {
  //states
  const [collection, setCollection] = useState({});
  const [snippets, setSnippets] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [getError, setGetError] = useState(null);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [searchText, setSearchText] = useState("");

  //misc
  const [totFollowers, setTotFollowers] = useState(0);

  //flags
  const [isLiked, setIsLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const [bg, setBg] = useState(
    "https://s3.amazonaws.com/assets.mlh.io/events/splashes/000/000/392/thumb/930adc5ed398-hackmtyMLH_300x300.png?1467906271"
  );

  const coll_bg = {
    background: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${bg}) center / cover`,
    // background: `url(${bg}) center / cover`,
  };

  //global states
  const [{ user, isDesktop }, dispatch] = useStateValue();
  const params = useParams();

  // lifecycle functions
  useEffect(() => {
    dispatch({
      type: "SET_PAGE",
      page: "collection_detail",
    });
    console.log("[RENDER] >> Collection");
    if (!refresh) {
      return;
    }

    async function fetchCollection() {
      try {
        console.log(`[GET] >> Collection ${params.id} details`);
        const response = await getCollectionFromID(params.id);
        setCollection(response.data);
        setSnippets(response.data.snippets);
        setTags(response.data.tags);
      } catch (error) {
        console.error(error);
        setGetError(`Failed to load collection with ID: ${params.id}`);
      }
      setIsLoading(false);
    }
    fetchCollection();
    setRefresh(false);
  }, [refresh, params]);

  useEffect(() => {
    if (user === collection.owner) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
    const followers = collection.followers;
    if (followers) {
      setIsFollowed(followers.includes(user));
      setTotFollowers(collection.followers.length);
    }
    if (collection.tags) {
      if (collection.tags[0]) {
        console.log("tag", collection.tags[0]);
        setBg(collection.tags[0].image_urls);
      }
    }
  }, [collection, user]);

  const podcasts = snippets.filter((snip) => snip.type_of === "podcast").length;
  const articles = snippets.filter((snip) => snip.type_of === "article").length;

  return (
    <div>
      {isDesktop ? (
        <main className="collection">
          <header>
            <div className="card" style={coll_bg}></div>
            <div className="info">
              <div className="type">COLLECTION</div>
              <div className="name">{collection.name}</div>
              <div className="desc">{collection.desc}</div>
              {tags.map((tag) => (
                <div className="tag btn" key={tags.id}>
                  {tag.name}
                </div>
              ))}
              <div
                className={isFollowed ? "btn center followed" : "btn center "}
              >
                {isFollowed ? <p>UNFOLLOW</p> : <p>FOLLOW</p>}
                <Favorite />
              </div>
            </div>
            <div className="col3">
              <div className="owner">{collection.owner}</div>
              <MoreVert className="more" />
            </div>
          </header>
          <div className="mid">
            <div className="searchsection">
              <div className="searchbox">
                <Search />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
              </div>
              <div className="line" />
            </div>
            <div className="selects">
              <div
                className={filter === "podcast" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("podcast");
                }}
              >
                <img src={Podcast} alt="Url" className="icon" />
                <p>{podcasts}</p>
              </div>
              <div
                className={filter === "article" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("article");
                }}
              >
                <img src={Article} alt="Url" className="icon" />
                <p>{articles}</p>
              </div>
              <div
                className={filter === "" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("");
                }}
              >
                <img src={URL} alt="Url" className="icon" />
                <p>12/</p>
              </div>
              <div
                className={filter === "" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("");
                }}
              >
                <img src={Video} alt="Url" className="icon" />
                <p>12/</p>
              </div>
            </div>
            <div className="addbtn center">
              <PlaylistAdd />
            </div>
          </div>
          <section>
            <div className="snippets">
              {snippets.map((snippet) => (
                <div key={snippet.id}>
                  {snippet.type_of.includes(filter) &&
                    snippet.title.includes(searchText) && (
                      <SnippetRow
                        snippet={snippet}
                        key={snippet.id}
                      />
                    )}
                </div>
              ))}
            </div>
            <div className="highlight"></div>
          </section>
        </main>
      ) : (
        <main className="collection-mobile">
          <header>
            <div className="card" style={coll_bg}></div>
            <div className="selects">
              <div
                className={filter === "podcast" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("podcast");
                }}
              >
                <img src={Podcast} alt="Url" className="icon" />
                <p>{podcasts}</p>
              </div>
              <div
                className={filter === "article" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("article");
                }}
              >
                <img src={Article} alt="Url" className="icon" />
                <p>{articles}</p>
              </div>
              <div
                className={filter === "" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("");
                }}
              >
                <img src={URL} alt="Url" className="icon" />
                <p>12/</p>
              </div>
              <div
                className={filter === "" ? "select current" : "select"}
                onClick={(e) => {
                  setFilter("");
                }}
              >
                <img src={Video} alt="Url" className="icon" />
                <p>12/</p>
              </div>
            </div>
            <div className="info">
              <div className="type">COLLECTION</div>
              <div className="name">{collection.name}</div>
              <div className="owner">by {collection.owner}</div>
              <div className="desc">{collection.desc}</div>
              {tags.map((tag) => (
                <div className="tag btn" key={tags.id}>
                  {tag.name}
                </div>
              ))}
              <div>
                <div
                  className={isFollowed ? "btn center followed" : "btn center "}
                >
                  {isFollowed ? <p>UNFOLLOW</p> : <p>FOLLOW</p>}
                  <Favorite />
                </div>
                <MoreVert className="more" />
              </div>
            </div>
          </header>
          <div className="mid">
            <div className="searchsection">
              <div className="searchbox">
                <Search />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="addbtn center">
              <PlaylistAdd />
            </div>
          </div>
          <section>
            <div className="snippets">
              {snippets.map((snippet) => (
                <div key={snippet.id}>
                  {snippet.type_of.includes(filter) &&
                    snippet.title.includes(searchText) && (
                      <SnippetRow snippet={snippet} key={snippet.id} />
                    )}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default Collection;
