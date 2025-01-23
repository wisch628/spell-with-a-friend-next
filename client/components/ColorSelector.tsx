import { Dispatch, SetStateAction } from "react";

const ColorSelector = ({
  color,
  setColor,
}: {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div>
      <label>And select your color</label>
      <select
        name="color"
        onChange={(event) => setColor(event.target.value)}
        value={color}
      >
        <option value="Red">Red</option>
        <option value="Orange">Orange</option>
        <option value="Green">Green</option>
        <option value="Blue">Blue</option>
        <option value="Purple">Purple</option>
      </select>
    </div>
  );
};

export default ColorSelector;
