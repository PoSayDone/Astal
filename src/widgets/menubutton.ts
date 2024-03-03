import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';

export type MenuButtonProps<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
    Self = MenuButton<Child, Attr>,
> = BaseProps<Self, Gtk.MenuButton.ConstructorProperties & {
    child?: Child
}, Attr>;

export function newMenuButton<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
>(...props: ConstructorParameters<typeof MenuButton<Child, Attr>>) {
    return new MenuButton(...props);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface MenuButton<Child, Attr> extends Widget<Attr> { }
export class MenuButton<Child extends Gtk.Widget, Attr> extends Gtk.MenuButton {
    static { register(this); }

    constructor(props: MenuButtonProps<Child, Attr> = {}, child?: Child) {
        if (child)
            props.child = child;

        super(props as Gtk.MenuButton.ConstructorProperties);
    }

    get child() { return super.child as Child; }
    set child(child: Child) { super.child = child; }
}
