import _regedit from 'regedit'
import fs from 'fs'
import path from 'path'
const regedit = _regedit.promisified


const REG_STEAM_PATH_32 = 'HKLM\\SOFTWARE\\Valve\\Steam'
const REG_STEAM_PATH_64 = 'HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam'
const LIBRARY_FOLDERS_STEAM_PATH = path.join('steamapps', 'libraryfolders.vdf')

export async function getSteamMainLocation(): Promise<false | string> {
    const res = await regedit.list([REG_STEAM_PATH_32, REG_STEAM_PATH_64])

    const steamPath = res[REG_STEAM_PATH_32].values.InstallPath || res[REG_STEAM_PATH_64].values.InstallPath

    if (!steamPath) return false
    
    return steamPath.value as string
}

export async function getSteamLibraryLocations(): Promise<false | string[]> {
    const mainPath = await getSteamMainLocation()
    if (!mainPath) return false
    
    const libraryFoldersPath = path.join(mainPath, LIBRARY_FOLDERS_STEAM_PATH)

    if (!fs.existsSync(libraryFoldersPath)) return false
    
    const content = fs.readFileSync(libraryFoldersPath, 'utf8')
    const lines = content.split('\n').filter(x => x.indexOf('\\') >= 0).map(x => {
        const parts = x.replace('"path"', '').split('"')
        return parts[1].replace(/\\\\/g, '\\')
    })

    return lines
}