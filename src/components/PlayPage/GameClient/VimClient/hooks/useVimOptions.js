import { useState, useEffect } from "react";
import opts, { vimrc } from "../vimOptions";
import _ from "lodash";
const { canvasStyle, inputStyle, ...vimOpts } = opts;

const useVimOptions = (user) => {
  const [vimOptions, setVimOptions] = useState(_.cloneDeep(vimOpts));

  useEffect(() => {
    if (user && user.vimrcText) {
      const newOptions = _.cloneDeep(vimOpts);
      newOptions.files["/home/web_user/.vim/vimrc"] = user.vimrcText;
      setVimOptions(newOptions);
    } else {
      const newOptions = _.cloneDeep(vimOpts);
      newOptions.files["/home/web_user/.vim/vimrc"] = vimrc;
      setVimOptions(newOptions);
    }
  }, [setVimOptions, user]);

  return [vimOptions];
};

export default useVimOptions;