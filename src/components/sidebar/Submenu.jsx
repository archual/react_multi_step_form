import React from 'react';
import images from '../../constants/images';
import {Icon} from 'antd';

class Submenu extends React.Component {
  constructor() {
    super();

    this.state = {
      showFilters: false
    };
  }

  toggleFilters = () => {
    this.setState((prevState) => {
      return {
        showFilters: !prevState.showFilters
      }
    });
  };

  filterDrafts = (filter) => {
    let updatedFilters = [...this.props.map.filter];
    const index = updatedFilters.indexOf(filter);

    if (index === -1) {
      updatedFilters.push(filter);
    } else {
      updatedFilters.splice(index, 1);
    }

    // let currentFilter = this.props.map.filter === filter ? false : filter;
    this.props.setFilter(updatedFilters);
  };

  handleAddDraft = (e) => {
    e.preventDefault();
    this.filterDrafts('new');

    if (!this.props.map.newDraft) {
      this.props.addDraft(this.props.map.center);
    }
  };

  render() {
    const { filter } = this.props.map;

    const filterSpecs = [
      {
        type: 'priority',
        label: 'Priority',
        icon: images.iconPriority,
      },
      {
        type: 'unclaimed',
        label: 'Unclaimed',
        icon: images.iconUnclaimed,
      },
      {
        type: 'my_draft',
        label: 'My Drafts',
        icon: images.iconMyDrafts,
      },
      {
        type: 'claimed',
        label: 'Claimed',
        icon: images.iconClaimed,
      },
      {
        type: 'my_pending',
        label: 'My Drafts in review',
        icon: images.iconMyDrafts,
      },
      {
        type: 'published',
        label: 'Published',
        icon: images.iconPublished,
      },
    ];
    let filters = filterSpecs.map(specs => {
      return (
        <li key={specs.type} className = {(filter.length && filter.indexOf(specs.type) !== -1 ? 'active ' : '') + (specs.type)}>
          <a href="#" onClick={this.filterDrafts.bind(this, specs.type)}>
            <img src={specs.icon}/>
            {specs.label}
          </a>
        </li>
      );
    });

    filters.unshift(
      <li key="new" className = {filter.length && filter.indexOf('new') !== -1 ? 'active' : ''}>
        <a href="#" onClick={this.handleAddDraft}>
          <img src={images.iconNew}/>
          <span className="text">New (Click to add + drag to correct location.)</span>
        </a>
        {this.props.map.newDraft ? <span className="odp-icons-check-x_foam inline-icon remove" onClick={this.props.removeNewDraft}>x</span> : ''}
      </li>
    );

    return (
      <div className={'drafts-filter' + (filter ? ' filtered' : '')}>
        <p>Select an existing draft or add a new draft. Toggle the layers below if desired.</p>
        <span onClick={this.toggleFilters} className="filter-toggle"><Icon type="filter" />Filter drafts</span>
        <ul className={this.state.showFilters ? 'show' : 'hide'}>
          {filters}
        </ul>
      </div>
    );
  }
}

export default Submenu;