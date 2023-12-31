import React, { useState } from 'react';
import { useTrail, animated } from 'react-spring';
import EmojiPicker from 'emoji-picker-react'; // Import the emoji picker component
import './App.css';
// Move ResolutionForm and ResolutionList outside of the App component

const ResolutionForm = ({ onNewResolution }) => {
  const [newResolution, setNewResolution] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😀'); // Starting with a default emoji
  const [selectedColor, setSelectedColor] = useState('#ffc0cb'); // Default pink color
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    setIsEmojiPickerVisible(false); // Hide the picker after selection
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };


  const handleEmojiChange = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onNewResolution({
      text: newResolution,
      emoji: selectedEmoji,
      color: selectedColor,
    });
    setNewResolution(''); // Reset the input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="resolution-form">
      <input
        type="text"
        value={newResolution}
        onChange={handleNewResolutionChange}
        placeholder="Your new resolution"
        className="resolution-input"
      />
      <div className="emoji-container">
        <button type="button" className="emoji-trigger" onClick={toggleEmojiPicker}>
          {selectedEmoji ? selectedEmoji : "Choose an Emoji"}
        </button>
        {isEmojiPickerVisible && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>
      <EmojiPicker onEmojiClick={onEmojiClick} />
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        className="color-picker"
      />
      <button type="submit" className="add-resolution-btn">Add Resolution</button>
    </form>
  );
};


const ResolutionList = ({ resolutions }) => {
  return (
    <ul>
      {resolutions.map((resolution, index) => (
        <li key={index} style={{ backgroundColor: resolution.color, display: 'flex', alignItems: 'center', margin: '10px 0', borderRadius: '10px', padding: '5px' }}>
          <span style={{ fontSize: '1.5em', marginRight: '10px' }}>{resolution.emoji}</span>
          {resolution.text}
        </li>
      ))}
    </ul>
  );
};

function App() {
  const [isResolutionMode, setIsResolutionMode] = useState(false);
  const [resolutions, setResolutions] = useState([]);
  const [trail, trailApi] = useTrail(3, () => ({
    xy: [0, 0],
    config: { mass: 10, tension: 200, friction: 50 },
  }));

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
        <>
          <div className="resolution-list">
            <h2>Let's Get Started</h2>
            <ResolutionForm onNewResolution={handleNewResolution} />
            <ResolutionList resolutions={resolutions} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
