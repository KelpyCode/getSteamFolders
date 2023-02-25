import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'
import { parseValveData } from './valveParser'


const REG_STEAM_PATH_32 = 'HKLM\\SOFTWARE\\Valve\\Steam'
const REG_STEAM_PATH_64 = 'HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam'
const LINUX_INSTALL_PATH = '~/.steam'
const LIBRARY_FOLDERS_STEAM_PATH = path.join('steamapps', 'libraryfolders.vdf')
const COMMON_STEAM_PATH = path.join('steamapps', 'common')


async function shellExecute(
    command: string
): Promise<{
  error: childProcess.ExecException | null;
  stdout: string;
  stderr: string;
}> {
    return new Promise((resolve) => {
        childProcess.exec(command, function (error, stdout, stderr) {
            resolve({ error, stdout, stderr })
        })
    })
}

const isWin = process.platform === 'win32'

let cacheSteamMainLocation: string | null = null
let cacheSteamLibraryLocations: string[] | null = null
let cacheSteamGameLocations: Record<string, string> | null = null


export function clearCache(): void {
    cacheSteamMainLocation = null
    cacheSteamLibraryLocations = null
    cacheSteamGameLocations = null
}

export async function getSteamMainLocation(): Promise<false | string> {
    if(cacheSteamMainLocation) return cacheSteamMainLocation

    const steamPath = isWin ? await getInstallPath(REG_STEAM_PATH_32) || await getInstallPath(REG_STEAM_PATH_64) : LINUX_INSTALL_PATH

    if (!steamPath) return false

    cacheSteamMainLocation = steamPath
    
    return steamPath
}

/**
 * @param ignoreInvalid If true, will ignore invalid paths (e.g. paths that don't exist)
 * @returns  Array of paths to Steam library folders
 */
export async function getSteamLibraryLocations(ignoreInvalid = true): Promise<string[]> {
    if (cacheSteamLibraryLocations) return cacheSteamLibraryLocations
    
    const mainPath = await getSteamMainLocation()
    if (!mainPath) return []
    
    const libraryFoldersPath = path.join(mainPath, LIBRARY_FOLDERS_STEAM_PATH)

    if (!fs.existsSync(libraryFoldersPath)) return []
    
    const content = fs.readFileSync(libraryFoldersPath, 'utf8')

    const parsed = parseValveData<Valve.LibraryConfig>(content)

    const paths = Object.values(parsed.libraryfolders).map(x => x.path).filter(x => {
        if (!ignoreInvalid) return true
        return fs.existsSync(x)
    })

    cacheSteamLibraryLocations = paths

    return paths
}


/**
 * @returns Object with the game name as key and the path as value
 */
export async function getAllSteamGames(): Promise<Record<string, string>> {
    if (cacheSteamGameLocations) return cacheSteamGameLocations

    const result: Record<string, string> = {}
    
    const steamLocs = await getSteamLibraryLocations(true)
    const apps = steamLocs.map(x => path.join(x, COMMON_STEAM_PATH))

    apps.forEach(directory => {
        const entries = fs.readdirSync(directory)
        entries.forEach(gameName => result[gameName] = path.join(directory, gameName))
    })

    cacheSteamGameLocations = result

    return result
}

/**
 * 
 * @param searchName Name of the game to search for (case and space insensitive)
 * @param contains If true, won't check for the full name, but if the name contains the game name
 * @returns Path of the game or false if not found
 */
export async function getSteamGameLocation(searchName: string, contains = false): Promise<false | string> {
    const allGames = await getAllSteamGames()
    
    const stringMatchReplacer = (x: string) => x.toLowerCase().replace(/[^a-zA-Z0-9]/gi, '')

    const key = Object.keys(allGames).find((game) =>
        contains
            ? stringMatchReplacer(game).includes(stringMatchReplacer(searchName))
            : stringMatchReplacer(game) === stringMatchReplacer(searchName)
    )

    if(!key) return false

    return allGames[key]
}

async function getInstallPath(regPath: string): Promise<string | false> {
    const res = await shellExecute('reg query ' + regPath + ' /V InstallPath')

    if (!res.error) {
        const path = res.stdout.split('REG_SZ')[1].trim()
        return path
    }
    return false
}

export const parse = parseValveData