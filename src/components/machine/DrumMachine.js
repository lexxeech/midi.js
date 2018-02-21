// @flow
import * as React from 'react';
import withPadController from '~/hoc/withPadController';

type Props = {};

class DrumMachine extends React.PureComponent<Props> {
  render(): React.Node {
    console.log(this.props);
    return <div>282</div>;
  }
}

export default withPadController(DrumMachine);
