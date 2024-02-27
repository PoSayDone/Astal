import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { loadInterfaceXML } from './utils.js';
import { type AstalProxy } from './dbus/types.js';

const AstalIFace = (bus: string) =>
    loadInterfaceXML(pkg.name)!.replace('@BUS@', bus);

const ClientIFace = (bus: string) =>
    loadInterfaceXML(`${pkg.name}.client`)!.replace('@BUS@', bus);

const TIME = `${GLib.DateTime.new_now_local().to_unix()}`;

interface Flags {
    busName: string
    inspector: boolean
    runJs: string
    runFile: string
    toggleWindow: string
    quit: boolean
}

class Client extends Gtk.Application {
    static { GObject.registerClass(this); }

    private _objectPath: string;
    private _dbus!: Gio.DBusExportedObject;
    private _proxy: AstalProxy;
    private _callback!: () => void;

    constructor(bus: string, path: string, proxy: AstalProxy) {
        super({
            applicationId: bus + '.client' + TIME,
            flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
        });

        this._objectPath = path + '/client' + TIME;
        this._proxy = proxy;
    }

    private _register() {
        Gio.bus_own_name(
            Gio.BusType.SESSION,
            this.applicationId!,
            Gio.BusNameOwnerFlags.NONE,
            (connection: Gio.DBusConnection) => {
                this._dbus = Gio.DBusExportedObject
                    .wrapJSObject(ClientIFace(this.applicationId!) as string, this);

                this._dbus.export(connection, this._objectPath);
            },
            null,
            null,
        );
    }

    Return(str: string) {
        print(str);
        this.quit();
    }

    Print(str: string) {
        print(str);
    }

    remote(method: 'Js' | 'File', body: string) {
        this._callback = () => this._proxy[`Run${method}Remote`](
            body,
            this.applicationId!,
            this._objectPath,
        );
        this.run(null);
    }

    vfunc_activate(): void {
        this.hold();
        this._register();
        this._callback();
    }
}

export default function(bus: string, path: string, flags: Flags) {
    const Proxy = Gio.DBusProxy.makeProxyWrapper(AstalIFace(bus));
    const proxy = Proxy(Gio.DBus.session, bus, path) as AstalProxy;
    const client = new Client(bus, path, proxy);

    if (flags.toggleWindow)
        print(proxy.ToggleWindowSync(flags.toggleWindow));

    else if (flags.runJs)
        client.remote('Js', flags.runJs);

    else if (flags.runFile)
        client.remote('File', flags.runFile);

    else if (flags.inspector)
        proxy.InspectorRemote();

    else if (flags.quit)
        proxy.QuitRemote();

    else
        print(`instance with busname "${flags.busName}" is already running`);
}
