import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';

const POSITION = {
    'left': Gtk.PositionType.LEFT,
    'right': Gtk.PositionType.RIGHT,
    'top': Gtk.PositionType.TOP,
    'bottom': Gtk.PositionType.BOTTOM,
} as const;

type Position = keyof typeof POSITION;

export type PopoverProps<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
    Self = Popover<Child, Attr>,
> = BaseProps<Self, Gtk.Popover.ConstructorProperties & {
    child?: Child
    on_closed?: (self: Self) => boolean
    xoffset?: number
    yoffset?: number
    popover_position?: Position
    point_to?: {
        x?: number
        y?: number
        width?: number
        height?: number
    }
}, Attr>;

export function newPopover<
    Child extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
>(...props: ConstructorParameters<typeof Popover<Child, Attr>>) {
    return new Popover(...props);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Popover<Child, Attr> extends Widget<Attr> { }
export class Popover<Child extends Gtk.Widget, Attr> extends Gtk.Popover {
    static {
        register(this, {
            properties: {
                'on-closed': ['jsobject', 'rw'],
                'xoffset': ['int', 'rw'],
                'yoffset': ['int', 'rw'],
                'point-to': ['int', 'rw'],
                'popover-position': ['jsobject', 'rw'],
            },
        });
    }

    constructor(props: PopoverProps<Child, Attr> = {}, child?: Child) {
        if (child)
            props.child = child;

        super(props as Gtk.Popover.ConstructorProperties);
        this.connect('closed', this.on_closed.bind(this));
    }

    get child() { return super.child as Child; }
    set child(child: Child) { super.child = child; }

    get on_closed() { return this._get('on-closed') || (() => false); }
    set on_closed(callback: (self: this) => void) { this._set('on-closed', callback); }

    get yoffset() { return this.get_offset()[1]; }
    set yoffset(y: number) { this.set_offset(this.xoffset, y); }

    get xoffset() { return this.get_offset()[0]; }
    set xoffset(x: number) { this.set_offset(x, this.yoffset); }

    get point_to() {
        const { x, y, width, height } = this.pointingTo;
        return { x, y, width, height };
    }

    set point_to({ x, y, width, height }) {
        const rect = new Gdk.Rectangle;
        rect.x = x ?? this.point_to.x;
        rect.y = y ?? this.point_to.y;
        rect.width = width ?? this.point_to.width;
        rect.height = height ?? this.point_to.height;
        this.pointingTo = rect;
    }

    get popover_position() {
        return Object.entries(POSITION).find((_, pos) => {
            pos === this.position;
        })![0] as Position;
    }

    set popover_position(pos: Position) {
        this.position = POSITION[pos];
    }
}
