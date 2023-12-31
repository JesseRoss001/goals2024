import React, { useState } from 'react';
import { useTrail, animated } from 'react-spring';
import EmojiPicker from 'emoji-picker-react';
import './App.css';

const ResolutionForm = ({ onNewResolution }) => {
  const [newResolution, setNewResolution] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null); // Start with null
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const handleNewResolutionChange = (event) => {
    setNewResolution(event.target.value);
  };

  const onEmojiClick = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji); // Set the selected emoji
    setIsEmojiPickerVisible(false); // Hide the picker after selection
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
    setSelectedEmoji(null); // Clear the selected emoji
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

const ResolutionList = ({ resolutions, onDelete }) => {
  return (
    <>
      <h2>Your New Year's Resolutions</h2>
      <ul className="resolutions-container">
        {resolutions.map((resolution, index) => (
          <li key={index} className="resolution-item">
            <span className="resolution-text">{resolution.text}</span>
            <span className="resolution-emoji">{resolution.emoji}</span>
            <button onClick={() => onDelete(index)} className="delete-resolution-btn">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

function App() {
  const [isResolutionMode, setIsResolutionMode] = useState(false);
  const [resolutions, setResolutions] = useState([]);
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

  const handleMouseMove = (e) => {
    trailApi.start({ xy: [e.clientX, e.clientY] });
  };

  const trans = (x, y) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

  return (
    <div className="App" onMouseMove={handleMouseMove} style={{ background: isResolutionMode ? 'linear-gradient(45deg, pink, purple, black)' : 'black' }}>
      {!isResolutionMode && (
        <>
          <animated.button
            className="resolution-button"
            onClick={handleClick}
          >
            Create Your New Year Resolutions
          </animated.button>

          <div className="hooksMain">
            {trail.map((props, index) => (
              <animated.div key={index} style={{ transform: props.xy.to(trans) }} />
            ))}
          </div>
        </>
      )}

      {isResolutionMode && (
        <div className="resolution-list">
          <h2>Let's Get Started</h2>
          <ResolutionForm onNewResolution={handleNewResolution} />
          <ResolutionList resolutions={resolutions} onDelete={handleDeleteResolution} />
        </div>
      )}
    </div>
  );
}

export default App;