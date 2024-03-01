import Gtk from 'gi://Gtk?version=4.0';
import Gdk from 'gi://Gdk?version=4.0';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { timeout, readFileAsync } from './utils.js';
import { loadInterfaceXML } from './utils.js';

import S from './service.js';
import V from './variable.js';
import * as W from './widget.js';
import * as U from './utils.js';

declare global {
    const App: App;
    const Widget: typeof W;
    const Service: typeof S;
    const Variable: typeof V;
    const Utils: typeof U;
}

const AstalIFace = (bus: string) =>
    loadInterfaceXML(pkg.name)?.replace('@BUS@', bus);

export interface Config {
    windows?: Gtk.Window[] | (() => Gtk.Window[])
    style?: string
    icons?: string
    gtkTheme?: string
    iconTheme?: string
    cursorTheme?: string
    closeWindowDelay?: { [key: string]: number }

    onWindowToggled?: (windowName: string, visible: boolean) => void
    onConfigParsed?: (app: App) => void
}

export class App extends Gtk.Application {
    static {
        S.register(this, {
            'window-toggled': ['string', 'boolean'],
            'config-parsed': [],
        });
    }

    private _dbus!: Gio.DBusExportedObject;
    private _cssProviders: Gtk.CssProvider[] = [];
    private _objectPath!: string;
    private _windows: Map<string, Gtk.Window> = new Map();
    private _configPath!: string;
    private _configDir!: string;

    private _closeWindowDelay: Config['closeWindowDelay'] = {};
    get closeWindowDelay() { return this._closeWindowDelay!; }
    set closeWindowDelay(v) { this._closeWindowDelay = v; }

    get windows() { return [...this._windows.values()]; }
    get configPath() { return this._configPath; }
    get configDir() { return this._configDir; }

    set iconTheme(name: string) { Gtk.Settings.get_default()!.gtkIconThemeName = name; }
    get iconTheme() { return Gtk.Settings.get_default()!.gtkIconThemeName || ''; }

    set cursorTheme(name: string) { Gtk.Settings.get_default()!.gtkCursorThemeName = name; }
    get cursorTheme() { return Gtk.Settings.get_default()!.gtkCursorThemeName || ''; }

    set gtkTheme(name: string) { Gtk.Settings.get_default()!.gtkThemeName = name; }
    get gtkTheme() { return Gtk.Settings.get_default()!.gtkThemeName || ''; }

    readonly resetCss = () => {
        const display = Gdk.Display.get_default();
        if (!display)
            return console.error("couldn't get display");

        this._cssProviders.forEach(provider => {
            Gtk.StyleContext.remove_provider_for_display(display, provider);
        });

        this._cssProviders = [];
    };

    readonly applyCss = (pathOrStyle: string, reset = false) => {
        const display = Gdk.Display.get_default();
        if (!display)
            return console.error("couldn't get display");

        if (reset)
            this.resetCss();

        const cssProvider = new Gtk.CssProvider();

        try {
            if (GLib.file_test(pathOrStyle, GLib.FileTest.EXISTS))
                cssProvider.load_from_path(pathOrStyle);
            else
                cssProvider.load_from_string(pathOrStyle);
        } catch (err) {
            logError(err);
        }

        Gtk.StyleContext.add_provider_for_display(
            display,
            cssProvider,
            Gtk.STYLE_PROVIDER_PRIORITY_USER,
        );

        this._cssProviders.push(cssProvider);
    };

    readonly addIcons = (path: string) => {
        const display = Gdk.Display.get_default();
        if (!display)
            return console.error("couldn't get display");

        Gtk.IconTheme.get_for_display(display).add_search_path(path);
    };

    setup(bus: string, path: string, configDir: string, entry: string) {
        this.applicationId = bus;
        this.flags = Gio.ApplicationFlags.DEFAULT_FLAGS;
        this._objectPath = path;

        this._configDir = configDir;
        this._configPath = entry;
    }

    vfunc_activate() {
        this.hold();

        Object.assign(globalThis, {
            Widget: W,
            Service: S,
            Variable: V,
            Utils: U,
            App: this,
        });

        this._register();
        this._load();
    }

    readonly connect = (signal = 'window-toggled', callback: (_: this, ...args: any[]) => void) => {
        return super.connect(signal, callback);
    };

    readonly toggleWindow = (name: string) => {
        const w = this.getWindow(name);
        if (w)
            w.visible ? this.closeWindow(name) : this.openWindow(name);
        else
            return 'There is no window named ' + name;
    };

    readonly openWindow = (name: string) => {
        this.getWindow(name)?.show();
    };

    readonly closeWindow = (name: string) => {
        const w = this.getWindow(name);
        if (!w || !w.visible)
            return;

        const delay = this.closeWindowDelay[name];
        if (delay && w.visible) {
            timeout(delay, () => w.hide());
            this.emit('window-toggled', name, false);
        }
        else {
            w.hide();
        }
    };

    readonly getWindow = (name: string) => {
        const w = this._windows.get(name);
        if (!w)
            console.error(Error(`There is no window named ${name}`));

        return w;
    };

    readonly removeWindow = (w: Gtk.Window | string) => {
        const name = typeof w === 'string' ? w : w.name || 'gtk-layer-shell';

        const win = this._windows.get(name);
        if (!win) {
            console.error(Error('There is no window named ' + name));
            return;
        }

        win.destroy();
        this._windows.delete(name);
    };

    readonly addWindow = (w: Gtk.Window) => {
        if (!(w instanceof Gtk.Window)) {
            return console.error(Error(`${w} is not an instanceof Gtk.Window, ` +
                ` but it is of type ${typeof w}`));
        }

        if (!w.name)
            return console.error(Error(`${w} has no name`));

        w.connect('notify::visible',
            () => this.emit('window-toggled', w.name, w.visible));

        if (this._windows.has(w.name)) {
            console.error(Error('There is already a window named' + w.name));
            this.quit();
            return;
        }

        this._windows.set(w.name, w);
    };

    readonly quit = () => super.quit();

    readonly config = (config: Config) => {
        const {
            windows,
            closeWindowDelay,
            style,
            icons,
            gtkTheme,
            iconTheme,
            cursorTheme,
            onConfigParsed,
            onWindowToggled,
        } = config;

        if (closeWindowDelay)
            this.closeWindowDelay = closeWindowDelay;

        if (gtkTheme)
            this.gtkTheme = gtkTheme;

        if (iconTheme)
            this.iconTheme = iconTheme;

        if (cursorTheme)
            this.cursorTheme = cursorTheme;

        if (style) {
            this.applyCss(style.startsWith('.')
                ? `${this.configDir}${style.slice(1)}`
                : style);
        }

        if (icons) {
            this.addIcons(icons.startsWith('.')
                ? `${this.configDir}${icons.slice(1)}`
                : icons);
        }

        if (typeof onWindowToggled === 'function')
            this.connect('window-toggled', (_, n, v) => onWindowToggled!(n, v));

        if (typeof onConfigParsed === 'function')
            this.connect('config-parsed', onConfigParsed);

        if (typeof windows === 'function')
            windows().forEach(this.addWindow);

        if (Array.isArray(windows))
            windows.forEach(this.addWindow);
    };

    private async _load() {
        try {
            const entry = await import(`file://${this.configPath}`);
            const config = entry.default as Config;
            if (!config)
                return this.emit('config-parsed');

            this.config(config);
            this.emit('config-parsed');
        } catch (err) {
            const error = err as { name?: string, message: string };
            const msg = `Unable to load file from: file://${this._configPath}`;
            if (error?.name === 'ImportError' && error.message.includes(msg)) {
                print(`config file not found: "${this._configPath}"`);
                this.quit();
            } else {
                logError(err);
            }
        }
    }

    private _register() {
        Gio.bus_own_name(
            Gio.BusType.SESSION,
            this.applicationId!,
            Gio.BusNameOwnerFlags.NONE,
            (connection: Gio.DBusConnection) => {
                this._dbus = Gio.DBusExportedObject
                    .wrapJSObject(AstalIFace(this.applicationId!) as string, this);

                this._dbus.export(connection, this._objectPath);
            },
            null,
            null,
        );
    }

    toJSON() {
        return {
            bus: this.applicationId,
            configDir: this.configDir,
            windows: Object.fromEntries(this.windows.entries()),
        };
    }

    RunJs(js: string, clientBusName?: string, clientObjPath?: string) {
        let fn;

        const dbus = (method: 'Return' | 'Print') => (out: unknown) => Gio.DBus.session.call(
            clientBusName!, clientObjPath!, clientBusName!, method,
            new GLib.Variant('(s)', [`${out}`]),
            null, Gio.DBusCallFlags.NONE, -1, null, null,
        );

        const response = dbus('Return');
        const print = dbus('Print');
        const client = clientBusName && clientObjPath;

        try {
            fn = Function(`return (async function(print) {
                ${js.includes(';') ? js : `return ${js}`}
            })`);
        } catch (error) {
            client ? response(error) : logError(error);
            return;
        }

        fn()(print)
            .then((out: unknown) => {
                client ? response(`${out}`) : print(`${out}`);
            })
            .catch((err: Error) => {
                client ? response(`${err}`) : logError(err);
            });
    }

    RunFile(file: string, bus?: string, path?: string) {
        readFileAsync(file)
            .then(content => {
                if (content.startsWith('#!'))
                    content = content.split('\n').slice(1).join('\n');

                this.RunJs(content, bus, path);
            })
            .catch(logError);
    }

    ToggleWindow(name: string) {
        this.toggleWindow(name);
        return `${this.getWindow(name)?.visible}`;
    }

    Inspector() { Gtk.Window.set_interactive_debugging(true); }

    Quit() { this.quit(); }
}

export const app = new App;
export default app;
