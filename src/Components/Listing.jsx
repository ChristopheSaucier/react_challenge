import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFetch } from "../Hooks/useFetch";
import ContentCard from "./ContentCard";
import "../CSS/Listing.css";

function Listing({ query = "/videos" }) {
  //USED TO MAKE THE useFetch HOOK RUN WHEN SET
  const [needRender, setNeedRender] = useState(0);
  const startIndex = useRef(1);
  const videoStartIndex = useRef(1);
  const articleStartIndex = useRef(1);

  //USED FOR INTERSECTION OBSERVER
  const observer = useRef();
  //NUMBER OF ELEMENTS RETREIVED ON FETCH
  const count = 20;

  useEffect(() => {
    startIndex.current = 1;
    videoStartIndex.current = 1;
    articleStartIndex.current = 1;

    if (needRender === 1) {
      setNeedRender(2);
    } else {
      setNeedRender(1);
    }
  }, [query]);

  const [
    articleData,
    loading,
    hasMore,
    error,
    videosIncluded,
    articlesIncluded,
    processingNewQuery,
  ] = useFetch(
    query,
    startIndex.current,
    videoStartIndex.current,
    articleStartIndex.current,
    count,
    needRender
  );

  function renderMoreContent() {
    startIndex.current = startIndex.current + count;
    videoStartIndex.current = videoStartIndex.current + videosIncluded.current;
    articleStartIndex.current =
      articleStartIndex.current + articlesIncluded.current;

    setNeedRender((prev) => (prev + count) % 100);
  }

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore.current) {
          renderMoreContent();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  let listingName = "listedContent";

  if (loading === true && processingNewQuery.current) {
    listingName = "listedContentFadeOut";
  } else {
    listingName = "listedContent";
  }

  if (error) {
    return (
      <div className="fetchError">ERROR: FAILED TO FETCH RELEVANT DATA</div>
    );
  } else {
    return (
      <div className={listingName}>
        {articleData.current.map((content, index) => {
          if (articleData.current.length === index + 1) {
            return (
              <div key={index} ref={lastElementRef}>
                <ContentCard contentData={content}></ContentCard>
              </div>
            );
          } else {
            return (
              <div key={index}>
                <ContentCard contentData={content}></ContentCard>
              </div>
            );
          }
        })}
      </div>
    );
  }
  // }
}

export default Listing;
