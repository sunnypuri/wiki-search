import React from 'react';

const HtmlContent = ({ content }: { content: string }) => {
    // Using `dangerouslySetInnerHTML` to set raw HTML
    const createMarkup = () => {
        return { __html: content };
    };

    return <>
        <style>
            {`.searchmatch { 
                width: 100%;
        white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
      }`}
        </style>
        <div className="searchmatch" dangerouslySetInnerHTML={createMarkup()} />
    </>
};

export default HtmlContent;