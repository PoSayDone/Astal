import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';

type Event<Self> = (self: Self) => unknown

export type ButtonProps<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
    Self = Button<Child, Attr>,
> = BaseProps<Self, Gtk.Button.ConstructorProperties & {
    child?: Child
    on_clicked?: Event<Self>
}, Attr>;

export function newButton<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
>(...props: ConstructorParameters<typeof Button<Child, Attr>>) {
    return new Button(...props);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Button<Child, Attr> extends Widget<Attr> { }
export class Button<Child extends Gtk.Widget, Attr> extends Gtk.Button {
    static {
        register(this, {
            properties: {
                'on-clicked': ['jsobject', 'rw'],
            },
        });
    }

    constructor(props: ButtonProps<Child, Attr> = {}, child?: Child) {
        if (child)
            props.child = child;

        super(props as Gtk.Button.ConstructorProperties);
        this.connect('clicked', this.on_clicked.bind(this));
    }

    get child() { return super.child as Child; }
    set child(child: Child) { super.child = child; }

    get on_clicked() { return this._get('on-clicked') || (() => false); }
    set on_clicked(callback: Event<this>) { this._set('on-clicked', callback); }
}
