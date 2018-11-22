export default function reducer(state = {}, action) {
  console.log('action');
  console.log(action);
  const { type, data } = action;

  switch (type) {
    case 'config':
      return { ...state, config: data };
    default:
      return state;
  }
}
