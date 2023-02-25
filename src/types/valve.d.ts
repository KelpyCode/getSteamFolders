declare namespace Valve {
  // Library Config

  export interface LibraryFolder {
    path: string;
    label: string;
    contentid: string;
    totalsize: string;
    update_clean_bytes_tally: string;
    time_last_update_corruption: string;
    apps: Record<string, string>;
  }

  export interface LibraryConfig {
    libraryfolders: Record<string, LibraryFolder>;
  }

  // Manifest

  export interface InstalledDepot {
    manifest: string;
    size: string;
    dlcappid?: string;
  }

  export interface UserConfig {
    language: string;
  }

  export interface MountedConfig {
    language: string;
  }

  export interface AppState {
    appid: string;
    Universe: string;
    LauncherPath: string;
    name: string;
    StateFlags: string;
    installdir: string;
    LastUpdated: string;
    SizeOnDisk: string;
    StagingSize: string;
    buildid: string;
    LastOwner: string;
    AutoUpdateBehavior: string;
    AllowOtherDownloadsWhileRunning: string;
    ScheduledAutoUpdate: string;
    InstalledDepots: Record<string, InstalledDepot>;
    SharedDepots: Record<string, string>;
    UserConfig: UserConfig;
    MountedConfig: MountedConfig;
  }

  export interface GameManifest {
    AppState: AppState;
  }

  // Workshop

  export interface WorkshopItemInstalled {
    size: string;
    timeupdated: string;
    manifest: string;
  }

  export interface WorkshopItemDetails {
    manifest: string;
    timeupdated: string;
    timetouched: string;
    BytesDownloaded: string;
    BytesToDownload: string;
    subscribedby: string;
  }

  export interface AppWorkshop {
    appid: string;
    SizeOnDisk: string;
    NeedsUpdate: string;
    NeedsDownload: string;
    TimeLastUpdated: string;
    TimeLastAppRan: string;
    WorkshopItemsInstalled: Record<string, WorkshopItemInstalled>;
    WorkshopItemDetails: Record<string, WorkshopItemDetails>;
  }

  export interface GameWorkshop {
    AppWorkshop: AppWorkshop;
  }
}
