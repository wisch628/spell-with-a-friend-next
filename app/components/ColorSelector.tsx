import { Dispatch, SetStateAction } from "react";
import { captialize } from "../utils";

const ColorSelector = ({
  color,
  setColor,
  colors,
}: {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  colors: string[];
}) => {
  return (
    <div className="color_wrapper">
      <label>And select your color</label>
      <select
        name="color"
        onChange={(event) => setColor(event.target.value)}
        value={color}
      >
        {colors.map((color) => (
          <option value={color} key={color}>
            {captialize(color)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorSelector;
