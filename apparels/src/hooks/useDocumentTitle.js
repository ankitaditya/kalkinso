import { useLayoutEffect } from 'react';

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'Kalkinso - Apparels';
    }
  }, [title]);
};

export default useDocumentTitle;
