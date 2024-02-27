{ lib
, stdenv
, buildNpmPackage
, fetchFromGitLab
, nodePackages
, meson
, pkg-config
, ninja
, gobject-introspection
, gtk4
, libpulseaudio
, gjs
, wrapGAppsHook
, upower
, gnome
, gtk4-layer-shell
, glib-networking
, networkmanager
, gvfs
, libsoup_3
, libnotify
, pam
, writeShellScriptBin
, extraPackages ? [ ]
, version ? "git"
, buildTypes ? false
}:
let
  gvc-src = fetchFromGitLab {
    domain = "gitlab.gnome.org";
    owner = "GNOME";
    repo = "libgnome-volume-control";
    rev = "8e7a5a4c3e51007ce6579292642517e3d3eb9c50";
    sha256 = "sha256-FosJwgTCp6/EI6WVbJhPisokRBA6oT0eo7d+Ya7fFX8=";
  };

  astal = stdenv.mkDerivation rec {
    pname = "astal";
    inherit version;

    src = buildNpmPackage {
      name = pname;
      src = ../.;

      dontBuild = true;

      npmDepsHash = "sha256-XYIWdrT/zHJV18ZcNYjN/RaS80MsgKSx4qq16XGQ7ac=";

      installPhase = ''
        mkdir $out
        cp -r * $out
      '';
    };

    mesonFlags = builtins.concatLists [
      (lib.optional buildTypes "-Dbuild_types=true")
    ];

    prePatch = ''
      mkdir -p ./subprojects/gvc
      cp -r ${gvc-src}/* ./subprojects/gvc
    '';

    postPatch = ''
      chmod +x post_install.sh
      patchShebangs post_install.sh
    '';

    nativeBuildInputs = [
      pkg-config
      meson
      ninja
      nodePackages.typescript
      wrapGAppsHook
      gobject-introspection
    ];

    buildInputs = [
      gjs
      gtk4
      libpulseaudio
      upower
      gnome.gnome-bluetooth
      gtk4-layer-shell
      glib-networking
      networkmanager
      gvfs
      libsoup_3
      libnotify
      pam
    ] ++ extraPackages;

    meta = with lib; {
      description = "JavaScript/TypeScript framework for creating Linux Desktops";
      homepage = "https://github.com/Aylur/Astal";
      platforms = [ "x86_64-linux" "aarch64-linux" ];
      license = licenses.gpl3;
      meta.maintainers = [ lib.maintainers.Aylur ];
    };
  };
in writeShellScriptBin "astal" ''
  LD_PRELOAD=${gtk4-layer-shell}/lib/libgtk4-layer-shell.so ${astal}/bin/astal $@
''
