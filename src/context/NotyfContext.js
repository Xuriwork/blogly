import React  from 'react'
import { Notyf } from 'notyf';

export default React.createContext(
  new Notyf({
    duration: 5000,
    position: {x: 'right', y: 'top'},
    dismissible: true,
    className: 'test',
  })
);