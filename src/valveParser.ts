type ValveData = Record<string, string | object>;

export function parseValveData<T = ValveData>(content: string): T {
    content = content.replace(/^(\s*)("\w+")(\n?\s*)/gm, '$1$2:')
        .replace(/"\s*$(?!\s*\})/gm, '",')
        .replace(/}(?!\s*})(?:$[\r\n])/gm, '},')
        .replace(/\\/gm, '\\')
    
    content = ('{' + content + '}').replace(/},\s*}/gm, '}}')
    
    return JSON.parse(content) as T
}