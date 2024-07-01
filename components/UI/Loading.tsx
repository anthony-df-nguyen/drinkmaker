import React from "react";

const MartiniLoader = () => (
  <div className="martini-loader">
    <div className="loader-content">
      <svg
        width="100"
        height="150"
        viewBox="0 0 100 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="glass-clip">
            <path d="M20 26 L50 68 L80 26 Z" />
          </clipPath>
        </defs>
        <g transform="translate(0, 10)">
          <path d="M20 30 L50 70 L80 30 Z" stroke="black" strokeWidth={3} fill="none" />
          <line x1="50" y1="70" x2="50" y2="110" stroke="black" strokeWidth={3} />
          <rect x="35" y="110" width="30" height="6" fill="black" />
          <rect
            x="20"
            y="30"
            width="60"
            height="40"
            fill="#cacaca"
            clipPath="url(#glass-clip)"
            className="liquid"
          />
          <circle cx="30" cy="30" r="6" fill="olive" />
        </g>
        <style jsx>{`
          @keyframes fillUp {
            0% {
              height: 0;
              y: 70;
            }
            100% {
              height: 40px;
              y: 30;
            }
          }
          @keyframes blink {
            0%,
            20% {
              opacity: 0;
            }
            40% {
              opacity: 1;
            }
            60% {
              opacity: 0;
            }
            80%,
            100% {
              opacity: 1;
            }
          }
          .liquid {
            animation: fillUp 3s infinite;
            transform-origin: bottom;
          }
          .loading-text {
            margin-top: 20px;
            font-size: 16px;
            color: black;
            text-align: center;
          }
          .dot {
            animation: blink 1.4s infinite both;
          }
          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
        `}</style>
      </svg>
      <div className="loading-text">
        Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
      </div>
    </div>
  </div>
);

export default MartiniLoader;