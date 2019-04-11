import React from 'react';
import { Cell } from 'recharts';

export const COLORS = {
  compound: [
    '#3CA0CC',
    '#798F99',
    '#64FFDA',
    '#FFADA4',
    '#CC3C52',
  ]
};

export const fillWith = (palette) => (data) => data.map((_entry, idx) => <Cell key={idx} fill={COLORS[palette][idx % COLORS[palette].length]} />);
