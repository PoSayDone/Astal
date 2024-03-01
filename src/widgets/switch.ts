import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';

export type SwitchProps<
    Attr = unknown,
    Self = Switch<Attr>,
> = BaseProps<Self, Gtk.Switch.ConstructorProperties & {
    on_activate?: (self: Self) => boolean
}, Attr>;

export function newSwitch<Attr = unknown>(props?: SwitchProps<Attr>) {
    return new Switch(props);
}

export interface Switch<Attr> extends Widget<Attr> { }
export class Switch<Attr> extends Gtk.Switch {
    static {
        register(this, {
            properties: {
                'on-activate': ['jsobject', 'rw'],
            },
        });
    }

    constructor(props: SwitchProps<Attr> = {}) {
        super(props as Gtk.Switch.ConstructorProperties);
        this.connect('activate', this.on_activate.bind(this));
    }

    get on_activate() { return this._get('on-activate') || (() => false); }
    set on_activate(callback: (self: this) => void) { this._set('on-activate', callback); }
}
