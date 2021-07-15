// https://css-tricks.com/a-lightweight-masonry-solution/

let grids = [...document.querySelectorAll('.grid--masonry')];

if (grids.length && getComputedStyle(grids[0]).gridTemplateRows !== 'masonry') {
  grids = grids.map((grid) => ({
    elem: grid,
    items: [...grid.childNodes].filter(
      (c) => c.nodeType === 1 && +getComputedStyle(c).gridColumnEnd !== -1
    ),
    columnCount: 0,
    gap: parseFloat(getComputedStyle(grid).rowGap),
  }));

  const layout = () => {
    grids.forEach((grid) => {
      let columnRecount = getComputedStyle(grid.elem).gridTemplateColumns.split(' ').length;

      if (grid.columnCount !== columnRecount) {
        grid.columnCount = columnRecount;

        grid.items.forEach((c) => c.style.removeProperty('margin-top'));

        if (grid.columnCount > 1) {
          grid.items.slice(columnRecount).forEach((c, i) => {
            let prevItemBtm = grid.items[i].getBoundingClientRect().bottom,
                currItemTop = c.getBoundingClientRect().top;

            c.style.marginTop = `${prevItemBtm + grid.gap - currItemTop}px`;
          });
        }
      }
    });
  }

  window.addEventListener('load', () => {
    layout();
    window.addEventListener('resize', layout, false);
  }, false);

  if ('loading' in HTMLImageElement.prototype) {
    // 🐛
  }
}
