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
        <option value="red">Red</option>
        <option value="orange">Orange</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="purple">Purple</option>
      </select>
    </div>
  );
};

export default ColorSelector;
