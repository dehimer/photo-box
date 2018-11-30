const defaultState = {
  config: {},
  photos: []
};

export default function reducer(state = defaultState, action) {
  console.log('action');
  console.log(action);
  const { type, data } = action;

  switch (type) {
    case 'config':
      return { ...state, config: data };
    case 'photos':
      return { ...state, photos: data };
    default:
      return state;
  }
}
