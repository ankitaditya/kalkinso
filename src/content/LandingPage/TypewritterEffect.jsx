import React, { useState, useEffect } from 'react';

const TypewriterEffect = () => {
  const words = ["Effortless Integration, Dynamic Tasking, Scalable Growth"];
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + currentWord[letterIndex]);
      setLetterIndex((prev) => prev + 1);
    }, 100);

    if (letterIndex === currentWord.length) {
      clearInterval(typingInterval);
      setTimeout(() => {
        setLetterIndex(0);
        setDisplayedText("");
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 1500); // Delay before typing next word
    }

    return () => clearInterval(typingInterval);
  }, [letterIndex, wordIndex]);

  return (
    <p
      style={{
        display: 'inline-block',
        fontSize: '1.5rem',
        backgroundColor: '#FFF',
        padding: '15px 30px',
        cursor: 'pointer',
        borderRadius: '3px',
        boxShadow: '0 6px 12px rgba(227, 27, 37, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
    >
      <strong style={{ color: 'black' }}>{displayedText}</strong>
      <span style={{
        display: 'inline-block',
        width: '1px',
        backgroundColor: 'black',
        animation: 'blink 0.8s infinite',
        marginLeft: '2px',
      }} />
    </p>
  );
};

export default TypewriterEffect;
