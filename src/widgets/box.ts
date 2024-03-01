import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';

export type BoxProps<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
    Self = Box<Child, Attr>
> = BaseProps<Self, Gtk.Box.ConstructorProperties & {
    child?: Child
    children?: Child[]
    vertical?: boolean
}, Attr>;

export function newBox<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown
>(...props: ConstructorParameters<typeof Box<Child, Attr>>) {
    return new Box(...props);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Box<Child, Attr> extends Widget<Attr> { }
export class Box<Child extends Gtk.Widget, Attr> extends Gtk.Box {
    static {
        register(this, {
            properties: {
                'vertical': ['boolean', 'rw'],
                'children': ['jsobject', 'rw'],
            },
        });
    }

    constructor(propsOrChildren: BoxProps<Child, Attr> | Child[] = {}, ...children: Gtk.Widget[]) {
        const props = Array.isArray(propsOrChildren) ? {} : propsOrChildren;

        if (Array.isArray(propsOrChildren))
            props.children = propsOrChildren;

        else if (children.length > 0)
            props.children = children as Child[];

        super(props as Gtk.Box.ConstructorProperties);

        this.connect('notify::orientation', () => this.notify('vertical'));
    }

    get child() { return this.children[0] as Child; }
    set child(child: Child) { this.children = [child]; }

    get children() {
        const children = [];
        let widget = this.get_first_child();
        while (widget) {
            children.push(widget);
            widget = widget.get_next_sibling();
        }
        return children as Child[];
    }

    set children(children: (Child | null)[]) {
        const newChildren = children || [];
        this.children.forEach(ch => ch && this.remove(ch));
        newChildren.forEach(w => w && this.append(w));
        this.notify('children');
    }

    get vertical() {
        return this.orientation === Gtk.Orientation.VERTICAL;
    }

    set vertical(v: boolean) {
        this.orientation = Gtk.Orientation[v ? 'VERTICAL' : 'HORIZONTAL'];
    }
}
