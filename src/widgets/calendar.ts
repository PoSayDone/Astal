import { register, type BaseProps, type Widget } from './widget.js';
import Gtk from 'gi://Gtk?version=4.0';

export type CalendarProps<
    Attr = unknown,
    Self = Calendar<Attr>,
> = BaseProps<Self, Gtk.Calendar.ConstructorProperties, Attr>;

export function newCalendar<Attr = unknown>(props?: CalendarProps<Attr>) {
    return new Calendar(props);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Calendar<Attr> extends Widget<Attr> { }
export class Calendar<Attr> extends Gtk.Calendar {
    static {
        register(this, {
            properties: {
                'date': ['jsobject', 'r'],
            },
        });
    }

    constructor(props: CalendarProps<Attr> = {}) {
        super(props as Gtk.Calendar.ConstructorProperties);
        this.connect('notify::day', () => this.notify('date'));
        this.connect('notify::month', () => this.notify('date'));
        this.connect('notify::year', () => this.notify('date'));
    }

    get date() { return this.get_date(); }
}
