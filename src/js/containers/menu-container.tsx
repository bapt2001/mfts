import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import MenuRepository from '@src/models/repository/menu-repository';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import DocumentMeta from '@src/shared/document-meta';

type MenuContainerProps = {
    menuRepository: MenuRepository;
    lang: DataSupportedLangType;
};

type MenuContainerState = {};

class MenuContainer extends React.Component<MenuContainerProps, MenuContainerState> {
    constructor(props: MenuContainerProps) {
        super(props);
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <DocumentMeta title={'MFS >> Menu'} />
                <HelixMenu jsonDataMenu={this.props.menuRepository.getJsonMenu()} />
            </div>
        );
    }
}

export default MenuContainer;
