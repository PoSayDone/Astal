import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import { Props, BindableProps, Binding, Connectable } from '../service.js';
import { registerGObject, kebabify, type CtorProps } from '../utils/gobject.js';

const ALIGN = {
    'fill': Gtk.Align.FILL,
    'start': Gtk.Align.START,
    'end': Gtk.Align.END,
    'center': Gtk.Align.CENTER,
    'baseline': Gtk.Align.BASELINE,
} as const;

type Align = keyof typeof ALIGN;

// type Keys = {
//     [K in keyof typeof Gdk as K extends `KEY_${infer U}` ? U : never]: number;
// };
//
// type ModifierKey = {
//     [K in keyof typeof Gdk.ModifierType as K extends `${infer M}_MASK` ? M : never]: number
// }

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
    css: string
    hpack: Align
    vpack: Align
    cursor_name: Cursor
    attribute: Attr
}

/* eslint-disable max-len */
interface EventHandlers<Self> {
    on_focus_enter: (self: Self, controller: Gtk.EventControllerFocus) => boolean | undefined,
    on_focus_leave: (self: Self, controller: Gtk.EventControllerFocus) => boolean | undefined,
    on_key_pressed: (self: Self, key: { val: number, code: number, mod: Gdk.ModifierType }, controller: Gtk.EventControllerKey) => boolean | undefined,
    on_key_released: (self: Self, key: { val: number, code: number, mod: Gdk.ModifierType }, controller: Gtk.EventControllerKey) => boolean | undefined,
    on_key_modifier: (self: Self, mod: Gdk.ModifierType, controller: Gtk.EventControllerKey) => boolean | undefined,
    on_legacy: (self: Self, event: Gdk.Event, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_click: (self: Self, event: { button: number, mod: Gdk.ModifierType, event: Gdk.Event }, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_click_release: (self: Self, event: { button: number, mod: Gdk.ModifierType, event: Gdk.Event }, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_primary_click: (self: Self, event: Gdk.Event, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_primary_click_release: (self: Self, event: Gdk.Event, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_middle_click: (self: Self, event: Gdk.Event, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_middle_click_release: (self: Self, event: Gdk.Event, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_secondary_click: (self: Self, event: Gdk.Event, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_secondary_click_release: (self: Self, event: Gdk.Event, controller: Gtk.EventControllerLegacy) => boolean | undefined,
    on_motion: (self: Self, positon: { x: number, y: number }, controller: Gtk.EventControllerMotion) => boolean | undefined,
    on_hover_leave: (self: Self, controller: Gtk.EventControllerMotion) => boolean | undefined,
    on_hover_enter: (self: Self, positon: { x: number, y: number }, controller: Gtk.EventControllerMotion) => boolean | undefined,
    on_scroll: (self: Self, delta: { x: number, y: number }, controller: Gtk.EventControllerScroll) => boolean | undefined,
    on_scroll_begin: (self: Self, controller: Gtk.EventControllerScroll) => boolean | undefined,
    on_scroll_end: (self: Self, controller: Gtk.EventControllerScroll) => boolean | undefined,
    on_scroll_up: (self: Self, delta: { x: number, y: number }, controller: Gtk.EventControllerScroll) => boolean | undefined,
    on_scroll_down: (self: Self, delta: { x: number, y: number }, controller: Gtk.EventControllerScroll) => boolean | undefined,
    on_scroll_right: (self: Self, delta: { x: number, y: number }, controller: Gtk.EventControllerScroll) => boolean | undefined,
    on_scroll_left: (self: Self, delta: { x: number, y: number }, controller: Gtk.EventControllerScroll) => boolean | undefined,
    on_scroll_decelerate: (self: Self, velocity: { x: number, y: number }, controller: Gtk.EventControllerScroll) => boolean | undefined,
}

type Optional<T> = { [K in keyof T]?: T[K] };
export type BaseProps<Self, Props, Attr = unknown> = {
    setup?: (self: Self) => void
} & BindableProps<CtorProps<Props & Optional<CommonProps<Attr> & EventHandlers<Self>>>>

export interface Widget<Attr> extends Required<CommonProps<Attr>> {
    on_focus_enter: EventHandlers<this>['on_focus_enter']
    on_focus_leave: EventHandlers<this>['on_focus_leave']
    on_key_pressed: EventHandlers<this>['on_key_pressed']
    on_key_released: EventHandlers<this>['on_key_released']
    on_key_modifier: EventHandlers<this>['on_key_modifier']
    on_legacy: EventHandlers<this>['on_legacy']
    on_click: EventHandlers<this>['on_click']
    on_primary_click: EventHandlers<this>['on_primary_click']
    on_primary_click_release: EventHandlers<this>['on_primary_click_release']
    on_middle_click: EventHandlers<this>['on_middle_click']
    on_middle_click_release: EventHandlers<this>['on_middle_click_release']
    on_secondary_click: EventHandlers<this>['on_secondary_click']
    on_secondary_click_release: EventHandlers<this>['on_secondary_click_release']
    on_motion: EventHandlers<this>['on_motion']
    on_hover_leave: EventHandlers<this>['on_hover_leave']
    on_hover_enter: EventHandlers<this>['on_hover_enter']
    on_scroll: EventHandlers<this>['on_scroll']
    on_scroll_begin: EventHandlers<this>['on_scroll_begin']
    on_scroll_end: EventHandlers<this>['on_scroll_end']
    on_scroll_up: EventHandlers<this>['on_scroll_up']
    on_scroll_down: EventHandlers<this>['on_scroll_down']
    on_scroll_right: EventHandlers<this>['on_scroll_right']
    on_scroll_left: EventHandlers<this>['on_scroll_left']
    on_scroll_decelerate: EventHandlers<this>['on_scroll_decelerate']

    hook(
        gobject: Connectable,
        callback: (self: this, ...args: any[]) => void,
        signal?: string,
    ): this

    readonly is_destroyed: boolean

    _handleParamProp(prop: keyof this, value: any): void
    _get<T>(field: string): T;
    _set<T>(field: string, value: T, notify?: boolean): void
    _focusController(): Gtk.EventControllerFocus
    _keyController(): Gtk.EventControllerKey
    _legacyController(): Gtk.EventControllerLegacy
    _scrollController(): Gtk.EventControllerScroll
    _motionController(): Gtk.EventControllerMotion

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

        return this;
    }

    _init(config: BaseProps<this, Gtk.Widget.ConstructorProperties, Attr> = {}) {
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

        super._init(props as Gtk.Widget.ConstructorProperties);

        if (attribute !== undefined)
            this._set('attribute', attribute);

        (binds as unknown as Array<[keyof Props<this>, Binding<any, any, any>]>)
            .forEach(([selfProp, { emitter, prop, transformFn }]) => {
                this.hook(emitter, () => {
                    this[selfProp] = transformFn(emitter[prop]);
                }, `notify::${kebabify(prop)}`);
            });

        this.connect('destroy', () => this._set('is-destroyed', true));
        setup?.(this);
    }

    _handleParamProp(selfProp: keyof this, value: any) {
        if (value === undefined)
            return;

        if (value instanceof Binding) {
            const { prop, emitter, transformFn } = value;
            this[selfProp] = transformFn(emitter[prop]);
            this.hook(emitter, () => {
                this[selfProp] = transformFn(emitter[prop]);
            }, `notify::${kebabify(value.prop)}`);
        }
        else {
            this[selfProp] = value;
        }
    }

    get is_destroyed(): boolean { return this._get('is-destroyed') || false; }

    // defining private fields for typescript causes
    // gobject constructor field setters to be overridden
    // so we use this _get and _set to avoid @ts-expect-error everywhere
    _get<T>(field: string) {
        // @ts-expect-error
        return this[`__${field}`] as T;
    }

    _set<T>(field: string, value: T, notify = true) {
        if (this._get(field) === value)
            return;

        // @ts-expect-error
        this[`__${field}`] = value;

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
        this[`${condition ? 'add' : 'remove'}_css_class`](className);
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

    get cursor_name() { return this.cursor.name as Cursor; }
    set cursor_name(cursor: Cursor) { this.cursor = new Gdk.Cursor({ name: cursor }); }

    // TODO: click_through

    _focusController() {
        if (this._get('focus-controller'))
            return this._get<Gtk.EventControllerFocus>('focus-controller');

        const controller = new Gtk.EventControllerFocus;
        this.add_controller(controller);
        this._set('focus-controller', controller, false);
        controller.connect('enter', () =>
            this.on_focus_enter(this, controller),
        );
        controller.connect('leave', () =>
            this.on_focus_leave(this, controller),
        );
        return controller;
    }

    get on_focus_enter() { return this._get('on-focus-enter') || (() => false); }
    set on_focus_enter(callback: EventHandlers<this>['on_focus_enter']) {
        this._focusController();
        this._set('on-focus-enter', callback);
    }

    get on_focus_leave() { return this._get('on-focus-leave') || (() => false); }
    set on_focus_leave(callback: EventHandlers<this>['on_focus_leave']) {
        this._focusController();
        this._set('on-focus-leave', callback);
    }

    _keyController() {
        if (this._get('key-controller'))
            return this._get<Gtk.EventControllerKey>('key-controller');

        const controller = new Gtk.EventControllerKey;
        this.add_controller(controller);
        this._set('key-controller', controller, false);
        controller.connect('key-pressed', (_, val, code, mod) => {
            return this.on_key_pressed(this, { val, code, mod }, controller);
        });
        controller.connect('key-released', (_, val, code, mod) => {
            return this.on_key_released(this, { val, code, mod }, controller);
        });
        controller.connect('modifiers', (_, mod) => {
            return this.on_key_modifier(this, mod, controller);
        });
        return controller;
    }

    get on_key_pressed() { return this._get('on-key-pressed') || (() => false); }
    set on_key_pressed(callback: EventHandlers<this>['on_key_pressed']) {
        this._keyController();
        this._set('on-key-pressed', callback);
    }

    get on_key_released() { return this._get('on-key-released') || (() => false); }
    set on_key_released(callback: EventHandlers<this>['on_key_released']) {
        this._keyController();
        this._set('on-key-released', callback);
    }

    get on_key_modifier() { return this._get('on-key-modifier') || (() => false); }
    set on_key_modifier(callback: EventHandlers<this>['on_key_modifier']) {
        this._keyController();
        this._set('on-key-modifier', callback);
    }

    _legacyController() {
        if (this._get('legacy-controller'))
            return this._get<Gtk.EventControllerLegacy>('legacy-controller');

        const controller = new Gtk.EventControllerLegacy;
        this.add_controller(controller);
        this._set('legacy-controller', controller, false);
        controller.connect('event', (_, e: Gdk.Event) => {
            const btnPress = e.get_event_type() === Gdk.EventType.BUTTON_PRESS;
            const btnRelease = e.get_event_type() === Gdk.EventType.BUTTON_RELEASE;
            const mod = e.get_modifier_state();
            let handled: boolean | undefined = false;

            handled ||= this.on_legacy(this, e, controller);

            if (btnPress) {
                const button = (e as Gdk.ButtonEvent).get_button();
                handled ||= this.on_click(this, { button, mod, event: e }, controller);

                if (button === 1)
                    handled ||= this.on_primary_click(this, e, controller);

                else if (button === 2)
                    handled ||= this.on_middle_click(this, e, controller);

                else if (button === 3)
                    handled ||= this.on_secondary_click(this, e, controller);
            }

            if (btnRelease) {
                const button = (e as Gdk.ButtonEvent).get_button();
                handled ||= this.on_click_release(this, { button, mod, event: e }, controller);

                if (button === 1)
                    handled ||= this.on_primary_click_release(this, e, controller);

                else if (button === 2)
                    handled ||= this.on_middle_click_release(this, e, controller);

                else if (button === 3)
                    handled ||= this.on_secondary_click_release(this, e, controller);
            }

            return handled;
        });
        return controller;
    }

    get on_legacy() { return this._get('on-legacy') || (() => false); }
    set on_legacy(callback: EventHandlers<this>['on_legacy']) {
        this._legacyController();
        this._set('on-legacy', callback);
    }

    get on_click() { return this._get('on-click') || (() => false); }
    set on_click(callback: EventHandlers<this>['on_click']) {
        this._legacyController();
        this._set('on-click', callback);
    }

    get on_click_release() { return this._get('on-click-release') || (() => false); }
    set on_click_release(callback: EventHandlers<this>['on_click_release']) {
        this._legacyController();
        this._set('on-click-release', callback);
    }

    get on_primary_click() { return this._get('on-primary-click') || (() => false); }
    set on_primary_click(callback: EventHandlers<this>['on_primary_click']) {
        this._legacyController();
        this._set('on-primary-click', callback);
    }

    get on_primary_click_release() { return this._get('on-primary-click-release') || (() => false); }
    set on_primary_click_release(callback: EventHandlers<this>['on_primary_click_release']) {
        this._legacyController();
        this._set('on-primary-click-release', callback);
    }

    get on_secondary_click() { return this._get('on-secondary-click') || (() => false); }
    set on_secondary_click(callback: EventHandlers<this>['on_secondary_click']) {
        this._legacyController();
        this._set('on-secondary-click', callback);
    }

    get on_secondary_click_release() { return this._get('on-secondary-click-release') || (() => false); }
    set on_secondary_click_release(callback: EventHandlers<this>['on_secondary_click_release']) {
        this._legacyController();
        this._set('on-secondary-click-release', callback);
    }

    get on_middle_click() { return this._get('on-middle-click') || (() => false); }
    set on_middle_click(callback: EventHandlers<this>['on_middle_click']) {
        this._legacyController();
        this._set('on-middle-click', callback);
    }

    get on_middle_click_release() { return this._get('on-middle-click-release') || (() => false); }
    set on_middle_click_release(callback: EventHandlers<this>['on_middle_click_release']) {
        this._legacyController();
        this._set('on-middle-click-release', callback);
    }

    _motionController() {
        if (this._get('motion-controller'))
            return this._get<Gtk.EventControllerMotion>('motion-controller');

        const controller = new Gtk.EventControllerMotion;
        this.add_controller(controller);
        this._set('motion-controller', controller, false);
        controller.connect('motion', (_, x, y) =>
            this.on_motion(this, { x, y }, controller),
        );
        controller.connect('enter', (_, x, y) =>
            this.on_hover_enter(this, { x, y }, controller),
        );
        controller.connect('leave', () =>
            this.on_hover_leave(this, controller),
        );
        return controller;
    }

    get on_motion() { return this._get('on-motion') || (() => false); }
    set on_motion(callback: EventHandlers<this>['on_motion']) {
        this._motionController();
        this._set('on-motion', callback);
    }

    get on_hover_enter() { return this._get('on-hover-enter') || (() => false); }
    set on_hover_enter(callback: EventHandlers<this>['on_hover_enter']) {
        this._motionController();
        this._set('on-hover-enter', callback);
    }

    get on_hover_leave() { return this._get('on-hover-leave') || (() => false); }
    set on_hover_leave(callback: EventHandlers<this>['on_hover_leave']) {
        this._motionController();
        this._set('on-hover-leave', callback);
    }

    _scrollController() {
        if (this._get('scroll-controller'))
            return this._get<Gtk.EventControllerScroll>('scroll-controller');

        const controller = new Gtk.EventControllerScroll;
        this.add_controller(controller);
        this._set('scroll-controller', controller, false);
        controller.set_flags(Gtk.EventControllerScrollFlags.BOTH_AXES);
        controller.connect('scroll', (_, x, y) => {
            let handled: boolean | undefined = false;

            handled ||= this.on_scroll(this, { x, y }, controller);

            if (y < 0)
                handled ||= this.on_scroll_up(this, { x, y }, controller);

            else if (y > 0)
                handled ||= this.on_scroll_down(this, { x, y }, controller);

            if (x < 0)
                handled ||= this.on_scroll_left(this, { x, y }, controller);

            else if (x > 0)
                handled ||= this.on_scroll_right(this, { x, y }, controller);

            return handled;
        });
        controller.connect('scroll-begin', () =>
            this.on_scroll_begin(this, controller),
        );
        controller.connect('scroll-end', () =>
            this.on_scroll_end(this, controller),
        );
        controller.connect('decelerate', (_, x, y) =>
            this.on_scroll_decelerate(this, { x, y }, controller),
        );
        return controller;
    }

    get on_scroll() { return this._get('on-scroll') || (() => false); }
    set on_scroll(callback: EventHandlers<this>['on_scroll']) {
        this._scrollController();
        this._set('on-scroll', callback);
    }

    get on_scroll_begin() { return this._get('on-scroll-begin') || (() => false); }
    set on_scroll_begin(callback: EventHandlers<this>['on_scroll_begin']) {
        this._scrollController();
        this._set('on-scroll-begin', callback);
    }

    get on_scroll_end() { return this._get('on-scroll-end') || (() => false); }
    set on_scroll_end(callback: EventHandlers<this>['on_scroll_end']) {
        this._scrollController();
        this._set('on-scroll-end', callback);
    }

    get on_scroll_up() { return this._get('on-scroll-up') || (() => false); }
    set on_scroll_up(callback: EventHandlers<this>['on_scroll_up']) {
        this._scrollController();
        this._set('on-scroll-up', callback);
    }

    get on_scroll_down() { return this._get('on-scroll-down') || (() => false); }
    set on_scroll_down(callback: EventHandlers<this>['on_scroll_down']) {
        this._scrollController();
        this._set('on-scroll-down', callback);
    }

    get on_scroll_right() { return this._get('on-scroll-right') || (() => false); }
    set on_scroll_right(callback: EventHandlers<this>['on_scroll_right']) {
        this._scrollController();
        this._set('on-scroll-right', callback);
    }

    get on_scroll_left() { return this._get('on-scroll-left') || (() => false); }
    set on_scroll_left(callback: EventHandlers<this>['on_scroll_left']) {
        this._scrollController();
        this._set('on-scroll-left', callback);
    }

    get on_scroll_decelerate() { return this._get('on-scroll-decelerate') || (() => false); }
    set on_scroll_decelerate(callback: EventHandlers<this>['on_scroll_decelerate']) {
        this._scrollController();
        this._set('on-scroll-decelerate', callback);
    }
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
            'css': ['string', 'rw'],
            'hpack': ['string', 'rw'],
            'vpack': ['string', 'rw'],
            'is-destroyed': ['boolean', 'r'],
            'attribute': ['jsobject', 'rw'],

            'on-focus-enter': ['jsobject', 'rw'],
            'on-focus-leave': ['jsobject', 'rw'],
            'on-key-pressed': ['jsobject', 'rw'],
            'on-key-released': ['jsobject', 'rw'],
            'on-key-modifier': ['jsobject', 'rw'],
            'on-legacy': ['jsobject', 'rw'],
            'on-click': ['jsobject', 'rw'],
            'on-click-release': ['jsobject', 'rw'],
            'on-primary-click': ['jsobject', 'rw'],
            'on-primary-click-release': ['jsobject', 'rw'],
            'on-middle-click': ['jsobject', 'rw'],
            'on-middle-click-release': ['jsobject', 'rw'],
            'on-secondary-click': ['jsobject', 'rw'],
            'on-secondary-click-release': ['jsobject', 'rw'],
            'on-motion': ['jsobject', 'rw'],
            'on-hover-leave': ['jsobject', 'rw'],
            'on-hover-enter': ['jsobject', 'rw'],
            'on-scroll': ['jsobject', 'rw'],
            'on-scroll-begin': ['jsobject', 'rw'],
            'on-scroll-end': ['jsobject', 'rw'],
            'on-scroll-up': ['jsobject', 'rw'],
            'on-scroll-down': ['jsobject', 'rw'],
            'on-scroll-right': ['jsobject', 'rw'],
            'on-scroll-left': ['jsobject', 'rw'],
            'on-scroll-decelerate': ['jsobject', 'rw'],
        },
    });
}
