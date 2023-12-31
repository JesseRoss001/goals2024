import React, { useState } from 'react';
import { useTrail, useSpring, animated } from 'react-spring';
import EmojiPicker from 'emoji-picker-react';
import './App.css';

const ResolutionForm = ({ onNewResolution }) => {
  const [newResolution, setNewResolution] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const handleNewResolutionChange = (event) => {
    setNewResolution(event.target.value);
  };

  const onEmojiClick = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    setIsEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onNewResolution({
      text: newResolution,
      emoji: selectedEmoji,
    });
    setNewResolution('');
    setSelectedEmoji(null);
  };

  return (
    <form onSubmit={handleSubmit} className="resolution-form">
      <div className="resolution-input-container">
        <input
          type="text"
          value={newResolution}
          onChange={handleNewResolutionChange}
          placeholder="Your new resolution"
          className="resolution-input"
        />
        {selectedEmoji && <span className="selected-emoji">{selectedEmoji}</span>}
      </div>
      <div className="emoji-container">
        <button type="button" className="emoji-trigger" onClick={toggleEmojiPicker}>
          Choose an Emoji
        </button>
        {isEmojiPickerVisible && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>
      <button type="submit" className="add-resolution-btn">Add Resolution</button>
    </form>
  );
};

const ResolutionList = ({ resolutions, onDelete, isDone }) => {
  return (
    <>
      <h2>Your New Year's Resolutions</h2>
      <ul className="resolutions-container">
        {resolutions.map((resolution, index) => (
          <li key={index} className="resolution-item">
            <span className="resolution-text">{resolution.text}</span>
            <span className="resolution-emoji">{resolution.emoji}</span>
            {!isDone && (
              <button onClick={() => onDelete(index)} className="delete-resolution-btn">Delete</button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

function App() {
  const [isResolutionMode, setIsResolutionMode] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [trail, trailApi] = useTrail(3, () => ({
    xy: [0, 0],
    config: { mass: 10, tension: 200, friction: 50 },
  }));

  const handleDeleteResolution = (index) => {
    setResolutions((currentResolutions) => currentResolutions.filter((_, i) => i !== index));
  };

  const handleNewResolution = (resolution) => {
    setResolutions(currentResolutions => [...currentResolutions, resolution]);
  };

  const handleClick = () => {
    setIsResolutionMode(true);
  };
  const glow = useSpring({
    from: { opacity: 0.7 },
    to: { opacity: 1 },
    config: { duration: 2000 },
    loop: { reverse: true },
  });
  const handleDone = () => {
    setIsDone(true);
  };

  const handleMouseMove = (e) => {
    trailApi.start({ xy: [e.clientX, e.clientY] });
  };

  const trans = (x, y) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;



  const backgroundSpring = useSpring({
    to: async (next) => {
      while (true) {
        await next({
          background: 'linear-gradient(45deg, #000000, #111111, #222222, #333333, #444444, #555555, #666666, #777777, #888888, #999999, #AAAAAA, #BBBBBB, #CCCCCC, #DDDDDD, #EEEEEE, #FFFFFF)'
        });
        await next({ background: 'black' });
      }
    },
    from: {
      background: 'gray',
    },
    config: {
      duration: 3500, // Adjust the duration for a smoother transition
    },
  });

  return (
    <animated.div className="App" onMouseMove={handleMouseMove} style={backgroundSpring}>
      {!isResolutionMode && (
        <>
          <div className="hooksMain">
            {trail.map((props, index) => (
              <animated.div key={index} className={`blob blob-${index}`} style={{ transform: props.xy.to(trans) }} />
            ))}
          </div>
          <animated.button
            className="resolution-button"
            onClick={handleClick}
            style={trail[2]}
          >
            Create Your New Year Resolutions
          </animated.button>
        </>
      )}
      {isResolutionMode && !isDone && (
        <div className="resolution-list">
          <h2>Let's Get Started</h2>
          
          <ResolutionForm onNewResolution={handleNewResolution} />
          <ResolutionList resolutions={resolutions} onDelete={handleDeleteResolution} isDone={isDone} />
          <button onClick={handleDone} className="done-btn">Done</button>
        </div>
      )}
      {isResolutionMode && isDone && (
        <div className="resolution-list">
          <h2>Your New Year's Resolutions</h2>
          <ul className="resolutions-container">
            {resolutions.map((resolution, index) => (
              <li key={index} className="resolution-item">
                <span className="resolution-text">{resolution.text}</span>
                <span className="resolution-emoji">{resolution.emoji}</span>
              </li>
            ))}
          </ul>
          <animated.div className="glow-wrapper">
            <animated.div className="glow" style={glow} />
            <animated.div className="glow" style={glow} />
            <animated.div className="glow" style={glow} />
          </animated.div>
        </div>
      )}
    </animated.div>
  );
}

export default App;

