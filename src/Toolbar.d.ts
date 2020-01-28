export = Toolbar;
export as namespace Toolbar;

declare namespace Toolbar {
  type Icon = {
    /** the icon that will be used to display */
    icon: string;
    /** the key that will be emmited on click */
    action: string;
  };

  type Icons = Array<Icon>;

  type IconGroup = {
    icons: Array<Icon>;
    /** necessary for react-spring */
    key: string;
  };

  type IconGroups = Array<IconGroup>;
}
