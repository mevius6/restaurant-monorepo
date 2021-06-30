import { revealText } from './reveal-text';
// import { revealList } from './reveal-list';
import { revealCard } from './reveal-card';
import { selectAll } from './utils';

/* eslint-disable no-unused-vars */
const revealHeadlines = revealText(selectAll('.reveal'));
const revealCards = revealCard(selectAll('.card'));
/* eslint-enable no-unused-vars */
