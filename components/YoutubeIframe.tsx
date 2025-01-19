import React from 'react';

interface YoutubeIframeProps {
  videoId: string;
  title?: string;
  width?: string;
  height?: string;
}

const YoutubeIframe: React.FC<YoutubeIframeProps> = ({
  videoId,
  title = 'YouTube video',
  width = '560',
  height = '315',
}) => {
  return (
    <iframe
      width={width}
      height={height}
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
    ></iframe>
  );
};

export default YoutubeIframe;
