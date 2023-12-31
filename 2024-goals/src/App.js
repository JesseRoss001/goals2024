import React, { useState } from 'react';
import { useSpring, animated, useTrail } from 'react-spring';
import './App.css'; // Make sure this links to your updated CSS file

function App() {
  const [isResolutionMode, setIsResolutionMode] = useState(false);
  const [showList, setShowList] = useState(false);
  const [trail, trailApi] = useTrail(3, () => ({
    xy: [0, 0],
    config: { mass: 10, tension: 200, friction: 50 },
  }));

  const handleClick = () => {
    setIsResolutionMode(true);
    setTimeout(() => {
      setShowList(true);
    }, 2000); // Adjust the time (2000 ms = 2 seconds) as needed
  };

  const handleMouseMove = (e) => {
    trailApi.start({ xy: [e.clientX, e.clientY] });
  };

  const trans = (x, y) =>
    `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

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
          {/* Content of your resolutions list goes here */}
        </div>
      )}
    </div>
  );
  {showList && (
    <div className="resolution-list">
      <h2>Let's Get Started</h2>
      {/* Content of your resolutions list goes here */}
    </div>
  )}
}

export default App;