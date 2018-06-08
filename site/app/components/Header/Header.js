import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

require('./header.scss');

const propTypes = {
	userName: PropTypes.string,
	userInitials: PropTypes.string,
	userSlug: PropTypes.string,
	userAvatar: PropTypes.string,

	onLogout: PropTypes.func.isRequired,
};

const defaultProps = {
	userName: undefined,
	userInitials: undefined,
	userSlug: undefined,
	userAvatar: undefined,
};

const Header = function(props) {
	const loggedIn = !!props.userSlug;
	const isHome = window.location.pathname === '/';

	return (
		<nav className={`header ${isHome ? 'simple' : ''}`}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>

						{/* App Logo - do not show on homepage */}
						{!isHome &&
							<div className={'headerItems headerItemsLeft'}>
								<Link to={'/'} className="headerLogo pt-button pt-large pt-minimal">
									Prior Art Archive
									{/* <img src="/logo.png" alt="Priot Art Archive" /> */}
								</Link>
							</div>
						}

						<div className={'headerItems headerItemsRight'}>
							{/* User avatar and menu */}
							<Link to={'/help'} className="pt-button pt-large pt-minimal">Help</Link>
							<Link to={'/about'} className="pt-button pt-large pt-minimal">About</Link>
							{loggedIn &&
								<Popover
									content={
										<Menu>
											<li>
												<Link to={`/user/${props.userSlug}`} className="pt-menu-item pt-popover-dismiss">
													<div>{props.userName}</div>
													<div className={'subtext'}>View Profile</div>
												</Link>
											</li>
											<MenuDivider />
											<MenuItem text={'Logout'} onClick={props.onLogout} />
										</Menu>
									}
									interactionKind={PopoverInteractionKind.CLICK}
									position={Position.BOTTOM_RIGHT}
									transitionDuration={-1}
									inheritDarkTheme={false}
								>
									<button className="pt-button pt-large pt-minimal avatar-button">
										<Avatar
											userInitials={props.userInitials}
											userAvatar={props.userAvatar}
											width={30}
										/>
									</button>
								</Popover>
							}

							{/* Login or Signup button */}
							{!loggedIn &&
								<Link to={'/login'} className="pt-button pt-large pt-intent-primary">Login</Link>
							}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

Header.defaultProps = defaultProps;
Header.propTypes = propTypes;
export default Header;
