import React, { useState, useEffect, useRef } from 'react';
import { debounce } from '../../utils';
import { HtmlContent } from '../HtmlContent';
import styles from './AutoSuggestInput.module.scss';
import useFocusOut from '../../hooks/useFocusOut';

const AutoSuggestInput: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [history, setHistory] = useState<any[]>([]);
    const historyRef = useFocusOut(() => setShowHistory(false));
    const suggestionsRef = useFocusOut(() => setShowSuggestions(false));
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const latestRequestRef = useRef<number>(0);

    const getSearchHistory = async () => {
        setShowSuggestions(true)
        if (inputValue === '') {
            setSuggestions([])
            try {
                const response = await fetch('http://localhost:3000/search/history', {
                    credentials: 'include'
                });
                const data = await response.json();
                setHistory(data.history);
                setShowSuggestions(false)
            } catch (e) {
                console.log('Error', e)
            }
            setShowHistory(true)
        } else {
            setShowHistory(false)
        }
    }

    useEffect(() => {
        if (inputValue?.length > 0) {
            setShowHistory(false)
        } else {
            setShowHistory(true)
            setShowSuggestions(false)
        }
    }, [inputValue])

    const debouncedFetchSuggestions = debounce((text: string) => {
        const requestId = ++latestRequestRef.current;
        const apiUrl = `http://localhost:3000/search/${text}`;
        setIsFetching(true)
        fetch(apiUrl, {
            credentials: 'include'
        }).then((response) => response.json())
            .then((data) => {
                if (requestId === latestRequestRef.current) {
                    setSuggestions(data.data);
                    if (data?.data?.length > 0) {
                        setShowSuggestions(true)
                    }
                }
            })
            .catch((error) => console.error('Error fetching suggestions:', error)).finally(() => {
                if (requestId === latestRequestRef.current) {
                    setIsFetching(false)
                }
            });
    }, 300);

    useEffect(() => {
        if (inputValue?.trim()?.length > 0) {
            debouncedFetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
        }

        return () => debouncedFetchSuggestions?.cancel();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type to search..."
                    className={styles.inputField}
                    onFocus={getSearchHistory}
                />
                {isFetching && <div className={styles.spinner} />}
            </div>
            {showSuggestions && !!suggestions?.length &&
                <div ref={suggestionsRef} className={styles.suggestionContainer} >
                    {suggestions?.map((suggestion, index) => (
                        <a className={styles.anchor} key={index} href={`https://en.wikipedia.org/wiki/${suggestion.title}`} target='_blank' rel="noopener noreferrer" tabIndex={0} aria-label={suggestion.title}>
                            <div className={styles.suggestionItem}>
                                <div className={styles.title}>{suggestion.title}</div>
                                <div className={styles.description}><HtmlContent content={suggestion?.snippet} /></div>
                            </div>
                        </a>
                    ))}
                </div>
            }
            {showHistory && !!history?.length && !showSuggestions &&
                <div ref={historyRef} className={styles.suggestionContainer}>
                    {history?.map((item, index) => (
                        <div onClick={(e) => { setInputValue(item) }} key={index} className={styles.suggestionItem}>{item}</div>
                    ))}
                </div>}
        </div>
    );
};

export default AutoSuggestInput;
