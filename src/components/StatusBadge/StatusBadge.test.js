import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
    test('renders the status text', () => {
        render(<StatusBadge status="Resolved" />);
        expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    test('maps known statuses to color variants', () => {
        const { rerender } = render(<StatusBadge status="Open" />);
        expect(screen.getByText('Open').className).toMatch(/bg-warning/);

        rerender(<StatusBadge status="Done" />);
        expect(screen.getByText('Done').className).toMatch(/bg-success/);

        rerender(<StatusBadge status="Acknowledged" />);
        expect(screen.getByText('Acknowledged').className).toMatch(/bg-primary/);
    });

    test('falls back to N/A and secondary for unknown/empty status', () => {
        render(<StatusBadge status="" />);
        const el = screen.getByText('N/A');
        expect(el.className).toMatch(/bg-secondary/);
    });
});
