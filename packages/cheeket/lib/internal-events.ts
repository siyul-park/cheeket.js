const InternalEvents = Object.freeze({
  PreClear: 'pre-clear',
  Clear: 'clear',
  PostClear: 'post-clear',

  PreCreate: 'pre-create',
  PostCreate: 'post-create',
  PreCreateAsync: 'pre-create:async',
  PostCreateAsync: 'post-create:async',
});

export default InternalEvents;
