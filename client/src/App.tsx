import React from 'react';
import styles from './App.module.scss';
import { AutoSuggestInput } from './components/AutoSuggestInput';

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Wiki Search</div>
      <div className={styles.autoSuggestContainer}>
        <AutoSuggestInput />
      </div>
    </div>
  );
}

export default App;
