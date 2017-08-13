// @flow
import React, {Component} from 'react';
import {
  connect as originalConnect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux';
import PropTypes from 'prop-types';

type MapStateToProps<S, SP> = (state: S) => SP;
type MapDispatchToProps<DP> = (dispatch: Function) => DP

const connect = <S, SP: Object, DP: Object>(mapStateToProps: MapStateToProps<S, SP>, mapDispatchToProps: MapDispatchToProps<DP>) => (component: Component<void, any, any>): Component<void, SP & DP, any> => {

  const Wrapped = originalConnect(mapStateToProps, (dispatch, ownProps) => {
    const pkgActions = bindActionCreators(ownProps.actions, dispatch);
    if(typeof mapDispatchToProps === 'function') {
      const userActions = mapDispatchToProps(dispatch, ownProps);
      return {
        ...pkgActions,
        ...userActions
      };
    }
    return pkgActions;
  }, null)(component);

  class Wrapper extends Component<void, SP & DP, any> {
    render(){
      return <Wrapped actions={this.context.store.actions} {...this.props} />;
    }
  }

  Wrapper.contextTypes = {
    store: PropTypes.object
  }

  return Wrapper;
}

export default connect;