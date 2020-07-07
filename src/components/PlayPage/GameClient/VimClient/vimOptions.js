const PREFIX = `/usr/local/share/vim/`;

const dirs = [
  "autoload/airline",
  "autoload/airline/themes",
  "autoload/lightline",
  "autoload/lightline/colorscheme",
];

export const vimrc = `" This default vimrc should be enough for every problem 
" Set all tabs to 4
" Feel free to edit this file as you'd like!
set expandtab tabstop=4 shiftwidth=4 softtabstop=4 smarttab

" Add custom theme - more support for custom themes coming soon
let g:material_theme_style = "darker"
colorscheme material
syntax enable
set number

" The default command for submitting is :export - this rebinds write and export
" to :E
command E w | export
`;

// used to manually load material theme
const fetchFiles = {
  "/usr/local/share/vim/autoload/airline/themes/material.vim":
    "https://raw.githubusercontent.com/kaicataldo/material.vim/master/autoload/airline/themes/material.vim",
  "/usr/local/share/vim/lightline/colorscheme/material_vim.vim":
    "https://raw.githubusercontent.com/kaicataldo/material.vim/master/autoload/lightline/colorscheme/material_vim.vim",
  "/usr/local/share/vim/colors/material.vim":
    "https://raw.githubusercontent.com/kaicataldo/material.vim/master/colors/material.vim",
};

// load vimrc
const files = {
  "/home/web_user/.vim/vimrc": vimrc,
};

const canvasStyle = {
  width: "600px",
  height: "400px",
  border: "1px solid black",
  borderRadius: "2px",
};

const inputStyle = {
  width: "1px",
  color: "transparent",
  backgroundColor: "transparent",
  padding: "0px",
  border: "0px",
  outline: "none",
  position: "relative",
  top: "0px",
  left: "0px",
};

export default {
  canvasStyle,
  inputStyle,
  dirs: dirs.map((dir) => PREFIX + dir),
  fetchFiles,
  files,
};
