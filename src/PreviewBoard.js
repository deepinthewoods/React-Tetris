import React from 'react';
import BoardRow from './BoardRow.js';


class PreviewBoard extends React.Component{
  constructor(props){
    super(props);

  }
  render(){
    let rows = [];

    for (let i = 0; i < this.props.cells.length; i++){
      rows.push(<BoardRow y={i} cells={this.props.cells[i]}/>);
    }


    return (
      <table>{rows}</table>
    );
  }
};
export default PreviewBoard;
