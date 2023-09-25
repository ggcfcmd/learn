import { createPortal } from "react-dom";

const Portal = () => {
  return createPortal(<p>这个p标签会被挂载到body下</p>, document.body);
};

export default Portal;
