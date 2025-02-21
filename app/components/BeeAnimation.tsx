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
      <svg className="trail" width="400" height="100" viewBox="0 0 400 100">
        <path
          d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50"
          stroke="black"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray="5,5"
          strokeOpacity="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="400"
            to="0"
            dur="6s"
            begin="0s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <div className="trail-mask"></div>
      <div className="trail-mask-2"></div>
    </div>
  );
};
