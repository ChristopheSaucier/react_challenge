import React, { useState, useEffect, useRef } from "react";
import { zip } from "lodash/array";

export const useFetch = (
  query,
  startIndex,
  videoStartIndex,
  articleStartIndex,
  count,
  needRender
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const videosIncluded = useRef(0);
  const articlesIncluded = useRef(0);
  const processingNewQuery = useRef(false);
  const fetchedData = useRef([]);
  const hasMore = useRef(false);

  useEffect(() => {
    console.log("DATA RESET");
    processingNewQuery.current = true;
    //setProcessingNewQuery(true);
  }, [query]);

  useEffect(() => {
    if (!query) return;
    console.log(query);

    const fetchData = async () => {
      setLoading(true);

      //QUERY VIDEO AND ARTICLE DATA
      let fullQuery = query + "?startIndex=" + startIndex + "&count=" + count;
      console.log(fullQuery);
      const response = await fetch(fullQuery);
      const data = await response.json();

      //GET CONTENT IDS
      let contentID = data.data.map((datum) => {
        return datum.contentId;
      });

      //CREATE QUERY FOR RELEVANT COMMENT INFO BASED ON CONTENT IDS
      let commentQuery = "/comments?ids={" + contentID + "}";
      const commentResponse = await fetch(commentQuery);
      const commentData = await commentResponse.json();

      //ZIP DATA TOGETHER INTO CONVENIENT UNIT
      const zippedData = zip(commentData.content, data.data);

      if (processingNewQuery.current) {
        fetchedData.current = [...zippedData];
        // setFetchedData(() => {
        //   return [...zippedData];
        // });
      } else {
        fetchedData.current = [...fetchedData.current, ...zippedData];
        // setFetchedData((prev) => {
        //   return [...prev, ...zippedData];
        // });
      }

      // setFetchedData((prev) => {
      //   return [...prev, ...zippedData];
      // });

      if (processingNewQuery.current) {
        processingNewQuery.current = false;
      }

      //setHasMore(startIndex + 5 < 300);
      hasMore.current = startIndex + count < 300;

      setLoading(false);
    };

    const fetchLatest = async () => {
      setLoading(true);

      //QUERY VIDEO AND ARTICLE DATA
      let videoQuery =
        "/videos" + "?startIndex=" + videoStartIndex + "&count=" + count;
      let articleQuery =
        "/articles" + "?startIndex=" + articleStartIndex + "&count=" + count;

      const videoResponse = await fetch(videoQuery);
      const videoData = await videoResponse.json();
      //console.log(videoData.data);

      const articleResponse = await fetch(articleQuery);
      const articleData = await articleResponse.json();
      //console.log(articleData.data);

      let latestData = [...videoData.data, ...articleData.data];
      //console.log(latestData);
      latestData.sort((a, b) =>
        a.metadata.publishDate < b.metadata.publishDate ? 1 : -1
      );
      //console.log(latestData);
      let slicedLatestData = latestData.slice(0, count);
      let vidCount = 0;
      let artCount = 0;
      //console.log(slicedLatestData);
      slicedLatestData.map((datum) => {
        if (datum.contentType === "video") {
          vidCount += 1;
        } else {
          artCount += 1;
        }
      });

      videosIncluded.current = vidCount;
      articlesIncluded.current = artCount;
      // setVideosIncluded(vidCount);
      // setArticlesIncluded(artCount);

      //GET CONTENT IDS
      let contentID = slicedLatestData.map((datum) => {
        return datum.contentId;
      });

      //CREATE QUERY FOR RELEVANT COMMENT INFO BASED ON CONTENT IDS
      let commentQuery = "/comments?ids={" + contentID + "}";
      const commentResponse = await fetch(commentQuery);
      const commentData = await commentResponse.json();

      //ZIP DATA TOGETHER INTO CONVENIENT UNIT
      const zippedData = zip(commentData.content, slicedLatestData);

      if (processingNewQuery.current) {
        fetchedData.current = [...zippedData];
        // setFetchedData(() => {
        //   return [...zippedData];
        // });
      } else {
        fetchedData.current = [...fetchedData.current, ...zippedData];
        // setFetchedData((prev) => {
        //   return [...prev, ...zippedData];
        // });
      }

      if (processingNewQuery.current) {
        processingNewQuery.current = false;
      }

      hasMore.current = startIndex + count < 300;

      setLoading(false);
    };

    if (query === "./latest") {
      fetchLatest().catch((error) => setError(error));
    } else {
      fetchData().catch((error) => setError(error));
    }
  }, [needRender]);

  return [
    fetchedData,
    loading,
    hasMore,
    error,
    videosIncluded,
    articlesIncluded,
    processingNewQuery,
  ];
};
