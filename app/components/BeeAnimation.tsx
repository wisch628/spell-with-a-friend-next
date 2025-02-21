import Image from "next/image";

export const BeeAnimation = ({ flip = false }) => {
  return (
    <div className={`bee-container${flip ? " flip" : ""}`}>
      <Image
        src="/images/nyt_bee.png"
        alt="bee icon"
        className="bee"
        width={100}
        height={45.31}
      />
      <svg className="trail" width="250" height="100" viewBox="0 0 250 100">
        <path
          d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50 T250,50"
          stroke="black"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray="5,5"
          strokeOpacity="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="250"
            to="0"
            dur="6s"
            begin="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <div className="trail-mask"></div>
      <div className="trail-mask-2"></div>
    </div>
  );
};
