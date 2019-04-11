/* Provide a setStatePromise method to a component, which calls setState and returns a promise
 * resolving on success */

export default Component =>
  class WithSetStatePromise extends Component {
    setStatePromise = (state) => new Promise(resolve =>
      this.setState(state, resolve)
    )
  }
