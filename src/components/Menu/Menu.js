import React from "react";
import "./Menu.css";

export const Menu = React.forwardRef(({ ...props }, ref) => (
  <div {...props} ref={ref} className="menu" />
));
