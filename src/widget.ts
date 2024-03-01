/* eslint-disable max-len */
import Gtk from 'gi://Gtk?version=4.0';
import { register, type BaseProps, type Widget } from './widgets/widget.js';

export { newBox as Box } from './widgets/box.js';
export { newButton as Button } from './widgets/button.js';
export { newCalendar as Calendar } from './widgets/calendar.js';
export { newCenterBox as CenterBox } from './widgets/centerbox.js';
export { newDrawingArea as DrawingArea } from './widgets/drawingarea.js';
export { newEntry as Entry } from './widgets/entry.js';
export { newFixed as Fixed } from './widgets/fixed.js';
export { newFlowBox as FlowBox } from './widgets/flowbox.js';
export { newIcon as Icon } from './widgets/icon.js';
export { newLabel as Label } from './widgets/label.js';
export { newLevelBar as LevelBar } from './widgets/levelbar.js';
export { newMenuButton as MenuButton } from './widgets/menubutton.js';
export { newOverlay as Overlay } from './widgets/overlay.js';
export { newPopover as Popover } from './widgets/popover.js';
export { newRevealer as Revealer } from './widgets/revealer.js';
export { newScrollable as Scrollable } from './widgets/scrollable.js';
export { newSeparator as Separator } from './widgets/separator.js';
export { newSlider as Slider } from './widgets/slider.js';
export { newSpinner as Spinner } from './widgets/spinner.js';
export { newStack as Stack } from './widgets/stack.js';
export { newSwitch as Switch } from './widgets/switch.js';
export { newToggleButton as ToggleButton } from './widgets/togglebutton.js';
export { newWindow as Window } from './widgets/window.js';

export function subclass<T extends { new(...args: any[]): Gtk.Widget }, Props>(Base: T, typename = Base.name) {
    class Subclassed extends Base {
        static { register(this, { typename }); }
        constructor(...params: any[]) { super(...params); }
    }
    type Instance<Attr> = InstanceType<typeof Subclassed> & Widget<Attr>;
    return <Attr>(props: BaseProps<Instance<Attr>, Props, Attr>) => {
        return new Subclassed(props) as Instance<Attr>;
    };
}
