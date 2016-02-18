export default function bindDispatch(dispatch) {
  dispatch({ type: 'INIT_DISPATCH', dispatch })
}
