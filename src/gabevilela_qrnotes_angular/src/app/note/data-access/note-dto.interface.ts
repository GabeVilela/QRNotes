export interface NoteDTO{
    id: number;
    title: string,
    content: string,
    needsExport:boolean,
    onBin?:boolean
}

/**
 * Function for obtaining a `NoteDTO` which has no content.  
 * Useful when you don't want to type a `NoteDTO` variable as also nullable/optional
 * @returns NoteDTO which has empty `title` and `content`, and `id` as `-1`
 */
export function getDefaultNote():NoteDTO{
    return {
        id: -1,
        title: '',
        content: '',
        needsExport: false,
        onBin: false
    }
}