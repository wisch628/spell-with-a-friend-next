import { useState } from "react";

const ColorSelector = () => {
  const [color, setColor] = useState("red");
  return (
    <div>
      <label>Select your color</label>
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
