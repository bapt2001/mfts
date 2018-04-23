/**
 * Temp debug menu
 */
import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '@src/redux/index';
import { withRouter } from 'react-router';

import MaterialAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import { WithStyles } from 'material-ui';
import { Menu as MenuIcon } from '@material-ui/icons/es';
import withStyles from 'material-ui/styles/withStyles';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

export interface MenuLinkProps {
    path: string;
    label: string;
    active: boolean;
}

interface AppBarProps {
    title: string;
    // menuLinks: MenuLinkProps[];
}

export type AppBarWithStyleProps = AppBarProps & WithStyles<ComponentClassNames>;
export type AppBarWithRouterProps = AppBarProps & RouteComponentProps<{}>;

export const AppBarComponent: React.SFC<AppBarWithStyleProps & AppBarWithRouterProps> = props => {
    const { classes } = props;
    const currentPath = props.location.pathname;

    const menuItems: MenuLinkProps[] = [
        { path: '/', label: 'Home' },
        { path: '/page-list', label: 'Pages' },
        { path: '/video-list', label: 'Videos' },
    ].map((menuLinkProps: MenuLinkProps) => {
        return { ...menuLinkProps, active: currentPath === menuLinkProps.path };
    });

    const LinkItem = (linkProps: MenuLinkProps) => {
        return (
            <Button
                color="inherit"
                variant={linkProps.active ? 'raised' : undefined}
                component={(btnProps: any) => <Link to={linkProps.path} {...btnProps} />}
            >
                {linkProps.label}
            </Button>
        );
    };

    const history = props.history;

    return (
        <div className={classes.root}>
            <MaterialAppBar elevation={0} position="fixed" style={{ backgroundColor: 'transparent' }}>
                <Toolbar>
                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Menu"
                        onClick={() => {
                            history.push('/menu');
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        {props.title}
                    </Typography>
                    {menuItems.map(({ path, label, active }) => {
                        return <LinkItem key={path} path={path} label={label} active={active} />;
                    })}
                </Toolbar>
            </MaterialAppBar>
        </div>
    );
};

/**
 * Exporting AppBarWithStyles component
 */

type ComponentClassNames = 'root' | 'flex' | 'menuButton';
const styles = {
    root: {
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

export const AppBarWithStyles = withStyles(styles)(AppBarComponent);

/**
 * Exporting AppBar with router support and injected styles
 */

const mapStateToProps = (state: RootState) => ({
    // mediaInfo: state.media.mediaInfo,
});

const mapDispatchToProps = (dispatch: any) => ({
    // dispatch
});

export const AppBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBarWithStyles));
