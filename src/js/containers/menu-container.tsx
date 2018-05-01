import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import jsonMenuData from '@db/data-menu.json';

interface IProps {}
interface IState {}

class MenuContainer extends React.Component<IProps, IState> {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <HelixMenu jsonDataMenu={jsonMenuData} />
            </div>
        );
    }
}

export default MenuContainer;
