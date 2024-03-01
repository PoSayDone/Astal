import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';
import Cairo from 'gi://cairo?version=1.0';

type Draw<Self> = (self: Self, cr: Cairo.Context, width: number, height: number) => void
type Resize<Self> = (self: Self, width: number, height: number) => void

export type DrawingAreaProps<
    Attr = unknown,
    Self = DrawingArea<Attr>,
> = BaseProps<Self, Gtk.DrawingArea.ConstructorProperties & {
    draw_fn?: Draw<Self>
    on_resize?: Resize<Self>
}, Attr>;

export function newDrawingArea<
    Attr = unknown
>(...props: ConstructorParameters<typeof DrawingArea<Attr>>) {
    return new DrawingArea(...props);
}

export interface DrawingArea<Attr> extends Widget<Attr> { }
export class DrawingArea<Attr> extends Gtk.DrawingArea {
    static {
        register(this, {
            properties: {
                'draw-fn': ['jsobject', 'rw'],
                'on-resize': ['jsobject', 'rw'],
            },
        });
    }

    constructor(props: DrawingAreaProps<Attr> = {}) {
        super(props as Gtk.DrawingArea.ConstructorProperties);
        this.connect('resize', this.on_resize.bind(this));
    }

    get on_resize() { return this._get('on-resize') || (() => false); }
    set on_resize(callback: Resize<this>) { this._set('on-resize', callback); }

    get draw_fn() { return this._get('draw') || (() => undefined); }
    set draw_fn(fn: Draw<this>) {
        this.set_draw_func(fn as Gtk.DrawingAreaDrawFunc);
        this._set('draw', fn);
    }
}
