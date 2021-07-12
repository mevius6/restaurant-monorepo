let grids = [...document.querySelectorAll('.grid--masonry')];

if(grids.length && getComputedStyle(grids[0]).gridTemplateRows !== 'masonry') {
  grids = grids.map(grid => ({
    _el: grid,
    gap: parseFloat(getComputedStyle(grid).gridRowGap),
    items: [...grid.childNodes].filter(c => c.nodeType === 1 && +getComputedStyle(c).gridColumnEnd !== -1),
    ncol: 0
  }));

  const layout = () => {
    grids.forEach(grid => {
      // get the post relayout number of columns
      let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;

      // if the number of columns has changed
      if(grid.ncol !== ncol) {
        // update number of columns
        grid.ncol = ncol;

        // revert to initial positioning, no margin
        grid.items.forEach(c => c.style.removeProperty('margin-top'));

        // if we have more than one column
        if(grid.ncol > 1) {
          grid.items.slice(ncol).forEach((c, i) => {
            // bottom edge of item above
            let prev_fin = grid.items[i].getBoundingClientRect().bottom,
                // top edge of current item
                curr_ini = c.getBoundingClientRect().top;

            c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
          });
        }
      }
    });
  }


  addEventListener('load', () => {
    layout();
    addEventListener('resize', layout, false);
  }, false);
}
