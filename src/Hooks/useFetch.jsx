import { useState, useEffect, useRef } from "react";
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
    processingNewQuery.current = true;
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);

      //QUERY VIDEO AND ARTICLE DATA
      let fullQuery = query + `?startIndex=${startIndex}&count=${count}`;

      const response = await fetch(fullQuery);
      const data = await response.json();

      //GET CONTENT IDS
      let contentID = data.data.map((datum) => {
        return datum.contentId;
      });

      //CREATE QUERY FOR RELEVANT COMMENT INFO BASED ON CONTENT IDS (THE NUMBER OF COMMENTS ARE GENERATED AT RANDOM BY THE API)
      let commentQuery = `/comments?ids={${contentID}}`;
      const commentResponse = await fetch(commentQuery);
      const commentData = await commentResponse.json();

      //ZIP DATA TOGETHER INTO CONVENIENT UNIT
      const zippedData = zip(commentData.content, data.data);

      if (processingNewQuery.current) {
        fetchedData.current = zippedData;
      } else {
        fetchedData.current = [...fetchedData.current, ...zippedData];
      }

      if (processingNewQuery.current) {
        processingNewQuery.current = false;
      }

      hasMore.current = startIndex + count < 300;

      setLoading(false);
    };

    const fetchLatest = async () => {
      setLoading(true);

      //QUERY VIDEO AND ARTICLE DATA
      let videoQuery = `/videos?startIndex=${videoStartIndex}&count=${count}`;
      let articleQuery = `/articles?startIndex=${articleStartIndex}&count=${count}`;

      const videoResponse = await fetch(videoQuery);
      const videoData = await videoResponse.json();

      const articleResponse = await fetch(articleQuery);
      const articleData = await articleResponse.json();

      let latestData = [...videoData.data, ...articleData.data];

      latestData.sort((a, b) =>
        a.metadata.publishDate < b.metadata.publishDate ? 1 : -1
      );

      let slicedLatestData = latestData.slice(0, count);
      let vidCount = 0;
      let artCount = 0;

      slicedLatestData.map((datum) => {
        if (datum.contentType === "video") {
          vidCount += 1;
        } else {
          artCount += 1;
        }
      });

      videosIncluded.current = vidCount;
      articlesIncluded.current = artCount;

      //GET CONTENT IDS
      let contentID = slicedLatestData.map((datum) => {
        return datum.contentId;
      });

      //CREATE QUERY FOR RELEVANT COMMENT INFO BASED ON CONTENT IDS (THE NUMBER OF COMMENTS ARE GENERATED AT RANDOM BY THE API)
      let commentQuery = `/comments?ids={${contentID}}`;
      const commentResponse = await fetch(commentQuery);
      const commentData = await commentResponse.json();

      //ZIP DATA TOGETHER INTO CONVENIENT UNIT
      const zippedData = zip(commentData.content, slicedLatestData);

      if (processingNewQuery.current) {
        fetchedData.current = [...zippedData];
      } else {
        fetchedData.current = [...fetchedData.current, ...zippedData];
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
