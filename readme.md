## getSteamFolders

# Intro
This package helps finding all Steam folders, incase you want to look for game folders without any user input.

# Usage

Install the package using
```
npm i getsteamfolders
```

Import the needed function
```js
import * as steamFolders from 'getsteamfolders'
```

Call `getSteamMainLocation` to get the primary location and `getSteamLibraryLocations` to get all locations.

# API


### `getSteamMainLocation()`
#### => ` Promise<string | false>`
Returns `false` if failed to resolve the path, otherwise returns the path of the main Steam installation path.

```js
console.log(await steamFolders.getSteamMainLocation())
// -> C:\Program Files (x86)\Steam
```


### `getSteamLibraryLocations()`
#### => ` Promise<string[]>`
Returns all used Steam installation paths.
```js
console.log(await steamFolders.getSteamLibraryLocations())
/* -> [
  'C:\\Program Files (x86)\\Steam',
  'S:\\SteamLibrary',
  'U:\\SteamLibrary'
] */
```
### `getAllSteamGames()`
#### => ` Promise<Record<string, string>>`
Get all installed Steam games. Name is key, path is the value.

```js
console.log(await steamFolders.getAllSteamGames())

/* -> [
  Mordhau: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Mordhau',
  Noita: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Noita',
  Northgard: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Northgard',
  skyrim: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\skyrim',
  ProjectZomboid: 'S:\\SteamLibrary\\steamapps\\common\\ProjectZomboid',
  ...
] */
```

### `getSteamGameLocation(searchName: string, contains? = false)`
#### => ` Promise<false | string>`
Get the path of a specific game. If `contains` is set to `true`, it will lazily search for the game name in the list of all games. Search is always case insensitive and all spaces are removed.


```js
console.log(await steamFolders.getSteamGameLocation('survivalists', true))

// -> U:\SteamLibrary\steamapps\common\The Survivalists
```
