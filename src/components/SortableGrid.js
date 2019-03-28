import React from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import deepEqual from 'deep-equal';

const SortableItem = SortableElement(({value, position, featured, handleFileClick}) => {
  return <li
    className={value.selected ? 'selected' : ''}
    onMouseDown={() => (handleFileClick(position))}
  >
    {typeof value.thumbnail !== 'undefined' ?
    <span className="image-wrapper">
      <img
        className={value.selected ? 'selected' : ''}
        src={value.thumbnail}
        alt={value.fileName}
      />
      {featured ? <span className="featured-flag">&nbsp;</span> : ''}
    </span> :
    <div className="file">
      <span className="file-ico">*.{value.fileName && value.fileName.split('.').pop()}</span>
      <span className="file-name">
        {value.fileName}
      </span>
    </div>}
  </li>
});

const SortableList = SortableContainer(({items, handleFileClick}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          value={value}
          position={index}
          featured={value.featured}
          handleFileClick={handleFileClick}
        />
      ))}
    </ul>
  );
});

class SortableGrid extends React.Component {
  state = {
    items: this.props.files
  };

  componentWillUpdate(nextProps) {
    if (!deepEqual(this.state.items, nextProps.files) ||
      nextProps.selectedItem !== this.props.selectedItem) {
      this.setState({ items: nextProps.files });
    }
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex !== newIndex) {
      this.setState({
        items: arrayMove(this.state.items, oldIndex, newIndex),
      });

      this.props.handleSortFiles(this.state.items);
    }
  };

  render() {
    const { handleFileClick } = this.props;
    if (!this.state.items.length) return null;

    return <SortableList
      axis="xy"
      items={this.state.items}
      onSortEnd={this.onSortEnd}
      handleFileClick={handleFileClick}
      pressDelay={0}
    />;
  }
}


export default SortableGrid;