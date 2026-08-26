import { toCSV } from './csv';

describe('toCSV', () => {
    const columns = [
        { label: 'Name', value: 'name' },
        { label: 'Room', value: 'room' },
        { label: 'Note', value: (r) => r.note },
    ];

    test('builds a header row and quoted values', () => {
        const csv = toCSV(columns, [{ name: 'Alice', room: 101, note: 'clean' }]);
        const [header, row] = csv.split('\n');
        expect(header).toBe('"Name","Room","Note"');
        expect(row).toBe('"Alice","101","clean"');
    });

    test('escapes embedded quotes and supports function accessors', () => {
        const csv = toCSV(columns, [{ name: 'A "B"', room: '', note: 'x,y' }]);
        const row = csv.split('\n')[1];
        expect(row).toBe('"A ""B""","","x,y"');
    });

    test('handles null/undefined as empty strings', () => {
        const csv = toCSV(columns, [{ name: null, room: undefined, note: 0 }]);
        expect(csv.split('\n')[1]).toBe('"","","0"');
    });
});
