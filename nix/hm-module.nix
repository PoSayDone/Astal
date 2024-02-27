self: {
  config,
  pkgs,
  lib,
  ...
}: let
  inherit (lib) mkMerge types;
  inherit (lib.modules) mkIf;
  inherit (lib.options) mkOption mkEnableOption literalExpression;

  defaultAstalPackage = self.packages.${pkgs.stdenv.hostPlatform.system}.default;
  cfg = config.programs.astal;
in {
  options.programs.astal = {
    enable = mkEnableOption "astal";

    package = mkOption {
      type = with types; nullOr package;
      default = defaultAstalPackage;
      defaultText = literalExpression "inputs.astal.packages.${pkgs.stdenv.hostPlatform.system}.default";
      description = ''
        The Astal package to use.

        By default, this option will use the `packages.default` as exposed by this flake.
      '';
    };

    finalPackage = mkOption {
      type = types.package;
      readOnly = true;
      visible = false;
      description = ''
        Resulting Astal package.
      '';
    };

    configDir = mkOption {
      type = with types; nullOr path;
      default = null;
      example = literalExpression "./astal-config";
      description = ''
        The directory to symlink to {file}`$XDG_CONFIG_HOME/astal`.
      '';
    };

    extraPackages = mkOption {
      type = with types; listOf package;
      default = [];
      description = ''
        Additional packages to add to gjs's runtime.
      '';
      example = literalExpression "[ pkgs.libadwaita ]";
    };
  };

  config = mkIf cfg.enable (mkMerge [
    (mkIf (cfg.configDir != null) {
      xdg.configFile."astal".source = cfg.configDir;
    })
    (mkIf (cfg.package != null) (let
      path = "share/astal/types";
      pkg = cfg.package.override {
        extraPackages = cfg.extraPackages;
        buildTypes = true;
      };
    in {
      programs.astal.finalPackage = pkg;
      home.packages = [pkg];
      home.file.".local/${path}".source = "${pkg}/${path}";
    }))
  ]);
}
