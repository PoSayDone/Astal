import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';
import GLib from 'gi://GLib?version=2.0';
import { lookUpIcon } from '../utils.js';

// TODO: Paintable
type Ico = string

export type IconProps<
    Attr = unknown,
    Self = Icon<Attr>,
> = BaseProps<Self, Gtk.Image.ConstructorProperties & {
    icon?: Ico
}, Attr>

export function newIcon<
    Attr = unknown
>(...props: ConstructorParameters<typeof Icon<Attr>>) {
    return new Icon(...props);
}

export interface Icon<Attr> extends Widget<Attr> { }
export class Icon<Attr> extends Gtk.Image {
    static {
        register(this, {
            properties: {
                'icon': ['string', 'rw'],
            },
        });
    }

    constructor(props: IconProps<Attr> | Ico = {}) {
        const p = typeof props === 'string' ? { icon: props } : props;
        super(p as Gtk.Image.ConstructorProperties);
    }

    get icon(): Ico { return this._get('icon') || ''; }
    set icon(icon: Ico) {
        if (typeof icon === 'string') {
            this._set('icon', icon);
            if (GLib.file_test(icon, GLib.FileTest.EXISTS)) {
                this.file = icon;
            }
            else if (lookUpIcon(icon)) {
                this.iconName = icon;
            }
            else if (icon !== '') {
                console.warn(Error(`can't assign "${icon}" as icon, ` +
                    'it is not a file nor a named icon'));
            }
        }
    }
}
