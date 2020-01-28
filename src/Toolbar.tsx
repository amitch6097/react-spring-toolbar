import React, { useState } from "react";
import { useTransition, animated, useSpring } from "react-spring";
import * as Icons from "react-icons/md";

const ICON_GROUP_SIZE = 3;
const ICON_WIDTH = 35;

export interface ToolbarProps {
  icons: Toolbar.Icons;
  onIconClicked?: (key: string) => void;
  withGrip?: boolean;
}

//=============================================================================
// Toolbar Component

export default function Toolbar({
  icons,
  onIconClicked,
  withGrip = false
}: ToolbarProps) {
  //=============================================================================
  // State and Transitions State

  const [iconGroups, setItemGroups] = useState([
    getIconGroup({
      icons,
      groupIndex: 0,
      groupSize: ICON_GROUP_SIZE
    })
  ]);

  const transitions = useTransition(
    iconGroups || [],
    item => item && item.key,
    {
      initial: null,
      from: { innerWidth: 0 },
      enter: iconGroup => [{ innerWidth: groupInnerWidth(iconGroup) }],
      leave: [{ innerWidth: 0 }, { opacity: 0 }]
    } as any
  );

  //=============================================================================
  // Component Functions and Variables

  const allIconsVisible = areAllIconsVisible({
    icons,
    iconGroups,
    groupSize: ICON_GROUP_SIZE
  });

  const expand = () => {
    const nextIconGroup = getIconGroup({
      icons,
      groupIndex: iconGroups.length,
      groupSize: ICON_GROUP_SIZE
    });
    setItemGroups([...iconGroups, nextIconGroup]);
  };

  const collapse = () => {
    const firstItemGroup = iconGroups.slice(0, 1);
    setItemGroups(firstItemGroup);
  };

  //=============================================================================
  // Render

  return (
    <div className="toolbar">
      {withGrip && <div className="grip" />}
      <div className="toolbar__icon-steps">
        {iconGroups &&
          transitions.map(
            ({ item, props: { innerWidth, ...rest }, key }: any) => {
              const icons: Array<Toolbar.Icon> = item && item.icons;
              return (
                <animated.div
                  className="toolbar__icon-steps-step-container"
                  key={key}
                  style={rest}
                >
                  <animated.div
                    className="toolbar__icon-steps-step"
                    style={{ overflow: "hidden", width: innerWidth }}
                  >
                    {icons &&
                      item.icons.map(icon => {
                        const Icon = getIcon(icon.icon);
                        return (
                          <div
                            key={icon.action}
                            onClick={() => onIconClicked(icon.action)}
                            className="toolbar__icon-wrapper"
                          >
                            <Icon />
                          </div>
                        );
                      })}
                  </animated.div>
                </animated.div>
              );
            }
          )}
      </div>
      {isExpandAvailable({ icons, iconGroups, groupSize: ICON_GROUP_SIZE }) && (
        <ExpandControl
          flipped={allIconsVisible}
          onClick={allIconsVisible ? collapse : expand}
        />
      )}
    </div>
  );
}

//=============================================================================
// ExpandControl Component
//  - Controls the Expand and Collapse Animations for us through the flipped prop

function ExpandControl({
  flipped,
  onClick
}: {
  flipped: boolean;
  onClick: (e: any) => void;
}) {
  const { transform } = useSpring({
    transform: `rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  return (
    <animated.div
      style={{ transform }}
      onClick={onClick}
      className="toolbar__icon-wrapper toolbar__expand"
    >
      <Icons.MdKeyboardArrowRight />
    </animated.div>
  );
}

//=============================================================================
// Helpers

/**
 * gets an icon group from the given icons using the
 * group size and the index and which we are grouping icons
 */
function getIconGroup({
  icons,
  groupIndex,
  groupSize
}: {
  icons: Toolbar.Icons;
  groupIndex: number;
  groupSize: number;
}): Toolbar.IconGroup {
  if (!icons) {
    return undefined;
  }
  const initialIndex = groupIndex * groupSize;
  const groupIcons = icons.slice(initialIndex, initialIndex + groupSize);
  const groupKey = groupIcons.map(icon => icon.action).join("");
  return { icons: groupIcons, key: groupKey };
}

/**
 * helps decide when we should show expand or collapse
 */
function areAllIconsVisible({
  icons,
  iconGroups,
  groupSize
}: {
  icons: Toolbar.Icons;
  iconGroups: Toolbar.IconGroups;
  groupSize: number;
}): boolean {
  const visibleIconsLength = iconGroups.length * groupSize;
  return Boolean(!icons || visibleIconsLength >= icons.length);
}

/**
 * solves the issue where we might not have more than one
 * icon group, therefore we should show expand / collapse
 */
function isExpandAvailable({
  icons,
  iconGroups,
  groupSize
}: {
  icons: Toolbar.Icons;
  iconGroups: Toolbar.IconGroups;
  groupSize: number;
}): boolean {
  return Boolean(icons.length >= groupSize);
}

/**
 *  Takes an iconGroup and solves the problem where we might
 * only have one icon in a group and the normal icon group
 * length is 3, the width would show two empty icons
 */
function groupInnerWidth(iconGroup: Toolbar.IconGroup) {
  return iconGroup && iconGroup.icons ? ICON_WIDTH * iconGroup.icons.length : 0;
}

/**
 * gets the icon from the react-icon lib
 */
function getIcon(iconName) {
  return Icons[iconName];
}
