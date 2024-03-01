import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';

export type OverlayProps<
    Child extends Gtk.Widget = Gtk.Widget,
    OverlayChild extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
    Self = Overlay<Child, OverlayChild, Attr>,
> = BaseProps<Self, Gtk.Overlay.ConstructorProperties & {
    clip_overlays?: boolean
    measuere_overlays?: boolean
    overlays?: OverlayChild[]
    overlay?: OverlayChild
    child?: Child
}, Attr>

export function newOverlay<
    Child extends Gtk.Widget = Gtk.Widget,
    OverlayChild extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
>(...props: ConstructorParameters<typeof Overlay<Child, OverlayChild, Attr>>) {
    return new Overlay(...props);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Overlay<Child, OverlayChild, Attr> extends Widget<Attr> { }
export class Overlay<
    Child extends Gtk.Widget,
    OverlayChild extends Gtk.Widget,
    Attr
> extends Gtk.Overlay {
    static {
        register(this, {
            properties: {
                'clip-overlays': ['boolean', 'rw'],
                'measure-overlays': ['boolean', 'rw'],
                'overlays': ['jsobject', 'rw'],
                'overlay': ['jsobject', 'rw'],
            },
        });
    }

    constructor(
        props: OverlayProps<Child, OverlayChild, Attr> = {},
        child?: Child,
        ...overlays: Gtk.Widget[]
    ) {
        if (child)
            props.child = child;

        if (overlays.length > 0)
            props.overlays = overlays as OverlayChild[];

        super(props as Gtk.Overlay.ConstructorProperties);
    }

    get clip_overlays() { return !!this._get('clip-overlays'); }
    set clip_overlays(clip: boolean) {
        this.overlays.forEach(ch => this.set_clip_overlay(ch, clip));
        this._set('clip-overlays', clip);
    }

    get measure_overlays() { return !!this._get('measure-overlays'); }
    set measure_overlays(measure: boolean) {
        this.overlays.forEach(ch => this.set_measure_overlay(ch, measure));
        this._set('measure-overlays', measure);
    }

    get child() { return super.child as Child; }
    set child(child: Child) { super.child = child; }

    get overlay() { return this.overlays[0]; }
    set overlay(overlay: OverlayChild) {
        this.overlays = [overlay];
        this.notify('overlay');
    }

    get overlays() {
        const children = [];
        let widget = this.get_first_child();
        while (widget) {
            children.push(widget);
            widget = widget.get_next_sibling();
        }
        return children as OverlayChild[];
    }

    set overlays(overlays: OverlayChild[]) {
        for (const widget of this.overlays)
            this.remove_overlay(widget);

        for (const widget of overlays) {
            this.add_overlay(widget);
            this.set_clip_overlay(widget, this.clip_overlays);
            this.set_measure_overlay(widget, this.measure_overlays);
        }

        this.notify('overlays');
    }
}
