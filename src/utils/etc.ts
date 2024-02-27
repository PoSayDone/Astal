import Gdk from 'gi://Gdk?version=4.0';
import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export function loadInterfaceXML(iface: string) {
    const uri = `resource:///astal/dbus/${iface}.xml`;
    const f = Gio.File.new_for_uri(uri);

    try {
        const [, bytes] = f.load_contents(null);
        return new TextDecoder().decode(bytes);
    } catch (e) {
        logError(e);
        return null;
    }
}

export function bulkConnect(
    service: GObject.Object,
    list: Array<[event: string, callback: (...args: any[]) => void]>,
) {
    const ids = [];
    for (const [event, callback] of list)
        ids.push(service.connect(event, callback));

    return ids;
}

export function bulkDisconnect(service: GObject.Object, ids: number[]) {
    for (const id of ids)
        service.disconnect(id);
}

export function lookUpIcon(name: string) {
    const display = Gdk.Display.get_default();
    if (!display)
        return console.error("couldn't get display");

    return Gtk.IconTheme.get_for_display(display).has_icon(name)
        ? name : null;
}

export function ensureDirectory(path: string) {
    if (!GLib.file_test(path, GLib.FileTest.EXISTS))
        Gio.File.new_for_path(path).make_directory_with_parents(null);
}
