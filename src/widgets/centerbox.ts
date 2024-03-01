import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';

export type CenterBoxProps<
    StartWidget extends Gtk.Widget = Gtk.Widget,
    CenterWidget extends Gtk.Widget = Gtk.Widget,
    EndWidget extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
    Self = CenterBox<StartWidget, CenterWidget, EndWidget, Attr>,
> = BaseProps<Self, Gtk.CenterBox.ConstructorProperties & {
    vertical?: boolean
    children?: [StartWidget?, CenterWidget?, EndWidget?]
    start_widget?: StartWidget
    center_widget?: CenterWidget
    end_widget?: EndWidget
}, Attr>;

export function newCenterBox<
    StartWidget extends Gtk.Widget = Gtk.Widget,
    CenterWidget extends Gtk.Widget = Gtk.Widget,
    EndWidget extends Gtk.Widget = Gtk.Widget,
    Attr = unknown,
>(...props: ConstructorParameters<typeof CenterBox<StartWidget, CenterWidget, EndWidget, Attr>>) {
    return new CenterBox(...props);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CenterBox<StartWidget, CenterWidget, EndWidget, Attr> extends Widget<Attr> { }
export class CenterBox<
    StartWidget extends Gtk.Widget,
    CenterWidget extends Gtk.Widget,
    EndWidget extends Gtk.Widget,
    Attr
> extends Gtk.CenterBox {
    static {
        register(this, {
            properties: {
                'vertical': ['boolean', 'rw'],
            },
        });
    }

    constructor(
        props: CenterBoxProps<StartWidget, CenterWidget, EndWidget, Attr> = {},
        startWidget?: StartWidget,
        centerWidget?: CenterWidget,
        endWidget?: EndWidget,
    ) {
        if (startWidget)
            props.startWidget = startWidget;

        if (centerWidget)
            props.centerWidget = centerWidget;

        if (endWidget)
            props.endWidget = endWidget;

        super(props as Gtk.Widget.ConstructorProperties);
        this.connect('notify::orientation', () => this.notify('vertical'));
    }

    get start_widget() { return super.startWidget as StartWidget; }
    get center_widget() { return super.centerWidget as CenterWidget; }
    get end_widget() { return super.endWidget as EndWidget; }

    get vertical() {
        return this.orientation === Gtk.Orientation.VERTICAL;
    }

    set vertical(v: boolean) {
        this.orientation = Gtk.Orientation[v ? 'VERTICAL' : 'HORIZONTAL'];
    }
}
