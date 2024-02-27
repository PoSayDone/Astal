import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import GLib from 'gi://GLib?version=2.0';
import { Props, BindableProps, Binding, Connectable } from '../service.js';
import { registerGObject, kebabify, type CtorProps } from '../utils/gobject.js';
import { interval, idle } from '../utils.js';

const ALIGN = {
    'fill': Gtk.Align.FILL,
    'start': Gtk.Align.START,
    'end': Gtk.Align.END,
    'center': Gtk.Align.CENTER,
    'baseline': Gtk.Align.BASELINE,
} as const;

type Align = keyof typeof ALIGN;

type Keys = {
    [K in keyof typeof Gdk as K extends `KEY_${infer U}` ? U : never]: number;
};

type ModifierKey = {
    [K in keyof typeof Gdk.ModifierType as K extends `${infer M}_MASK` ? M : never]: number
}

type Cursor =
    | 'default'
    | 'help'
    | 'pointer'
    | 'context-menu'
    | 'progress'
    | 'wait'
    | 'cell'
    | 'crosshair'
    | 'text'
    | 'vertical-text'
    | 'alias'
    | 'copy'
    | 'no-drop'
    | 'move'
    | 'not-allowed'
    | 'grab'
    | 'grabbing'
    | 'all-scroll'
    | 'col-resize'
    | 'row-resize'
    | 'n-resize'
    | 'e-resize'
    | 's-resize'
    | 'w-resize'
    | 'ne-resize'
    | 'nw-resize'
    | 'sw-resize'
    | 'se-resize'
    | 'ew-resize'
    | 'ns-resize'
    | 'nesw-resize'
    | 'nwse-resize'
    | 'zoom-in'
    | 'zoom-out'

interface CommonProps<Attr> {
    // TODO: click_through?: boolean
    css?: string
    hpack?: Align
    vpack?: Align
    cursorName?: Cursor
    attribute?: Attr
}

export type BaseProps<Self, Props, Attr = unknown> = {
    setup?: (self: Self) => void
} & BindableProps<CtorProps<Props & CommonProps<Attr>>>

type Required<T> = { [K in keyof T]-?: T[K] };
export interface Widget<Attr> extends Required<CommonProps<Attr>> {
    hook(
        gobject: Connectable,
        callback: (self: this, ...args: any[]) => void,
        signal?: string,
    ): this

    bind<
        Prop extends keyof Props<this>,
        GObj extends Connectable,
        ObjProp extends keyof Props<GObj>,
    >(
        prop: Prop,
        gobject: GObj,
        objProp?: ObjProp,
        transform?: (value: GObj[ObjProp]) => this[Prop],
    ): this

    on(
        signal: string,
        callback: (self: this, ...args: any[]) => void
    ): this

    poll(
        timeout: number,
        callback: (self: this) => void,
    ): this

    // keybind<
    //     // eslint-disable-next-line space-before-function-paren
    //     Fn extends (self: this, event: Gdk.Event) => void,
    //     Key extends keyof Keys,
    // >(
    //     key: Key,
    //     callback: Fn,
    // ): this
    //
    // keybind<
    //     // eslint-disable-next-line space-before-function-paren
    //     Fn extends (self: this, event: Gdk.Event) => void,
    //     Key extends keyof Keys,
    //     Mod extends Array<keyof ModifierKey>,
    // >(
    //     mods: Mod,
    //     key: Key,
    //     callback: Fn,
    // ): this,

    readonly is_destroyed: boolean
    _handleParamProp(prop: keyof this, value: any): void
    _get<T>(field: string): T;
    _set<T>(field: string, value: T, notify?: boolean): void

    toggleCssClass(className: string, condition?: boolean): void
}

export class AstalWidget<Attr> extends Gtk.Widget implements Widget<Attr> {
    set attribute(attr: Attr) { this._set('attribute', attr); }
    get attribute(): Attr { return this._get('attribute'); }

    hook(
        gobject: Connectable,
        callback: (self: this, ...args: any[]) => void,
        signal?: string,
    ): this {
        const con = typeof gobject?.connect !== 'function';
        const discon = typeof gobject?.disconnect !== 'function';
        if (con || discon) {
            console.error(Error(`${gobject} is not a Connectable, missing ` +
                ` ${[con ? 'connect' : '', discon ? 'disconnect' : ''].join(', ')} function`));
            return this;
        }

        const id = gobject.connect(signal!, (_, ...args: unknown[]) => {
            callback(this, ...args);
        });

        this.connect('destroy', () => {
            gobject.disconnect(id);
        });

        GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
            if (!this.is_destroyed)
                callback(this);

            return GLib.SOURCE_REMOVE;
        });

        return this;
    }

    bind<
        Prop extends keyof Props<this>,
        GObj extends Connectable,
        ObjProp extends keyof Props<GObj>,
    >(
        prop: Prop,
        gobject: GObj,
        objProp?: ObjProp,
        transform?: (value: GObj[ObjProp]) => this[Prop],
    ): this {
        const targetProp = objProp || 'value';
        const callback = transform
            ? () => {
                // @ts-expect-error too lazy to type
                this[prop] = transform(gobject[targetProp]);
            }
            : () => {
                // @ts-expect-error too lazy to type
                this[prop] = gobject[targetProp];
            };

        this.hook(gobject, callback, `notify::${kebabify(targetProp)}`);
        return this;
    }

    on(signal: string, callback: (self: this, ...args: any[]) => void): this {
        this.connect(signal, callback);
        return this;
    }

    poll(timeout: number, callback: (self: this) => void): this {
        interval(timeout, () => callback(this), this);
        return this;
    }

    // TODO:
    // keybind<
    //     // eslint-disable-next-line space-before-function-paren
    //     Fn extends (self: this, event: Gdk.Event) => void,
    //     Key extends keyof Keys,
    //     Mod extends Array<keyof ModifierKey>,
    // >(
    //     modsOrKey: Key | Mod,
    //     keyOrCallback: Key | Fn,
    //     callback?: Fn,
    // ): this {
    //     const mods = callback ? modsOrKey as Mod : [];
    //     const key = callback ? keyOrCallback as Key : modsOrKey as Key;
    //     const fn = callback ? callback : keyOrCallback as Fn;
    //
    //     this.connect('key-press-event', (_, event: Gdk.Event) => {
    //         const k = event.get_keyval()[1];
    //         const m = event.get_state()[1];
    //         const ms = mods.reduce((ms, m) => ms | Gdk.ModifierType[`${m}_MASK`], 0);
    //         if (mods.length > 0 && k === Gdk[`KEY_${key}`] && m === ms)
    //             return fn(this, event);
    //
    //         if (mods.length === 0 && k === Gdk[`KEY_${key}`])
    //             return fn(this, event);
    //     });
    //
    //     return this;
    // }

    _init(
        config: BaseProps<this,
            Gtk.Widget.ConstructorProperties & { child?: Gtk.Widget },
            Attr> = {},
        child?: Gtk.Widget,
    ) {
        const { setup, attribute, ...props } = config;

        const binds = (Object.keys(props) as Array<keyof typeof props>)
            .map(prop => {
                if (props[prop] instanceof Binding) {
                    const bind = [prop, props[prop]];
                    delete props[prop];
                    return bind;
                }
            })
            .filter(pair => pair);

        if (child)
            props.child = child;

        super._init(props as Gtk.Widget.ConstructorProperties);

        if (attribute !== undefined)
            this._set('attribute', attribute);

        (binds as unknown as Array<[keyof Props<this>, Binding<any, any, any>]>)
            .forEach(([selfProp, { emitter, prop, transformFn }]) => {
                this.bind(selfProp, emitter, prop, transformFn);
            });

        this.connect('destroy', () => this._set('is-destroyed', true));

        if (setup)
            setup(this);
    }

    _handleParamProp<Props>(prop: keyof Props, value: any) {
        if (value === undefined)
            return;

        if (value instanceof Binding)
            // @ts-expect-error implementation in Connectable
            this.bind(prop, value.emitter, value.prop, value.transformFn);
        else
            this[prop as keyof this] = value;
    }

    get is_destroyed(): boolean { return this._get('is-destroyed') || false; }

    // defining private fields for typescript causes
    // gobject constructor field setters to be overridden
    // so we use this _get and _set to avoid @ts-expect-error everywhere
    _get<T>(field: string) {
        return (this as unknown as { [key: string]: unknown })[`__${field}`] as T;
    }

    _set<T>(field: string, value: T, notify = true) {
        if (this._get(field) === value)
            return;

        (this as unknown as { [key: string]: T })[`__${field}`] = value;

        if (notify)
            this.notify(field);
    }

    _setPack(orientation: 'h' | 'v', align: Align) {
        if (!align)
            return;

        if (!Object.keys(ALIGN).includes(align)) {
            return console.error(Error(
                `${orientation}pack has to be on of ${Object.keys(ALIGN)}, but it is ${align}`,
            ));
        }

        this[`${orientation}align`] = ALIGN[align];
    }

    _getPack(orientation: 'h' | 'v') {
        return Object.keys(ALIGN).find(align => {
            return ALIGN[align as Align] === this[`${orientation}align`];
        }) as Align;
    }

    get hpack() { return this._getPack('h'); }
    set hpack(align: Align) { this._setPack('h', align); }

    get vpack() { return this._getPack('v'); }
    set vpack(align: Align) { this._setPack('v', align); }

    toggleCssClass(className: string, condition = true) {
        condition
            ? this.add_css_class(className)
            : this.remove_css_class(className);

        this.notify('ccs-classes');
    }

    _cssProvider!: Gtk.CssProvider;
    get css() { return this._cssProvider?.to_string() || ''; }
    set css(css: string) {
        if (typeof css !== 'string')
            return;

        if (!css.includes('{') || !css.includes('}'))
            css = `* { ${css} }`;

        if (this._cssProvider)
            this.get_style_context().remove_provider(this._cssProvider);

        this._cssProvider = new Gtk.CssProvider();
        this._cssProvider.load_from_string(css);
        this.get_style_context()
            .add_provider(this._cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_USER);

        this.notify('css');
    }

    get cursorName() { return this._get('cursor'); }
    set cursorName(cursor: Cursor) {
        this._set('cursor', cursor);
        this.cursor = new Gdk.Cursor({ name: cursor });
    }

    // TODO:
    // get click_through() { return !!this._get('click-through'); }
    // set click_through(clickThrough: boolean) {
    //     if (this.click_through === clickThrough)
    //         return;
    //
    //     const value = clickThrough ? new Cairo.Region : null;
    //     this.input_shape_combine_region(value);
    //     this._set('click-through', value);
    //     this.notify('click-through');
    // }
}

export function register<T extends { new(...args: any[]): Gtk.Widget }>(
    klass: T,
    config?: Parameters<typeof registerGObject>[1] & { cssName?: string },
) {
    Object.getOwnPropertyNames(AstalWidget.prototype).forEach(name => {
        Object.defineProperty(klass.prototype, name,
            Object.getOwnPropertyDescriptor(AstalWidget.prototype, name) ||
            Object.create(null),
        );
    });
    return registerGObject(klass, {
        cssName: config?.cssName,
        typename: config?.typename || `Astal_${klass.name}`,
        signals: config?.signals,
        properties: {
            ...config?.properties,
            'class-name': ['string', 'rw'],
            'class-names': ['jsobject', 'rw'],
            'css': ['string', 'rw'],
            'hpack': ['string', 'rw'],
            'vpack': ['string', 'rw'],
            'cursor': ['string', 'rw'],
            'is-destroyed': ['boolean', 'r'],
            'attribute': ['jsobject', 'rw'],
            'click-through': ['boolean', 'rw'],
        },
    });
}
