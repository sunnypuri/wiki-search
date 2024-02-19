import axios from "axios";

const WIKI_API_URL = process.env.WIKI_API_URL as string
async function fetchWikiApiData(searchTerm: string) {
    return await axios.get(WIKI_API_URL, {
        params: {
            action: 'query',
            list: 'search',
            srsearch: searchTerm,
            format: 'json',
        }
    });
}

export {
    fetchWikiApiData
}
