# getSteamFolders

## Intro
This package helps finding all Steam folders, incase you want to look for Game folders without any user input.

## Usage

Install the package using
```
npm i getsteamfolders
```

Import the needed function
```js
import {getSteamMainLocation, getSteamLibraryLocations} from 'getsteamfolders'
```

Call `getSteamMainLocation` to get the primary location and `getSteamLibraryLocations` to get all locations.

## Documentation


### `getSteamMainLocation() -> Promise<string | false>`
Returns `false` if failed to resolve the path, otherwise returns the path of the main Steam installation path.


### `getSteamLibraryLocations() -> Promise<string[] | false>`
Returns `false` if failed to resolve the path, otherwise returns all used Steam installation paths.
