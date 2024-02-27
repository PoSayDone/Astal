import GLib from 'gi://GLib';

export const USER = GLib.get_user_name();
export const HOME = GLib.get_home_dir();
export const CACHE_DIR = `${GLib.get_user_cache_dir()}/${pkg.name.split('.').pop()}`;

export * from './utils/exec.js';
export * from './utils/file.js';
export * from './utils/etc.js';
export * from './utils/timeout.js';
export * from './utils/fetch.js';
export * from './utils/notify.js';
export * from './utils/pam.js';
export * from './utils/gobject.js';
export * from './utils/binding.js';
