const PREFIX = `/usr/local/share/vim/`;

const dirs = [
  "autoload/airline",
  "autoload/airline/themes",
  "autoload/lightline",
  "autoload/lightline/colorscheme",
];

const vimrc = `
  set expandtab tabstop=4 shiftwidth=4 softtabstop=4
  let g:material_theme_style = "darker"
  colorscheme material
  syntax enable
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

export default { dirs: dirs.map((dir) => PREFIX + dir), fetchFiles, files };
