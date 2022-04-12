import { InternalEvents as Parent } from 'cheeket';

const InternalEvents = Object.freeze({
  Load: 'load',
  LoadAsync: 'load:async',
  ...Parent,
});

export default InternalEvents;
